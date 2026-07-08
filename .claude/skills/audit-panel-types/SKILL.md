---
name: audit-panel-types
description: Audit kirby-types panel augmentation types against Kirby PHP, K6 TypeScript, and K5 JavaScript sources via a two-pass agent swarm.
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

## Probe – map the live sources

Kirby migrates modules between `.js` and `.ts` every release. Never trust hard-coded file status – discover it:

```
node scripts/probe.mjs <KIRBY_K5_ROOT> <KIRBY_K6_ROOT> <KIRBY_TYPES_ROOT>
```

`probe.mjs` creates `<KIRBY_TYPES_ROOT>/.review/.raw/` and writes `source-map.json` beside it. The map reports, per module, whether K5/K6 ship `.js`/`.ts`/`absent`; the `$helper` and panel-singleton registrations; both Kirby versions; and `postureFlags`. **Completion criterion**: `source-map.json` exists and its `modules` map is non-empty.

Then branch on `postureFlags`:

- **A flag contains `RE-CONFIRM`** (K6 shipped, K5 retired, or the plugin shape flipped) → surface it to the user and get a decision before launching. The standing posture lives in [rubric.md](references/rubric.md); a boundary crossing is the only thing that reopens it.
- **A flag contains `SHALLOW-HISTORY`** → that root's history floor is its current release, so it silently mis-dates `@since`. Don't gate the user; route all `@since` archaeology to the deepest-history root (per [rubric.md](references/rubric.md)) and proceed.
- **Otherwise** → launch. Routine runs ask nothing.

[topology.md](references/topology.md) gives the **stable** map only: symbol → cluster → module + PHP authority. Every agent reads `source-map.json` for file status and cites it – never the extensions in topology.

## Pass 1 – annotate + report

One agent per cluster in [topology.md](references/topology.md), batched ~8 at a time. Each writes its JSON to `<KIRBY_TYPES_ROOT>/.review/.raw/<cluster>.json` before returning – compaction loses in-memory results.

**Completion criterion**: every cluster in [topology.md](references/topology.md) has a written `.raw/<cluster>.json` before the rename gate. A clean cluster still writes one (empty finding arrays + summary); a missing file means a dropped agent – relaunch it.

Pass 1 is **read-only on every file**, including the kirby-types `.d.ts`. Revert any stray `.d.ts` edits before pass 2.

Prompt template: [agent-prompts.md – Pass 1](references/agent-prompts.md#pass-1).

## Rename gate

Pass 1 may surface `renameCandidates`. Aggregate across clusters.

- **Empty or all "keep as-is" advisories**: skip the gate. Proceed to pass 2 with `APPROVED RENAMES: none`.
- **Otherwise**: present as a multi-select to the user with each rationale. Pass the approved subset to pass 2. Rejected ones get DEFER with `user did not approve rename`.

A `learnFrom` whose new identifier differs from the old is a rename in disguise. Route it through the gate.

## Pass 2 – verify + apply

One verifier per `.d.ts`, read-only. Each reads the cluster JSONs for its file, decides ACT / DEFER / DISMISS, and emits `{old_string, new_string}` patches in JSON; the orchestrator applies them.

Prompt template: [agent-prompts.md – Pass 2](references/agent-prompts.md#pass-2). Apply walk: see [edit-gotchas.md](references/edit-gotchas.md).

**Completion criterion**: `tsc --noEmit` and `pnpm test` both exit clean; `test/*.test-d.ts` assertions broken by the new types are updated in the same pass.
