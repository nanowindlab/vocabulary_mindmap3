# 20260324_MM3_084_TRANSLATION_DEFAULT_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## Scope

- translation default implementation

## Applied

- 대표 번역 선택 규칙을 `영어 우선, 없으면 source-first fallback`으로 변경
- detail surface는 rich translation 기준으로 해당 규칙을 적용
- compact surface는 가용한 `translation_summary` 범위 안에서 같은 규칙을 적용
- `로브스터` 케이스를 기준으로 영어 우선 대표 번역 검증 추가

## Verification

- `npm run build` 통과
- `npx playwright test` 9개 테스트 통과

## Next Active Work

- `MM3-085 Translation Default Acceptance`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / 영어 기본 + source-first fallback 구현과 검증 결과를 최초 기록
