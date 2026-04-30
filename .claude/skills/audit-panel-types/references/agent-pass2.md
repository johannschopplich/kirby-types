# Pass-2 verifier agent prompt template

Use one Agent call per `.d.ts` file (Opus, run_in_background). 8 agents total.

````
ROLE: Pass-2 verifier for kirby-types Panel types. Re-verify pass-1 findings and emit precise patches for confirmed issues. Read-only – do NOT use Edit/Write.

TS FILE: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>
KIRBY SOURCE ROOT: <KIRBY_ROOT>
PASS-1 FINDINGS: read all of these JSON files (paths absolute under <KIRBY_TYPES_ROOT>):
- .review/.raw/<cluster1>.json
- .review/.raw/<cluster2>.json
...

JOB:
For every finding (missing/redundant/signatureMismatch/soft) in the pass-1 JSONs, plus any `intentional` note you suspect should be tightened:
1. Re-verify by reading the cited Kirby source line(s) AND the current TS shape (which now has @source annotations applied – use them to find sources fast).
2. Consider surrounding TS code: would a fix cascade-break consumers? Is there existing narrowing? Would deep PHP types make a fix impractical?
3. Decide:
   - **ACT**: confirmed wrong; fix is straightforward; no cascade-break
   - **DEFER**: real issue but the cost > value (deep PHP types, server-hydrated null narrowings consumers never observe, deprecated Vue paths)
   - **DISMISS**: pass-1 was wrong on re-examination
4. For each ACT, produce a patch (`old_string` → `new_string`) suitable for the Edit tool:
   - `old_string` MUST be a unique exact substring within the TS file
   - Preserve indentation, existing JSDoc, and existing @source lines
   - When adding a new property/method, include a 1-2 line JSDoc. If the description fits on one line and the block has no `@source` or other tags, write it inline as `/** Description. */` – not a 3-line block. Add an `@source` ONLY if the source file is different from every `@source` already on the wrapping interface – never duplicate a parent cite. Path is file-only, no `:line` suffix.
   - Minimal – no surrounding refactor

For Soft items: tighten if statically known and won't cascade. Otherwise DEFER.

OUTPUT – single fenced ```json at end:
{
  "verifications": [
    {
      "finding": "<short identifier>",
      "bucket": "missing|redundant|signatureMismatch|soft",
      "decision": "ACT|DEFER|DISMISS",
      "rationale": "<1-2 sentences citing kirby path:line>",
      "patch": {  // ACT only
        "old_string": "<exact unique substring>",
        "new_string": "<replacement>"
      }
    }
  ],
  "summary": "X ACT, Y DEFER, Z DISMISS"
}
````

## Common DEFER patterns to inject into the prompt

- **Server-hydrated nulls**: PHP populates `PanelSystem`, `PanelTranslation`, `PanelLanguage` fields before any consumer reads. JS `defaults()` returning `null` is a transient state. DEFER the widening.
- **Deep per-blueprint shapes**: `PanelViewPropsModel` differs per content type (Page/File/User/Site). A unified shape would require a tagged union – large refactor; DEFER unless the user explicitly wants it.
- **Deprecated paths**: e.g. `PanelDialog.open` accepting a legacy Vue component instance. The current `any`-typed `openComponent` covers it; DEFER tightening.
- **JSDoc-only documentation gaps**: a runtime accepts `'/'` as a synonym for root parent in `pages.create` – already covered by `string` type; DISMISS as documentation-only.

## Auto-apply caveat

Some agents will apply patches themselves despite the read-only instruction. The orchestrator's apply step must tolerate this – skip `old_string` that isn't found (already applied) and treat non-dict `patch` fields as agent-self-applied summaries. See [edit-gotchas.md](edit-gotchas.md) for the full algorithm.

If you want to enforce strict read-only, pass `mode: plan` on the Agent call.
