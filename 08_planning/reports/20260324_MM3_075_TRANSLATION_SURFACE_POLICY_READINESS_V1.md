# 20260324_MM3_075_TRANSLATION_SURFACE_POLICY_READINESS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- translation surface policy를 구현하기 전, 필요한 입력과 제한 범위를 정리한다.

## 실행 전 확인 항목

- `searchIndex`와 `detailMap`에 `translation_summary` 또는 `senses.translations`가 있다.
- compact surface와 detail surface를 분리해 바꿀 수 있다.
- 새 payload 추가 없이 기존 필드만으로 대표 번역 1개를 고를 수 있다.

## 변경 범위

- `App.jsx`의 global toggle label
- `SearchBox.jsx`
- `TermDetail.jsx`
- `FlipcardDeck.jsx`
- 필요 시 `ListView`

## 보류 기준

- 특정 언어를 제품 기본 언어로 새로 강제해야 하면 보류
- translation payload 구조 변경이 필요해지면 보류

## 결론

- 실행 가능

## Next Active Work

- `MM3-076 Translation Surface Implementation`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / translation surface policy readiness를 최초 정리
