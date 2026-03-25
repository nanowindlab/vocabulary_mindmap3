# 20260326_MM3_213_CANONICAL_THIN_INDEX_GENERATOR_RECOVERY_NOTE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 07:54 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-213` parked backlog activation for `PARK-005 canonical thin-index generator recovery / documentation`

## Facts Confirmed

- canonical source artifacts exist:
  - `vocab_dictionary/output/unified_live/kcenter_thin_index.json.gz`
  - `vocab_dictionary/output/unified_live/kcenter_facet_payload.json.gz`
- runtime alignment against those artifacts currently passes via `MM3-212`.
- current runtime search index is not a raw copy of thin index.

## Field Gap

### Thin index currently exposes only:

- `entry.id`
- `entry.word`
- `entry.pos`
- `entry.word_grade`
- `entry.categories`
- `sense_count`
- `has_subwords`
- `has_related_forms`
- `representative_sense.id`
- `representative_sense.definition`
- `representative_sense.translation_summary`

### Runtime search index additionally carries:

- `original_language_type`
- `def_en`
- normalized `hierarchy`
- `surface`
- `routing`
- `stats` (`frequency`, `rank`, `round_count`, `band`, `level`)
- `chunk_id`
- `related_vocab`
- `refs.cross_links`
- `roman`
- expanded multilingual `translation_summary`

## PM Interpretation

- `search/facet` source alignment은 recoverable하다.
- 하지만 exact current runtime search generator는 `thin index + facet payload`만으로는 복구되지 않는다.
- full generator recovery를 하려면 적어도 아래 provenance mapping이 추가로 필요하다.
  - TOPIK stats source
  - chunk assignment source
  - cross-link / related-vocab source
  - original-language / romanization provenance
  - English-first translation projection rule

## What Can Be Done Without Approval

- recovery boundary documentation
- source/runtime field provenance mapping
- partial builder feasibility check
- validator-first gate setup

## What Should Not Be Assumed

- `kcenter_thin_index.json.gz` alone로 current `APP_READY_SEARCH_INDEX.json`를 exact 재생성할 수 있다고 가정하지 않는다.
- current generator recovery를 blind rebuild로 진행하지 않는다.

## PM Verdict

- `PARTIAL_RECOVERY_PATH_CONFIRMED`

## Next Step

- next implementation step은 `runtime search index field provenance mapping`이다.
- 그 전까지는 current deploy/runtime truth를 계속 `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build`로 유지한다.

