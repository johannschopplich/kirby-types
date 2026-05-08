---
name: audit-panel-types
description: Audit kirby-types panel augmentation types against Kirby PHP, K6 TypeScript, and K5 JavaScript sources via a two-pass agent swarm. Use when asked to audit, verify, refresh, or check kirby-types panel types.
disable-model-invocation: true
---

# Audit Panel Types

Panel augmentation types are a contract between three sources of truth: the PHP response shape, the K6 TypeScript runtime, and the K5 JavaScript runtime. Pass 1 spawns one agent per source-symbol cluster to surface drift. Pass 2 verifies each finding and applies confirmed fixes. Authority order is **PHP > K6 TS > K5 JS** – that order is load-bearing and was overruled in 4 of 39 cases on the last run.

## Reference docs

- [topology.md](references/topology.md) – cluster → source mapping
- [rubric.md](references/rubric.md) – authority order, finding categories, exemptions (pasted into both agent prompts)
- [agent-pass1.md](references/agent-pass1.md) – pass-1 annotate + report
- [agent-pass2.md](references/agent-pass2.md) – pass-2 verify + apply
- [renames.md](references/renames.md) – rename approval gate
- [edit-gotchas.md](references/edit-gotchas.md) – apply algorithm and four known gotchas

## Roots

The orchestrator needs three absolute paths from the user. Ask if missing – no defaults, no auto-detection.

- `<KIRBY_TYPES_ROOT>` – the kirby-types checkout being audited
- `<KIRBY_K5_ROOT>` – Kirby 5 checkout (PHP authority + K5 JS at `panel/src/`)
- `<KIRBY_K6_ROOT>` – Kirby 6 checkout (K6 TS at `panel/src/`)

If the user has no K6 checkout, treat K6 as silent in every finding. The diff degrades to PHP + K5 JS. Do not block.

## Pass 1 – annotate + report

Spawn one Opus agent per cluster from [topology.md](references/topology.md). Each does the trinary diff and emits JSON. **Persist each JSON to `<KIRBY_TYPES_ROOT>/.review/.raw/<cluster>.json` on receipt** – compaction loses in-memory results.

Apply `@source` annotations and aggregate per-cluster JSON into per-`.d.ts` reports under `<KIRBY_TYPES_ROOT>/.review/`.

## Rename approval gate

Pass 1 may surface rename candidates. Aggregate them across clusters into a single approval list and ask the user before launching pass 2. See [renames.md](references/renames.md).

## Pass 2 – verify + apply

One Opus verifier per `.d.ts` file – verifiers benefit from cross-cluster context for cascade analysis. Each re-verifies findings against the current source, classifies **ACT / DEFER / DISMISS**, and emits exact `{old_string, new_string}` patches. Apply via the algorithm in [edit-gotchas.md](references/edit-gotchas.md). `tsc --noEmit` from `<KIRBY_TYPES_ROOT>` must exit clean.

Archive each pass-1 report as `.pass1` before overwriting with the pass-2 version.
