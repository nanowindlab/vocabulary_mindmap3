# 20260328_MM3_268FG_DETAIL_SURFACE_REVIEW_AND_IMPLEMENTATION_V1

- Packet name: `20260328_MM3_268FG_DETAIL_SURFACE_REVIEW_AND_IMPLEMENTATION_V1`
- Packet role: `note`
- Task ID: `MM3-268F`, `MM3-268G`
- Parent pipeline or workflow: `M1 Runtime Wiring / Core Explorer / 2026-03-28 Feedback Wave`
- Status: `DONE`
- Current Revision: `R1`
- Last Updated: `2026-03-28 21:17 KST`
- Last Updated By: `Codex PM`

## Purpose

- Why this packet exists:
  - detail surface 관련 review 항목 `MM3-268F`, `MM3-268G`의 판단과 구현 결과를 한 번에 고정한다.
- What it decides, verifies, or locks:
  - detail tab count wrapping 대응과 `핵심 뜻` 카드 구조 완화를 반영한다.

## MM3-268F Review Result

- Original feedback:
  - `보다` 사례에서 `의미관계 2`가 두 줄로 내려가며, 1280 가로폭에서도 한 줄 유지 가능한지 검토 권고
- Decision:
  - `가능하며, 경미한 tab compression으로 대응하는 것이 맞다.`
- Applied change:
  - tab button을 `inline-flex + nowrap` 기준으로 재정리했다.
  - label/count 간격을 줄이고 badge를 고정폭이 아니라 축소 가능한 구조로 정리했다.

## MM3-268G Review Result

- Original feedback:
  - `핵심 뜻` 카드가 `박스 안의 박스`처럼 보여 공간 낭비가 크고 내용 전달이 약함
- Decision:
  - `현재 구조를 유지하되 translation block을 inner box에서 flatter rail로 낮추는 방향이 맞다.`
- Applied change:
  - translation panel을 heavy nested box 대신 상단 divider 아래의 flatter rail로 바꿨다.
  - translation meta row와 translation body를 분리해 정보 위계를 더 직접적으로 읽히게 했다.

## Changed Files

- `09_app/src/components/TermDetail.jsx`
- `09_app/src/index.css`

## Validation

- `npx playwright test tests/smoke.spec.js tests/scenario.spec.js tests/residual.spec.js -g "search and facet wiring smoke|word-first + expression-assist scenario|filter-first scenario|node preview clears after term detail selection"` -> `3 passed`
- `npm run build` -> `PASS`

## Revision History

- `R1` / `2026-03-28 21:17 KST` / `Codex PM` / `MM3-268F`, `MM3-268G` review 결과와 detail surface 적용 결과를 기록
