# Pass-2 verifier agent prompt template

Use one Agent call per `.d.ts` file (Opus, run_in_background). 8 agents total. The rubric block is in [rubric.md](rubric.md) – paste verbatim into the agent prompt.

````
ROLE: Pass-2 verifier for kirby-types Panel types. Re-verify pass-1 findings and emit precise patches for confirmed issues. Agents are read-only on sources; Write is permitted only to the supplied JSON output path, before returning. See [rubric.md](rubric.md). Output path: `<KIRBY_TYPES_ROOT>/.review/.raw/<TS_FILE>.pass2.json`.

TS FILE: <KIRBY_TYPES_ROOT>/src/panel/<TS_FILE>

KIRBY ROOTS:
- <KIRBY_K5_ROOT> – PHP authority + K5 JS
- <KIRBY_K6_ROOT> – K6 TS (may be absent)

PASS-1 FINDINGS: read all of these JSON files:
- <KIRBY_TYPES_ROOT>/.review/.raw/<cluster1>.json
- <KIRBY_TYPES_ROOT>/.review/.raw/<cluster2>.json
...

APPROVED RENAMES (from the user gate):
<list approved {current → proposed}, or "none">

JOB:
For every finding (drift / learnFrom / renameCandidate / missing / redundant / signatureMismatch / soft) in the pass-1 JSONs:

1. Re-verify by reading PHP first, K6 TS second, K5 JS only when both are silent. Use the `@source` annotations applied at end of pass 1 to find sources fast.
2. Consider surrounding TS code: would a fix cascade-break consumers? Is there existing narrowing? Would deep PHP types make a fix impractical?
3. Decide:
   - **ACT**: confirmed wrong; fix is straightforward; no cascade-break.
   - **DEFER**: real issue but cost > value (deep PHP types, server-hydrated null narrowings consumers never observe, K6 plugin Vue-3 shape, deprecated Vue-2 paths, K6-only methods on K5-targeted types).
   - **DISMISS**: pass-1 was wrong on re-examination.
4. For renameCandidates: ACT only if the user approved this rename; otherwise DEFER with rationale `user did not approve rename`. Do not silently skip – the user gate is the decision authority.
5. For each ACT, produce a patch (`old_string` → `new_string`) suitable for the Edit tool:
   - `old_string` MUST be a unique exact substring within the TS file.
   - Preserve indentation, existing JSDoc, and existing `@source` lines.
   - When adding a new property/method, include a 1-2 line JSDoc. Add an `@source` ONLY if the source file differs from every `@source` already on the wrapping interface – never duplicate a parent cite. Path is file-only, no `:line` suffix.
   - Minimal – no surrounding refactor.

For Soft items: tighten if statically known and won't cascade. Otherwise DEFER.

OUTPUT – single fenced ```json at end:
{
  "verifications": [
    {
      "finding": "<short identifier>",
      "bucket": "drift|learn|rename|missing|redundant|signatureMismatch|soft",
      "decision": "ACT|DEFER|DISMISS",
      "rationale": "<1-2 sentences citing source path>",
      "patch": {
        "old_string": "<exact unique substring>",
        "new_string": "<replacement>"
      }
    }
  ],
  "annotations": [
    {
      "finding": "<symbol> @source addition",
      "decision": "ACT",
      "rationale": "<1 sentence>",
      "patch": { "old_string": "...", "new_string": "..." }
    }
  ],
  "summary": "X ACT (verifications) + Y ACT (annotations) + Z DEFER + W DISMISS"
}

The optional `annotations` array carries pure `@source` additions/normalizations as patch objects (same `{old_string, new_string}` shape as `verifications[].patch`). Apply both arrays to the file. Splitting them in the JSON makes the run easier to skim – verifications are about contract changes, annotations are about provenance.
````

## Common ACT vs DEFER patterns

### ACT (current policy)

- **K6-only methods/fields**: see [rubric.md](rubric.md#k6-only-members).
- **K6-renamed identifiers** (after user approval at the rename gate): apply rename, add `K6 only` note if the old name only existed in K5.

### DEFER

- **JS-defaults vs PHP-runtime divergence**: if a property's JS `defaults()` returns `null` but the PHP response shape always sets it, the type is **non-nullable**. DEFER any nullable widening unless PHP source confirms the response can omit the field. Never widen on JS evidence alone – that is the defaults-as-runtime fallacy.
- **K6 plugin Vue-3 shape**: K6 `panel/src/panel/plugins.ts` uses `App`, `Plugin`, `ConcreteComponent` from Vue 3. DEFER (record as drift only).
- **Deep per-blueprint shapes**: `PanelViewPropsModel` differs per content type (Page/File/User/Site). A unified shape would require a tagged union – DEFER unless explicitly requested.
- **Deprecated Vue-2 paths**: e.g. `PanelDialog.openComponent`. K6 removed it; K5 retains it for legacy Vue 2 components. DEFER tightening; keep as `@deprecated`.
- **JSDoc-only documentation gaps**: a runtime accepts `'/'` as synonym for root parent in `pages.create` – already covered by `string` type; DISMISS as documentation-only.
