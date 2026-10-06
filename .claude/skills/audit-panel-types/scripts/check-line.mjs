#!/usr/bin/env node
// Check the kirby-types declarations for versions outside the line: a
// `@since` outside the line's majors, a baseline `@since` on a member, doc
// prose naming another line's Kirby version, and a version older than the
// baseline. Exits 1 with one `file:line` per hit.
//
// Usage: node check-line.mjs <KIRBY_TYPES_ROOT> [LINE]
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { LINES } from "./lines.mjs";

const [TYPES, LINE_ARG] = process.argv.slice(2);
if (!TYPES) {
  process.stderr.write(
    "Usage: node check-line.mjs <KIRBY_TYPES_ROOT> [LINE]\n",
  );
  process.exit(1);
}
const line =
  LINE_ARG ||
  execSync(`git -C "${TYPES}" branch --show-current`, {
    encoding: "utf8",
  }).trim();
const rules = LINES[line];
if (!rules) {
  process.stderr.write(
    `Unknown line \`${line}\` – pass one of: ${Object.keys(LINES).join(", ")}\n`,
  );
  process.exit(1);
}
const foreignMajors = Object.values(LINES)
  .flatMap((other) => other.majors)
  .filter((major) => !rules.majors.includes(major))
  .join("");
const foreign = new RegExp(
  `\\bKirby [${foreignMajors}]\\b|\\b[${foreignMajors}]\\.\\d+\\.\\d+\\b`,
);

// A missing or `x` patch, as in `4.8` or `5.3.x`, counts as 0.
const compare = (a, b) => {
  const [x, y] = [a, b].map((v) =>
    v.split(".").map((part) => Number(part) || 0),
  );
  return x[0] - y[0] || x[1] - y[1] || (x[2] ?? 0) - (y[2] ?? 0);
};
const predating = (text) =>
  (text.match(/\b\d+\.\d+(?:\.(?:\d+|x))?\b/g) ?? []).find(
    (v) =>
      rules.majors.includes(v.split(".")[0]) && compare(v, rules.baseline) < 0,
  );

const files = [
  ...fs.readdirSync(TYPES).filter((f) => f.endsWith(".d.ts")),
  ...fs
    .readdirSync(path.join(TYPES, "src"), { recursive: true })
    .filter((f) => f.endsWith(".d.ts"))
    .map((f) => path.join("src", f)),
].sort();

const hits = [];
for (const file of files) {
  const lines = fs.readFileSync(path.join(TYPES, file), "utf8").split("\n");
  lines.forEach((text, index) => {
    const at = `${file}:${index + 1}`;
    if (!/^\s*(\/\*\*|\*|\/\/)/.test(text)) return;
    const older = predating(text);

    const since = text.match(/@since\s+(\d+)\.\S+/);
    if (since && !rules.majors.includes(since[1])) {
      hits.push(
        `${at}: \`@since ${since[0].split(/\s+/)[1]}\` is outside the line's majors (${rules.majors.join(", ")})`,
      );
    } else if (since && text.includes(`@since ${rules.baseline}`)) {
      // The baseline tag belongs on the module docblock or an exported declaration's, never on a member's.
      const opensAt = (l) => l.trimStart().startsWith("/**");
      const isModuleDocblock =
        lines.findIndex(opensAt) ===
        lines.findLastIndex((l, i) => i <= index && opensAt(l));
      const end = lines.findIndex((l, i) => i >= index && l.includes("*/"));
      const next =
        lines
          .slice(end + 1)
          .find((l) => l.trim() !== "" && !/^\s*\/\//.test(l)) ?? "";
      if (
        !isModuleDocblock &&
        !/^\s*(export|declare)\b|^\s*(interface|type)\s+[A-Z]/.test(next)
      )
        hits.push(
          `${at}: \`@since ${rules.baseline}\` on a member – the baseline sits on declarations only`,
        );
    } else if (foreign.test(text)) {
      hits.push(`${at}: names another line's Kirby version – ${text.trim()}`);
    } else if (older) {
      hits.push(
        `${at}: \`${older}\` predates the line's baseline ${rules.baseline} – ${text.trim()}`,
      );
    }
  });
}

if (hits.length > 0) {
  process.stdout.write(`${hits.join("\n")}\n`);
  process.exit(1);
}
process.stdout.write(
  `No versions outside the line in ${files.length} files (\`${line}\`).\n`,
);
