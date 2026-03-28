# 20260326_MM3_240_FALLBACK_SURFACE_GUIDANCE_REFINEMENT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 22:50 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-236E Fallback Surface Guidance`

## Implemented

- `상황 미지정` helper wording을 더 짧게 정리했다.
- `분류 밖 항목` helper wording을 탐색 기준 중심으로 더 짧게 정리했다.
- fallback surface용 compact guidance chip을 header meta row에 추가했다.
- actual in-app guide의 fallback section wording을 current UI guidance와 맞췄다.

## Files

- `09_app/src/utils/hierarchyDisplay.js`
- `09_app/src/components/TermDetail.jsx`
- `09_app/tests/residual.spec.js`
- `08_planning/reports/20260325_MM3_197_ACTUAL_IN_APP_GUIDE_V1.md`

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/residual.spec.js -g "situation none path is reframed as general vocabulary|unclassified helper splits grammatical items from uncategorized vocabulary"` -> `2 passed`

## PM Verdict

- `MM3-236E` -> `DONE`
- fallback surface guidance refinement는 current canonical 안에서 closeout 가능 상태다.
- `MM3 UI refinement roadmap`은 planned slice 기준으로 전부 닫혔다.

## Revision History

- `R1` / `2026-03-26 22:50 KST` / `Codex PM` / fallback guidance wording과 compact guidance chip을 반영하고 targeted validation을 닫음
