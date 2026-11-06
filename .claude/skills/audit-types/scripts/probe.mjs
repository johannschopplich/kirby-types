#!/usr/bin/env node
// Probe the live Kirby checkout and write a fresh source map to
// <KIRBY_TYPES_ROOT>/.review/source-map.json (emptying .review/.raw/ for pass 1).
// Volatile facts are discovered here, so topology.md holds only stable ones.
//
// Usage: node probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT> <KQL_ROOT> <SIBLINGS_ROOT>
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { TARGET } from "./kirby.mjs";

const [KIRBY, TYPES, KQL, SIBLINGS] = process.argv.slice(2);
if (!KIRBY || !TYPES || !KQL || !SIBLINGS) {
  process.stderr.write(
    "Usage: node probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT> <KQL_ROOT> <SIBLINGS_ROOT>\n",
  );
  process.exit(1);
}

// The `@source` paths of kql.d.ts are relative to the KQL root.
const sourceRoot = (file) => (file === "src/kql.d.ts" ? KQL : KIRBY);

// Every directory a topology.md **Modules** path sits in, scanned whole rather
// than named per module since file extensions drift between releases: a module
// missing from the map reads as renamed or gone. Relative to <root>/panel/src.
const SCAN_DIRS = [
  "",
  "panel",
  "api",
  "helpers",
  "libraries",
  "components/Forms/Field",
  "components/Forms/Blocks",
  "components/Forms/Layouts",
  "components/Forms/Writer",
  "components/Forms/Writer/Marks",
  "components/Forms/Writer/Nodes",
  "components/Forms/Writer/Utils",
  "components/Forms/Input",
  "components/Forms/Toolbar",
  "components/Dropdowns",
  "components/Layout",
  "components/Navigation",
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
      const m = f.match(/^(.+?)\.(d\.ts|ts|js|vue)$/);
      if (!m || /\.(test|spec|test-d)$/.test(m[1])) continue;
      (map[path.posix.join("panel/src", dir, m[1])] ??= []).push(m[2]);
    }
  }
  return Object.fromEntries(
    Object.keys(map)
      .sort()
      .map((k) => [k, map[k].sort().join("+")]),
  );
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
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

// Every `@source` path in the kirby-types declarations that its root lacks.
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
      const root = sourceRoot(file);
      // A package path (`@types/…`) is not the root's to check.
      const topDir = source.split("/")[0];
      if (!fs.existsSync(path.join(root, topDir))) continue;
      if (!fs.existsSync(path.join(root, source)))
        dead.push(`${file}: ${source}`);
    }
  }
  return [...new Set(dead)];
}

// Every type exported from src/ that no topology cluster lists under **Symbols**.
function unownedTypes() {
  const topology = fs.readFileSync(
    new URL("../references/topology.md", import.meta.url),
    "utf8",
  );
  const owners = topology
    .split("\n")
    .filter((l) => l.includes("**Symbols**:"))
    .map((l) =>
      l.replace(/(\w+)\{([^}]+)\}/g, (_, stem, rest) =>
        rest
          .split(",")
          .map((s) => stem + s.trim())
          .join(", "),
      ),
    )
    .flatMap((l) => l.match(/\b[A-Z]\w*\*?/g) ?? []);
  const isOwned = (name) =>
    owners.some((o) =>
      o.endsWith("*") ? name.startsWith(o.slice(0, -1)) : name === o,
    );
  const dir = path.join(TYPES, "src");
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith(".d.ts"))
    .sort()
    .flatMap((f) =>
      [
        ...fs
          .readFileSync(path.join(dir, f), "utf8")
          .matchAll(/^export (?:interface|type) (\w+)/gm),
      ]
        .map((m) => m[1])
        .filter((name) => !isOwned(name))
        .map((name) => `${f}: ${name}`),
    );
}

// Whether a version range allows the major as its lower bound in any `||`
// alternative: `^6.0`, `~6.0`, `>=6.0 <7`, or `6.*` does, `<6.0` does not.
const allowsMajor = (range, major) =>
  range
    .split("||")
    .some((alternative) =>
      new RegExp(`^\\s*(\\^|~|>=?|=)?\\s*v?${major}(?!\\d)`).test(alternative),
    );

// Every repo under the siblings root that depends on kirby-types 2.
function siblingRepos() {
  return fs
    .readdirSync(SIBLINGS)
    .sort()
    .filter((repo) => {
      try {
        const root = path.join(SIBLINGS, repo);
        if (fs.realpathSync(root) === fs.realpathSync(TYPES)) return false;
        const pkg = readJson(path.join(root, "package.json"));
        const range = { ...pkg.dependencies, ...pkg.devDependencies }[
          "kirby-types"
        ];
        return Boolean(range) && allowsMajor(range, "2");
      } catch {
        return false;
      }
    });
}

// Every name the sibling repos import from kirby-types in a braced `import`,
// with the repos that import it.
function siblingImports(repos) {
  const SKIP = new Set(["node_modules", "dist", ".git", ".nuxt", ".output"]);
  const imports = {};
  const read = (fn) => {
    try {
      return fn();
    } catch {
      return null;
    }
  };
  const walk = (dir, repo) => {
    for (const entry of read(() =>
      fs.readdirSync(dir, { withFileTypes: true }),
    ) ?? []) {
      if (SKIP.has(entry.name)) continue;
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p, repo);
      else if (
        /\.(ts|mts|tsx|vue)$/.test(entry.name) &&
        !entry.name.endsWith(".d.ts")
      )
        for (const [, names] of (
          read(() => fs.readFileSync(p, "utf8")) ?? ""
        ).matchAll(
          /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*["']kirby-types[^"']*["']/g,
        ))
          for (const name of names.split(",")) {
            const id = name
              .trim()
              .replace(/^type\s+/, "")
              .split(/\s+as\s+/)[0];
            if (/^\w+$/.test(id)) (imports[id] ??= new Set()).add(repo);
          }
    }
  };
  for (const repo of repos) walk(path.join(SIBLINGS, repo), repo);
  return Object.fromEntries(
    Object.keys(imports)
      .sort()
      .map((id) => [id, [...imports[id]].sort()]),
  );
}

const siblings = siblingRepos();
const kirbyVersion =
  readJson(path.join(KIRBY, "composer.json")).version || "unknown";
const kqlKirbyRange =
  readJson(path.join(KQL, "composer.json")).require?.["getkirby/cms"] ?? "";
const flags = [];

if (!kirbyVersion.startsWith(`${TARGET.major}.`)) {
  flags.push(
    `KIRBY-MISMATCH: kirby-types types Kirby ${TARGET.major}, but the Kirby root is ${kirbyVersion} -> ask for the matching root.`,
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

if (!allowsMajor(kqlKirbyRange, TARGET.major)) {
  flags.push(
    `KQL-MISMATCH: the KQL root requires getkirby/cms "${kqlKirbyRange || "nothing"}", not Kirby ${TARGET.major} -> ask for the KQL branch that does.`,
  );
}

const dirty = run(
  `git -C "${TYPES}" status --porcelain -- src test '*.d.ts'`,
).trim();
if (dirty) {
  flags.push(
    `DIRTY-TREE: ${TYPES} has uncommitted declaration or test changes -> commit or stash them, then re-probe.`,
  );
}

const dead = deadSources();
if (dead.length > 0) {
  flags.push(
    `DEAD-SOURCE: ${dead.length} @source path(s) their root lacks, listed under deadSources -> pass 2 re-points or drops those of a declaration under src/; the rest go to the report.`,
  );
}

const unowned = unownedTypes();
if (unowned.length > 0) {
  flags.push(
    `UNOWNED-TYPES: ${unowned.length} exported type(s) no topology cluster owns, listed under unownedTypes -> add each to the cluster whose symbols reference it.`,
  );
}

const rawDir = path.join(TYPES, ".review", ".raw");
fs.rmSync(rawDir, { recursive: true, force: true });
fs.mkdirSync(rawDir, { recursive: true });
fs.writeFileSync(
  path.join(TYPES, ".review", "source-map.json"),
  JSON.stringify(
    {
      ...TARGET,
      base: run(`git -C "${TYPES}" rev-parse HEAD`).trim(),
      kirbyVersion,
      kqlKirbyRange,
      historyReach: reach,
      flags,
      helperRegistrations: helperRegistrations(),
      panelSingletons: panelSingletons(),
      deadSources: dead,
      unownedTypes: unowned,
      siblingRepos: siblings,
      siblingImports: siblingImports(siblings),
      modules: moduleMap(),
    },
    null,
    2,
  ) + "\n",
);
process.stdout.write(`source-map.json written (Kirby ${kirbyVersion}).\n`);
