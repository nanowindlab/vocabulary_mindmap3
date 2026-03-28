# 20260327_MM3_266A_PAYLOAD_WEIGHT_AND_DUPLICATION_AUDIT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 17:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- execute `MM3-266A` payload weight and duplication audit

## Summary

- current data is compressed, but layout-level duplication is still large.
- biggest structural issue is not a single file but repeated storage of similar entry payloads across:
  - canonical source snapshots
  - live runtime payloads
  - compressed runtime payloads
  - chunked rich/example payloads

## Weight Breakdown

### 1. Canonical source zone

- `vocab_dictionary/output/unified_live/`: `1,452,049,703` bytes
- main files:
  - `kcenter_base.json`: `461,102,235`
  - `kcenter_base.seed.json`: `443,988,746`
  - `kcenter_translations.json`: `182,597,100`
  - `kcenter_translations.seed.json`: `182,597,100`
  - `kcenter_base.json.gz`: `62,134,328`
  - `kcenter_thin_index.json.gz`: `8,558,583`

### 2. Live runtime zone

- `09_app/public/data/live/`: `1,371,877,020` bytes
- main files:
  - `APP_READY_DETAIL_MAP.json`: `427,379,247`
  - `APP_READY_SEARCH_INDEX.json`: `181,733,540`
  - `APP_READY_MEANING_TREE.json`: `160,435,724`
  - `APP_READY_SITUATION_TREE.json`: `23,986,085`
  - `APP_READY_UNCLASSIFIED_TREE.json`: `27,471,995`
  - `APP_READY_CHUNK_RICH_*` total: `402,787,701`
  - `APP_READY_CHUNK_EXAMPLES_*` total: `148,078,614`

### 3. Compressed runtime zone

- `09_app/public/data/internal/runtime_payloads/`: `195,944,370` bytes
- main files:
  - `APP_READY_DETAIL_MAP.json.gz`: `34,302,250`
  - `APP_READY_SEARCH_INDEX.json.gz`: `33,266,347`
  - `APP_READY_MEANING_TREE.json.gz`: `29,169,277`
  - `APP_READY_SITUATION_TREE.json.gz`: `4,886,132`
  - `APP_READY_UNCLASSIFIED_TREE.json.gz`: `4,527,862`
  - `APP_READY_CHUNK_RICH_*.json.gz` total: `68,133,449`
  - `APP_READY_CHUNK_EXAMPLES_*.json.gz` total: `21,658,246`

## Duplication Hotspots

### A. canonical seed/full duplication

- `kcenter_base.seed.json` and `kcenter_base.json` are both very large.
- `kcenter_translations.seed.json` and `kcenter_translations.json` are same-size scale.
- this suggests the repo keeps both pre-merge/seed and merged/full payloads at full snapshot size.

### B. runtime detail vs chunk rich duplication

- `APP_READY_DETAIL_MAP.json` already holds full entry detail.
- `APP_READY_CHUNK_RICH_*` stores chunked detail again.
- this is a direct runtime duplication trade-off for chunked loading.

### C. live vs compressed runtime duplication

- the same runtime payload exists in:
  - decompressed live JSON
  - compressed runtime payloads
- operationally useful, but versioning/storage-cost wise it duplicates one delivery layer.

### D. examples duplication

- dictionary examples live in detail payloads
- example chunks store example-focused payload again
- `TOPIK` examples are merged on top, increasing chunk growth further

## Current Entry Counts

- canonical base entries: `53,012`
- thin entries: `53,012`
- facet entries: `53,012`

## PM Interpretation

- current structure is optimized for runtime convenience more than storage efficiency.
- the biggest wins are likely to come from:
  1. removing seed/full snapshot duplication from tracked repo state
  2. choosing one authoritative runtime storage layer and deriving the others on demand
  3. decoupling examples/translations from full detail snapshots more aggressively

## Recommended Next Questions

- can `seed` artifacts move out of tracked default state?
- can `APP_READY_DETAIL_MAP` become chunk-only or on-demand?
- should runtime delivery keep only compressed payloads + build-time prepare, while local live JSON becomes generated ephemeral state?
- should examples/translations become separate keyed stores instead of being repeated in multiple payload layers?

## PM Verdict

- `MM3-266A`: `DONE`

## Next Step

- `MM3-266B` alternative storage/layout options study

## Revision History

- `R1` / `2026-03-27 17:10 KST` / `Codex PM` / payload weight breakdown과 major duplication hotspot을 고정
