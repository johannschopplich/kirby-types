# Rename approval gate

Pass 1 may flag rename candidates – e.g. `PanelApi.ping → pingId` (K6 renamed the interval-handle field), `PanelUploadCompleteCallback → PanelUploadResultCallback` (K6 split zero-arg `complete` from three-arg `success`/`error`).

Renames are not "fixes" – they are API breaks that need explicit user consent.

## Workflow

1. Pass 1 emits `renameCandidates: [{ current, proposed, rationale }]` per cluster.
2. The orchestrator aggregates renames across all 23 clusters into a single approval list.
3. Present the list to the user as a multi-select question (e.g. via AskUserQuestion). Include the rationale for each candidate so the user can judge value vs breakage.
4. Pass the approved subset into pass 2 verifier prompts (the agent template has an `APPROVED RENAMES` slot).
5. Pass 2 verifiers ACT on approved renames; for rejected ones DEFER with rationale `user did not approve rename`.

## Spotting hidden renames

A rename can hide as a `learnFrom` if the proposed change touches an exported identifier. If pass 1 emits a `learnFrom` whose `new_string` declares a different name than `old_string`, treat it as a rename and route through the gate.
