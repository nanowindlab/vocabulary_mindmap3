# 20260324_MM3_114_MISCLASSIFIED_NONE_SCENARIO_READINESS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 12:28 KST`

## Last Updated By

- `Codex PM`

## 목적

- `미분류`와 `주제 및 상황 > 없음` 구조 혼란을 줄이기 위한 최소 구현 범위를 정한다.

## 실행 전 확인 항목

- `미분류` tree는 현재 사실상 `학습난이도 -> 품사` 정렬이다.
- `주제 및 상황 > 없음`은 대규모 항목군이 존재한다.
- payload 변경 없이 label / helper text 수준에서 의미를 더 분명히 할 수 있다.

## 최소 구현 범위

- `미분류` scene label을 `학습난이도 · ...` 형태로 명시
- `미분류` category label을 `품사 · ...` 형태로 명시
- `없음`은 `상황 미지정` 또는 `미기재`로 재라벨링
- detail panel에 보조 설명 추가

## 보류 범위

- 실제 taxonomy 재구성
- payload 재생성
- 대규모 re-bucketing

## 결론

- 실행 가능

## Next Active Work

- `MM3-115 Misclassified / None Scenario Implementation`

## Revision History

- `R1` / `2026-03-24 12:28 KST` / `Codex PM` / misclassified/none scenario readiness를 최초 기록
