# 20260327_MM3_266B_STORAGE_LAYOUT_OPTIONS_STUDY_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 17:25 KST`

## Last Updated By

- `Codex PM`

## Scope

- execute `MM3-266B` alternative storage/layout options study

## Option A. Repo-Light Artifact Externalization

### Summary

- keep current runtime model mostly intact
- move large artifacts out of tracked git default path
- keep manifest/checksum/version in repo

### Structure

- git keeps:
  - code
  - manifests
  - checksums
  - small metadata
- object storage / release assets keep:
  - `kcenter_base.json.gz`
  - `kcenter_thin_index.json.gz`
  - `runtime_payloads/*.json.gz`

### Pros

- fastest to adopt
- lowest regression risk
- immediately reduces git clone/push weight
- current runtime code barely changes

### Cons

- local storage duplication still exists
- structural duplication inside runtime layout is not solved
- fetch/bootstrap workflow becomes mandatory

### Risk

- low

## Option B. Chunk-First Runtime, No Monolithic Detail Map

### Summary

- runtime keeps `search/tree/facet` plus chunked detail stores
- remove `APP_READY_DETAIL_MAP` from default delivery path
- detail is rebuilt from chunk stores on demand

### Structure

- keep:
  - `APP_READY_SEARCH_INDEX`
  - `APP_READY_MEANING_TREE`
  - `APP_READY_SITUATION_TREE`
  - `APP_READY_UNCLASSIFIED_TREE`
  - `APP_READY_FACETS`
  - `CHUNK_MANIFEST`
  - `APP_READY_CHUNK_RICH_*`
  - `APP_READY_CHUNK_EXAMPLES_*`
- remove from default runtime delivery:
  - `APP_READY_DETAIL_MAP`

### Pros

- removes biggest single runtime duplicate
- chunked loading model becomes the primary runtime truth
- lowers delivery/storage cost materially

### Cons

- loader fallback path must be redesigned
- debugging direct-entry detail becomes less convenient
- packaging/build scripts need more invariants

### Risk

- medium

## Option C. Normalized Canonical Store + Exported Runtime Views

### Summary

- canonical source moves from giant JSON snapshots to normalized store
- runtime payloads become generated views only

### Candidate Forms

- sqlite
- duckdb
- sharded key-value store

### Pros

- strongest deduplication
- better incremental updates
- clearer separation between canonical source and runtime exports
- future analytics/validation become easier

### Cons

- biggest migration cost
- more tooling complexity
- browser/runtime delivery still needs exported JSON or API layer

### Risk

- high

## Comparison

| Option | Storage Efficiency | Runtime Risk | Tooling Cost | Near-Term Practicality |
| --- | --- | --- | --- | --- |
| A | medium | low | low | high |
| B | high | medium | medium | high |
| C | very high | medium-high | high | medium |

## PM Verdict

- `MM3-266B`: `DONE`

## Recommended Next Step

- move to `MM3-266C`
- choose a phased target, not a single big-bang rewrite

## Revision History

- `R1` / `2026-03-27 17:25 KST` / `Codex PM` / storage/layout alternatives 3안을 비교하고 실행 가능성을 평가
