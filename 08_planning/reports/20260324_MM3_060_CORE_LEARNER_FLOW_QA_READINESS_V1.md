# 20260324_MM3_060_CORE_LEARNER_FLOW_QA_READINESS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- `MM3-059`에서 정한 core learner flow 경로를 실제 QA execution으로 넘기기 전에 전제와 체크 방식을 고정한다.

## 실행 전 확인 항목

- browser harness가 현재 로컬에서 동작한다.
- current smoke baseline이 통과한다.
- 대표 검증 어휘가 정해져 있다.
  - `요리하다`: 의미 관계어 / 관련형 점프
  - `밥`: 표현층 미리보기
- tree payload와 facet payload가 현재 live 경로에서 응답한다.

## 실행 방식

- 1차: Playwright 기반 반복 가능 경로
- 2차: 자동화가 어려운 흐름만 수동 QA 후보로 분리

## 이번 단계에서 볼 것

- relation jump 후 detail header 동기화
- subword preview 상태 표기
- tree 선택 후 detail 진입
- 필터 반영 후 search / tree 결과 정합성

## 이번 단계에서 아직 보지 않을 것

- 전 범주 exhaustive QA
- 장시간 learner session
- expression 독립 surface 검증

## 결론

- 실행 가능

## Next Active Work

- `MM3-061 Core Learner Flow QA Execution`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / QA readiness 전제와 실행 방식을 최초 정리
