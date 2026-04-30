---
name: audit-panel-types
description: Audit kirby-types panel augmentation types against Kirby JS + PHP runtime sources via a two-pass agent swarm. Use when asked to audit, verify, refresh, or check kirby-types panel types, or when the user explicitly invokes this skill.
disable-model-invocation: true
---

A two-pass swarm for verifying that Panel augmentation types in `kirby-types/src/panel/*.d.ts` match the Kirby runtime. Pass 1 annotates `@source` and reports findings. Pass 2 verifies each finding and applies confirmed fixes.

## Setup

Before launching agents, the orchestrator needs two absolute paths:

- `<KIRBY_TYPES_ROOT>` – the kirby-types checkout being audited
- `<KIRBY_ROOT>` – the Kirby checkout the types describe

Read these from the user's invocation. If either is missing, ask before continuing – no defaults, no auto-detection.

The 8 audit-target files are always: `index.d.ts`, `base.d.ts`, `features.d.ts`, `api.d.ts`, `helpers.d.ts`, `libraries.d.ts`, `writer.d.ts`, `textarea.d.ts` under `<KIRBY_TYPES_ROOT>/src/panel/`.

Reports go to `<KIRBY_TYPES_ROOT>/.review/`.

## Topology

23 source-symbol cluster agents – one per Kirby source file group, not one per `.d.ts` file. (8 file-scoped agents would be too coarse for `features.d.ts`, which spans 17 source files.)

| `.d.ts` file     | Pass-1 clusters                                                             |
| ---------------- | --------------------------------------------------------------------------- |
| `base.d.ts`      | 1 (state, feature, modal, history, listeners, request)                      |
| `features.d.ts`  | 6 (state-only, notification, view+searcher, upload, content, modals+events) |
| `api.d.ts`       | 4 (core+auth, pages+site+files, users+roles+languages, translations+system) |
| `helpers.d.ts`   | 3 (data, string/UI, utility)                                                |
| `libraries.d.ts` | 1                                                                           |
| `writer.d.ts`    | 3 (editor, marks, nodes)                                                    |
| `textarea.d.ts`  | 1                                                                           |
| `index.d.ts`     | 4 (Panel main + plugins, config + language, permissions, view props)        |

See [references/topology.md](references/topology.md) for the cluster → source-file mapping each agent needs in its prompt.

## Pass 1: annotate + report

Read-only swarm. Agents propose annotations and findings; the orchestrator applies them.

### 1. Spawn 23 Opus agents in parallel

Launch in 2–3 batches to keep notifications manageable. Each agent owns one cluster and gets:

- The TS symbols it's responsible for (interface/type names, no line numbers needed)
- Candidate Kirby source paths (the agent verifies or refines)
- The rubric (below) verbatim

Agent prompt template: see [references/agent-pass1.md](references/agent-pass1.md).

### 2. Persist each agent's JSON to disk immediately

When a notification arrives, write the JSON to `<KIRBY_TYPES_ROOT>/.review/.raw/<cluster>.json` before continuing – compaction loses in-memory results. Each agent returns:

```json
{
  "annotations": [{ "symbol": "...", "anchor": "<unique substring>", "sources": ["panel/src/panel/X.js"] }],
  "findings": {
    "missing": [{ "symbol": "...", "name": "...", "where": "panel/src/panel/X.js:NN", "note": "..." }],
    "redundant": [...],
    "signatureMismatch": [...],
    "soft": [...]
  },
  "intentional": [...],
  "summary": "1–3 sentences"
}
```

### 3. Apply `@source` annotations

Write a script that inserts `@source <path>` into the JSDoc above each anchored symbol. Any language. See [references/edit-gotchas.md](references/edit-gotchas.md) before starting.

### 4. Write 8 markdown reports

Aggregate the per-cluster JSON into one report per `.d.ts` file at `<KIRBY_TYPES_ROOT>/.review/<file>.d.ts.md`, plus `<KIRBY_TYPES_ROOT>/.review/README.md` with totals. Group findings into `missing` / `redundant` / `signatureMismatch` / `soft` / `intentional looseness`.

## Pass 2: verify + apply

Pass 1 produces reports for the user to review. Pass 2 turns confirmed findings into patches.

### 1. Spawn 8 verifier agents in parallel

One per `.d.ts` file (not per cluster – verifiers benefit from cross-cluster context for cascade analysis). Each:

- Reads its `<KIRBY_TYPES_ROOT>/.review/.raw/*.json` files
- Re-verifies each finding against current Kirby source
- Classifies **ACT / DEFER / DISMISS** with rationale
- For ACT, emits an exact `{old_string, new_string}` patch suitable for the Edit tool

Agent prompt template: see [references/agent-pass2.md](references/agent-pass2.md).

Agents will apply patches themselves anyway. Verify the diff against their proposed `old_string/new_string`. Use `mode: plan` to enforce strict read-only.

### 2. Decision rubric for the verifier

- **ACT** – confirmed wrong; fix is straightforward; no cascade-break
- **DEFER** – real issue but the cost > value (deep PHP types, server-hydrated null narrowings consumers never observe, deprecated Vue paths)
- **DISMISS** – pass-1 was wrong on re-examination

Common DEFER patterns and DEFER/DISMISS examples: see [references/agent-pass2.md](references/agent-pass2.md).

### 3. Apply patches

Write a script that walks each verifier output, takes ACT entries, and applies them as exact-string replacements. Skip:

- `old_string` not found (already applied – no-op)
- `old_string` non-unique (collision risk – log and skip)
- `patch` field present but not a dict (agent self-applied; field is a textual summary)

Algorithm and gotchas: [references/edit-gotchas.md](references/edit-gotchas.md).

### 4. Verify

```bash
./node_modules/.bin/tsc --noEmit
```

Run from `<KIRBY_TYPES_ROOT>`. Must exit clean. If errors appear, identify which patch caused them and revert via `git checkout -- src/panel/<file>.d.ts`.

### 5. Update reports

Aggregate the pass-2 verifier JSON into pass-2 reports with **Applied (ACT) / Deferred / Dismissed** sections. Archive each pass-1 report as `<file>.d.ts.md.pass1` before overwriting. Update `.review/README.md` totals.

## Rubric (used by both passes verbatim, paste into agent prompts)

**Real findings to report:**

- **Missing** – public Kirby member not represented in TS
- **Redundant** – TS member without runtime backing
- **Signature mismatch** – wrong arity / param types / return type
- **Soft** – JSDoc shape narrower than `any`/`Record<string, any>` widening allows; lower severity

**Skip – never report:**

- `#`-prefixed JS class privates
- Symbols marked `@internal` in JSDoc on either side
- Test-only references (`*.test.js`)

**Intentional looseness – note, do not flag:**

- `Record<string, any>` for query bags (e.g. `query?: Record<string, any>`)
- `Promise<any>` for dynamic backend response data
- Deep PHP class shapes too cumbersome to mirror (per-blueprint model permissions, locale arrays keyed by LC\_\* constants, blueprint-driven view tabs)

## Outputs

After pass 2:

- 8 `.d.ts` files with `@source` JSDoc annotations and applied fixes – verifiable via `git diff src/panel/`
- `.review/<file>.d.ts.md` × 8 – pass-2 reports
- `.review/<file>.d.ts.md.pass1` × 8 – archived pass-1 reports
- `.review/README.md` – top-level summary with per-file ACT/DEFER/DISMISS table
- `.review/.raw/` and `.review/.raw2/` – raw agent JSON for re-aggregation
