# 20260329_MM3_300_RELATION_TOP_FILTER_CARRYOVER_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 22:18 KST`

## Last Updated By

- `Codex PM`

## Scope

- MM3 상단 filter carryover를 relation explorer shell에 반영한다.
- 번역 언어를 `영어`, `몽골어`만 노출하고 `영어`를 기본값으로 둔다.
- `TOPIK 빈도` filter를 추가한다.

## Inputs

- `08_planning/reports/20260329_MM3_299_RELATION_ROUTE_AND_DEEP_DETAIL_FOLLOW_ON_V1.md`
- `10_relation_app/src/App.jsx`
- `10_relation_app/scripts/build-relation-bootstrap.mjs`
- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`

## Implementation

- top filter bar added:
  - `품사`
  - `난이도`
  - `번역 언어`
  - `TOPIK 빈도`
- language rule:
  - only `영어`, `몽골어`
  - default `영어`
- `TOPIK 빈도` source:
  - current search projection `stats.band`

## Validation

- search projection sample:
  - `band` populated rows `7,195`
  - band distribution available
- generator now carries:
  - `topikBand`
  - `topikLevel`
  - filtered `translationSummary`
- `./node_modules/.bin/vite build`: `PASS`

## PM Verdict

- `ACCEPT`
- `FILTER_CARRYOVER_LOCKED`
- `MM3-300_DONE`
- `BUNDLED_WITH_MM3-299`

## Revision History

- `R1` / `2026-03-29 22:18 KST` / `Codex PM` / top filter carryover, language default rule, TOPIK filter lock
