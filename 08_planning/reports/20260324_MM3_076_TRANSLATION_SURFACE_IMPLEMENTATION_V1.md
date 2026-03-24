# 20260324_MM3_076_TRANSLATION_SURFACE_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## Scope

- translation surface implementation

## Applied

- global toggle label을 `ENG ON/OFF`에서 `번역 ON/OFF`로 변경
- compact surface는 대표 번역 1개만 보조 정보로 사용
- detail panel은 대표 번역 1개 기본 노출 + `전체 번역 보기` 확장으로 변경
- flashcard도 대표 번역 1개만 사용

## Evidence

- `entries_with_any_translation = 51,746`
- first translation language는 사실상 `몽골어`가 기본 순서를 차지함
- 따라서 특정 언어를 제품 기본 언어로 강제하지 않고 source-first representative translation을 사용함

## Verification

- `npm run build` 통과
- `npx playwright test` 8개 테스트 통과

## Next Active Work

- `MM3-077 Translation Surface Acceptance`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / translation surface 구현과 검증 결과를 최초 기록
