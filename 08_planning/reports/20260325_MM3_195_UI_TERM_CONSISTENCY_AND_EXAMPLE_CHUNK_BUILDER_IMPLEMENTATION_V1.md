# 20260325_MM3_195_UI_TERM_CONSISTENCY_AND_EXAMPLE_CHUNK_BUILDER_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 17:39 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-187H` UI term consistency and MM3-side example chunk builder implementation

## Inputs

- `08_planning/reports/20260325_MM3_194_EXAMPLE_SOURCE_FEASIBILITY_AND_UNCLASSIFIED_TERM_CLARIFICATION_V1.md`
- `09_app/src/App.jsx`
- `09_app/src/utils/hierarchyDisplay.js`
- `09_app/src/data/loaderAdapter.js`
- `09_app/scripts/build-example-chunks.mjs`
- `09_app/scripts/package-live-payloads.mjs`
- `09_app/scripts/prepare-live-payloads.mjs`
- `09_app/scripts/verify-runtime-payloads.mjs`
- `09_app/package.json`
- `09_app/tests/residual.spec.js`

## Implemented

### 1. UI term consistency guard

- learner-facing UI 기준으로 raw `미분류`를 직접 노출하지 않는 방향을 재확인했다.
- verification target:
  - unclassified tab label
  - search / detail path learner-facing wording
- test:
  - `unclassified surface uses learner-facing label consistently`

### 2. MM3-side example chunk builder

- added:
  - `09_app/scripts/build-example-chunks.mjs`
- role:
  - MM3 current dictionary examples를 `APP_READY_CHUNK_EXAMPLES_*` shape로 생성
  - per-entry source label을 `구/문장/대화` 등으로 보존

### 3. Runtime payload chain integration

- updated:
  - `09_app/scripts/package-live-payloads.mjs`
  - `09_app/scripts/prepare-live-payloads.mjs`
  - `09_app/scripts/verify-runtime-payloads.mjs`
  - `09_app/src/data/loaderAdapter.js`
  - `09_app/package.json`
- result:
  - package/prepare/verify chain이 `APP_READY_CHUNK_EXAMPLES_*`를 실제 payload로 다룬다.
  - loader fallback은 `TOPIK round`가 없을 때도 source label을 읽는다.

## Artifact Result

- current live example chunks:
  - `107 files`
- current compressed example chunks:
  - `107 files`
- runtime payload manifest entries:
  - `220`
- manifest example entries:
  - `107`

## Verification

- command:
  - `npm run package:live`
- result:
  - example chunk `107`개 포함 manifest write 완료
- command:
  - `npm run prepare:live`
- result:
  - example chunk `107`개 restore 완료
- command:
  - `npm run verify:live`
- result:
  - pass
- command:
  - `npx playwright test tests/residual.spec.js -g "unclassified surface uses learner-facing label consistently|search helper explains ordering and basic-item label|examples prioritize TOPIK source when chunk examples are available"`
- result:
  - `3 passed`

## PM Verdict

- `MM3_187H_DONE`

## Remaining Limitation

- current builder는 MM3 dictionary examples를 chunk payload로 복원한다.
- 아직 `TOPIK round` provenance 자체를 새로 만들지는 않는다.
- 따라서 visible example source quality는 개선됐지만, `TOPIK` priority를 fully reflected라고 부르기에는 provenance layer가 아직 약하다.

## Next Active Work

- `MM3-187I Example Source Quality / TOPIK Provenance Decision`

## Revision History

- `R1` / `2026-03-25 17:39 KST` / `Codex PM` / UI term consistency guard와 MM3-side example chunk builder implementation을 기록
