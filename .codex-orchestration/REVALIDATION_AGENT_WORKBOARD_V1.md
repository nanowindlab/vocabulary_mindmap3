# REVALIDATION_AGENT_WORKBOARD_V1

## Agent

- Role: `revalidation criteria reset lane`
- Owner: `REVALIDATION_AGENT`
- Task ID: `MM3-025`
- Status: `DONE`
- Output Report: `.codex-orchestration/reports/20260324_MM3-025_REVALIDATION_CRITERIA_RESET_V1.md`

## Scope

- `MM3-024` 검증 모델을 기준으로 `MM3-020/021`의 실패 항목을 다시 분류할 재검증 기준을 정리한다.

## Required Deliverable

- 예외군/결함군 재분류 기준
- 재집계가 필요한 항목
- 재검증 기준값
- 다음 검증 패킷 진입 조건
- reflection

## Working Rules

- 한국어 작성
- 구현 지시/코드 변경 금지
- 검증 기준 재정렬에만 집중

## Result

- 새 검증 모델의 우선순위에 맞춰 `예외군 선분류 -> 잔여 결함 재집계 -> 다음 패킷 진입 조건` 순서로 기준을 재정렬했다.
- helper 필드는 저장형 결함 집계에서 분리하고, `categories / translations / pos`는 각기 재분류 후 잔여값만 결함으로 남기도록 정리했다.
