#!/usr/bin/env node
// Check the comments in the kirby-types declarations for misplaced versions: a
// `@since` outside the line's majors or not newer than the baseline; and any
// version in prose – another line's or the line's own – since the docs describe
// the line's latest release.
// Exits 1 with one `file:line` per hit.
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
  `\\bKirby [${foreignMajors}]\\b|(?<![\\d.])[${foreignMajors}]\\.\\d+\\b`,
);

// A missing or `x` patch, as in `4.8` or `5.3.x`, counts as 0.
const compare = (a, b) => {
  const [x, y] = [a, b].map((v) =>
    v.split(".").map((part) => Number(part) || 0),
  );
  return x[0] - y[0] || x[1] - y[1] || (x[2] ?? 0) - (y[2] ?? 0);
};
const versions = (text) =>
  (text.match(/(?<![\d.])\d+\.\d+(?:\.(?:\d+|x))?\b/g) ?? []).filter((v) =>
    rules.majors.includes(v.split(".")[0]),
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
    const since = text.match(/@since\s+(?:Kirby\s+)?((\d+)\.[\w.]+)/);
    const prose = since ? text.replace(since[0], "") : text;
    const dated = versions(prose);
    if (since && !rules.majors.includes(since[2])) {
      hits.push(
        `${at}: \`@since ${since[1]}\` is outside the line's majors (${rules.majors.join(", ")})`,
      );
    } else if (since && compare(since[1], rules.baseline) <= 0) {
      hits.push(
        `${at}: \`@since ${since[1]}\` is not newer than the line's baseline ${rules.baseline} – ${text.trim()}`,
      );
    }
    if (foreign.test(prose)) {
      hits.push(`${at}: names another line's Kirby version – ${text.trim()}`);
    } else if (dated.length > 0) {
      hits.push(
        `${at}: \`${dated[0]}\` dates the prose – describe the latest release – ${text.trim()}`,
      );
    }
  });
}

if (hits.length > 0) {
  process.stdout.write(`${hits.join("\n")}\n`);
  process.exit(1);
}
process.stdout.write(
  `No misplaced versions in ${files.length} files (\`${line}\`).\n`,
);
