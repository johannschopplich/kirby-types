#!/usr/bin/env node
// Probe the live Kirby checkout and write a fresh source map to
// <KIRBY_TYPES_ROOT>/.review/source-map.json (creating .review/.raw/ for pass 1).
// Volatile facts – .js vs .ts per module, $helper/panel registrations, the Kirby
// version, history reach, dead @source paths, flags – are DISCOVERED here, never
// hard-coded in topology.md. Agents read the map; they never guess file status.
//
// Usage: node probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT> [LINE]
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { LINES } from "./lines.mjs";

const [KIRBY, TYPES, LINE_ARG] = process.argv.slice(2);
if (!KIRBY || !TYPES) {
  process.stderr.write(
    "Usage: node probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT> [LINE]\n",
  );
  process.exit(1);
}

// The line is the kirby-types branch unless LINE names one; the Kirby root must match it.

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
  "types",
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
      const m = f.match(/^(.+?)\.(d\.ts|ts|js)$/);
      if (!m || /\.(test|spec|test-d)$/.test(m[1])) continue;
      (map[`panel/src/${dir}/${m[1]}`] ??= []).push(m[2]);
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
  // A shallow clone attributes every older member to its oldest fetched commit,
  // so `git tag --contains` mis-dates @since.
  try {
    // A root nested in another checkout answers with the parent's history.
    const topLevel = run(`git -C "${KIRBY}" rev-parse --show-toplevel`).trim();
    if (fs.realpathSync(topLevel) !== fs.realpathSync(KIRBY))
      throw new Error("not a checkout root");
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

// Every `@source` path in the kirby-types declarations that the Kirby root lacks.
function deadSources() {
  const files = [
    ...fs.readdirSync(TYPES).filter((f) => f.endsWith(".d.ts")),
    ...fs
      .readdirSync(path.join(TYPES, "src"), { recursive: true })
      .filter((f) => f.endsWith(".d.ts"))
      .map((f) => path.join("src", f)),
  ];
  const dead = [];
  for (const file of files.sort()) {
    const text = fs.readFileSync(path.join(TYPES, file), "utf8");
    for (const [, source] of text.matchAll(/@source\s+(\S+)/g)) {
      // A package path (`@types/…`) is not Kirby's to check.
      const topDir = source.split("/")[0];
      if (!fs.existsSync(path.join(KIRBY, topDir))) continue;
      if (!fs.existsSync(path.join(KIRBY, source)))
        dead.push(`${file}: ${source}`);
    }
  }
  return [...new Set(dead)];
}

const kirbyVersion = version();
const flags = [];

let line = LINE_ARG ?? "";
if (!line) {
  try {
    line = run(`git -C "${TYPES}" branch --show-current`).trim();
  } catch {}
}
const lineLabel = line ? `\`${line}\`` : "a detached HEAD";
const expectedMajor = LINES[line]?.majors.at(-1);
if (!expectedMajor) {
  flags.push(
    `LINE-UNKNOWN: the line is ${lineLabel}, none of ${Object.keys(LINES).join(", ")} -> ask which line this audit targets.`,
  );
} else if (!kirbyVersion.startsWith(`${expectedMajor}.`)) {
  flags.push(
    `LINE-MISMATCH: ${lineLabel} audits Kirby ${expectedMajor}, but the Kirby root is ${kirbyVersion} -> ask for the matching root.`,
  );
}

const reach = historyReach();
if (reach.unreadable) {
  flags.push(
    `NOT-GIT: ${KIRBY} is not the root of a git checkout -> ask for a full-history clone of getkirby/kirby.`,
  );
} else if (reach.shallow) {
  flags.push(
    `SHALLOW-HISTORY: ${KIRBY} is a shallow clone and cannot date @since -> run \`git -C ${KIRBY} fetch --unshallow --tags\`, then re-probe.`,
  );
} else if (reach.minorTagLines < 3) {
  flags.push(
    `SHALLOW-HISTORY: ${KIRBY} holds ${reach.minorTagLines} minor-tag line(s) and cannot date @since -> run \`git -C ${KIRBY} fetch --tags\`, then re-probe.`,
  );
}

const dead = deadSources();
if (dead.length > 0) {
  flags.push(
    `DEAD-SOURCE: ${dead.length} @source path(s) the Kirby root lacks, listed under deadSources -> pass 2 re-points or drops them.`,
  );
}

fs.mkdirSync(path.join(TYPES, ".review", ".raw"), { recursive: true });
fs.writeFileSync(
  path.join(TYPES, ".review", "source-map.json"),
  JSON.stringify(
    {
      line,
      kirbyVersion,
      historyReach: reach,
      flags,
      helperRegistrations: helperRegistrations(),
      panelSingletons: panelSingletons(),
      deadSources: dead,
      modules: moduleMap(),
    },
    null,
    2,
  ) + "\n",
);
process.stdout.write(
  `source-map.json written (${lineLabel}, Kirby ${kirbyVersion}).\n`,
);
