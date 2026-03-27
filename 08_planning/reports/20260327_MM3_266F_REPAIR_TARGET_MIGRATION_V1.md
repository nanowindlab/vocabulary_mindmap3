# 20260327_MM3_266F_REPAIR_TARGET_MIGRATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 21:48 KST`

## Last Updated By

- `Codex PM`

## Scope

- migrate repair/apply scripts away from `DETAIL_MAP` as a normal operational target

## Implemented

- updated:
  - `vocab_dictionary/scripts/apply_subject_none_policy.py`
  - `vocab_dictionary/scripts/repair_runtime_translation_payloads.py`
  - `vocab_dictionary/scripts/repair_runtime_related_form_targets.py`
  - `vocab_dictionary/scripts/repair_runtime_detail_fidelity.py`

## What Changed

### 1. `apply_subject_none_policy` no longer patches `DETAIL_MAP`

- source base
- thin index
- facet payload
- search index
- tree trio

only these remain patched in the normal chain.

### 2. translation repair no longer writes `DETAIL_MAP`

- translation repair now updates:
  - search index
  - rich chunks
  - tree trio
- `DETAIL_MAP` is no longer part of that write path.

### 3. related-form repair no longer writes `DETAIL_MAP`

- source base and link integrity stay as repair targets
- `DETAIL_MAP` direct patch path was removed

### 4. detail fidelity repair becomes report-only

- `repair_runtime_detail_fidelity.py` no longer mutates `DETAIL_MAP`
- it now reports source-side counts and confirms the detail-map write path is removed

## Validation

- `npm run build` -> `PASS`
- `npm run package:live` -> `PASS`

## PM Verdict

- `repair target migration`: `DONE`

## Next Step

- decide whether `DETAIL_MAP` remains as debug-only generated artifact or can be fully removed from the normal local chain

## Revision History

- `R1` / `2026-03-27 21:48 KST` / `Codex PM` / repair/apply scripts의 `DETAIL_MAP` direct write path를 제거하고 local build/package validation을 통과
