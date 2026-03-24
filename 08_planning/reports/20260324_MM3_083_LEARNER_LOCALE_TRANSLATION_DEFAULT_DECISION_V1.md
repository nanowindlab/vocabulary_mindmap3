# 20260324_MM3_083_LEARNER_LOCALE_TRANSLATION_DEFAULT_DECISION_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- 대표 번역의 기본 언어를 source-first로 둘지, learner locale 기준으로 둘지 결정한다.

## 현재 사실

- 현재 데이터에서 first translation은 사실상 `몽골어`가 기본 순서다.
- 영어는 거의 존재하지 않는다.
- 현재 앱은 `대표 번역 1개 + 전체 번역 확장` 정책으로 동작한다.

## 선택지

### A. source-first 유지

- 장점: 추가 데이터/정책 없이 안정적
- 단점: learner locale과 어긋날 수 있음

### B. learner-locale default 도입

- 장점: 사용자별 번역 효용이 높아짐
- 단점: locale 정책과 fallback 규칙 결정이 필요

## User Decision

- 기본 외국어는 `영어`로 둔다.
- 단, locale-aware 시스템은 도입하지 않고 `source-first`를 유지한다.

## PM 해석

- 고정 제품 기본 언어는 `영어`
- current sense에 영어 번역이 있으면 영어를 대표 번역으로 사용
- 영어가 없으면 source-first 첫 번역으로 fallback
- 사용자 locale / learner locale 기반 동적 전환은 도입하지 않음

## Status

- `ACCEPTED`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / learner locale / translation default decision 경계를 최초 기록
- `R2` / `2026-03-24 09:11 KST` / `Codex PM` / 사용자 결정 반영: 영어 기본 + source-first fallback으로 확정
