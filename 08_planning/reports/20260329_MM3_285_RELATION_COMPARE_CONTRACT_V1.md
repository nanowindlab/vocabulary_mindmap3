# 20260329_MM3_285_RELATION_COMPARE_CONTRACT_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-29 10:47 KST`

## Last Updated By

- `Codex PM`

## Scope

- `의미 관계`를 quick compare surface로 재정의한다.
- relation type grouping, first-read order, unresolved/text-only guardrail, compare note rule을 먼저 고정한다.

## Inputs

- `08_planning/reports/20260326_MM3_236_MM3_UI_REFINEMENT_ROADMAP_V1.md`
- `08_planning/reports/20260329_MM3_282_PROJECT_DB_BASELINE_AND_RELATION_EXPRESSION_STRENGTHENING_V1.md`
- `09_app/src/components/TermDetail.jsx`

## Contract

### First-Read Order

1. `빠른 비교`
2. `확장 관계`
3. `형태·문체 변이`
4. `관련형`
5. `연관 어휘`
6. `교차 연결 장면`
7. `다른 뜻 보기`

### Grouping Rule

- `빠른 비교`
  - `유의어`
  - `반대말`
  - `참고어`
- `확장 관계`
  - primary compare set과 form/style variant set 밖의 relation terms
- `형태·문체 변이`
  - `큰말`
  - `작은말`
  - `센말`
  - `여린말`
  - `준말`
  - `본말`
  - `높임말`
  - `낮춤말`
- `관련형`
  - source-explicit and jumpable related forms only

### Guardrail

- unresolved `related_forms`는 default relation surface에 다시 올리지 않는다.
- unresolved relation은 navigation target처럼 보이게 하지 않는다.
- compare utility를 먼저 보여 주고, broader association은 그 다음에 둔다.

### Helper Copy Rule

- `빠른 비교`
  - `비슷한말, 반대말, 참고어를 먼저 비교합니다.`
- `확장 관계`
  - `비교 뒤에 이어 볼 의미 관계를 모았습니다.`
- `형태·문체 변이`
  - `큰말, 작은말, 센말, 준말 같은 표현 변이를 따로 봅니다.`
- `관련형`
  - `파생어와 source-explicit related form만 이동 대상으로 보여 줍니다.`

## Bundle Decision

- same-turn bundle allowed:
  - `MM3-285 + MM3-286`
- reason:
  - same surface
  - same file boundary
  - same regression boundary
- not bundled now:
  - `MM3-287`
  - `MM3-288`
  - expression scope needs a separate contract because current data reality is different

## Downstream Implementation Checklist

- split current relation terms into compare / extended / variant groups
- update relation section order
- add learner-facing helper copy
- keep related-form text-only guardrail intact
- add relation grouping regression

## Exit Condition

- compare surface first-read order is fixed
- relation grouping is fixed
- non-clickable/text-only rule is fixed
- downstream implementation checklist is ready

## PM Verdict

- `ACCEPT`
- `CONTRACT_LOCKED`
- `BUNDLED_WITH_MM3_286`

## Revision History

- `R1` / `2026-03-29 10:31 KST` / `Codex PM` / relation compare contract package opening
- `R2` / `2026-03-29 10:47 KST` / `Codex PM` / relation compare contract, grouping rule, same-turn bundle decision을 고정
