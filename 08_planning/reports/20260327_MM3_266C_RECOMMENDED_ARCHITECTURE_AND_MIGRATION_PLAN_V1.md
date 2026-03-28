# 20260327_MM3_266C_RECOMMENDED_ARCHITECTURE_AND_MIGRATION_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 17:25 KST`

## Last Updated By

- `Codex PM`

## Scope

- execute `MM3-266C` recommended optimization architecture and migration plan

## Recommendation

- recommended target is a phased hybrid:
  - Phase 1: `Option A`
  - Phase 2: selective `Option B`
  - Phase 3: evaluate `Option C` only if growth continues

## Why This Is The Best Path

### 1. fastest repo-weight relief comes from externalizing tracked heavy artifacts

- current push pain is dominated by large tracked blobs
- this is solved faster by artifact externalization than by deep schema redesign

### 2. biggest runtime duplication is `APP_READY_DETAIL_MAP` vs chunk-rich

- once repo-weight pressure is relieved,
  the next biggest gain is to remove monolithic detail duplication from default runtime

### 3. normalized canonical store is attractive but not the first move

- it is architecturally cleaner,
  but migration cost is high and not required to get immediate wins

## Recommended Target Architecture

### Canonical Source

- keep a single authoritative canonical source package outside default tracked repo path
- repo keeps:
  - manifest
  - checksum
  - version metadata
  - rebuild scripts

### Runtime Delivery

- authoritative runtime delivery keeps:
  - search/tree/facet payloads
  - chunk manifest
  - chunk-rich
  - chunk-examples
- monolithic `APP_READY_DETAIL_MAP` becomes:
  - local debug/generated artifact
  - not the primary shipped runtime object

### Git Strategy

- stop treating large binary-ish payload snapshots as normal git content by default
- either external artifact storage or LFS as temporary bridge

## Migration Plan

### Phase 1. Externalize Large Artifacts

- targets:
  - `kcenter_base.json.gz`
  - `kcenter_thin_index.json.gz`
  - `runtime_payloads/*.json.gz`
- output:
  - manifest + checksum + fetch/restore script
- goal:
  - reduce repo and push weight immediately

### Phase 2. Make Chunk Runtime Primary

- demote `APP_READY_DETAIL_MAP` from primary runtime truth
- loader reads chunk-rich/examples as default
- keep detail map only for local tooling/debug if still needed
- goal:
  - remove runtime duplication hotspot

### Phase 3. Revisit Canonical Storage Form

- if source keeps growing or rebuild costs become dominant:
  - prototype normalized canonical store
  - compare sqlite / duckdb / sharded kv

## Acceptance Criteria For Phase 1

- repo no longer tracks the heaviest artifacts by default
- local bootstrap remains reproducible
- `npm run prepare:live`, `npm run build`, runtime parity checks still pass

## Acceptance Criteria For Phase 2

- runtime no longer depends on monolithic detail map for normal learner flow
- chunk-based detail parity is proven
- build/package chain remains deterministic

## PM Verdict

- `MM3-266C`: `DONE`
- recommended execution order:
  - `A -> B -> optional C`

## Next Step

- `MM3-266D` execution tranche selection
- decide whether to start with:
  - external artifactization protocol
  - or chunk-first runtime tranche

## Revision History

- `R1` / `2026-03-27 17:25 KST` / `Codex PM` / recommended target architecture와 phased migration plan을 고정
