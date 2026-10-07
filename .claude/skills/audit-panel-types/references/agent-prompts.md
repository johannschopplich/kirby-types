# Agent Prompt Templates

Substitute the `<placeholders>`: the roots from the user, `<SKILL_DIR>` as this skill's directory, `LINE` from `source-map.json`, and the cluster slots from [topology.md](topology.md).

## Pass 1

```
ROLE: You review TypeScript augmentation types that describe Kirby Panel's runtime `window.panel`. Your one write is the JSON at OUTPUT PATH.

OUTPUT PATH: <KIRBY_TYPES_ROOT>/.review/.raw/<CLUSTER>.json

TS FILE TO REVIEW: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

LINE: <LINE>. The rubric's Lines table gives its plugin shape, the source map its `@since` baseline.

RUBRIC: <SKILL_DIR>/references/rubric.md. Read it in full before step 1.

KIRBY ROOT: <KIRBY_ROOT>. PHP authority at `src/`, Panel source at `panel/src/`, full git history for `@since`.

SOURCE MAP: <KIRBY_TYPES_ROOT>/.review/source-map.json. Each module's file types and the `$helper`/singleton registrations; resolve every module's extension from it.

SYMBOLS YOU OWN:
<COMMA-SEPARATED LIST FROM TOPOLOGY>

MODULES (extension-free):
<MODULE LIST FROM TOPOLOGY>
PHP: <PHP paths from topology, or "silent">. A path KIRBY ROOT lacks has moved: find its counterpart by resolver or method name and cite that.
WATCH: <from topology: the file section's preamble, the cluster's preamble, and every cluster bullet besides Symbols, Modules and PHP – or "none">

JOB:
1. Resolve each owned symbol's modules to real files via the source map, then read them. A module missing from the map is renamed or gone: find its successor by symbol name, else file the symbol as `redundant`.
2. Diff PHP against the Panel source, then sweep the types against both.
3. Apply the rubric.

Done when every member of every owned symbol is matched to a source or filed in a category, and OUTPUT PATH parses as JSON.

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
  "intentional": [{ "symbol": "...", "name": "...", "note": "..." }],
  "summary": "1-3 sentences."
}

`anchor` identifies the declaration line uniquely. Source paths are file-only, without a `:line` suffix.
```

## Pass 2

```
ROLE: Pass-2 verifier for kirby-types Panel types. Re-verify the pass-1 findings and emit `{old_string, new_string}` patches for the confirmed ones. Your one write is the JSON at OUTPUT PATH.

OUTPUT PATH: <KIRBY_TYPES_ROOT>/.review/.raw/<TS_FILE>.pass2.json

TS FILE: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

LINE: <LINE>

RUBRIC: <SKILL_DIR>/references/rubric.md. Read it in full before step 1.

KIRBY ROOT: <KIRBY_ROOT>

SOURCE MAP: <KIRBY_TYPES_ROOT>/.review/source-map.json. Its `deadSources` lists this file's phantom `@source` lines.

PASS-1 FINDINGS, read each:
- <KIRBY_TYPES_ROOT>/.review/.raw/<cluster1>.json
- ...

APPROVED RENAMES: <list of {current → proposed}, or "none">

JOB, for every pass-1 finding:

1. Re-verify against PHP first, the Panel source second. Re-read the cited source for each ACT, and DEFER when one check leaves it ambiguous.
2. Decide:
   - **ACT**: confirmed, the fix is straightforward, and it breaks no override in an extending interface.
   - **DEFER**: real, but costs more than it gives (deep PHP types, server-hydrated nullability no consumer observes).
   - **DISMISS**: pass 1 was wrong.
3. A rename is ACT only when approved; otherwise DEFER with `user did not approve rename`.
4. Merge findings several clusters report for the same member into one patch.
5. For each ACT, emit `{old_string, new_string}`:
   - `old_string` is an exact substring found once in the current file. Widen it to the wrapping declaration when a member name repeats, as `slug:` or `uuid:` do on a sub-interface and as a shortcut. Patches never overlap; merge neighbours.
   - Keep indentation and the existing JSDoc the finding leaves true; rewrite or drop the lines it falsifies – a phantom `@source`, a version in prose, a shape the type rejects, a deleted member's doc. A JSDoc's indent is that of its inner `*` lines, one more than `/**`; expand a one-line `/** … */` before adding a line to it.
   - New members follow the rubric's JSDoc style, and a patch changes only its finding.
   - A broken `test/*.test-d.ts` assertion or a companion edit in another file, such as a re-export, gets its own patch with `"file"` set to that path. A fixed assertion keeps exercising the same call against the new type.

Soft items: tighten when the type is statically known and breaks nothing; otherwise DEFER.

Done when every pass-1 finding and every `deadSources` entry for this file has one entry, and OUTPUT PATH parses as JSON.

OUTPUT (written to OUTPUT PATH; the reply carries only the summary and every DEFER that needs a user decision):
{
  "verifications": [
    {
      "finding": "<short identifier>",
      "bucket": "tighten|renameCandidate|missing|redundant|signatureMismatch|soft",
      "decision": "ACT|DEFER|DISMISS",
      "rationale": "<1-2 sentences citing a source path>",
      "patch": { "file": "<optional, relative to the root; default the TS file>", "old_string": "...", "new_string": "..." }
    }
  ],
  "annotations": [
    { "finding": "<symbol> @source addition", "decision": "ACT", "rationale": "...", "patch": { "old_string": "...", "new_string": "..." } }
  ],
  "summary": "X ACT (verifications) + Y ACT (annotations) + Z DEFER + W DISMISS"
}
```
