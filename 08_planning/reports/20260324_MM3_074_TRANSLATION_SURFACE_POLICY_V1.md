# 20260324_MM3_074_TRANSLATION_SURFACE_POLICY_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- 다국어 번역을 learner-facing surface에서 어떻게 노출할지 정책을 고정한다.

## 현재 사실

- 번역 데이터는 영어 중심이 아니다.
- 대표 sense 기준 번역 언어 분포는 사실상 `몽골어`가 첫 순위이며, 영어는 예외적이다.
- 현재 UI의 `ENG ON/OFF` 표기는 데이터 현실과 맞지 않는다.

## 정책

1. 기본 노출은 `대표 번역 1개`
- 상세 패널은 대표 번역 1개만 기본 노출한다.
- 기준은 `current sense의 첫 번째 translation`이다.

2. 전체 번역은 확장형
- 같은 sense의 다른 번역은 `전체 번역 보기`를 눌렀을 때만 펼친다.

3. global toggle 명칭 변경
- `ENG ON/OFF`가 아니라 `번역 ON/OFF`로 표기한다.

4. 검색/리스트/카드도 대표 번역만
- compact surface에서는 대표 번역만 보조 정보로 사용한다.

## PM 판단

- 특정 언어 하나를 제품 기본 언어로 강제하지 않는다.
- 대신 source-order 기준 대표 번역 1개를 기본으로 두고, 나머지는 확장형으로 둔다.

## Next Active Work

- `MM3-075 Translation Surface Policy Readiness`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / translation surface policy를 최초 정리
