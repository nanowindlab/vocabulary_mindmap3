# 20260324_MM3_068_SCENARIO_RESIDUAL_MANUAL_QA_READINESS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- `MM3-067` residual candidate를 실제 manual / semi-automated QA wave로 넘기기 전 readiness를 정리한다.

## Residual 분류

### Semi-Automated 가능

1. `filter persistence across view`
2. `expression non-standalone handling`
3. `longer learner session`

### Manual 중심 유지

1. `situation-first tree category-first` 정밀 경로

## 실행 전 확인 항목

- current Playwright 5개 경로가 통과한다.
- `미리보기 전용` 표현 메시지가 실제 UI에서 노출된다.
- 리스트/마인드맵 전환 버튼이 현재 harness에서 접근 가능하다.
- 긴 세션 경로에서 search / relation / tab switch를 연속 실행할 수 있다.

## 실행 원칙

- 자동화 가능한 residual은 먼저 browser harness로 닫는다.
- manual만 필요한 경로는 따로 남긴다.
- residual 실패는 구조 결함인지, selector/harness 한계인지 분리한다.

## 결론

- 실행 가능

## Next Active Work

- `MM3-069 Scenario Residual QA Execution`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / residual readiness와 manual/semi-automated 분류를 최초 정리
