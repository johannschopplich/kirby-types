# Agent prompt templates

One template per pass. Both passes are read-only on every file – never use the Edit tool from inside an agent. Substitute `<placeholders>`: the roots from the user, `LINE` from `source-map.json` `line`, the cluster slots from [topology.md](topology.md).

## Pass 1

One Agent call per cluster, `run_in_background: true`. Launch in batches of ~8 so notifications stay manageable. Subagents inherit the orchestrator's model – don't pass an explicit `model:` override.

```
ROLE: You review TypeScript augmentation types that describe Kirby Panel's runtime `window.panel`. READ-ONLY on every file – including the kirby-types `.d.ts` under review. DO NOT use the Edit tool. Write only to the JSON output path before returning.

OUTPUT PATH: <KIRBY_TYPES_ROOT>/.review/.raw/<CLUSTER>.json

TS FILE TO REVIEW: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

LINE: <LINE> – its row in the rubric's Lines table sets the plugin shape and the `@since` baseline.

RUBRIC: <KIRBY_TYPES_ROOT>/.claude/skills/audit-panel-types/references/rubric.md – read it in full before step 1.

KIRBY ROOT: <KIRBY_ROOT> – PHP authority at `src/`, Panel source at `panel/src/`, full git history for `@since`.

SOURCE MAP: <KIRBY_TYPES_ROOT>/.review/source-map.json – per module, whether the root ships `.js`, `.ts`, or both, plus `$helper`/singleton registrations. Resolve every module's extension from here. NEVER assume `.js` vs `.ts`.

SYMBOLS YOU OWN:
<COMMA-SEPARATED LIST FROM TOPOLOGY>

MODULES (extension-free – resolve each against the source map):
<MODULE LIST FROM TOPOLOGY>
PHP: <PHP paths from topology, or "silent"> – Kirby 5 paths; on a Kirby 6 root, find each counterpart by grepping its resolver or method name (`View.php` resolvers moved to `State.php`, model props to `ModelViewController`).
WATCH: <from topology: the file section's preamble, the cluster's preamble, and its Watch line – or "none">

JOB:
1. Resolve each owned symbol's module(s) to real files via the source map, then read them.
2. Diff PHP → Panel source, then sweep TYPES → SOURCES.
3. Apply the rubric, including its phantom `@source` rule.

OUTPUT (written to OUTPUT PATH; the reply carries only the summary and the count per category):
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
  "patches": [{ "symbol": "...", "kind": "<finding category>", "gated": "renameCandidate|none", "old_string": "...", "new_string": "..." }],
  "intentional": [{ "symbol": "...", "name": "...", "note": "..." }],
  "summary": "1-3 sentences."
}

`anchor` must uniquely identify the declaration line. `old_string` must be unique within the .d.ts. Source paths file-only, no `:line` suffix. Renames go to `renameCandidates` for the user gate – never auto-applied.
```

## Pass 2

One Agent call per `.d.ts`, `run_in_background: true`. Same model-inheritance rule as pass 1.

Time-box: pass 1 already cited PHP and Panel paths. Re-read a source only when the finding is unclear. If still ambiguous after one quick check, DEFER.

```
ROLE: Pass-2 verifier for kirby-types Panel types. Re-verify pass-1 findings and emit `{old_string, new_string}` patches for confirmed issues. READ-ONLY on every file – DO NOT use the Edit tool. Write only to the JSON output path before returning.

OUTPUT PATH: <KIRBY_TYPES_ROOT>/.review/.raw/<TS_FILE>.pass2.json

TS FILE: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

LINE: <LINE> – see the rubric's Lines table.

RUBRIC: <KIRBY_TYPES_ROOT>/.claude/skills/audit-panel-types/references/rubric.md – read it in full before step 1.

KIRBY ROOT: <KIRBY_ROOT> – PHP authority + Panel source

SOURCE MAP: <KIRBY_TYPES_ROOT>/.review/source-map.json

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
   - `old_string` is a unique exact substring of the current TS file – a pass-1 `old_string` goes stale once the file changed; patches never overlap – merge neighbours.
   - Preserve indentation and existing JSDoc – a phantom `@source` is the one existing line you rewrite.
   - When adding a new property/method, follow the rubric's JSDoc style.
   - Minimal – no surrounding refactor.
   - A broken `test/*.test-d.ts` assertion or a companion edit in another `.d.ts` (a re-export) gets its own patch with `"file"` set to that path.

Soft items: tighten if statically known and won't cascade. Otherwise DEFER.

OUTPUT (written to OUTPUT PATH; the reply carries only the summary and every DEFER that needs a user decision):
{
  "verifications": [
    {
      "finding": "<short identifier>",
      "bucket": "tighten|renameCandidate|missing|redundant|signatureMismatch|soft",
      "decision": "ACT|DEFER|DISMISS",
      "rationale": "<1-2 sentences citing source path>",
      "patch": { "file": "<optional – a test/*.test-d.ts path; default the TS file>", "old_string": "...", "new_string": "..." }
    }
  ],
  "annotations": [
    { "finding": "<symbol> @source addition", "decision": "ACT", "rationale": "...", "patch": { "old_string": "...", "new_string": "..." } }
  ],
  "summary": "X ACT (verifications) + Y ACT (annotations) + Z DEFER + W DISMISS"
}
```

### ACT vs DEFER cheat sheet

ACT:

- Members the line ships that TS lacks
- Panel TS shapes PHP confirms (`tighten`)
- Renamed identifiers, after gate approval

DEFER:

- JS-defaults vs PHP-runtime divergence (defaults-as-runtime fallacy)
- Deep per-blueprint shapes (e.g. `PanelViewPropsModel` per content type)
- JSDoc-only documentation gaps
