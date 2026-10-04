#!/usr/bin/env node
// Probe the live Kirby checkout and write a fresh source map to
// <KIRBY_TYPES_ROOT>/.review/source-map.json (creating .review/.raw/ for pass 1).
// Volatile facts – .js vs .ts per module, $helper/panel registrations, the Kirby
// version, history reach, flags – are DISCOVERED here, never hard-coded in
// topology.md. Agents read the map; they never guess file status.
//
// Usage: node probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT>
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const [KIRBY, TYPES] = process.argv.slice(2);
if (!KIRBY || !TYPES) {
  process.stderr.write(
    "Usage: node probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT>\n",
  );
  process.exit(1);
}

// The kirby-types branch decides the line; the Kirby root must match it.
const LINES = {
  main: { major: "5", line: "kirby-5" },
  "feat/kirby-6": { major: "6", line: "kirby-6" },
};

// Directories whose file-extension status drifts between releases. Discovered by
// listing, so no per-module list rots. Relative to <root>/panel/src.
const SCAN_DIRS = [
  "panel",
  "api",
  "helpers",
  "libraries",
  "components/Forms/Writer",
  "components/Forms/Writer/Marks",
  "components/Forms/Writer/Nodes",
  "components/Forms/Writer/Utils",
  "components/Forms/Toolbar",
];

const run = (cmd) =>
  execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

function moduleMap() {
  const map = {};
  for (const dir of SCAN_DIRS) {
    let entries;
    try {
      entries = fs.readdirSync(path.join(KIRBY, "panel/src", dir));
    } catch {
      continue;
    }
    for (const f of entries) {
      const m = f.match(/^(.*)\.(ts|js)$/);
      if (!m || /\.(test|spec|test-d)$/.test(m[1])) continue;
      (map[`${dir}/${m[1]}`] ??= []).push(m[2]);
    }
  }
  return Object.fromEntries(
    Object.keys(map)
      .sort()
      .map((k) => [k, map[k].sort().join("+")]),
  );
}

function version() {
  try {
    const j = JSON.parse(
      fs.readFileSync(path.join(KIRBY, "composer.json"), "utf8"),
    );
    return j.version || "unknown";
  } catch {
    return "unknown";
  }
}

function historyReach() {
  // A shallow clone collapses every pre-floor member to its oldest commit, so
  // `git tag --contains` silently mis-dates @since.
  try {
    const shallow =
      run(`git -C "${KIRBY}" rev-parse --is-shallow-repository`).trim() ===
      "true";
    const minorTagLines = new Set(
      run(`git -C "${KIRBY}" tag`)
        .split("\n")
        .map((s) => s.trim())
        .filter((t) => /^\d+\.\d+/.test(t))
        .map((t) => t.split(".").slice(0, 2).join(".")),
    ).size;
    return { shallow, minorTagLines };
  } catch {
    return { shallow: false, minorTagLines: 0, unreadable: true };
  }
}

function helperRegistrations() {
  for (const ext of ["ts", "js"]) {
    const p = path.join(KIRBY, "panel/src/helpers/index." + ext);
    if (!fs.existsSync(p)) continue;
    const block = fs
      .readFileSync(p, "utf8")
      .match(/export const helper\s*=\s*\{([\s\S]*?)\}/);
    if (!block) return [];
    // Split on commas/newlines so a trailing-comma-less last property is not missed.
    return [
      ...new Set(
        block[1]
          .split(/[,\n]/)
          .map((s) => s.trim().split(":")[0].trim())
          .filter((s) => /^[A-Za-z_$][\w$]*$/.test(s)),
      ),
    ].sort();
  }
  return [];
}

function panelSingletons() {
  for (const ext of ["ts", "js"]) {
    const p = path.join(KIRBY, "panel/src/panel/panel." + ext);
    if (!fs.existsSync(p)) continue;
    return [
      ...new Set(
        [
          ...fs.readFileSync(p, "utf8").matchAll(/^\s*this\.([a-z]\w*)\s*=/gm),
        ].map((m) => m[1]),
      ),
    ].sort();
  }
  return [];
}

const kirbyVersion = version();
const flags = [];

let branch = "unknown";
try {
  branch = run(`git -C "${TYPES}" branch --show-current`).trim();
} catch {}
const expected = LINES[branch];
if (!expected) {
  flags.push(
    `LINE-UNKNOWN: kirby-types is on \`${branch}\`, not \`main\` or \`feat/kirby-6\` -> ask which line this audit targets.`,
  );
} else if (!kirbyVersion.startsWith(`${expected.major}.`)) {
  flags.push(
    `LINE-MISMATCH: \`${branch}\` audits Kirby ${expected.major}, but the Kirby root is ${kirbyVersion} -> ask for the matching root.`,
  );
}

const reach = historyReach();
if (reach.shallow || reach.minorTagLines < 3) {
  flags.push(
    `SHALLOW-HISTORY: ${KIRBY} (shallow=${reach.shallow}, ${reach.minorTagLines} minor-tag line(s)) cannot date @since -> run \`git -C ${KIRBY} fetch --unshallow --tags\` before pass 1.`,
  );
}

// Create .review/.raw (recursive covers .review) so pass-1 agents have somewhere
// to write, then drop the map beside it.
fs.mkdirSync(path.join(TYPES, ".review", ".raw"), { recursive: true });
fs.writeFileSync(
  path.join(TYPES, ".review", "source-map.json"),
  JSON.stringify(
    {
      line: expected?.line ?? "unknown",
      branch,
      kirbyVersion,
      historyReach: reach,
      flags,
      helperRegistrations: helperRegistrations(),
      panelSingletons: panelSingletons(),
      modules: moduleMap(),
    },
    null,
    2,
  ) + "\n",
);
process.stdout.write(
  `source-map.json written (${expected?.line ?? "unknown line"}, Kirby ${kirbyVersion}).\n`,
);
