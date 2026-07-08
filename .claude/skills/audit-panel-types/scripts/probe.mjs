#!/usr/bin/env node
// Probe the live Kirby checkouts and write a fresh source map to
// <KIRBY_TYPES_ROOT>/.review/source-map.json (creating .review/.raw/ for pass 1).
// Volatile facts – .js vs .ts per module, $helper/panel registrations, Kirby
// versions, history reach, posture flags – are DISCOVERED here, never hard-coded
// in topology.md. Agents read the map; they never guess file status.
//
// Usage: node probe.mjs <KIRBY_K5_ROOT> <KIRBY_K6_ROOT> <KIRBY_TYPES_ROOT>
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const [K5, K6, TYPES] = process.argv.slice(2);
if (!K5 || !K6 || !TYPES) {
  process.stderr.write(
    "Usage: node probe.mjs <KIRBY_K5_ROOT> <KIRBY_K6_ROOT> <KIRBY_TYPES_ROOT>\n",
  );
  process.exit(1);
}

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

function exts(root, dir) {
  const abs = path.join(root, "panel/src", dir);
  const out = {};
  let entries;
  try {
    entries = fs.readdirSync(abs);
  } catch {
    return out;
  }
  for (const f of entries) {
    const m = f.match(/^(.*)\.(ts|js)$/);
    if (!m) continue;
    if (/\.(test|spec)$/.test(m[1]) || /\.test-d$/.test(m[1])) continue;
    const key = `${dir}/${m[1]}`;
    (out[key] ??= []).push(m[2]);
  }
  return out;
}

function moduleMap() {
  const map = {};
  const keys = new Set();
  const k5 = {},
    k6 = {};
  for (const d of SCAN_DIRS) {
    Object.assign(k5, exts(K5, d));
    Object.assign(k6, exts(K6, d));
  }
  for (const k of Object.keys(k5)) keys.add(k);
  for (const k of Object.keys(k6)) keys.add(k);
  for (const k of [...keys].sort()) {
    map[k] = {
      k5: (k5[k] || []).sort().join("+") || "absent",
      k6: (k6[k] || []).sort().join("+") || "absent",
    };
  }
  return map;
}

function version(root) {
  try {
    const j = JSON.parse(
      fs.readFileSync(path.join(root, "composer.json"), "utf8"),
    );
    return j.version || "unknown";
  } catch {
    return "unknown";
  }
}

function historyReach(root) {
  // A shallow clone, or one whose tags cover only its own release line, collapses
  // every pre-floor member to its oldest commit, so `git tag --contains` silently
  // mis-dates @since. Reported so dating can route to the deepest checkout.
  const run = (cmd) =>
    execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  try {
    const shallow =
      run(`git -C "${root}" rev-parse --is-shallow-repository`).trim() ===
      "true";
    const minorTagLines = new Set(
      run(`git -C "${root}" tag`)
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

function helperRegistrations(root) {
  for (const ext of ["ts", "js"]) {
    const p = path.join(root, "panel/src/helpers/index." + ext);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");
    const block = src.match(/export const helper\s*=\s*\{([\s\S]*?)\}/);
    if (!block) return [];
    // Split on commas/newlines so a trailing-comma-less last property (`writer`)
    // is not missed.
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

function panelSingletons(root) {
  for (const ext of ["ts", "js"]) {
    const p = path.join(root, "panel/src/panel/panel." + ext);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");
    return [
      ...new Set(
        [...src.matchAll(/^\s*this\.([a-z][\w]*)\s*=/gm)].map((m) => m[1]),
      ),
    ].sort();
  }
  return [];
}

const k5v = version(K5),
  k6v = version(K6);
const postureFlags = [];
// The Vue-2 hold flips only when K6 SHIPS (stable, no -alpha/-beta/-rc suffix).
if (/^6\./.test(k6v) && !/-(alpha|beta|rc)/i.test(k6v)) {
  postureFlags.push(
    `K6 is ${k6v} (shipped, not pre-release) -> RE-CONFIRM: flip plugin shape to Vue 3 and clear @since 6 forward-tags?`,
  );
} else {
  postureFlags.push(
    `K6 is ${k6v} (pre-release) -> Vue-2 hold stands; learn from K6 TS as evidence.`,
  );
}
if (k5v === "unknown") {
  postureFlags.push(
    `K5 root absent/unreadable -> RE-CONFIRM: retire K5-JS rows and <KIRBY_K5_ROOT>?`,
  );
}

// A shallow clone dated members to its 5.5.0 floor and shipped two wrong @since
// tags. Flag any root that cannot see past its own release line.
const reach = { k5: historyReach(K5), k6: historyReach(K6) };
for (const [label, root, h, ver] of [
  ["K5", K5, reach.k5, k5v],
  ["K6", K6, reach.k6, k6v],
]) {
  if (ver === "unknown") continue;
  if (h.shallow || h.minorTagLines < 3) {
    postureFlags.push(
      `SHALLOW-HISTORY: ${label} root ${root} (shallow=${h.shallow}, ${h.minorTagLines} minor-tag line(s)) cannot date @since reliably -> run @since archaeology against a full-history checkout (git tag --contains against the deepest available root, or gh upstream). Never date a pre-floor member here.`,
    );
  }
}

// Create .review/.raw (recursive covers .review) so pass-1 agents have somewhere
// to write, then drop the map beside it.
fs.mkdirSync(path.join(TYPES, ".review", ".raw"), { recursive: true });
fs.writeFileSync(
  path.join(TYPES, ".review", "source-map.json"),
  JSON.stringify(
    {
      versions: { k5: k5v, k6: k6v },
      historyReach: reach,
      postureFlags,
      helperRegistrations: {
        k5: helperRegistrations(K5),
        k6: helperRegistrations(K6),
      },
      panelSingletons: { k5: panelSingletons(K5), k6: panelSingletons(K6) },
      modules: moduleMap(),
    },
    null,
    2,
  ) + "\n",
);
process.stdout.write(`source-map.json written (K5 ${k5v} / K6 ${k6v}).\n`);
