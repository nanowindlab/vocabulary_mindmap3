# 20260324_MM3_063_SCENARIO_LEVEL_QA_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- core learner flow를 넘어서, 현재 product scenario를 learner start point 기준으로 다시 묶어 QA 범위를 정한다.

## Scenario 묶음

1. `word-first`
- 검색으로 표제어 진입
- 상세 확인
- 의미 관계어 또는 관련형으로 점프

2. `situation-first`
- `주제 및 상황` 탭 진입
- tree에서 범주를 따라 단어 선택
- 상세 동기화 확인

3. `expression-assist`
- `has_subwords`가 있는 표제어 진입
- 표현층 미리보기 확인
- 독립 표제어가 있는 표현은 jump

4. `filter-first`
- 상단 필터로 결과 집합 축소
- 축소된 상태에서 검색 또는 tree 선택
- 상세 진입까지 유지 확인

## 원칙

- 현재 앱이 이미 지원하는 경로만 본다.
- source-native로 비어 있는 항목은 결함으로 보지 않는다.
- 시나리오를 넓히기보다, 대표 learner path를 반복 가능하게 닫는다.

## 제외

- 장시간 학습 세션
- exhaustive category 회귀
- expression top-level surface

## Next Active Work

- `MM3-064 Scenario-Level QA Execution Readiness`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / scenario-level QA 묶음을 최초 정의
