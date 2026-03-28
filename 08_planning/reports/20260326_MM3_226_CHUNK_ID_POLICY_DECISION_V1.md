# 20260326_MM3_226_CHUNK_ID_POLICY_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 12:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- current tranche `chunk_id` policy decision
- canonical mapping backlog disposition

## Facts

- `npm run audit:authoritative-promotion` 기준:
  - `exact_match_full = true`
  - `exact_match_without_chunk_id = true`
  - `semantic_authority_candidate_ready = true`
- current app는 `chunk_id`가 없더라도 `loadEntryDetail(term.id)` fallback이 있다.
- `CHUNK_MANIFEST_V1.json` alone으로는 entry-level `chunk_id`를 재구성할 수 없다.
- canonical mapping 신규 생성 task는 `MM3-226A` backlog로 추가됐다.

## PM Decision

- current tranche에서는 `chunk_id`를 **runtime-enrichment**로 유지한다.
- `chunk_id`는 initial authoritative semantic gate에 포함하지 않는다.
- canonical `chunk_id` mapping 신규 생성은 `MM3-226A` parked backlog로 유지한다.
- current next verdict는 actual authoritative switch execution 여부다.

## Why

- current critical path는 이미 `search semantic fields + facets` authoritative candidate를 닫는 것이다.
- `chunk_id`는 search semantics보다 navigation/performance routing 성격이 더 강하다.
- canonical mapping을 지금 여는 것은 full runtime parity work를 다시 current tranche에 끌어들이는 일이다.

## Reopen Trigger

- full runtime parity가 이번 tranche의 acceptance로 다시 필요해질 때
- chunk routing drift / fallback cost / cache instability가 actual issue로 다시 관찰될 때
- search row의 direct chunk routing 자체를 canonical source에서 고정해야 할 제품/운영 요구가 생길 때

## PM Verdict

- `ACCEPT`
- `RUNTIME_ENRICHMENT_POLICY_LOCKED`
- `CANONICAL_MAPPING_PARKED`

## Next Active Work

- `MM3-217 Runtime Payload Builder Activation`
- active subtrack:
  - `MM3-217C authoritative output promotion hardening`
- next unblock:
  - actual authoritative switch verdict

## Revision History

- `R1` / `2026-03-26 12:10 KST` / `Codex PM` / current tranche `chunk_id` policy를 runtime-enrichment로 고정하고 canonical mapping을 parked backlog로 분리
