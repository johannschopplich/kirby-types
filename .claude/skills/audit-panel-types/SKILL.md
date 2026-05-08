---
name: audit-panel-types
description: Audit kirby-types panel augmentation types against Kirby PHP, K6 TypeScript, and K5 JavaScript sources via a two-pass agent swarm. Use when asked to audit, verify, refresh, or check kirby-types panel types.
disable-model-invocation: true
---

# Audit Panel Types

Authority: **PHP > K6 TS > K5 JS**. PHP overrules K6 when they disagree.

## Roots

Ask the user for three absolute paths. Don't auto-detect.

- `<KIRBY_TYPES_ROOT>` – the kirby-types checkout being audited
- `<KIRBY_K5_ROOT>` – Kirby 5 checkout (PHP source + K5 JS)
- `<KIRBY_K6_ROOT>` – Kirby 6 checkout (K6 TS)

If `<KIRBY_K6_ROOT>` is absent, treat K6 as silent and proceed with PHP + K5.

## Pre-flight – verify topology

Spot-check [topology.md](references/topology.md) against `<KIRBY_K6_ROOT>/panel/src`. K6 keeps moving files between releases. Patch topology inline before launching agents – stale entries waste tokens.

Watch for: files still on `.js` that the topology calls TS (or vice versa), new singletons in `panel/src/panel/`, new helper registrations in `helpers/index.ts`.

## Pass 1 – annotate + report

One agent per cluster from [topology.md](references/topology.md). 23 agents, batched 7–8 at a time. Each writes its JSON to `<KIRBY_TYPES_ROOT>/.review/.raw/<cluster>.json` before returning – compaction loses in-memory results.

Pass 1 is **read-only on every file**, including the kirby-types `.d.ts`. Revert any stray `.d.ts` edits before pass 2.

Prompt template: [AGENTS.md – Pass 1](references/AGENTS.md#pass-1).

## Rename gate

Pass 1 may surface `renameCandidates`. Aggregate across clusters.

- **Empty or all "keep as-is" advisories**: skip the gate. Proceed to pass 2 with `APPROVED RENAMES: none`.
- **Otherwise**: present as a multi-select to the user with each rationale. Pass the approved subset to pass 2. Rejected ones get DEFER with `user did not approve rename`.

A `learnFrom` whose new identifier differs from the old is a rename in disguise. Route it through the gate.

## Pass 2 – verify + apply

One verifier per `.d.ts` (8 agents). Each reads the cluster JSONs for its file, decides ACT / DEFER / DISMISS, and emits `{old_string, new_string}` patches. The orchestrator applies them.

The verifier is also read-only. Patches go in JSON; the apply step is yours.

Prompt template: [AGENTS.md – Pass 2](references/AGENTS.md#pass-2).

### Apply

Walk every pass-2 JSON, collect every `{old_string, new_string}` from ACT entries, and replace in file-position order. Schema varies between agents (`patch`, `edit`, `edits`, top-level `patches[]`); be tolerant. See [edit-gotchas.md](references/edit-gotchas.md).

Re-runs must be no-ops. `tsc --noEmit` must exit clean. `pnpm test` must pass – type-test files (`test/*.test-d.ts`) consume the augmentations and break on signature changes; update them in the same commit.

References: [topology](references/topology.md) · [rubric](references/rubric.md) · [agents](references/AGENTS.md) · [edit gotchas](references/edit-gotchas.md).
