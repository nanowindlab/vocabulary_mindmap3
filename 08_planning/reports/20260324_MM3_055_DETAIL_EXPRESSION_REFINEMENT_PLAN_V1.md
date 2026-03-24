# 20260324_MM3_055_DETAIL_EXPRESSION_REFINEMENT_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- detail / expression 1차 연결 이후 learner flow 마찰을 줄이는 refinement 범위를 고정한다.

## 포함 범위

- `의미 관계어` 클릭 시 상세 탐색 점프
- `관련형` 클릭 시 상세 탐색 점프
- `subword` 카드에서 독립 표제어가 있는 경우 바로 점프
- 독립 표제어가 없는 표현은 `미리보기 전용` 상태로 명시

## 제외 범위

- 새 payload 분리
- expression 독립 top-level 화면
- tree 축 재설계
- search/facet 구조 변경

## PM 판단

- 이번 refinement는 새 구조를 여는 단계가 아니라, 이미 연결된 detail / expression을 탐색 가능 상태로 다듬는 단계다.
- source-native로 독립 표제어가 없는 표현은 repair하지 않고 현재 상태를 인정한다.

## Next Active Work

- `MM3-056 Detail / Expression Refinement Readiness`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / refinement 범위와 제외 범위를 최초 고정
