# 20260324_MM3_064_SCENARIO_LEVEL_QA_READINESS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- `MM3-063`의 scenario-level QA를 실제 browser harness execution으로 넘기기 전 체크 항목을 고정한다.

## 실행 전 확인 항목

- current core smoke 2개가 통과한다.
- scenario 대표 표제어가 확정돼 있다.
  - `요리하다`: relation jump
  - `두다`: expression-assist
  - `시내버스` 또는 동일한 `주제 및 상황` 진입 표제어: situation-first
- 필터 결과 수를 읽을 selector가 있다.
- tree term 선택을 추적할 selector가 있다.

## 실행 가능 기준

- 새 payload나 새 UI surface 없이 현행 앱으로 실행 가능하다.
- Playwright에 start-point별 시나리오를 추가할 수 있다.
- 실패 시 `scenario mismatch`와 `implementation defect`를 분리할 수 있다.

## 보류 기준

- 대표 표제어가 unstable하면 보류
- tree 구조가 selector 없이 추적 불가하면 보류
- 새 시나리오가 현재 제품 결정과 충돌하면 보류

## 결론

- 실행 가능

## Next Active Work

- `MM3-065 Scenario-Level QA Execution`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / scenario-level QA execution readiness를 최초 정리
