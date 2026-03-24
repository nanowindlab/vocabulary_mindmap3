# 20260324_MM3_059_CORE_LEARNER_FLOW_QA_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- current core explorer slice를 smoke보다 넓은 learner path에서 어떤 순서로 검증할지 정한다.

## QA 우선 경로

1. `검색 -> 상세 -> 의미 관계어 점프`
2. `검색 -> 상세 -> 관련형 점프`
3. `검색 -> 상세 -> 표현층 미리보기 / 독립 표제어 점프`
4. `의미 범주 tree -> 상세 동기화`
5. `주제 및 상황 tree -> 상세 동기화`
6. `홈 상단 필터 -> 검색 결과 / tree 반영`

## 이번 단계의 원칙

- learner가 실제로 밟는 핵심 경로부터 닫는다.
- source-native로 비어 있는 데이터는 결함으로 취급하지 않는다.
- wide regression보다 좁고 반복 가능한 경로 세트를 먼저 닫는다.

## 제외

- 전체 시나리오 회귀
- expression 전용 전체 surface QA
- 장시간 수동 탐색 세션

## Next Active Work

- `MM3-060 Core Learner Flow QA Execution Readiness`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / core learner flow QA 우선 경로를 최초 정리
