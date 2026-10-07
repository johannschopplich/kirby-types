---
name: audit-panel-types
description: Audit kirby-types panel augmentation types against the Kirby PHP and Panel source of the release line the branch targets, via a two-pass agent swarm.
disable-model-invocation: true
---

# Audit Panel Types

Each kirby-types branch types one Kirby release line, per [rubric.md – Lines](references/rubric.md#lines).

## Roots

Take three absolute paths from the user:

- `<KIRBY_TYPES_ROOT>`: the kirby-types checkout being audited; its branch names the line
- `<KIRBY_ROOT>`: the Kirby checkout of that line at its latest release per [rubric.md – Lines](references/rubric.md#lines), PHP and Panel source
- `<KIRBYUSE_ROOT>`: the kirbyuse checkout on the same line, for [Downstream](#downstream)

## Probe

```
node scripts/probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT> [LINE]
```

It writes `<KIRBY_TYPES_ROOT>/.review/source-map.json`: the line with its majors and `@since` baseline, the audit's `base` commit, each module's file types, the registrations, dead `@source` paths, and exported types no cluster owns. Done when `modules` is non-empty. Then branch on `flags`:

- **`LINE-UNKNOWN`**: ask which line the work targets and re-probe with it as `LINE`.
- **`LINE-MISMATCH` or `NOT-GIT`**: get a matching, full-history root from the user.
- **`DIRTY-TREE`**: have the user commit or stash the changes `git status --short` lists, then re-probe.
- **`SHALLOW-HISTORY`**: run the command the flag names and re-probe.
- **`UNOWNED-TYPES`**: add each listed type to the [topology](references/topology.md) cluster whose symbols reference it, then re-probe.
- **`DEAD-SOURCE`, or no flag**: launch. Routine runs ask nothing.

## Pass 1

One agent per cluster in [topology.md](references/topology.md), launched in batches of about eight, with the [Pass 1 template](references/agent-prompts.md#pass-1). Done when every cluster has a `.review/.raw/<cluster>.json` that parses, a clean one included, and `git status --short` lists no `.d.ts`. Relaunch a cluster whose file is missing or broken; revert a `.d.ts` an agent touched.

## Rename Gate

Collect `renameCandidates` across clusters, a `tighten` that changes an identifier included. When none proposes a new name, pass 2 gets `APPROVED RENAMES: none`. Otherwise put them to the user as a multi-select with each rationale, and pass 2 gets the approved subset.

## Pass 2

One verifier per `.d.ts` in the topology, with the [Pass 2 template](references/agent-prompts.md#pass-2). Done when every `.d.ts` has a `.review/.raw/<file>.pass2.json` that parses; relaunch a verifier whose file is missing or broken.

## Apply

Collect every `old_string`/`new_string` pair under an ACT and apply it with the Edit tool to the patch's `file`, else to the verifier's `.d.ts`; the first match wins:

- `new_string` contains `old_string` and is present: an insertion already applied, skip.
- `old_string` found once: apply.
- `old_string` gone and `new_string` present: already applied, skip.
- Anything else: skip, and keep it for the report.

Run the checks on `<KIRBY_TYPES_ROOT>`'s own install. Done when `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm lint`, and `node scripts/check-line.mjs <KIRBY_TYPES_ROOT> <LINE>` exit clean, with the `test/*.test-d.ts` assertions the new types broke updated in the same pass. A narrowed member fails `tsc` on an interface that extends it and overrides it wider: narrow that override too, or `Omit` the member there.

## Downstream

kirbyuse builds on these types. Install them into `<KIRBYUSE_ROOT>` as a tarball: `pnpm pack --pack-destination "$TMPDIR"` in `<KIRBY_TYPES_ROOT>`, then `pnpm add <tarball>` in `<KIRBYUSE_ROOT>`. A `pnpm link` resolves `vue` from kirby-types' own install, and the second Vue copy breaks kirbyuse's build. Then:

- **Grep** its `src/` and README for every member pass 2 deleted, renamed, or retyped, and for comments naming kirby-types (`//.*kirby-types`), the marker of a workaround for a types gap.
- **Check** `pnpm test:types`, `pnpm lint`, and `pnpm build`.

Then restore `package.json` and the lockfile that `pnpm add` rewrote, and `pnpm install`. Done when every hit is fixed or reported, the checks passed against the tarball, `dist/index.d.ts` still declares what `src/index.ts` hands its users (`window.panel` or the `kirby-types/panel-globals` re-export), and `git status --short` in `<KIRBYUSE_ROOT>` lists only the fixes.

## Report

Per `.d.ts`: the ACTs applied, the patches skipped, the DEFERs that need a user decision, and the check results; then the kirbyuse hits and the source map's `base`. On a line other than `main`, list the ACTs that may hold on `main`'s latest release too, as unchecked candidates. Name a dropped agent as unchecked. Delete `.review/`.

## Commit

On the user's word: one commit per `.d.ts` with the test and companion edits its checks need – stage a shared test file's hunks with `git apply --cached` – and a skill edit in its own commit. A change that holds on both lines' latest releases lands on `main`, which merges into `feat/kirby-6`. Done when `scripts/check-commits.sh <KIRBY_TYPES_ROOT> <base>` passes every commit on its own. Releases follow the order in the `kirby` skill.
