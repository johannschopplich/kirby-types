# Apply-step algorithm + gotchas

The orchestrator writes two scripts during a run: one to apply pass-1 `@source` annotations into JSDoc blocks, one to apply pass-2 ACT patches as exact-string replacements. Pick any language. The four gotchas below are the ones that took the previous run real time to diagnose – handle them up front.

## Apply `@source` annotations (pass 1)

For each annotation `{ symbol, anchor, sources: [paths] }`:

1. **Normalize sources first.** Strip any `:line` or `:line-range` suffix (`foo.php:65` → `foo.php`). Drop a source if it already appears on the wrapping interface's JSDoc – children must not repeat parent cites. Both rules apply even when the agent emitted them.
2. Find `anchor` in the TS file. It must be a unique substring.
3. Look at the line above the anchor. Three cases:
   - **No JSDoc** – insert a fresh block above with `/**`, `* @source <path>` per source, `*/`. Match the anchor's own indent.
   - **Multiline JSDoc** (`*/` on the line above, `/**` somewhere earlier) – insert each new `* @source <path>` line just before the `*/`, indented to match existing inner `*` lines.
   - **Inline JSDoc** (`/** Foo */` all on one line) – expand it to multiline, then add `* @source <path>` lines before `*/`.
4. Skip sources already present in the block (idempotent re-run).

## Apply ACT patches (pass 2)

For each verifier output entry where `decision === "ACT"`:

1. If `patch` is not an object (agent self-applied; field is a textual summary) – skip silently.
2. Locate `patch.old_string` in the file. Must be present and unique. If absent → already applied (skip). If non-unique → log error, skip.
3. Replace with `patch.new_string`.

Run patches in file-position order so earlier replacements don't invalidate later offsets.

## The four gotchas

### 1. JSDoc indent is read from inner `*` lines, not from `*/`

In nested JSDoc blocks, the `/**` and `*/` lines align at column N, but inner `*` lines indent at N+1. If you read indent from the `*/` line and apply it to your inserted `@source` line, the result will be off by one space.

```
  /**           <-- col 2
   * Foo        <-- col 3  ← read indent from this
   * @source X  <-- insert at col 3 to match
   */          <-- col 2  ← NOT this
```

If the block has no inner `*` line yet (single-line block being expanded), use the `/**` line's indent plus one space.

### 2. Inline JSDoc must be expanded before insertion

`/** Foo */` on one line is a valid JSDoc but can't host multi-line `@source` additions. Detect with a regex like `^(\s*)/\*\*\s*(.*?)\s*\*/\s*$` and rewrite to:

```
<indent>/**
<indent> * Foo
<indent> * @source <path>
<indent> */
```

### 3. Anchor uniqueness – and disambiguation when needed

Agents are told to emit unique anchors, but some collide in practice:

- `export interface PanelLibrary` matches both `PanelLibrary` and `PanelLibraryColors`. Anchors must include the trailing `{` (or generic params) for disambiguation.
- Some property names legitimately appear twice – e.g. `clone:`, `pad:`, `slug:`, `uuid:` exist on both a sub-interface and as shortcuts on the parent `PanelHelpers`. The agent's anchor matches both. The orchestrator needs an "occurrence: 2" path or a richer anchor.

Verify uniqueness before applying. If non-unique and you can't recover automatically, log the symbol and skip – better to drop one annotation than to write to the wrong line.

### 4. Idempotence on re-run

Both apply steps must be safe to re-run. Annotations with `@source` already present should be no-ops. Patches whose `old_string` is gone (already applied) should be no-ops. Don't error on these.

## Verification

After pass-2 applies finish, run `tsc --noEmit` from the kirby-types repo root. Must exit clean. If errors appear, identify the offending patch from the diff and revert just that file via `git checkout`.
