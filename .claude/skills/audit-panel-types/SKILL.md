---
name: audit-panel-types
description: Audit kirby-types panel augmentation types against the Kirby PHP and Panel source of the release line the branch targets, via a two-pass agent swarm.
disable-model-invocation: true
---

# Audit Panel Types

Authority: **PHP > Panel source** of one Kirby release line. Each kirby-types branch types exactly one line – see [rubric.md – Lines](references/rubric.md#lines).

## Roots

Ask the user for two absolute paths. Don't auto-detect.

- `<KIRBY_TYPES_ROOT>` – the kirby-types checkout being audited; its branch names the line
- `<KIRBY_ROOT>` – the Kirby checkout of that line (PHP source + Panel source)

## Probe – map the live source

Kirby migrates modules between `.js` and `.ts` every release. Never trust hard-coded file status – discover it:

```
node scripts/probe.mjs <KIRBY_ROOT> <KIRBY_TYPES_ROOT> [LINE]
```

`probe.mjs` creates `<KIRBY_TYPES_ROOT>/.review/.raw/` and writes `source-map.json` beside it: the line, the Kirby version, per-module `.js`/`.ts` status, and the `$helper` and panel-singleton registrations. **Completion criterion**: `source-map.json` exists and its `modules` map is non-empty.

Then branch on `flags`:

- **`LINE-UNKNOWN`** → ask which Lines-table branch the work targets, then re-probe with it as `LINE`.
- **`LINE-MISMATCH` or `NOT-GIT`** → surface it and get a matching, full-history root from the user.
- **`SHALLOW-HISTORY`** → run the command the flag names, then re-probe.
- **Any other flag, or none** → launch. Routine runs ask nothing.

[topology.md](references/topology.md) gives the **stable** map only: symbol → cluster → module + PHP authority.

## Pass 1 – annotate + report

One agent per cluster in [topology.md](references/topology.md), batched ~8 at a time. Each writes its JSON to `<KIRBY_TYPES_ROOT>/.review/.raw/<cluster>.json` before returning – compaction loses in-memory results.

**Completion criterion**: every cluster in [topology.md](references/topology.md) has a written `.raw/<cluster>.json` before the rename gate. A clean cluster still writes one (empty finding arrays + summary); a missing file means a dropped agent – relaunch it.

Pass 1 is **read-only on every file**, including the kirby-types `.d.ts`. Revert any stray `.d.ts` edits before pass 2.

Prompt template: [agent-prompts.md – Pass 1](references/agent-prompts.md#pass-1).

## Rename gate

Pass 1 may surface `renameCandidates`. Aggregate across clusters.

- **Empty or all "keep as-is" advisories**: skip the gate. Proceed to pass 2 with `APPROVED RENAMES: none`.
- **Otherwise**: present as a multi-select to the user with each rationale. Pass the approved subset to pass 2. Rejected ones get DEFER with `user did not approve rename`.

A `tighten` whose new identifier differs from the old is a rename in disguise. Route it through the gate.

## Pass 2 – verify + apply

One verifier per `.d.ts`, read-only. Each reads the cluster JSONs for its file, decides ACT / DEFER / DISMISS, and emits `{old_string, new_string}` patches in JSON; the orchestrator applies them.

Prompt template: [agent-prompts.md – Pass 2](references/agent-prompts.md#pass-2). Apply walk: see [edit-gotchas.md](references/edit-gotchas.md).

**Completion criterion**: every `.d.ts` in [topology.md](references/topology.md) has a written `.raw/<file>.pass2.json` before the apply – a missing file means a dropped verifier, relaunch it. After the apply, `tsc --noEmit`, `pnpm test`, `pnpm lint`, and `node scripts/check-line.mjs <KIRBY_TYPES_ROOT>` exit clean, with `test/*.test-d.ts` assertions broken by the new types updated in the same pass. Once committed, `scripts/check-commits.sh <KIRBY_TYPES_ROOT> <BASE>`, with `<BASE>` the commit the audit started from, passes every commit on its own.
