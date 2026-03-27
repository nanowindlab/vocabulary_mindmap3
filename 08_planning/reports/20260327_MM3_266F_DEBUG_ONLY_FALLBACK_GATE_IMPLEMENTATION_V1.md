# 20260327_MM3_266F_DEBUG_ONLY_FALLBACK_GATE_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 21:28 KST`

## Last Updated By

- `Codex PM`

## Scope

- implement `debug-only fallback gate`

## Implemented

- `App.jsx`
  - normal learner runtime no longer uses `loadEntryDetail()` as a silent fallback
  - `DETAIL_MAP` fallback now opens only in explicit debug mode
- current debug gate:
  - `DEV`
  - `?mm3DetailFallback=1`
  - `localStorage.MM3_DETAIL_FALLBACK_DEBUG=1`

## Why This Matters

- this removes hidden learner-facing dependency on `APP_READY_DETAIL_MAP`
- it keeps diagnostic flexibility without preserving a silent production fallback

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/smoke.spec.js tests/scenario.spec.js` -> `5 passed`

## PM Verdict

- `debug-only fallback gate`: `DONE`

## Next Step

- move to `canonical-direct chunk builder` planning/implementation

## Revision History

- `R1` / `2026-03-27 21:28 KST` / `Codex PM` / `DETAIL_MAP` normal fallback를 debug-only로 낮추고 local validation을 완료
