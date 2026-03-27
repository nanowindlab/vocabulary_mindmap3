# 20260327_MM3_266F_T2_DETAIL_MAP_DEMOTION_PREPARATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 21:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- prepare `T2 DETAIL_MAP demotion`

## Problem

- `APP_READY_DETAIL_MAP.json` is still `245,842,330` bytes.
- current runtime no longer depends on it for the common path when `chunk_id` exists.
- however, it still remains a structural dependency in both runtime fallback and build-side artifact generation.

## Current Dependency Map

### Learner Runtime

- `App.jsx`
  - `handleSelectTerm()` still calls `loadEntryDetail(term.id)` when `term.chunk_id` is absent.
- `loaderAdapter.js`
  - `loadEntryDetail()` still fetches `APP_READY_DETAIL_MAP.json`.

### Build / Package / Validation

- `package-live-payloads.mjs`
  - chunks are built from `APP_READY_DETAIL_MAP.json`
- `build-example-chunks.mjs`
  - example chunks are rebuilt from `APP_READY_DETAIL_MAP.json`
- `audit-authoritative-promotion-readiness.mjs`
  - reports `detail_map_bytes`
- `verify-runtime-payloads.mjs`
  - verifies `APP_READY_DETAIL_MAP.json` as a generated artifact

### Repair Scripts

- `repair_runtime_translation_payloads.py`
- `repair_runtime_related_form_targets.py`
- `repair_runtime_detail_fidelity.py`
- `apply_subject_none_policy.py`

all still patch or read `APP_READY_DETAIL_MAP.json` directly.

## Blocking Facts

### 1. runtime fallback is not fully removable yet

- current search rows do carry `chunk_id`, but the code path still preserves `loadEntryDetail()` fallback.
- T2 cannot remove `DETAIL_MAP` from runtime truth unless the fallback contract is explicitly retired or replaced.

### 2. chunk generation still depends on `DETAIL_MAP`

- `package-live-payloads.mjs` chunks `DETAIL_MAP` into:
  - `APP_READY_CHUNK_RICH_*`
  - `APP_READY_CHUNK_EXAMPLES_*`
- this means `DETAIL_MAP` is not only a runtime object but also a current chunk build intermediate.

### 3. repair pipeline writes into `DETAIL_MAP`

- multiple repair scripts patch `DETAIL_MAP` in-place.
- until their target moves to chunk-rich or canonical source, `DETAIL_MAP` remains operationally important.

## Preparation Verdict

- `T2` is not blocked conceptually.
- but it is blocked operationally by:
  - runtime fallback dependency
  - chunk build dependency
  - repair script dependency

## Required Pre-Work Before Full Demotion

### A. fallback contract decision

- decide whether `loadEntryDetail()` is:
  - removed
  - retained for debug-only
  - replaced by chunk-rich guaranteed path

### B. chunk build source decision

- decide whether chunk-rich/examples should be built from:
  - canonical source directly
  - a reduced intermediate other than `DETAIL_MAP`

### C. repair target migration

- decide which script layer becomes the new repair target:
  - canonical source
  - chunk-rich
  - new intermediate

## Recommended Next Action

- do not demote `DETAIL_MAP` yet.
- first open a narrower decision packet for:
  - `runtime fallback retirement`
  - `chunk build source migration`

## PM Verdict

- `MM3-266F / T2` preparation: `DONE`
- next unresolved design blocker is explicit and narrow now.

## Revision History

- `R1` / `2026-03-27 21:05 KST` / `Codex PM` / `DETAIL_MAP` demotion의 current dependency map과 blocking facts를 고정
