# 20260327_MM3_266F_DEBUG_ONLY_FALLBACK_AND_CANONICAL_DIRECT_CHUNK_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 21:24 KST`

## Last Updated By

- `Codex PM`

## Scope

- define the implementation plan for:
  - `debug-only fallback gate`
  - `canonical-direct chunk builder`

## Work Item A. Debug-Only Fallback Gate

### Goal

- stop treating `loadEntryDetail()` as a normal learner runtime path
- keep it temporarily available only for explicit debug/diagnostic usage

### Files

- `09_app/src/App.jsx`
- `09_app/src/data/loaderAdapter.js`

### Planned Change

- learner-facing normal path:
  - if `term.chunk_id` exists, use chunk path
  - if `term.chunk_id` is missing, do not silently fall back to `DETAIL_MAP`
- debug-only path:
  - allow `loadEntryDetail()` only behind explicit debug condition
  - example:
    - `DEV`
    - opt-in query/localStorage flag

### Acceptance

- normal runtime no longer reads `APP_READY_DETAIL_MAP.json` as a silent fallback
- debug-only fallback remains available for controlled diagnosis
- search/select/detail smoke remains green

## Work Item B. Canonical-Direct Chunk Builder

### Goal

- stop generating `CHUNK_RICH/EXAMPLES` from `APP_READY_DETAIL_MAP`
- generate them directly from canonical `kcenter_base`

### Files

- `09_app/scripts/package-live-payloads.mjs`
- `09_app/scripts/build-example-chunks.mjs`
- `09_app/scripts/example-chunk-sources.mjs`
- optional support:
  - new helper under `09_app/scripts/`

### Planned Change

- replace `DETAIL_MAP -> chunkEntries()` source with canonical entries
- keep `chunk_id` assignment and `CHUNK_MANIFEST_V1` generation behavior stable
- preserve current example chunk merge logic:
  - dictionary examples
  - TOPIK sentence merge

### Acceptance

- `APP_READY_CHUNK_RICH_*` and `APP_READY_CHUNK_EXAMPLES_*` are reproducible without `APP_READY_DETAIL_MAP`
- `package:live` still completes
- chunk manifest count and structure remain stable

## Sequence

1. implement `debug-only fallback gate`
2. verify local runtime smoke
3. migrate chunk builder source
4. verify package/build chain

## Non-Goals

- full `DETAIL_MAP` removal in the same tranche
- `SEARCH_INDEX` slimming
- translation payload redesign

## PM Verdict

- plan is ready for implementation

## Revision History

- `R1` / `2026-03-27 21:24 KST` / `Codex PM` / `debug-only fallback gate`와 `canonical-direct chunk builder` implementation plan을 고정
