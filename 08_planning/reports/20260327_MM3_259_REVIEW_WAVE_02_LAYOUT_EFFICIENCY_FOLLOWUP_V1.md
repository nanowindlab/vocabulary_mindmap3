# 20260327_MM3_259_REVIEW_WAVE_02_LAYOUT_EFFICIENCY_FOLLOWUP_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 09:12 KST`

## Last Updated By

- `Codex PM`

## Scope

- user review wave 02 layout-efficiency follow-up

## Immediate Fix Applied

- top nav / shell banner / filter rail / explorer header를 한 단계 더 압축했다.
- search input width를 더 넓혔다.
- search result row에서 keyword가 먼저 보이도록 `word first + badge second line`으로 재구성했다.
- default `기본 항목` badge는 row에서 제거하고 helper 설명으로만 유지했다.
- detail core card는 `핵심 뜻` + translation stacked layout으로 바꿨다.
- `계층 탐색` header와 `explorer view` header의 분할선 높이를 맞췄다.

## Clarification

- `기본 항목`은 현재 app에서 detail panel로 바로 들어가는 기본 표제어를 뜻한다.
- default route라 learner-facing row badge로는 설명 가치보다 noise가 커서 de-emphasize했다.

## Study Tasks Kept Open

- `MM3-257A` meaning tree 하위 분류 count exposure study
- `MM3-258A` situation tree repeated child label redundancy study

## Verification

- `npm run build` -> `PASS`
- `npx playwright test tests/smoke.spec.js tests/residual.spec.js -g "search and facet wiring smoke|search helper explains ordering and basic-item label|detail header keeps pronunciation inline and removes duplicate translation section"` -> `3 passed`

## Revision History

- `R1` / `2026-03-27 09:12 KST` / `Codex PM` / layout efficiency feedback를 immediate fix와 open study task로 분리해 기록
