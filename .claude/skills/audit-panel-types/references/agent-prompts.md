# Agent prompt templates

One template per pass. Both passes are read-only on every file – never use the Edit tool from inside an agent. Substitute `<placeholders>` from [topology.md](topology.md). Paste the rubric block from [rubric.md](rubric.md) verbatim.

## Pass 1

One Agent call per cluster, `run_in_background: true`. Launch in batches of ~8 so notifications stay manageable. Subagents inherit the orchestrator's model – don't pass an explicit `model:` override.

````
ROLE: You review TypeScript augmentation types that describe Kirby Panel's runtime `window.panel`. READ-ONLY on every file – including the kirby-types `.d.ts` under review. DO NOT use the Edit tool. Write only to the JSON output path before returning.

OUTPUT PATH: <KIRBY_TYPES_ROOT>/.review/.raw/<CLUSTER>.json

TS FILE TO REVIEW: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

LINE: <line from source-map.json> – the row in rubric.md's Lines table sets the plugin shape and the `@since` baseline.

KIRBY ROOT: <KIRBY_ROOT> – PHP authority at `src/`, Panel source at `panel/src/`, full git history for `@since`.

SOURCE MAP: <KIRBY_TYPES_ROOT>/.review/source-map.json – per module, whether the root ships `.js`, `.ts`, or both, plus `$helper`/singleton registrations. Resolve every module's extension from here. NEVER assume `.js` vs `.ts`.

SYMBOLS YOU OWN:
<COMMA-SEPARATED LIST FROM TOPOLOGY>

MODULES (extension-free – resolve each against the source map):
<MODULE LIST FROM TOPOLOGY>
PHP: <PHP paths from topology, or "silent">

JOB:
1. Resolve each owned symbol's module(s) to real files via the source map, then read them.
2. Diff PHP → Panel source, then sweep TYPES → SOURCES.
3. Apply the rubric. For `@source`: cite the file the map lists; a path under the other extension or absent from the map is a **phantom** → replace or drop it.

OUTPUT (single fenced ```json at end of response, also written to OUTPUT PATH):
{
  "annotations": [{ "symbol": "...", "anchor": "export interface ... {", "sources": ["panel/src/..."] }],
  "tighten": [{ "symbol": "...", "sourceShape": "...", "kirbyTypesCurrent": "...", "rationale": "...", "phpAuthority": "..." }],
  "renameCandidates": [{ "current": "...", "proposed": "...", "rationale": "..." }],
  "findings": {
    "missing": [{ "symbol": "...", "name": "...", "where": "...", "note": "..." }],
    "redundant": [{ "symbol": "...", "name": "...", "note": "..." }],
    "signatureMismatch": [{ "symbol": "...", "name": "...", "tsSig": "...", "sourceSig": "...", "note": "..." }],
    "soft": []
  },
  "patches": [{ "symbol": "...", "kind": "tighten|fix|rename", "gated": "rename|none", "old_string": "...", "new_string": "..." }],
  "intentional": [{ "symbol": "...", "name": "...", "note": "..." }],
  "summary": "1-3 sentences."
}

`anchor` must uniquely identify the declaration line. `old_string` must be unique within the .d.ts. Source paths file-only, no `:line` suffix. Renames go to `renameCandidates` for the user gate – never auto-applied.
````

### Per-cluster watchpoints

- **Hybrid clusters** (`features-*`): PHP rules nullability. Panel `*State` types are JS-bootstrap shape, not PHP authority. Never widen on Panel evidence alone.
- **Inheritance-aware** (`features-view`, `features-modals`, `features-content`): never re-flag inherited PanelFeature/PanelModal members. Focus on what the module ADDS or OVERRIDES.
- **PHP-rooted** (`index-config`, `index-permissions`, `index-viewprops`): PHP `toArray()` / `props()` is the response shape. Panel `*State` types are JS-side state, not the server payload – don't import.
- **API clusters**: the Panel client is source of truth. PHP routes only when JSDoc on the client wrapper is missing.
- **`index-panel`**: the plugin shape (`PanelApp`, `PanelComponentExtension`, `PanelPlugins`, `PanelPluginExtensions`) follows the line's Vue version.
- **Helpers**: anchors are short property names (`array:`, `slug:`). Use surrounding context for uniqueness, or anchor on the wrapping interface.

## Pass 2

One Agent call per `.d.ts`, `run_in_background: true`. Same model-inheritance rule as pass 1.

Time-box: pass 1 already cited PHP and Panel paths. Re-read a source only when the finding is unclear. If still ambiguous after one quick check, DEFER.

````
ROLE: Pass-2 verifier for kirby-types Panel types. Re-verify pass-1 findings and emit `{old_string, new_string}` patches for confirmed issues. READ-ONLY on every file – DO NOT use the Edit tool. Write only to the JSON output path before returning.

OUTPUT PATH: <KIRBY_TYPES_ROOT>/.review/.raw/<TS_FILE>.pass2.json

TS FILE: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

LINE: <line from source-map.json> – see rubric.md's Lines table.

KIRBY ROOT: <KIRBY_ROOT> – PHP authority + Panel source

PASS-1 FINDINGS – read each:
- <KIRBY_TYPES_ROOT>/.review/.raw/<cluster1>.json
- <KIRBY_TYPES_ROOT>/.review/.raw/<cluster2>.json
- ...

APPROVED RENAMES (from the user gate):
<list approved {current → proposed}, or "none">

JOB – for every pass-1 finding:

1. Re-verify against PHP first, Panel source second.
2. Decide:
   - **ACT** – confirmed wrong, fix is straightforward, no cascade-break.
   - **DEFER** – real issue but cost > value (deep PHP types, server-hydrated null narrowings consumers never observe).
   - **DISMISS** – pass 1 was wrong on re-examination.
3. Renames: ACT only if approved at the gate. Otherwise DEFER with `user did not approve rename`.
4. Several clusters may report the same member – dedupe into ONE patch.
5. For each ACT, emit `{old_string, new_string}`:
   - `old_string` is a unique exact substring within the TS file; patches never overlap – merge neighbours.
   - Preserve indentation and existing JSDoc/`@source` lines.
   - When adding a new property/method, follow the JSDoc rules in [rubric.md](rubric.md#jsdoc-style).
   - Minimal – no surrounding refactor.
   - A broken `test/*.test-d.ts` assertion gets its own patch with `"file": "test/<name>.test-d.ts"`.

Soft items: tighten if statically known and won't cascade. Otherwise DEFER.

OUTPUT (single fenced ```json at end of response, also written to OUTPUT PATH):
{
  "verifications": [
    {
      "finding": "<short identifier>",
      "bucket": "tighten|rename|missing|redundant|signatureMismatch|soft",
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

- Members the line ships that TS lacks
- Panel TS shapes PHP confirms (`tighten`)
- Renamed identifiers, after gate approval

DEFER:

- JS-defaults vs PHP-runtime divergence (defaults-as-runtime fallacy)
- Deep per-blueprint shapes (e.g. `PanelViewPropsModel` per content type)
- JSDoc-only documentation gaps
