# 20260329_MM3_297_RELATION_COMPARE_DETAIL_AND_MINDMAP_WIRING_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 22:18 KST`

## Last Updated By

- `Codex PM`

## Scope

- `10_relation_app/`에 actual compare detail drilldown과 mindmap expansion을 연결한다.
- current card metadata-only state를 term detail interaction과 relation map interaction으로 올린다.

## Inputs

- `08_planning/reports/20260329_MM3_296_RELATION_NAVIGATOR_DATA_WIRING_V1.md`
- `10_relation_app/scripts/build-relation-bootstrap.mjs`
- `10_relation_app/src/App.jsx`
- `10_relation_app/src/index.css`

## Implementation

- generator enrichment:
  - term detail field 추가
  - `definition`
  - `pos`
  - `wordGrade`
  - `hierarchyPath`
  - `categoryValue`
  - `chunkId`
  - `routing`
  - `representativeSenseId`
  - `translationSummary`
- app interaction:
  - right panel mode tabs `Compare / Detail / Mindmap`
  - term tile click -> actual detail drilldown
  - mindmap node click -> detail drilldown
  - compare panel keeps actual detail metadata in sync
- styling:
  - detail sheet
  - translation chips
  - mindmap svg board
  - active tile/mode states

## Validation

- `npm run build:data`: `PASS`
- `./node_modules/.bin/vite build`: `PASS`
- result:
  - compare interaction works from actual generated term detail
  - detail panel reads actual generated detail fields
  - mindmap board renders actual term nodes and click-to-detail path

## Review

- compare/detail/mindmap are now interactive, not placeholder-only.
- current wiring still respects `10_relation_app/` boundary.
- actual deep chunk detail fetch와 external route jump는 current scope에 넣지 않았다.

## Exit Condition

- detail drilldown wired
- mindmap expansion wired
- build passed
- local preview can be launched

## PM Verdict

- `ACCEPT`
- `INTERACTION_WIRED`
- `MM3-297_DONE`
- `BUNDLED_WITH_MM3-298`

## Revision History

- `R1` / `2026-03-29 22:18 KST` / `Codex PM` / compare detail drilldown, mindmap expansion wiring, build validation
