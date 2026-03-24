# 20260324_MM3_145_TRANSLATION_SURFACE_FOLLOWUP_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 15:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- translation surface follow-up implementation

## Applied

- `외국어` 필터를 `번역 언어` display selector로 전환
- `전체 번역 보기` 제거
- compact/detail/list surface가 selected translation language를 우선 사용
- translation language가 없으면 영어, 다시 없으면 source-first fallback 유지

## Verification

- `npm run build` 통과
- `npx playwright test` `13 passed`

## Next Active Work

- `MM3-146 Translation Surface Follow-up Acceptance`

## Revision History

- `R1` / `2026-03-24 15:05 KST` / `Codex PM` / translation surface follow-up 구현과 검증 결과를 최초 기록
