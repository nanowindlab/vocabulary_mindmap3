# 20260327_MM3_261_TOP_ARCHITECTURE_CONSOLIDATION_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 08:35 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-261A` top architecture consolidation implementation tranche

## Implemented

- `Current Surface` strip을 제거했다.
- top shell / filter rail / explorer header를 practical density 기준으로 추가 압축했다.
- `계층 탐색` header와 `Explorer View` header의 baseline과 divider line을 맞췄다.
- logo kicker를 `MM3 Explorer`에서 `Explorer`로 바꿨다.
- `핵심 뜻`/번역 area를 stacked practical reading layout으로 재정리했다.

## Related Clarification

- `MM3`의 `3`은 learner-facing product meaning이 아니라 project code다.
- 따라서 top chrome에서는 project code를 전면에 드러내기보다
  explorer identity만 남기는 편이 맞다고 판단했다.

## Files

- `09_app/src/App.jsx`
- `09_app/src/components/TermDetail.jsx`
- `09_app/src/index.css`

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/smoke.spec.js tests/residual.spec.js -g "search and facet wiring smoke|search helper explains ordering and basic-item label|detail header keeps pronunciation inline and removes duplicate translation section"` -> `3 passed`

## PM Verdict

- `MM3-260C` -> `DONE`
- `MM3-261A` -> `DONE`

## Remaining Follow-Up

- `MM3-261B` top architecture theme continuity art-direction polish: `TODO`

## Revision History

- `R1` / `2026-03-27 08:35 KST` / `Codex PM` / top architecture consolidation implementation을 반영하고 practical reading까지 함께 정리
