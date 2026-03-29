# 20260329_MM3_299_RELATION_ROUTE_AND_DEEP_DETAIL_FOLLOW_ON_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 22:18 KST`

## Last Updated By

- `Codex PM`

## Scope

- route state 유지와 deeper detail refinement를 relation explorer shell에 반영한다.
- family/group/card/view/term 상태를 URL hash로 유지한다.
- detail sheet에 richer metadata를 올린다.

## Inputs

- `08_planning/reports/20260329_MM3_297_RELATION_COMPARE_DETAIL_AND_MINDMAP_WIRING_V1.md`
- `10_relation_app/src/App.jsx`
- `10_relation_app/scripts/build-relation-bootstrap.mjs`

## Implementation

- route state:
  - `family`
  - `group`
  - `card`
  - `view`
  - `term`
  - filter state
- deep detail refinement:
  - `definition`
  - `pos`
  - `wordGrade`
  - `hierarchyPath`
  - `categoryValue`
  - `chunkId`
  - `routing`
  - `representativeSenseId`
  - `translationSummary`
  - `topikBand`
  - `topikLevel`

## Validation

- `npm run build:data`: `PASS`
- `./node_modules/.bin/vite build`: `PASS`
- route state persists through hash
- detail sheet reads richer generated term data

## PM Verdict

- `ACCEPT`
- `ROUTE_AND_DEEP_DETAIL_LOCKED`
- `MM3-299_DONE`
- `BUNDLED_WITH_MM3-300`

## Revision History

- `R1` / `2026-03-29 22:18 KST` / `Codex PM` / route state and deep detail refinement lock
