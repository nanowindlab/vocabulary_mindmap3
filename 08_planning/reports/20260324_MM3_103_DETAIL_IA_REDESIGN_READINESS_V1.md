# 20260324_MM3_103_DETAIL_IA_REDESIGN_READINESS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 11:05 KST`

## Last Updated By

- `Codex PM`

## 목적

- detail IA redesign를 실제 구현하기 전 범위와 리스크를 고정한다.

## 실행 전 확인 항목

- current browser suite `11 tests passed`
- 변경 범위를 `TermDetail.jsx`와 관련 테스트로 제한 가능
- search/tree/facet/payload 구조를 건드리지 않고 tab/section 재배치만으로 진행 가능

## 실행 가능 기준

- `정의 & 연관` 과밀을 tab 분리로 줄일 수 있다
- 많은 sense는 축소/확장으로 제어할 수 있다
- 표현층은 독립 tab으로 분리 가능하다

## 보류 기준

- 새로운 payload 요구
- navigation contract 변경
- tree/search/facet까지 동시 변경 필요

## 결론

- 실행 가능

## Next Active Work

- `MM3-104 Detail IA Redesign Implementation`

## Revision History

- `R1` / `2026-03-24 11:05 KST` / `Codex PM` / detail IA redesign readiness를 최초 기록
