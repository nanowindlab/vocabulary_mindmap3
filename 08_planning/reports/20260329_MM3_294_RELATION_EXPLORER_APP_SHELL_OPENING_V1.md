# 20260329_MM3_294_RELATION_EXPLORER_APP_SHELL_OPENING_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 22:18 KST`

## Last Updated By

- `Codex PM`

## Scope

- `10_relation_app/` 안에서 separate relation explorer shell을 연다.
- current `MM3` theme continuity를 유지하면서 relation-first 3-panel shell을 구현한다.
- real data wiring은 current scope에서 제외한다.

## Inputs

- `08_planning/reports/20260329_MM3_291_RELATION_EXPLORER_IA_CANONICAL_V1.md`
- `08_planning/reports/20260329_MM3_292_RELATION_NAVIGATOR_DATA_CONTRACT_V1.md`
- `08_planning/reports/20260329_MM3_293_WORKSPACE_VERCEL_MULTI_PROJECT_TOPOLOGY_V1.md`
- `09_app/package.json`
- `09_app/src/App.jsx`
- `09_app/src/index.css`

## Implementation

- created:
  - `10_relation_app/package.json`
  - `10_relation_app/index.html`
  - `10_relation_app/src/main.jsx`
  - `10_relation_app/src/App.jsx`
  - `10_relation_app/src/index.css`
- shell shape:
  - top navigation
  - left relation family rail
  - center subgroup/card panel
  - right compare/status panel
- current shell behavior:
  - static sample relation families
  - static subgroup chips
  - static study cards
  - compare panel preview
- preserved rule:
  - write boundary is `10_relation_app/` only
  - current root `vercel.json` untouched

## Validation

- command:
  - `npm install`
  - `npm run build`
- result:
  - `PASS`
  - `dist/index.html`
  - `dist/assets/index-MmfUFvoy.css`
  - `dist/assets/index-DXffXpWZ.js`

## Implementation Review

- theme continuity:
  - `MM3` dark shell rhythm, chip/card language, panel split을 유지했다
- boundary hygiene:
  - `09_app/` untouched
  - new shell lives only in `10_relation_app/`
- scope discipline:
  - no runtime data wiring
  - no deploy boundary mutation

## Additional Task Need

- shell 이후 actual relation data를 붙이는 follow-up task가 필요하다.
- new task candidate:
  - `MM3-296 Relation Navigator Data Wiring`

## Exit Condition

- separate shell exists
- build passes
- write boundary stayed inside `10_relation_app/`
- next data wiring task need is explicit

## PM Verdict

- `ACCEPT`
- `SHELL_OPENED`
- `MM3-294_DONE`

## Revision History

- `R1` / `2026-03-29 22:18 KST` / `Codex PM` / separate relation explorer shell opening, build validation, next data wiring need explicit화
