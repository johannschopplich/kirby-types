# Pass-1 cluster agent prompt template

Use one Agent call per cluster (Opus, run_in_background, read-only). Substitute `<placeholders>` from [topology.md](topology.md). The rubric block is in [rubric.md](rubric.md) – paste verbatim into the agent prompt.

````
ROLE: You review TypeScript augmentation types that describe Kirby Panel's runtime `window.panel`. These types help plugin authors. Agents are read-only on sources; Write is permitted only to the supplied JSON output path, before returning. See [rubric.md](rubric.md). Output path: `<KIRBY_TYPES_ROOT>/.review/.raw/<CLUSTER>.json`.

TS FILE TO REVIEW: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

KIRBY ROOTS:
- <KIRBY_K5_ROOT> – Kirby 5 checkout. PHP authority lives at `src/`; K5 JS at `panel/src/`.
- <KIRBY_K6_ROOT> – Kirby 6 checkout. K6 TS at `panel/src/`. (May be absent – if so, treat K6 as silent for every finding.)

SYMBOLS YOU OWN (review only these):
<COMMA-SEPARATED LIST FROM TOPOLOGY>

CANDIDATE SOURCES (verify, refine, search if missing):
- PHP: <list from topology, or "silent">
- K6 TS: <list from topology, or "no K6 source">
- K5 JS: <list from topology>

JOB:
1. Locate and confirm source paths for each owned symbol.
2. Trinary diff:
   a. PHP → TYPES (response shape, nullability) – walk PHP `toArray()` / `props()` first for hybrid clusters.
   b. K6 TS → TYPES – walk K6 `.ts` for method signatures, new symbols, narrowed unions.
   c. K5 JS → TYPES – walk K5 `.js` only when PHP is silent and K6 is unmigrated.
   d. TYPES → SOURCES (sweep) – every TS member must exist in at least one source.
3. Apply the rubric (paste from rubric.md). Authority order is PHP > K6 TS > K5 JS.

OUTPUT (single fenced ```json at end):
{
  "annotations": [
    { "symbol": "PanelDrag", "anchor": "export interface PanelDrag extends", "sources": ["panel/src/panel/drag.js"] }
  ],
  "drift": [{"symbol":"...","k5":"...","k6":"...","php":"...","note":"..."}],
  "learnFrom": [{"symbol":"...","k6Shape":"...","kirbyTypesCurrent":"...","rationale":"...","phpAuthority":"..."}],
  "renameCandidates": [{"current":"...","proposed":"...","rationale":"..."}],
  "findings": {
    "missing": [{"symbol":"...","name":"...","where":"...","note":"..."}],
    "redundant": [{"symbol":"...","name":"...","note":"..."}],
    "signatureMismatch": [{"symbol":"...","name":"...","tsSig":"...","sourceSig":"...","note":"..."}],
    "soft": []
  },
  "patches": [{"symbol":"...","kind":"learn|rename","gated":"rename|none","old_string":"...","new_string":"..."}],
  "intentional": [{"symbol":"...","name":"...","note":"..."}],
  "summary": "1-3 sentences."
}

The `anchor` MUST uniquely identify the declaration line. If a bare `export interface FooBar` matches multiple symbols, include the trailing `{` or generic params.

Annotate the wrapping interface only. A member gets an `@source` only when its file differs from every `@source` already on the interface – never duplicate.

Source paths are file-only. No `:line` or `:line-range` suffixes – line numbers rot.

Quote member names exactly. `old_string` must be unique within the .d.ts file.

Renames are NOT applied automatically. Emit them as `renameCandidates` for the user gate ([renames.md](renames.md)). The orchestrator presents the aggregated list before pass 2.
````

## Per-cluster customizations

- **Hybrid clusters** (`features-*`): PHP rules nullability. K6 `*State` types are JS-bootstrap shapes made type-safe – they are NOT authoritative for nullability against PHP. Never widen on K6 evidence alone.
- **Inheritance-aware clusters** (`features-view`, `features-modals`, `features-content`): Inherited PanelFeature/PanelModal members are NOT re-flagged. Focus on what each module ADDS or OVERRIDES.
- **PHP-rooted clusters** (`index-config`, `index-permissions`, `index-viewprops`): PHP `toArray()` / `props()` is the response shape. K6 TS often does NOT model server props (e.g. K6 `ViewState` is JS-side state, not the full server payload). Do not import K6 narrowings here.
- **API clusters**: JS client (K5 + K6) is source of truth. PHP routes consulted only when JSDoc on the JS wrapper is missing.
- **Plugins cluster** (`index-panel`): K6 `plugins.ts` uses Vue 3 types. kirby-types stays Vue 2 augmentation. Record K6 plugin/PanelApp/PanelPluginExtensions shape as drift only. Never propose backports.
- **Helpers clusters**: anchors are usually short property names (`array:`, `slug:`). Use enough surrounding context for uniqueness, or anchor on the wrapping interface declaration (`export interface PanelHelpersArray`).

## Batching

Launch in 2-3 batches of 7-8 agents each to keep notification volume manageable.
