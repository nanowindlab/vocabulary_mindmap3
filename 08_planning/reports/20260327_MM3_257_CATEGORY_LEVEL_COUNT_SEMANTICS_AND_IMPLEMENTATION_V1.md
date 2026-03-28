# 20260327_MM3_257_CATEGORY_LEVEL_COUNT_SEMANTICS_AND_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 08:35 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-257A` meaning tree 하위 분류 count exposure study

## Fixed Semantics

- `category-level count`는 `해당 하위 분류 아래의 visible term 수`로 정의한다.
- 기준 데이터는 current `filteredList`다.
- 따라서 filter state에 따라 count도 동적으로 바뀐다.
- count는 `의미 범주`, `주제 및 상황`, `분류 밖 항목` 3축 모두에 적용한다.
- count는 category row에 `항상` 노출한다.

## Why This Definition

- current tree는 `filteredList` 기준으로 rebuild된다.
- 따라서 category count도 같은 filtered dataset을 기준으로 계산해야 tree와 filter가 일관된다.
- direct child count가 아니라 visible term count를 쓰는 편이 learner-facing value가 더 높다.

## Implemented

- tree build 단계에서 category node에 `termCount`를 누적한다.
- sidebar renderer에서 scene count와 함께 category count도 노출한다.

## Files

- `09_app/src/App.jsx`
- `09_app/src/components/SidebarTree.jsx`

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/smoke.spec.js tests/residual.spec.js -g "tree and filter learner flow smoke|search and facet wiring smoke|closing detail keeps selected term synced in mindmap"` -> `3 passed`

## PM Verdict

- `MM3-257A` -> `DONE`

## Revision History

- `R1` / `2026-03-27 08:35 KST` / `Codex PM` / category-level count semantics를 고정하고 3축 공통 implementation까지 반영
