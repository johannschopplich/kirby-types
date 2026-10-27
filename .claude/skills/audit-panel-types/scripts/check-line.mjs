#!/usr/bin/env node
// Check the comments in the kirby-types declarations for misplaced versions: a
// `@since` outside the line's major or not newer than the baseline; and any
// Kirby version in prose, since the docs describe the latest release.
// Exits 1 with one `file:line` per hit.
//
// Usage: node check-line.mjs <KIRBY_TYPES_ROOT>
import fs from "node:fs";
import path from "node:path";
import { LINE } from "./line.mjs";

const [TYPES] = process.argv.slice(2);
if (!TYPES) {
  process.stderr.write("Usage: node check-line.mjs <KIRBY_TYPES_ROOT>\n");
  process.exit(1);
}

// A missing or `x` patch, as in `4.8` or `5.3.x`, counts as 0.
const compare = (a, b) => {
  const [x, y] = [a, b].map((v) =>
    v.split(".").map((part) => Number(part) || 0),
  );
  return x[0] - y[0] || x[1] - y[1] || (x[2] ?? 0) - (y[2] ?? 0);
};
const versions = (text) =>
  (text.match(/(?<![\d.])\d+\.\d+(?:\.(?:\d+|x))?\b/g) ?? []).filter((v) =>
    v.startsWith(`${LINE.major}.`),
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
    if (since && since[2] !== LINE.major) {
      hits.push(`${at}: \`@since ${since[1]}\` is outside Kirby ${LINE.major}`);
    } else if (since && compare(since[1], LINE.baseline) <= 0) {
      hits.push(
        `${at}: \`@since ${since[1]}\` is not newer than the baseline ${LINE.baseline} – ${text.trim()}`,
      );
    }
    if (/\bKirby \d/.test(prose)) {
      hits.push(`${at}: names a Kirby version – ${text.trim()}`);
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
process.stdout.write(`No misplaced versions in ${files.length} files.\n`);
