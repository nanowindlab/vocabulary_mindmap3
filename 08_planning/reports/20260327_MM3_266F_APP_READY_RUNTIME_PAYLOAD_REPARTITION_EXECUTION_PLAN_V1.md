# 20260327_MM3_266F_APP_READY_RUNTIME_PAYLOAD_REPARTITION_EXECUTION_PLAN_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-27 20:32 KST`

## Last Updated By

- `Codex PM`

## Scope

- select the first execution tranche for `MM3-266F`
- define the bounded implementation plan and verification boundaries

## Tranche Selection

- selected first tranche:
  - `T1 Formalize Search-Index-Derived Tree Runtime`

## Why This Tranche First

- current production symptom was already traced to the large tree payload fetch path.
- runtime behavior has already proven that `searchIndex -> tab projection` restores learner-facing tree rendering without direct tree payload fetch.
- therefore the highest-value next move is to turn the current workaround into an explicit runtime contract, before touching `DETAIL_MAP` or slimming `SEARCH_INDEX`.

## T1 Goal

- make `APP_READY_MEANING_TREE`, `APP_READY_SITUATION_TREE`, and `APP_READY_UNCLASSIFIED_TREE` non-runtime learner fetch objects by contract
- keep them only as build/validation artifacts for now
- align runtime code comments, loader boundaries, and validation language to the new contract

## In Scope

- runtime contract/documentation update for tree payload trio demotion
- remove or park dead runtime loader path references that imply the app still fetches tree trio
- keep current `searchIndex -> tab projection` runtime path as the intended architecture
- preserve current `SEARCH_INDEX + FACETS` eager load and `CHUNK_*` on-demand detail model
- align loader comments/exports so the new runtime contract is explicit in code

## Out Of Scope

- shrinking `APP_READY_SEARCH_INDEX`
- demoting `APP_READY_DETAIL_MAP` from primary runtime truth
- chunk-only detail parity rewrite
- external artifactization / LFS strategy
- package/build manifest restructuring
- tree trio generation removal from build-side artifacts

## File Boundary

### Primary Runtime

- `09_app/src/App.jsx`
- `09_app/src/data/loaderAdapter.js`
- optional:
  - `09_app/src/utils/hierarchyDisplay.js`

### Build/Validation

- doc-only, comments-only, or explicit non-runtime clarification in:
  - `09_app/scripts/prepare-live-payloads.mjs`
  - `09_app/scripts/verify-runtime-payloads.mjs`
  - `09_app/scripts/validate-runtime-source-alignment.mjs`

### Control-Plane

- `08_planning/reports/20260327_MM3_266F_*`
- `08_planning/TASKLIST_V1.md`
- `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
- `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
- `.codex-orchestration/HANDOFF_MESSAGE_TO_NEW_PM_V1.md`

## Verification

### Required

- `npm run build`
- `npx playwright test tests/smoke.spec.js tests/scenario.spec.js`

### Acceptance

- app runtime does not depend on direct tree payload fetch for learner-facing navigation
- dead tree fetch path references are removed or explicitly parked from runtime code
- local shell/tree render still shows current counts:
  - meaning `44,410`
  - situation `6,399`
  - unclassified `8,506`
- production custom domain can still render the projected tree shell

### Done Criteria

- `App.jsx` and `loaderAdapter.js` reflect the same runtime contract
- learner-facing runtime no longer implies tree trio fetch as an active path
- package/build still succeed without changing tree trio generation policy
- local smoke and scenario tests remain green

## Rollback Boundary

- if projected tree runtime causes rendering/count regressions, revert only the runtime contract tranche
- do not mix this rollback with `DETAIL_MAP` or `SEARCH_INDEX` slimming work

## Follow-Up Tranches

### T2

- `DETAIL_MAP` demotion preparation
- define chunk-only detail parity requirements

### T3

- `SEARCH_INDEX` slimming plan
- identify removable eager fields and possible semantic-tail split

## PM Verdict

- `MM3-266F` now has a selected first execution tranche.
- PM validation and 3-expert review both returned `PARTIAL_ACCEPT` with scope tightening.
- preferred sequence:
  - `T1 Formalize Search-Index-Derived Tree Runtime`
  - `T2 DETAIL_MAP demotion preparation`
  - `T3 SEARCH_INDEX slimming`

## Revision History

- `R2` / `2026-03-27 20:32 KST` / `Codex PM` / PM validation과 3인 전문가 리뷰를 반영해 T1 scope, non-goals, done criteria를 강화
- `R1` / `2026-03-27 20:18 KST` / `Codex PM` / `MM3-266F` first tranche selection과 bounded execution plan을 고정
