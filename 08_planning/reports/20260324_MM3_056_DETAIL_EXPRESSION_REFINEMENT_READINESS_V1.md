# 20260324_MM3_056_DETAIL_EXPRESSION_REFINEMENT_READINESS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- detail / expression refinement를 실제로 실행하기 전, 필요한 입력과 보류 조건을 고정한다.

## 실행 전 확인 항목

- `APP_READY_DETAIL_MAP.json`에 `related_forms`, `senses.related_terms`, `subwords`가 존재한다.
- `APP_READY_SEARCH_INDEX.json`에 relation jump를 위한 `id`, `word`가 존재한다.
- `target_code` 기반 참조와 `word` fallback을 consumer 레이어에서 해석할 수 있다.
- source-native로 독립 표제어가 없는 표현은 `점프 실패`가 아니라 `미리보기 전용`으로 처리한다.

## 실행 가능 기준

- 새 payload 없이 `searchIndex + detailMap` 조합으로 해결 가능하다.
- 범위를 `TermDetail`과 `App`의 참조 해석 레이어로 제한할 수 있다.
- smoke에 relation jump와 expression preview를 추가할 수 있다.

## 보류 기준

- 새 runtime payload 분리가 필요해지면 보류
- tree shell이나 facet 구조 변경이 필요해지면 보류
- source 데이터 왜곡이 필요하면 보류

## 결론

- 실행 가능

## Next Active Work

- `MM3-057 Detail / Expression Refinement Execution`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / refinement 실행 전제와 보류 기준을 최초 정리
