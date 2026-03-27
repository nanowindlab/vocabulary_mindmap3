# 20260327_MM3_262C_RUNTIME_DETAIL_FIDELITY_REPAIR_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 12:20 KST`

## Last Updated By

- `Codex PM`

## Scope

- implement `MM3-262C` runtime detail fidelity repair
- ensure XML-derived dictionary data survives into app detail/runtime chunk surfaces

## Implemented

### 1. Runtime detail repair

- added:
  - `vocab_dictionary/scripts/repair_runtime_detail_fidelity.py`
- behavior:
  - `kcenter_base.json`의 canonical entry를 기준으로 `APP_READY_DETAIL_MAP.json` entry를 재동기화한다.
  - app-consumed detail fields `word/pos/word_grade/categories/pronunciation/original_language/related_forms/senses/subwords`를 source-of-truth 기준으로 맞춘다.

### 2. Package chain enforcement

- updated:
  - `09_app/package.json`
- behavior:
  - `prepackage:live`에서 `repair:runtime-detail-fidelity`를 먼저 실행한다.
  - 이후 `check:runtime-surface-sidecar`와 `package:live`가 이어진다.

### 3. Example cap removal

- updated:
  - `09_app/scripts/example-chunk-sources.mjs`
  - `09_app/src/data/loaderAdapter.js`
  - `09_app/src/App.jsx`
  - `09_app/src/components/TermDetail.jsx`
- behavior:
  - TOPIK sentence `4개` cap 제거
  - dictionary example `8개` cap 제거
  - merged example total `8개` cap 제거
  - app detail 예문 list cap 제거

### 4. Relation disambiguation label

- updated:
  - `09_app/src/components/TermDetail.jsx`
- behavior:
  - relation card label에 non-zero `homonym_no`를 suffix로 표시한다.
  - `실상3`, `실제2`, `실지2` 같은 source-style disambiguation이 user-facing label에 나타난다.

### 5. Regression coverage

- updated:
  - `09_app/tests/residual.spec.js`
- added coverage:
  - `실제로` entry가 restored XML examples와 relation disambiguation labels를 보여 주는지 검증

## Verification

### Data repair

- command:
  - `python3 vocab_dictionary/scripts/repair_runtime_detail_fidelity.py`
- result:
  - `updated_entries`: `53,480`
  - `entries_with_example_count_change`: `47,079`
  - report:
    - `tmp_reports/runtime_detail_fidelity_repair_report.json`

### Post-repair parity

- command:
  - batch compare `kcenter_base` vs `APP_READY_DETAIL_MAP` example types/count
- result:
  - `loss_counter = {}`

### Sentinel check

- `14112 실제로`
  - `APP_READY_DETAIL_MAP` example texts: `9`
  - `APP_READY_CHUNK_RICH_chunk-0001` example texts: `9`
  - `APP_READY_CHUNK_EXAMPLES_chunk-0001` total example bundle: `27`
  - relation labels preserve runtime `homonym_no`: `실상/3`, `실제/2`, `실지/2`, `실지로/0`

### Packaging / build

- command:
  - `npm run package:live`
  - `npm run build`
- result:
  - `PASS`

### Browser regression

- command:
  - `npx playwright test tests/residual.spec.js -g "실제로 entry keeps restored xml examples and relation disambiguation labels"`
- result:
  - `1 passed`

## PM Verdict

- delivery verdict:
  - `ACCEPT`
- scope verdict:
  - current user-reported XML-to-app example/relation fidelity issue is repaired in live runtime payload and app display

## Residual Note

- original truncation generator path는 아직 explicit하게 isolate하지 못했다.
- 그러나 current runtime truth는 repair script + package chain으로 canonical source에 재정렬됐다.
- upstream canonicalization은 future hardening follow-up으로 분리 가능하다.

## Revision History

- `R1` / `2026-03-27 12:20 KST` / `Codex PM` / runtime detail fidelity repair implementation, package chain enforcement, example cap removal, browser regression verification을 기록
