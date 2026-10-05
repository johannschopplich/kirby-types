# Apply step

Walk every pass-2 JSON. Collect every `{old_string, new_string}` from any ACT entry and apply it with the Edit tool to the patch's `file` when set, else to the verifier's TS file.

`old_string` must be present and unique:

- Absent → already applied. Skip silently. Re-runs must be no-ops.
- Non-unique → log and skip. Better to drop one patch than write to the wrong line.

Then run the completion check in [SKILL.md](../SKILL.md#pass-2--verify--apply).

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

**Checks run on the branch's own install.** `main` builds against Vue 2.7, `feat/kirby-6` against Vue 3. A worktree that borrows the other branch's `node_modules` passes or fails for the wrong Vue.

**Narrowing a base type cascades to derived overrides.** Narrowing a member on a parent interface can make a wider override on a child interface an illegal override – `tsc` then fails on the child, not the patched line. When a patch narrows a member, grep for interfaces that `extends` the patched one and narrow their overrides in the same pass – or, where the child legitimately differs, omit the member from the parent in the child's `extends`, as `PanelModal` does with `Omit<PanelFeature<TDefaults>, "reload">`.
