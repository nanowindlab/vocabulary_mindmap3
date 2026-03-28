# 20260327_MM3_245_DETAIL_SURFACE_CARD_HARMONIZATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 00:43 KST`

## Last Updated By

- `Codex PM`

## Scope

- additional design slice inside `MM3-242 New Design Tranche`

## Implemented

- detail core card에 `Core Meaning` kicker와 two-column card rhythm을 적용했다.
- translation panel을 별도 inset panel로 정리했다.
- relation/overview card에 unified section surface treatment를 적용했다.

## Files

- `09_app/src/components/TermDetail.jsx`
- `09_app/src/index.css`

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/smoke.spec.js tests/residual.spec.js -g "search and facet wiring smoke|detail header keeps pronunciation inline and removes duplicate translation section|tree and filter learner flow smoke"` -> `3 passed`

## PM Verdict

- `MM3-245` -> `DONE`
- detail surface card harmonization은 current design pass 안에서 closeout 가능 상태다.

## Revision History

- `R1` / `2026-03-27 00:43 KST` / `Codex PM` / detail core/translation/section card surface harmonization을 반영하고 targeted validation을 통과시킴
