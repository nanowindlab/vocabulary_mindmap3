# 20260325_MM3_188_W1_REOPENED_REGRESSIONS_EXECUTION_NOTE_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-25 16:08 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-187` W1 reopened regressions execution note

## Executed

### W1A. Search Enter residual

- file:
  - `09_app/src/components/SearchBox.jsx`
- change:
  - IME composition 중 `Enter`를 selection trigger로 처리하지 않도록 guard를 추가했다.
- reason:
  - second pilot raw feedback의 `버리다 -> Enter -> 다` residual은 Korean IME composition timing과 일치한다.

### W1B. Relation duplicate clarity

- file:
  - `09_app/src/components/TermDetail.jsx`
- change:
  - 같은 표면형이 반복되는 관계/관련형은 definition을 축약하지 않고 더 길게 보여 구분도를 높였다.
- reason:
  - `보다 -> 파생어: 보이다` 2건은 target이 다르지만 learner는 duplicate처럼 느꼈다.

### W1C. Expression translation residual

- verified:
  - source base의 `돈` subword translation에는 영어를 포함한 `11개` 언어가 존재했다.
  - current runtime residual 원인은 source 부재가 아니라 `repair_runtime_translation_payloads.py`가 entry `senses`만 고치고 `subwords.senses`, `APP_READY_CHUNK_RICH_*`를 고치지 않던 projection bug였다.
- fix:
  - repair script를 detail subwords + rich chunk subwords까지 확장했다.
  - runtime live artifact를 다시 복원했고, `돈` 표현 카드가 영어 selector를 따르는 것을 targeted regression으로 확인했다.

### Verification

- command:
  - `npx playwright test tests/residual.spec.js -g "IME composition|relation labels disambiguate|expression cards surface english|search enter triggers selection"`
- result:
  - `4 passed`

## PM Verdict

- `W1_DONE`

## Next Active Work

- `MM3-187F W2 Surface Contract Cleanup`

## Revision History

- `R1` / `2026-03-25 15:44 KST` / `Codex PM` / W1A/W1B 구현과 검증 결과, W1C 판단 옵션을 한 문서로 정리
- `R2` / `2026-03-25 16:08 KST` / `Codex PM` / W1C root cause를 source/runtime/chunk mismatch로 재검증하고 repair + 4-test regression 기준으로 W1을 닫음
