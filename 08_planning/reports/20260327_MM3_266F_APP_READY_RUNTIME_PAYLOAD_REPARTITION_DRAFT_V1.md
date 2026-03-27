# 20260327_MM3_266F_APP_READY_RUNTIME_PAYLOAD_REPARTITION_DRAFT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 20:08 KST`

## Last Updated By

- `Codex PM`

## Scope

- draft the target architecture for `MM3-266F` `APP_READY_*` runtime payload repartition

## Problem Restatement

- current production symptom proved that `APP_READY_MEANING_TREE.json` `160,435,724` bytes is too heavy as a direct runtime fetch.
- current runtime workaround already bypasses tree fetch by deriving tab views from `APP_READY_SEARCH_INDEX`.
- therefore the remaining design task is not whether repartition is needed, but which `APP_READY_*` objects should remain shipped runtime truth.

## Current Payload Baseline

### Hot Runtime

- `APP_READY_SEARCH_INDEX.json`: `181,733,540`
- `APP_READY_FACETS.json`: `4,114`

### Large Tree Payloads

- `APP_READY_MEANING_TREE.json`: `160,435,724`
- `APP_READY_SITUATION_TREE.json`: `23,986,085`
- `APP_READY_UNCLASSIFIED_TREE.json`: `27,471,995`

### Detail Layer

- `APP_READY_DETAIL_MAP.json`: `245,842,330`
- `APP_READY_CHUNK_RICH_*`: total `402,787,701` / `107 files`
- `APP_READY_CHUNK_EXAMPLES_*`: total `148,078,614` / `107 files`
- `CHUNK_MANIFEST_V1.json`: `7,627`

## Evidence From Current Runtime

- `APP_READY_SEARCH_INDEX` alone can project current learner-facing tab membership counts:
  - meaning: `44,410`
  - situation: `6,399`
  - unclassified: `8,506`
- latest production custom domain recheck recovered actual tree render by using `searchIndex -> tab projection`.
- this means the three large tree payloads are no longer required as learner-facing runtime fetch objects.

## Per-Payload Decision Draft

### Keep As Hot Runtime Truth

- `APP_READY_SEARCH_INDEX`
  - reason:
    - current app boot and search/select flow already depend on it
    - tab/tree projection is now possible from this object
    - it is still too large, but it is the most valuable eager payload
- `APP_READY_FACETS`
  - reason:
    - tiny
    - immediately needed for filter shell

### Keep As On-Demand Runtime Truth

- `APP_READY_CHUNK_RICH_*`
  - reason:
    - primary detail body
    - chunked access is already aligned with learner interaction
- `APP_READY_CHUNK_EXAMPLES_*`
  - reason:
    - example-heavy layer
    - should stay separated from rich detail for selective fetch
- `CHUNK_MANIFEST_V1`
  - reason:
    - runtime routing/validation metadata

### Demote From Learner-Facing Runtime Fetch

- `APP_READY_MEANING_TREE`
- `APP_READY_SITUATION_TREE`
- `APP_READY_UNCLASSIFIED_TREE`
  - reason:
    - current runtime no longer needs them to render the shell/tree
    - they duplicate information already recoverable from `APP_READY_SEARCH_INDEX`
    - at least one of them (`MEANING_TREE`) was a confirmed production bottleneck

### Demote From Primary Runtime Truth

- `APP_READY_DETAIL_MAP`
  - reason:
    - biggest monolithic detail object
    - duplicates chunk-rich/detail content
    - current learner flow should prefer chunk-based detail
  - caveat:
    - keep as build/debug/validator artifact until chunk-only detail parity is explicitly proven

## Target Architecture Draft

### Learner-Facing Runtime Delivery

- eager:
  - `APP_READY_SEARCH_INDEX`
  - `APP_READY_FACETS`
- lazy:
  - `APP_READY_CHUNK_RICH_*`
  - `APP_READY_CHUNK_EXAMPLES_*`
  - `CHUNK_MANIFEST_V1`
- not fetched by app runtime:
  - `APP_READY_MEANING_TREE`
  - `APP_READY_SITUATION_TREE`
  - `APP_READY_UNCLASSIFIED_TREE`
  - `APP_READY_DETAIL_MAP`

### Build/Validation Layer

- keep generated for:
  - source alignment validation
  - sidecar recovery comparison
  - offline inspection/debug
- not treated as primary learner runtime objects:
  - tree payload trio
  - detail map

## Migration Tranche Proposal

### Tranche 1

- formalize current `searchIndex -> tab projection` as intended runtime architecture
- remove direct runtime fetch dependency on tree payload trio
- acceptance:
  - production shell/tree renders from projected data
  - local/prod smoke remains green

### Tranche 2

- make `chunk-rich/examples` the explicit primary detail runtime truth
- keep `APP_READY_DETAIL_MAP` only for validator/debug until parity closes
- acceptance:
  - learner detail flow no longer needs detail-map fallback on normal path

### Tranche 3

- reduce `APP_READY_SEARCH_INDEX` itself
- candidate directions:
  - thinner search-head fields
  - split semantic tail
  - smaller translation preview surface
- acceptance:
  - first boot payload materially lower than current `181.7MB`

## Open Design Questions

- how much of current `translation_summary` must remain eager in `APP_READY_SEARCH_INDEX`?
- should projected tree generation happen fully at runtime, or should build emit a smaller tree-shell artifact?
- when `APP_READY_DETAIL_MAP` is demoted, what fallback/debug protocol replaces it cleanly?

## PM Verdict

- `MM3-266F` draft exists now.
- current preferred direction:
  - keep `SEARCH_INDEX + FACETS` hot
  - keep `CHUNK_RICH/EXAMPLES + MANIFEST` on-demand
  - demote tree trio and detail map from learner-facing runtime truth

## Next Step

- revise the opening packet or create a dedicated execution plan packet for tranche selection.

## Revision History

- `R1` / `2026-03-27 20:08 KST` / `Codex PM` / `APP_READY_*` payload별 keep/remove/demote draft와 migration tranche proposal을 고정
