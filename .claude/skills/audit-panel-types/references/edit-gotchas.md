# Apply step

Walk every pass-2 JSON. Collect every `{old_string, new_string}` from any ACT entry. Apply via the Edit tool in file-position order so earlier replacements don't invalidate later offsets.

`old_string` must be present and unique:

- Absent → already applied. Skip silently. Re-runs must be no-ops.
- Non-unique → log and skip. Better to drop one patch than write to the wrong line.

After applying, run `tsc --noEmit` and `pnpm test`. Both must exit clean. Type-test files (`test/*.test-d.ts`) consume the augmentations – update broken `expectType`/`expectAssignable` assertions in the same commit.

## Schema is tolerant

Walk any nested object collecting `{old_string, new_string}` pairs from ACT entries; fall back to a top-level `patches[]` array. Accept any of:

- `verifications[].patch.{old_string, new_string}` (canonical)
- `verifications[].edit.{old_string, new_string}` or `edits: [...]`
- `old_string` / `new_string` directly on the verification
- top-level `patches: [{old_string, new_string, ...}]`

## Gotchas

**JSDoc indent reads from inner `*` lines, not from `*/`.** In nested blocks, `/**` and `*/` align at column N but inner `*` lines indent at N+1. Reading indent from `*/` produces off-by-one output. If the block has no inner `*` yet, use the `/**` indent plus one space.

**Inline JSDoc must be expanded before insertion.** `/** Foo */` is valid but can't host multi-line additions. Detect with `^(\s*)/\*\*\s*(.*?)\s*\*/\s*$` and rewrite to multiline first.

**Anchor uniqueness.** Some property names legitimately appear twice (e.g. `clone:`, `pad:`, `slug:`, `uuid:` on both a sub-interface and as parent shortcuts). Verify uniqueness before applying. Disambiguate by widening the anchor to include the surrounding declaration or the trailing `{`.

**Idempotence.** Patches whose `old_string` is gone are already applied – that's a no-op, not an error.
