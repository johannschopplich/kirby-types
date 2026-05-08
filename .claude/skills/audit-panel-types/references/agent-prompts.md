# Agent prompt templates

One template per pass. Both passes are read-only on every file – never use the Edit tool from inside an agent. Substitute `<placeholders>` from [topology.md](topology.md). Paste the rubric block from [rubric.md](rubric.md) verbatim.

## Pass 1

One Agent call per cluster, `run_in_background: true`. 23 clusters. Launch 7–8 at a time so notifications stay manageable. Subagents inherit the orchestrator's model – don't pass an explicit `model:` override.

````
ROLE: You review TypeScript augmentation types that describe Kirby Panel's runtime `window.panel`. READ-ONLY on every file – including the kirby-types `.d.ts` under review. DO NOT use the Edit tool. Write only to the JSON output path before returning.

OUTPUT PATH: <KIRBY_TYPES_ROOT>/.review/.raw/<CLUSTER>.json

TS FILE TO REVIEW: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

KIRBY ROOTS:
- <KIRBY_K5_ROOT> – PHP authority at `src/`; K5 JS at `panel/src/`.
- <KIRBY_K6_ROOT> – K6 TS at `panel/src/`. (May be absent – treat K6 as silent if so.)

SYMBOLS YOU OWN:
<COMMA-SEPARATED LIST FROM TOPOLOGY>

CANDIDATE SOURCES:
- PHP: <list from topology, or "silent">
- K6 TS: <list from topology, or "no K6 source">
- K5 JS: <list from topology>

JOB:
1. Locate sources for each owned symbol.
2. Trinary diff PHP → K6 TS → K5 JS, then sweep TYPES → SOURCES.
3. Apply the rubric. Authority is PHP > K6 TS > K5 JS.

OUTPUT (single fenced ```json at end of response, also written to OUTPUT PATH):
{
  "annotations": [{ "symbol": "...", "anchor": "export interface ... {", "sources": ["panel/src/..."] }],
  "drift": [{ "symbol": "...", "k5": "...", "k6": "...", "php": "...", "note": "..." }],
  "learnFrom": [{ "symbol": "...", "k6Shape": "...", "kirbyTypesCurrent": "...", "rationale": "...", "phpAuthority": "..." }],
  "renameCandidates": [{ "current": "...", "proposed": "...", "rationale": "..." }],
  "findings": {
    "missing": [{ "symbol": "...", "name": "...", "where": "...", "note": "..." }],
    "redundant": [{ "symbol": "...", "name": "...", "note": "..." }],
    "signatureMismatch": [{ "symbol": "...", "name": "...", "tsSig": "...", "sourceSig": "...", "note": "..." }],
    "soft": []
  },
  "patches": [{ "symbol": "...", "kind": "learn|rename", "gated": "rename|none", "old_string": "...", "new_string": "..." }],
  "intentional": [{ "symbol": "...", "name": "...", "note": "..." }],
  "summary": "1-3 sentences."
}

`anchor` must uniquely identify the declaration line. `old_string` must be unique within the .d.ts. Source paths file-only, no `:line` suffix. Renames go to `renameCandidates` for the user gate – never auto-applied.
````

### Per-cluster watchpoints

- **Hybrid clusters** (`features-*`): PHP rules nullability. K6 `*State` is JS-bootstrap shape, not PHP authority. Never widen on K6 evidence alone.
- **Inheritance-aware** (`features-view`, `features-modals`, `features-content`): never re-flag inherited PanelFeature/PanelModal members. Focus on what the module ADDS or OVERRIDES.
- **PHP-rooted** (`index-config`, `index-permissions`, `index-viewprops`): PHP `toArray()` / `props()` is the response shape. K6 TS `*State` types are JS-side state, not the server payload – don't import.
- **API clusters**: JS client is source of truth. PHP routes only when JSDoc on the JS wrapper is missing.
- **`index-panel`**: K6 plugin shape uses Vue 3 (`App`, `Plugin`, `ConcreteComponent`). Record as drift only – never propose backports.
- **Helpers**: anchors are short property names (`array:`, `slug:`). Use surrounding context for uniqueness, or anchor on the wrapping interface.

## Pass 2

One Agent call per `.d.ts`, `run_in_background: true`. 8 agents. Same model-inheritance rule as pass 1.

Time-box: pass 1 already cited PHP/K6/K5 paths. Re-read a source only when the finding is unclear. If still ambiguous after one quick check, DEFER. Aim for under 5 minutes wall-clock.

````
ROLE: Pass-2 verifier for kirby-types Panel types. Re-verify pass-1 findings and emit `{old_string, new_string}` patches for confirmed issues. READ-ONLY on every file – DO NOT use the Edit tool. Write only to the JSON output path before returning.

OUTPUT PATH: <KIRBY_TYPES_ROOT>/.review/.raw/<TS_FILE>.pass2.json

TS FILE: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

KIRBY ROOTS:
- <KIRBY_K5_ROOT> – PHP authority + K5 JS
- <KIRBY_K6_ROOT> – K6 TS (may be absent)

PASS-1 FINDINGS – read each:
- <KIRBY_TYPES_ROOT>/.review/.raw/<cluster1>.json
- <KIRBY_TYPES_ROOT>/.review/.raw/<cluster2>.json
- ...

APPROVED RENAMES (from the user gate):
<list approved {current → proposed}, or "none">

JOB – for every pass-1 finding:

1. Re-verify against PHP first, K6 TS second, K5 JS only when both silent.
2. Decide:
   - **ACT** – confirmed wrong, fix is straightforward, no cascade-break.
   - **DEFER** – real issue but cost > value (deep PHP types, server-hydrated null narrowings consumers never observe, K6 plugin Vue-3 shape, deprecated Vue-2 paths, K6-only methods on K5-targeted types).
   - **DISMISS** – pass 1 was wrong on re-examination.
3. Renames: ACT only if approved at the gate. Otherwise DEFER with `user did not approve rename`.
4. For each ACT, emit `{old_string, new_string}`:
   - `old_string` is a unique exact substring within the TS file.
   - Preserve indentation and existing JSDoc/`@source` lines.
   - When adding a new property/method, follow the JSDoc rules in [rubric.md](rubric.md#jsdoc-style).
   - Minimal – no surrounding refactor.

Soft items: tighten if statically known and won't cascade. Otherwise DEFER.

OUTPUT (single fenced ```json at end of response, also written to OUTPUT PATH):
{
  "verifications": [
    {
      "finding": "<short identifier>",
      "bucket": "drift|learn|rename|missing|redundant|signatureMismatch|soft",
      "decision": "ACT|DEFER|DISMISS",
      "rationale": "<1-2 sentences citing source path>",
      "patch": { "old_string": "...", "new_string": "..." }
    }
  ],
  "annotations": [
    { "finding": "<symbol> @source addition", "decision": "ACT", "rationale": "...", "patch": { "old_string": "...", "new_string": "..." } }
  ],
  "summary": "X ACT (verifications) + Y ACT (annotations) + Z DEFER + W DISMISS"
}
````

### ACT vs DEFER cheat sheet

ACT:

- K6-only members → add with `@since 6` (see [rubric.md](rubric.md#k6-only-members))
- K6-renamed identifiers, after gate approval

DEFER:

- JS-defaults vs PHP-runtime divergence (defaults-as-runtime fallacy)
- K6 plugin Vue-3 shape – drift only
- Deep per-blueprint shapes (e.g. `PanelViewPropsModel` per content type)
- Already-`@deprecated` Vue-2 paths
- JSDoc-only documentation gaps
