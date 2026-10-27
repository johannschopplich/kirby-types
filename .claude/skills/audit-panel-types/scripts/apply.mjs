#!/usr/bin/env node
// Apply the ACT patches of every `.review/.raw/*.pass2.json`, first match wins:
// an insertion already present is skipped, an `old_string` found once is
// replaced, an `old_string` gone with its `new_string` present is skipped as
// applied, and anything else is skipped and listed for the report.
//
// Usage: node apply.mjs <KIRBY_TYPES_ROOT>
import fs from "node:fs";
import path from "node:path";

const [TYPES] = process.argv.slice(2);
if (!TYPES) {
  process.stderr.write("Usage: node apply.mjs <KIRBY_TYPES_ROOT>\n");
  process.exit(1);
}

const rawDir = path.join(TYPES, ".review", ".raw");
const files = new Map();
const skipped = [];
let applied = 0;

for (const report of fs
  .readdirSync(rawDir)
  .filter((f) => f.endsWith(".pass2.json"))
  .sort()) {
  const tsFile = path.join(
    "src",
    "panel",
    report.replace(/\.pass2\.json$/, ""),
  );
  const { verifications = [], annotations = [] } = JSON.parse(
    fs.readFileSync(path.join(rawDir, report), "utf8"),
  );

  for (const entry of [...verifications, ...annotations]) {
    if (entry.decision !== "ACT" || !entry.patch) continue;
    const {
      file = tsFile,
      old_string: oldString,
      new_string: newString,
    } = entry.patch;
    if (!files.has(file)) {
      files.set(file, fs.readFileSync(path.join(TYPES, file), "utf8"));
    }
    const text = files.get(file);
    const occurrences = text.split(oldString).length - 1;

    if (newString.includes(oldString) && text.includes(newString)) continue;
    if (occurrences === 1) {
      files.set(
        file,
        text.replace(oldString, () => newString),
      );
      applied++;
    } else if (occurrences === 0 && text.includes(newString)) {
      continue;
    } else {
      skipped.push(
        `${file}: ${entry.finding} (\`old_string\` found ${occurrences} times)`,
      );
    }
  }
}

for (const [file, text] of files) {
  fs.writeFileSync(path.join(TYPES, file), text);
}
process.stdout.write(
  `Applied ${applied} patches, skipped ${skipped.length}.\n${skipped.map((line) => `${line}\n`).join("")}`,
);
