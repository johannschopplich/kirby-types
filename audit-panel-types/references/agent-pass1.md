# Pass-1 cluster agent prompt template

Use one Agent call per cluster (Opus, run_in_background, read-only). Substitute `<placeholders>` from [topology.md](topology.md).

````
ROLE: You review TypeScript augmentation types that describe Kirby Panel's runtime `window.panel`. These types help plugin authors. Read-only – DO NOT use Edit/Write.

TS FILE TO REVIEW: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>
KIRBY SOURCE ROOT: <KIRBY_ROOT> (read JS under panel/src/, PHP under src/)

SYMBOLS YOU OWN (review only these):
<COMMA-SEPARATED LIST FROM TOPOLOGY>

CANDIDATE KIRBY SOURCES (verify, refine, search if missing):
<LIST OF kirby/...js OR kirby/...php PATHS>

JOB:
1. Locate/confirm Kirby source path for each owned symbol.
2. Bidirectional comparison:
   a. SOURCE → TYPES (primary): walk every public method/property/getter in the JS class or PHP toArray() output. Each must be typed.
   b. TYPES → SOURCE (sweep): every TS member must exist in source.
3. Apply rubric:
   - SKIP: `#`-prefixed JS privates, `@internal` JSDoc, test-only refs (`.test.js`)
   - REPORT: missing | redundant | signatureMismatch
   - SOFT: JSDoc richer than `any`/`Record<string,any>` widening
   - INTENTIONAL (note, don't flag): `Record<string,any>` for query bags / dynamic backend props / deep-PHP-rooted shapes

OUTPUT (single fenced ```json at end):
{
  "annotations": [
    { "symbol": "PanelDrag", "anchor": "export interface PanelDrag extends", "sources": ["panel/src/panel/drag.js"] }
  ],
  "findings": {
    "missing": [{"symbol":"...","name":"...","where":"panel/src/panel/X.js","note":"..."}],
    "redundant": [{"symbol":"...","name":"...","note":"..."}],
    "signatureMismatch": [{"symbol":"...","name":"...","tsSig":"...","jsSig":"...","note":"..."}],
    "soft": []
  },
  "intentional": [{"symbol":"...","name":"...","note":"..."}],
  "summary": "1-3 sentences."
}

The `anchor` MUST uniquely identify the declaration line. If a bare `export interface FooBar` matches multiple symbols, include the trailing `{` or generic params.

Annotate the wrapping interface only. A member gets an `@source` only when its file differs from every `@source` already on the interface – never duplicate.

Source paths are file-only. No `:line` or `:line-range` suffixes – line numbers rot.

Quote member names exactly.
````

## Per-cluster customizations

- **Inheritance-aware clusters** (`features-view`, `features-modals`, `features-content`): add a line – _"Inherited PanelFeature/PanelModal members are NOT re-flagged. Focus on what each module ADDS or OVERRIDES."_
- **Helpers clusters**: anchors are usually short property names like `array:`. Tell the agent to use enough context for uniqueness, or to anchor on the type interface declaration (`export interface PanelHelpersArray`) when sub-types are named.
- **PHP-rooted clusters** (`index-config`, `index-permissions`, `index-viewprops`): tell the agent the source of truth is PHP `toArray()` / `props()` / `$actions` arrays. JS only consumes the JSON, so don't compare against JS for these.
- **API clusters**: JS client is source of truth. Consult `config/api/routes/*.php` only when JS wrapper JSDoc is missing.

## Batching

Launch in 2–3 batches to keep notification volume manageable:

- Batch 1: `base` + 6 features clusters (7 agents)
- Batch 2: 4 api + 3 helpers + 1 libraries (8 agents)
- Batch 3: 3 writer + 1 textarea + 4 index (8 agents)
