# 20260327_MM3_266F_APP_READY_RUNTIME_PAYLOAD_REPARTITION_OPENING_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 19:08 KST`

## Last Updated By

- `Codex PM`

## Scope

- open `MM3-266F` `APP_READY_*` runtime payload repartition design

## Goal

- current runtime symptom과 `MM3-267` workaround를 기준으로, `APP_READY_*` payload를 learner-facing access pattern 기준으로 다시 나누는 next design task를 고정한다.

## Why This Task Is Now Active

- latest production `Vercel` runtime는 `Ready` 상태였지만,
  prior structure에서는 `APP_READY_MEANING_TREE.json` `160MB` fetch가 Safari에서 persistent loading symptom을 만들었다.
- `MM3-267`에서 app runtime을 `searchIndex -> tab projection`으로 우회해 current symptom은 완화됐다.
- 이제 temporary runtime bypass를 durable payload architecture로 승격할 설계가 필요하다.

## Inputs

- `08_planning/reports/20260327_MM3_266B_STORAGE_LAYOUT_OPTIONS_STUDY_V1.md`
- `08_planning/reports/20260327_MM3_266C_RECOMMENDED_ARCHITECTURE_AND_MIGRATION_PLAN_V1.md`
- `08_planning/reports/20260327_MM3_267_T1_LOADER_CACHING_HARDENING_IMPLEMENTATION_V1.md`
- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- `09_app/public/data/live/APP_READY_DETAIL_MAP.json`
- `09_app/public/data/live/APP_READY_CHUNK_RICH_*.json`
- `09_app/public/data/live/APP_READY_CHUNK_EXAMPLES_*.json`

## Design Question

- current runtime는 무엇을 eagerly ship하고,
  무엇을 lazily fetch하며,
  무엇을 build-time artifact로만 남겨야 하는가?

## Initial Framing

### Keep Hot

- `APP_READY_SEARCH_INDEX`
- `APP_READY_FACETS`

### Keep On-Demand

- `APP_READY_CHUNK_RICH_*`
- `APP_READY_CHUNK_EXAMPLES_*`

### Reconsider As Shipped Runtime Objects

- `APP_READY_MEANING_TREE`
- `APP_READY_SITUATION_TREE`
- `APP_READY_UNCLASSIFIED_TREE`
- `APP_READY_DETAIL_MAP`

## Expected Output

- repartition target architecture
- per-payload keep/remove/demote decision
- migration tranche proposal
- build/package/runtime verification impact note

## PM Verdict

- `MM3-266F`: `OPEN`

## Revision History

- `R1` / `2026-03-27 19:08 KST` / `Codex PM` / `MM3-267` closeout 이후 `APP_READY_*` repartition design task opening을 고정
