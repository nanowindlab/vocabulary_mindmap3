# 20260327_MM3_258B_SITUATION_REPEATED_LABEL_RESOLUTION_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 13:25 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-258B` situation tree repeated label resolution options / implementation decision

## Decision

- learner-facing repeated `scene/category` in `주제 및 상황` hierarchy는 아래 규칙으로 정리한다.
  - detail/search/list path에서는 repeated second label을 collapse한다.
  - tree/category node는 semantic rename이 아니라 structural label `어휘 목록`으로 표시한다.

## Why This Direction

- source-shaped hierarchy 자체는 유지해야 한다.
- 그러나 learner-facing path까지 `교통 이용하기 > 교통 이용하기`처럼 반복되면 noise가 크고, feedback도 반복적으로 누적됐다.
- `어휘 목록`은 semantic category를 위조하지 않고, 현재 node가 `semantic category`가 아니라 `term container`라는 UI 역할만 드러낸다.
- 즉:
  - source truth는 유지
  - learner-facing redundancy만 완화

## Implemented

- updated:
  - `09_app/src/utils/hierarchyDisplay.js`
  - `09_app/tests/residual.spec.js`
- behavior:
  - repeated `scene/category` 상황 hierarchy는 detail path를 `주제 및 상황 > {scene}`로 collapse
  - sidebar/tree category label은 `어휘 목록`으로 노출

## Validation

- command:
  - `npm run build`
  - `npx playwright test tests/residual.spec.js -g "situation repeated labels collapse to a cleaner learner-facing path|실제로 entry keeps restored xml examples and relation disambiguation labels"`
- result:
  - `PASS`
  - `2 passed`

## PM Verdict

- `MM3-258B`: `DONE`

## Follow-Up

- repeated label source 구조 자체를 canonical data layer에서 재설계하지는 않는다.
- current product에서는 learner-facing display normalization만 유지한다.

## Revision History

- `R1` / `2026-03-27 13:25 KST` / `Codex PM` / repeated situation label에 대한 learner-facing collapse rule과 validation을 고정
