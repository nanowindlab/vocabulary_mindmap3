# 20260327_MM3_266F_FALLBACK_RETIREMENT_AND_CHUNK_BUILD_SOURCE_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 21:16 KST`

## Last Updated By

- `Codex PM`

## Scope

- decide `runtime fallback retirement`
- decide `chunk build source migration`

## Evidence Summary

### 1. runtime fallback still exists

- `App.jsx` still calls `loadEntryDetail(term.id)` when `term.chunk_id` is absent.
- `loaderAdapter.js` still fetches `APP_READY_DETAIL_MAP.json` for that fallback path.

### 2. chunk build still depends on `DETAIL_MAP`

- `package-live-payloads.mjs` reads `APP_READY_DETAIL_MAP.json`
- then slices it into:
  - `APP_READY_CHUNK_RICH_*`
  - `APP_READY_CHUNK_EXAMPLES_*`

### 3. canonical source is structurally close enough

- `kcenter_base` entry already contains:
  - `id`
  - `word`
  - `pos`
  - `word_grade`
  - `categories`
  - `pronunciation`
  - `original_language`
  - `related_forms`
  - `senses`
  - `subwords`
- current `APP_READY_DETAIL_MAP` is effectively a reduced projection of the same semantic body.

## Decision 1. Runtime Fallback Retirement

- decision:
  - move from `normal runtime fallback` to `debug-only fallback`

### Why

- learner-facing normal path already relies on `chunk_id`.
- keeping `DETAIL_MAP` as a silent normal fallback preserves hidden dependency and delays demotion.
- removing it immediately without a guard is unnecessary risk.

### Resulting Rule

- production/normal learner runtime:
  - do not use `loadEntryDetail()` as a routine fallback
- debug-only path:
  - keep it temporarily available behind explicit debug mode or controlled diagnostic path

## Decision 2. Chunk Build Source Migration

- decision:
  - migrate chunk build source from `APP_READY_DETAIL_MAP` to canonical `kcenter_base`

### Why

- `kcenter_base` already carries the semantic fields needed for `chunk-rich`.
- current `DETAIL_MAP -> chunk` path adds an intermediate duplication layer.
- if `DETAIL_MAP` is to be demoted later, chunk generation must stop depending on it first.

### Resulting Rule

- canonical source becomes the authoritative source for:
  - `APP_READY_CHUNK_RICH_*`
  - `APP_READY_CHUNK_EXAMPLES_*`
- `DETAIL_MAP` remains temporary debug/repair artifact until the migration is complete.

## Recommended Sequence

1. make runtime fallback debug-only
2. migrate chunk build source to canonical direct path
3. then demote `DETAIL_MAP` from primary runtime truth

## PM Verdict

- `fallback retirement`: `debug-only fallback`
- `chunk build source migration`: `canonical direct path`

## Next Step

- implementation plan for:
  - debug-only fallback gate
  - canonical-direct chunk builder tranche

## Revision History

- `R1` / `2026-03-27 21:16 KST` / `Codex PM` / `fallback retirement`와 `chunk build source migration` decision을 고정
