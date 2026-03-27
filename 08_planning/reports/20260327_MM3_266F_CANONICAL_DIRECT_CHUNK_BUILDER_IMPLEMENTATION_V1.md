# 20260327_MM3_266F_CANONICAL_DIRECT_CHUNK_BUILDER_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 21:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- implement `canonical-direct chunk builder`

## Implemented

- added:
  - `09_app/scripts/runtime-detail-projection.mjs`
- updated:
  - `09_app/scripts/package-live-payloads.mjs`
  - `09_app/scripts/build-example-chunks.mjs`
  - `09_app/scripts/runtime-search-recovery-core.mjs`
  - `09_app/scripts/prepare-live-payloads.mjs`
  - `09_app/scripts/verify-runtime-payloads.mjs`
  - `09_app/scripts/audit-authoritative-promotion-readiness.mjs`
  - `09_app/src/data/loaderAdapter.js`

## What Changed

### 1. chunk source moved to canonical direct path

- `APP_READY_CHUNK_RICH_*` is now built from canonical `kcenter_base`
- `APP_READY_CHUNK_EXAMPLES_*` is now built from canonical-projected detail entries

### 2. runtime surface recovery no longer requires `DETAIL_MAP`

- `buildRecoverableSearchRows()` now derives `chunk_id` from canonical entry order
- direct dependency on `APP_READY_DETAIL_MAP.json` was removed from the recovery path

### 3. compressed runtime payload set no longer treats `DETAIL_MAP` as required

- `prepare-live`
- `verify-live`
- `package:live`

all now complete without requiring `APP_READY_DETAIL_MAP` inside `runtime_payloads/*.json.gz`

## Validation

- `npm run build` -> `PASS`
- `npm run build:examples` -> `PASS`
- `npm run package:live` -> `PASS`
- `npx playwright test tests/smoke.spec.js tests/scenario.spec.js` -> `5 passed`
- `probe:runtime-surface-recovery` -> `matched 53012 / mismatched 0`

## PM Verdict

- `canonical-direct chunk builder`: `DONE`

## Next Step

- define `DETAIL_MAP demotion` actual execution boundary

## Revision History

- `R1` / `2026-03-27 21:42 KST` / `Codex PM` / chunk builder source를 canonical direct path로 이전하고 local package/build validation을 통과
