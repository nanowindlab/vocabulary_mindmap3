# 20260329_MM3_295_EXPRESSION_FOLLOW_ON_PLANNING_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 22:18 KST`

## Last Updated By

- `Codex PM`

## Scope

- `활용 표현`을 relation explorer first opening scope 밖의 later follow-on으로 고정한다.
- reopen timing과 later planning boundary를 정리한다.

## Inputs

- `08_planning/reports/20260329_MM3_282_PROJECT_DB_BASELINE_AND_RELATION_EXPRESSION_STRENGTHENING_V1.md`
- `08_planning/reports/20260329_MM3_292_RELATION_NAVIGATOR_DATA_CONTRACT_V1.md`
- `09_app/src/components/ExpressionBoard.jsx`
- user directive in this thread

## Planning

- current expression surface는 relation core보다 later tranche가 맞다.
- first opening에서 relation-first 학습 흐름을 흔들지 않도록 별도 follow-on으로 둔다.

## Validation

- current DB reality:
  - expression surface coverage `1,150`
  - subword total `2,864`
  - jumpable subword items `1`
- interpretation:
  - current expression surface는 navigation-heavy first opening candidate가 아니다
  - preview/support layer 성격이 더 강하다

## 3인의 전문가 검토

### Expert 1. Data Reality Lens

- strong point:
  - later tranche로 미루는 판단이 맞다
- critique:
  - relation core before expression order를 계속 유지해야 한다

### Expert 2. Learner Flow Lens

- strong point:
  - relation-first shell이 먼저 열려야 학습 흐름이 선명하다
- critique:
  - expression을 early bundle로 넣으면 app 목적이 흐려질 수 있다

### Expert 3. Product Scope Lens

- strong point:
  - later roadmap으로 park하면 current opening scope를 지킬 수 있다
- critique:
  - reopen timing이 없으면 backlog가 다시 흐려질 수 있다

## Improvement

- `활용 표현` reopen timing:
  - after relation shell opening
  - after relation data wiring
  - only when relation-first base flow is stable
- current role:
  - later roadmap only
  - no first-opening implementation

## Revalidation

- later roadmap placement is still correct
- current scope exclusion is still correct
- relation-first opening priority is preserved

## Exit Condition

- later roadmap registration maintained
- reopen timing clarified
- first-opening exclusion maintained

## PM Verdict

- `ACCEPT`
- `LATER_ROADMAP_LOCKED`
- `MM3-295_DONE`

## Revision History

- `R1` / `2026-03-29 22:18 KST` / `Codex PM` / expression later follow-on planning, reopen timing, first-opening exclusion rule 고정
