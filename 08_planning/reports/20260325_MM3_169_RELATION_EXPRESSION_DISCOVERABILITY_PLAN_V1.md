# 20260325_MM3_169_RELATION_EXPRESSION_DISCOVERABILITY_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 00:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-169A` relation / expression surface discoverability follow-up

## Objective

- relation / expression surface를 더 빨리 찾게 하되, 기존 `상세 내부의 2차 보조 레이어` 원칙은 유지한다.
- `MM3-168` top-of-fold contract, `MM3-170` translation residual, `MM3-171` performance constraint를 동시에 만족하는 discoverability 설계를 만든다.

## Inputs

- `08_planning/reports/20260325_MM3_168_DETAIL_HEADER_CLOSE_COPY_DENSITY_CONTRACT_V1.md`
- `08_planning/reports/20260325_MM3_170_TRANSLATION_SURFACE_COMPLETENESS_REAUDIT_NOTE_V1.md`
- `08_planning/reports/20260325_MM3_171_RUNTIME_PERFORMANCE_PAYLOAD_SPLIT_AUDIT_NOTE_V1.md`
- `08_planning/reports/20260324_MM3_157_EXPRESSION_SCENARIO_FOLLOWUP_PLAN_V1.md`
- `08_planning/reports/20260324_MM3_158_EXPRESSION_SCENARIO_WORKFLOW_ACCEPTANCE_V1.md`
- `08_planning/reports/20260324_MM3_081_DETAIL_EXPRESSION_MICRO_POLISH_IMPLEMENTATION_V1.md`
- `08_planning/reports/20260324_MM3_082_DETAIL_EXPRESSION_MICRO_POLISH_ACCEPTANCE_V1.md`
- `08_planning/reports/20260324_MM3_167_ADDITIONAL_HUMAN_TEST_FEEDBACK_COVERAGE_CHECK_V1.md`

## Current Residuals

- `관계`
  - 현재 tab은 있으나 단어 표시 UI가 다른 tab보다 덜 정리돼 보인다는 피드백이 남아 있다.
- `표현`
  - 현재 expression workflow는 존재하지만, user는 더 앞쪽에서 표현 항목을 발견하고 싶어 한다.
- `표현 카드 copy`
  - `상세 연결 없음`
  - `의미 2개`
  - `예:` 용어
- `표현 번역`
  - subword/expression card는 selected language를 아직 반영하지 않는다.

## Relation / Expression Pipeline

### Workflow 1. Tab-Level Discoverability

- 목적:
  - top-of-fold를 과밀하게 만들지 않으면서 relation/expression entry를 더 빨리 찾게 한다.
- steps:
  1. `핵심` 상단은 compact teaser만 유지한다.
  2. tab label/count/signal을 relation/expression entry cue로 재검토한다.
  3. `관계`, `표현` 탭 진입 이유가 분명한 microcopy를 정의한다.

### Workflow 2. Relation Surface Contract

- 목적:
  - `관계` 탭이 다른 탭과 동일한 시각 품질과 탐색 신뢰도를 갖게 한다.
- steps:
  1. relation chip/list/card 중 어떤 표현이 현재 구조에 맞는지 비교한다.
  2. 의미 관계어 / 관련형 / 교차 연결의 시각 위계를 다시 정리한다.
  3. repeated relation word, long label, disambiguation metadata가 readability를 해치지 않게 rule을 적는다.

### Workflow 3. Expression Card Contract

- 목적:
  - expression card residual을 learner-facing 수준에서 정리한다.
- steps:
  1. `상세 연결 없음` label의 유지/축약/대체 후보를 정리한다.
  2. `의미 2개` 같은 count copy를 더 명확한 wording으로 바꿀지 정한다.
  3. `예:`를 `예문`으로 통일할지 결정한다.
  4. parent word / jumpable / preview-only signal이 동시에 과밀하지 않게 배치 원칙을 적는다.

### Workflow 4. Expression Translation Residual Scope

- 목적:
  - expression/subword card의 selected language residual을 fix scope로 정의한다.
- steps:
  1. `first translation 고정`과 `selected language 반영`을 구분한다.
  2. 현재 runtime `6개` 언어 정책을 expression card도 따를지 정한다.
  3. regression test gap을 어떤 surface에서 메울지 적는다.

## Constraints

- `MM3-168` top-of-fold contract를 깨지 않는다.
- expression discoverability를 이유로 top-level primary surface로 격상하지 않는다.
- `MM3-170`의 runtime `6개` 언어 reality를 무시하지 않는다.
- `MM3-171`의 performance constraint를 고려해 heavy surface를 추가하지 않는다.

## Deliverables

- tab-level discoverability option set
- relation surface visual contract
- expression card copy contract
- expression translation residual fix scope
- downstream implementation checklist

## Review Checkpoint

- review focus:
  - relation/expression discoverability 개선이 `2차 보조 레이어` 원칙을 깨지 않는지
  - top-of-fold density contract와 충돌하지 않는지
  - expression translation residual scope가 `MM3-170` audit 결과와 맞는지

## Exit Criteria

- relation과 expression 각각의 discoverability 방식이 분리 정의된다.
- card-level copy residual과 translation residual scope가 동시에 정리된다.
- `MM3-168` / `MM3-170` / `MM3-171` 입력과 논리 충돌이 없다.

## Next Step

- `MM3-169` contract draft

## Revision History

- `R1` / `2026-03-25 00:10 KST` / `Codex PM` / W3 second step으로 relation/expression discoverability follow-up plan을 최초 작성
