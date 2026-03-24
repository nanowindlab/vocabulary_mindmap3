# 20260324_MM3_157_EXPRESSION_SCENARIO_FOLLOWUP_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 17:00 KST`

## Last Updated By

- `Codex PM`

## 목적

- raw feedback `F-027` 기준으로 `표현층`을 learner가 언제, 왜, 어떻게 써야 하는지 하나의 연계 파이프라인으로 다시 정의한다.

## Inputs

- `08_planning/pilot_feedback/human pilot test.md`
- `08_planning/pilot_feedback/20260324_pilot_session_01.md`
- `08_planning/reports/20260323_MM3_005_SCENARIO_REWRITE_ACCEPTANCE_V1.md`
- `08_planning/reports/20260324_MM3_051_EXPRESSION_WIRING_PLAN_V1.md`
- `08_planning/reports/20260324_MM3_053_EXPRESSION_WIRING_ACCEPTANCE_V1.md`
- `08_planning/reports/20260324_MM3_122_EXPLANATION_COPY_CLARIFICATION_IMPLEMENTATION_V1.md`
- `08_planning/reports/20260324_MM3_138_PILOT_FEEDBACK_COVERAGE_AUDIT_V1.md`
- `09_app/src/components/SearchBox.jsx`
- `09_app/src/components/TermDetail.jsx`
- `09_app/src/App.jsx`

## Current Problem

- 표현층은 현재 상세 패널 내부 탭으로는 존재하지만, learner 입장에서 `언제 열고`, `무엇을 먼저 보고`, `jump 가능한 표현과 preview-only 표현을 어떻게 다르게 쓰는지`가 구조화돼 있지 않다.
- 기존 canonical rule은 유지해야 한다.
  - 표현층은 `독립 top-level surface`가 아니라 `상세의 2차 보조 레이어`

## PM Decision

- 표현층 follow-up은 `하나의 파이프라인 -> 여러 연계 워크플로우 -> 각 워크플로우의 연계 스텝` 구조로 정리한다.
- 기본 원칙은 `core-first, expression-second`다.
- search/result에서 바로 표현 surface로 보내지 않고, 상세의 핵심 뜻 확인 이후 표현층으로 확장시키는 흐름을 유지한다.

## Expression Scenario Pipeline

### Workflow 1. Availability Signal

- 목적:
  - 이 단어가 표현 확장 가치가 있다는 신호를 먼저 준다.
- steps:
  1. search/list에서 `다음: 표현층` 신호를 본다.
  2. learner는 일반 상세로 진입한다.
  3. core tab에서 표현층을 왜 열어야 하는지 helper를 읽는다.

### Workflow 2. Guided Expansion

- 목적:
  - 표현층 진입을 learner가 스스로 해석하지 않도록 CTA로 안내한다.
- steps:
  1. core tab helper에서 `핵심 뜻 -> 표현층` 순서를 안내한다.
  2. CTA로 expression tab을 연다.
  3. expression tab 상단에서 `표현 학습 파이프라인` 설명을 본다.

### Workflow 3. Jumpable Expression Path

- 목적:
  - 독립 표제어가 있는 표현은 별도 어휘 학습으로 확장한다.
- steps:
  1. `독립 항목 연결` 표현을 먼저 본다.
  2. 해당 카드를 클릭해 독립 표제어로 점프한다.
  3. 이동한 상세에서 다시 핵심/관계/예문 흐름으로 이어간다.

### Workflow 4. Preview-Only Expression Path

- 목적:
  - 독립 표제어가 없는 표현은 parent word 맥락 안에서 소화한다.
- steps:
  1. `상세 연결 없음` 표현을 별도 그룹으로 본다.
  2. parent word 태그와 예시를 기준으로 preview한다.
  3. parent term에 남아 관계/예문과 함께 해석한다.

## Scope

포함:
- search/list signal copy 보정
- core tab expression workflow helper
- expression tab의 `jumpable` / `preview-only` 분리
- workflow CTA와 regression test

제외:
- `ExpressionBoard` 활성화
- expression 전용 top-level route
- search 구조 변경
- tree 재설계
- payload 재생성
- 기본 auto-open 정책

## Acceptance Criteria

- learner가 표현층을 여는 시점이 `핵심 뜻 확인 이후`로 명시된다.
- search/list/detail/expression이 같은 표현 시나리오를 가리킨다.
- `독립 항목 연결`과 `상세 연결 없음`의 쓰임이 서로 다른 branch로 분리된다.
- 표현층이 여전히 `2차 보조 레이어`라는 제품 원칙을 유지한다.
- regression test가 CTA/helper/분기 구조를 실제로 검증한다.

## Next Active Work

- `MM3-158 Expression Scenario Workflow Acceptance`

## Revision History

- `R1` / `2026-03-24 17:00 KST` / `Codex PM` / expression scenario를 pipeline/workflow/step 구조로 최초 정리
