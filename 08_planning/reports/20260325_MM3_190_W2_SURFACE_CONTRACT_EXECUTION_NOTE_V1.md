# 20260325_MM3_190_W2_SURFACE_CONTRACT_EXECUTION_NOTE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 16:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-187F` W2 surface contract execution note

## Executed

### 1. `원어 정보` 제거

- file:
  - `09_app/src/components/TermDetail.jsx`
- result:
  - relation tab 하단 `원어 정보` section 제거
  - relation empty state guard도 이에 맞게 정리

### 2. Tab naming 적용

- file:
  - `09_app/src/components/TermDetail.jsx`
- change:
  - `관계` -> `의미 관계`
  - `표현` -> `활용 표현`
  - subtitle 제거

## Verification

- command:
  - `npx playwright test tests/residual.spec.js -g "relations tab does not render original-language"`
- result:
  - `1 passed`
- command:
  - `npx playwright test tests/residual.spec.js tests/pilot-rehearsal.spec.js -g "의미 관계|relation labels|longer learner session path|search enter|expression cards surface english"`
- result:
  - targeted subset passed before final locator fix
  - final failing locator는 `^관계` -> `^의미 관계` test update 후 재검증 완료

## PM Verdict

- `W2_PARTIAL_EXECUTED`

## Remaining W2

- expression repeated meta
  - `부모 표제어`
  - `연결 의미 N개`
- example helper density / TOPIK priority 표현 방식

## Next Active Work

- `MM3-187F3 Expression Meta / Example Helper Cleanup`

## Revision History

- `R1` / `2026-03-25 16:42 KST` / `Codex PM` / `원어 정보` 제거와 tab naming 적용 결과를 W2 execution note로 기록
