---
name: audit-panel-types
description: Audit kirby-types panel augmentation types against the Kirby 6 PHP and Panel source, via a two-pass agent swarm.
disable-model-invocation: true
---

# Audit Panel Types

## Roots

Use the absolute paths the user names; default the rest without asking to this checkout, the `/tmp/kirby-v6` clone, and `~/Projects/kirbyuse`:

- `<KIRBY_TYPES_ROOT>`: the kirby-types checkout being audited
- `<KIRBY_ROOT>`: the Kirby checkout at its latest release per [rubric.md – Latest Release](references/rubric.md#latest-release), PHP and Panel source
- `<KIRBYUSE_ROOT>`: the kirbyuse checkout, for [Downstream](#downstream)

`<SKILL_DIR>` is this skill's directory.

## Probe

```
node <SKILL_DIR>/scripts/probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT>
```

It empties `.review/.raw/` and writes `<KIRBY_TYPES_ROOT>/.review/source-map.json`: the Kirby major and `@since` baseline, the audit's `base` commit, `modules` with each module's file types, `helperRegistrations`, `panelSingletons`, `deadSources`, and `unownedTypes`. Done when `modules` is non-empty. Then branch on `flags`:

- **`KIRBY-MISMATCH` or `NOT-GIT`**: get a matching, full-history root from the user.
- **`DIRTY-TREE`**: have the user commit or stash the changes `git status --short -- src test '*.d.ts'` lists, then re-probe.
- **`SHALLOW-HISTORY`**: run the command the flag names and re-probe.
- **`UNOWNED-TYPES`**: add each listed type to the [topology](references/topology.md) cluster whose symbols reference it, else to the cluster of its file whose modules hold its source, then re-probe.
- **Only `DEAD-SOURCE`, or no flag**: launch without asking. A `deadSources` entry outside `src/panel/` goes to the report, not to pass 2.

## Pass 1

One agent per cluster in [topology.md](references/topology.md), at most eight at once, with the [Pass 1 template](references/agent-prompts.md#pass-1). Done when every cluster has a `.review/.raw/<CLUSTER>.json` that parses, a clean one included, and `git status --short` lists no `.d.ts`. Revert a `.d.ts` an agent touched. Relaunch a cluster whose file is missing or broken once; a second failure drops it.

## Rename Gate

Collect `renameCandidates` across clusters, a `tighten` that changes an identifier included. With no candidate, pass 2 gets `APPROVED RENAMES: none`. Otherwise put them to the user as multi-select questions of up to four, each with its rationale, and pass 2 gets the approved subset.

## Pass 2

One verifier per `.d.ts` in the topology, with the [Pass 2 template](references/agent-prompts.md#pass-2). Done when every `.d.ts` has a `.review/.raw/<TS_FILE>.pass2.json` that parses. Relaunch a verifier whose file is missing or broken once; a second failure drops it.

## Apply

```
node <SKILL_DIR>/scripts/apply.mjs <KIRBY_TYPES_ROOT>
```

It applies every ACT patch of `.review/.raw/*.pass2.json` and lists the ones it skipped, for the report. Re-apply by hand a skipped patch whose target another verifier edited, against the edited text.

Run the checks on `<KIRBY_TYPES_ROOT>`'s own install. Done when `pnpm exec tsc --noEmit`, `pnpm test`, and `pnpm lint` exit clean and `node <SKILL_DIR>/scripts/check-versions.mjs <KIRBY_TYPES_ROOT>` lists no hit in `src/panel/`, with the `test/*.test-d.ts` assertions the new types broke updated in the same pass; a hit elsewhere goes to the report. A narrowed member fails `tsc` on an interface that extends it and overrides it wider: narrow that override too, or `Omit` the member there. A failure you cannot fix within its finding's claim: revert that patch and report it as skipped.

## Downstream

kirbyuse builds on these types. Install them into `<KIRBYUSE_ROOT>` as a tarball: `pnpm pack --pack-destination "$TMPDIR"` in `<KIRBY_TYPES_ROOT>`, then `pnpm add <tarball>` in `<KIRBYUSE_ROOT>`. Not `pnpm link`: it pulls in a second Vue copy that breaks kirbyuse's build. Then:

- **Grep** its `src/` and README for every member pass 2 deleted, renamed, or retyped, and for comments naming kirby-types (`//.*kirby-types`), the marker of a workaround for a types gap.
- **Check** `pnpm test:types`, `pnpm lint`, and `pnpm build`.

Then restore every file `pnpm add` rewrote – `git status --short` lists them – and `pnpm install`. Done when every hit is fixed or reported, the checks passed against the tarball, `dist/index.d.ts` still declares what `src/index.ts` hands its users (`window.panel` or the `kirby-types/panel-globals` re-export), and `git status --short` in `<KIRBYUSE_ROOT>` lists only the fixes beyond what it listed before the install.

## Report

Per `.d.ts`: the ACTs applied, the patches skipped, and the DEFERs; then the check results, the kirbyuse hits and the fixes left uncommitted there, and the source map's `base`. Name a dropped agent as unchecked. Delete `.review/`.

## Commit

On the user's word: one commit per `.d.ts` with the test and companion edits its checks need – stage a shared test file's hunks with `git apply --cached` – and a skill edit in its own commit. Commit a file that declares a type another imports before the importer. Done when `<SKILL_DIR>/scripts/check-commits.sh <KIRBY_TYPES_ROOT> <base>`, with the `base` the report names, passes every commit on its own.
