# TRIAGE_AGENT_WORKBOARD_V1

## Agent

- Role: `validation failure triage lane`
- Owner: `TRIAGE_AGENT`
- Task ID: `MM3-021`
- Status: `COMPLETED`
- Output Report: `.codex-orchestration/reports/MM3-021_VALIDATION_FAILURE_TRIAGE_V1.md`

## Scope

- `MM3-020` 첫 제한 검증 실패를 원인별로 나누고, 무엇을 먼저 고쳐야 하는지 정리한다.

## Key Outcome

- 홈 `categories` 누락과 결과 `translations` 누락은 데이터 문제로 분류했다.
- 홈 `pos` 4건 누락도 데이터 문제로 분류했다.
- `sense_count / has_subwords / has_related_forms`는 저장형 누락으로 단정하지 않고, 계산형 thin projection 계약 해석이 먼저 필요한 문서 문제로 분리했다.
- 재검증 전에는 helper 필드의 확인 경로를 문서에서 먼저 고정해야 한다.

## Required Deliverable

- 실패 항목별 원인
- 문서 문제인지 데이터 문제인지 구분
- 우선 수리 순서
- 최소 수정 범위
- 다음 검증 재실행 조건
- reflection

## Working Rules

- 한국어 작성
- 구현 지시/코드 변경 금지
- 원인 분해와 우선순위 정리에 집중
