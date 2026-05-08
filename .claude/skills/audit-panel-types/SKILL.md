---
name: audit-panel-types
description: Audit kirby-types panel augmentation types against Kirby PHP, K6 TypeScript, and K5 JavaScript sources via a two-pass agent swarm. Use when asked to audit, verify, refresh, or check kirby-types panel types.
disable-model-invocation: true
---

# Audit Panel Types

Panel augmentation types are a contract between three sources of truth: the PHP response shape, the K6 TypeScript runtime, and the K5 JavaScript runtime. Pass 1 spawns one agent per source-symbol cluster to surface drift. Pass 2 verifies each finding and applies confirmed fixes. Authority order is **PHP > K6 TS > K5 JS** – load-bearing. PHP overrules K6 when they disagree; see [rubric.md](references/rubric.md) for examples.

K6-only members are pulled in with `@since 6`; the Vue-3 plugin shape is the only K6 surface that defers (see [rubric.md](references/rubric.md)).

## Roots

The orchestrator needs three absolute paths from the user. Ask if missing – no defaults, no auto-detection.

- `<KIRBY_TYPES_ROOT>` – the kirby-types checkout being audited
- `<KIRBY_K5_ROOT>` – Kirby 5 checkout (PHP authority + K5 JS at `panel/src/`)
- `<KIRBY_K6_ROOT>` – Kirby 6 checkout (K6 TS at `panel/src/`)

If the user has no K6 checkout, treat K6 as silent in every finding. The diff degrades to PHP + K5 JS. Do not block.

## Pass 1 – annotate + report

Spawn one Opus agent per cluster from [topology.md](references/topology.md). Persist each JSON to `<KIRBY_TYPES_ROOT>/.review/.raw/<cluster>.json` immediately – compaction loses in-memory results. Aggregate per-`.d.ts` reports under `<KIRBY_TYPES_ROOT>/.review/`. Prompt template: [agent-pass1.md](references/agent-pass1.md).

## Rename approval gate

Pass 1 may surface rename candidates. Aggregate them across clusters into a single approval list and ask the user before launching pass 2. See [renames.md](references/renames.md).

## Pass 2 – verify + apply

One Opus verifier per `.d.ts` file – cross-cluster context aids cascade analysis. Each emits ACT / DEFER / DISMISS plus `{old_string, new_string}` patches. Apply via [edit-gotchas.md](references/edit-gotchas.md); `tsc --noEmit` must exit clean. Archive pass-1 reports as `.pass1` before overwriting.

References: [topology](references/topology.md) · [rubric](references/rubric.md) · [pass 1](references/agent-pass1.md) · [pass 2](references/agent-pass2.md) · [renames](references/renames.md) · [edit gotchas](references/edit-gotchas.md).
