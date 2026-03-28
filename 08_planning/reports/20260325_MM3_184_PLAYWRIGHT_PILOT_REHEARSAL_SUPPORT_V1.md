# 20260325_MM3_184_PLAYWRIGHT_PILOT_REHEARSAL_SUPPORT_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-25 01:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- Playwright-based pilot rehearsal support

## Objective

- true human pilot를 대체하지는 않되, launch sheet 경로를 자동 dry-run으로 먼저 검증할 수 있게 한다.

## Added

- Playwright rehearsal spec:
  - `09_app/tests/pilot-rehearsal.spec.js`

## Covered Rehearsal Paths

1. `돈`
- detail `핵심`
- `표현`
- preview-only expression card

2. `요리하다`
- 번역 언어 selector
- `예문` helper

3. `보다`, `버리다`
- `주제 및 상황 > 상황 미지정 > 일반 어휘`
- `분류 밖 항목`

## Verification

- command:
  - `npx playwright test tests/pilot-rehearsal.spec.js`
- result:
  - `3 passed`
- duration:
  - `22.5s`

## Boundary

- 이 spec은 `human scheduling`을 대체하지 않는다.
- facilitator 관찰, confusion 기록, raw quote capture는 여전히 human pilot에서만 가능하다.

## PM Verdict

- `VERIFIED`

## Next Active Work

- `MM3-096C session slot / execution handoff 정리`

## Revision History

- `R1` / `2026-03-25 01:05 KST` / `Codex PM` / launch sheet 경로를 자동 dry-run할 수 있는 Playwright rehearsal spec을 추가
- `R2` / `2026-03-25 01:05 KST` / `Codex PM` / local Playwright runner에서 rehearsal spec `3 passed`를 확인
