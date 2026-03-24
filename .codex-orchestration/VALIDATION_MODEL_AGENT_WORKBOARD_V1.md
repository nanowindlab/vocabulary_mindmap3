# VALIDATION_MODEL_AGENT_WORKBOARD_V1

## Agent

- Role: `validation model reframe lane`
- Owner: `VALIDATION_MODEL_AGENT`
- Task ID: `MM3-024`
- Status: `DONE`
- Output Report: `.codex-orchestration/reports/20260324_MM3-024_VALIDATION_MODEL_REFRAME_V1.md`

## Scope

- source-native 예외와 실제 결함을 구분할 새 검증 모델을 정의한다.

## Required Deliverable

- 예외군 정의
- 검증 대상군 정의
- 완화 규칙
- 재검증 진입 조건
- reflection

## Working Rules

- 한국어 작성
- 구현 지시/코드 변경 금지
- 검증 모델 재정의에만 집중

## Result Note

- source-native 예외와 실제 결함을 분리하는 2단 모델로 재정의 완료
- helper 필드는 저장형 결함 판정 대상이 아니라 계산/반영 경로 확인 대상으로 분리
