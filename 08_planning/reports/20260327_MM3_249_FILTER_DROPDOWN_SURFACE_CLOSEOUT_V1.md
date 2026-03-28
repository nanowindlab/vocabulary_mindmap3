# 20260327_MM3_249_FILTER_DROPDOWN_SURFACE_CLOSEOUT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 09:35 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-248 Filter & Dropdown Surface Refresh`

## Implemented

- filter trigger button state를 current shell language에 맞춰 재정리했다.
- dropdown panel에 header / selection summary를 추가했다.
- option row를 custom selection indicator 기반 interaction row로 바꿨다.
- translation toggle / filter panel summary pill도 같은 interaction language로 맞췄다.

## Files

- `09_app/src/App.jsx`
- `09_app/src/index.css`

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/smoke.spec.js tests/scenario.spec.js tests/residual.spec.js -g "tree and filter learner flow smoke|filter-first scenario|vietnamese translation selector shows vietnamese surface|expression cards hide translation when translation is off"` -> `4 passed`

## PM Verdict

- `MM3-248` -> `DONE`
- filter/dropdown interaction surface는 current tranche 기준으로 closeout 가능 상태다.
- next slice는 `search result panel guidance` 쪽으로 넘긴다.

## Revision History

- `R1` / `2026-03-27 09:35 KST` / `Codex PM` / filter/dropdown/translation toggle interaction surface를 정리하고 targeted validation을 닫음
