# 20260329_MM3_296_RELATION_NAVIGATOR_DATA_WIRING_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 22:18 KST`

## Last Updated By

- `Codex PM`

## Scope

- `10_relation_app/` shell에 actual relation data를 연결한다.
- current schema에서 derived bootstrap과 family JSON을 생성해 family/group/card shell을 real data로 교체한다.
- compare/detail drilldown과 mindmap runtime wiring은 current scope에서 제외한다.

## Inputs

- `08_planning/reports/20260329_MM3_292_RELATION_NAVIGATOR_DATA_CONTRACT_V1.md`
- `10_relation_app/src/App.jsx`
- `10_relation_app/src/index.css`
- `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`

## Implementation

- added:
  - `10_relation_app/scripts/build-relation-bootstrap.mjs`
  - `10_relation_app/public/data/relation-bootstrap.json`
  - `10_relation_app/public/data/relation-family-*.json`
- updated:
  - `10_relation_app/package.json`
  - `10_relation_app/src/App.jsx`
  - `10_relation_app/src/index.css`

## Wiring Rule

- source:
  - `kcenter_base.json.gz`
  - `APP_READY_SEARCH_INDEX.json`
- derived artifacts:
  - `relation-bootstrap.json`
  - `relation-family-synonym.json`
  - `relation-family-antonym.json`
  - `relation-family-reference.json`
  - `relation-family-honorific.json`
  - `relation-family-size.json`
  - `relation-family-intensity.json`
  - `relation-family-shortform.json`
  - `relation-family-derived.json`
- app runtime:
  - bootstrap fetch
  - selected family JSON fetch
  - actual subgroup/card rendering
  - actual compare metadata rendering

## Validation

- `relation-bootstrap.json` generated:
  - `familyCount = 8`
- sample family payload:
  - `비슷한말`
  - `groupCount = 156`
  - `cardCount = 2702`
  - first sample card `가사 · 집안일 · 집일`
- build validation:
  - `npm run build:data`: `PASS`
  - `./node_modules/.bin/vite build`: `PASS`

## Review

- current data wiring now reflects actual relation families and subgroup/card counts.
- generator respects current schema direct use/adapt boundary.
- shell remains inside `10_relation_app/`.

## Additional Task Need

- new task required:
  - `MM3-297 Relation Compare Detail And Mindmap Wiring`
- reason:
  - current app now renders actual family/group/card data
  - but compare/detail jump and mindmap expansion are still metadata-only

## Exit Condition

- actual relation bootstrap generated
- family payloads generated
- shell renders fetched family/group/card data
- build passes
- next task need is explicit

## PM Verdict

- `ACCEPT`
- `DATA_WIRED`
- `MM3-296_DONE`

## Revision History

- `R1` / `2026-03-29 22:18 KST` / `Codex PM` / actual relation navigator bootstrap generation, shell data wiring, build validation, next task explicit화
