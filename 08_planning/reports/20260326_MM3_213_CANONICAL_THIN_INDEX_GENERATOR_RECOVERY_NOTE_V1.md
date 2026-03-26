# 20260326_MM3_213_CANONICAL_THIN_INDEX_GENERATOR_RECOVERY_NOTE_V1

## Current Revision

- `R5`

## Last Updated

- `2026-03-26 10:08 KST`

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

## Runtime Search Field Provenance Map

| Runtime field | Current provenance status | Source / script evidence | Exact recovery status |
|---|---|---|---|
| `id` | known | `kcenter_thin_index.json.gz` `entry.id` | recoverable |
| `word` | known | `kcenter_thin_index.json.gz` `entry.word` | recoverable |
| `pos` / `pos_list` | known | `kcenter_thin_index.json.gz` `entry.pos`; runtime flattens first value into `pos` | recoverable |
| `word_grade` | known | `kcenter_thin_index.json.gz` `entry.word_grade` | recoverable |
| `categories` | known | `kcenter_thin_index.json.gz` `entry.categories` | recoverable |
| `sense_count` | known | `kcenter_thin_index.json.gz` `sense_count` | recoverable |
| `has_subwords` | known | `kcenter_thin_index.json.gz` `has_subwords` | recoverable |
| `has_related_forms` | known | `kcenter_thin_index.json.gz` `has_related_forms` | recoverable |
| `representative_sense_id` | known | `kcenter_thin_index.json.gz` `representative_sense.id` | recoverable |
| `def_ko` | known | `kcenter_thin_index.json.gz` `representative_sense.definition` | recoverable |
| `translation_summary` | partial | thin index provides a partial translation summary; [repair_runtime_translation_payloads.py](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/scripts/repair_runtime_translation_payloads.py) rewrites runtime translation fields from `kcenter_translations.json.gz` | partial |
| `def_en` | known via sidecar repair | [repair_runtime_translation_payloads.py](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/scripts/repair_runtime_translation_payloads.py) derives English definition from source translations | recoverable with sidecar |
| `stats` | partial | TOPIK stats come from `entry_topik_stats.json.gz`; current runtime keeps only the matched subset and no explicit confidence field | partial |
| `original_language_type` | intentionally out of learner-facing scope | present in `kcenter_base` entry `original_language.type`, but current product policy does not use it in learner-facing UI | no recovery needed for current scope |
| `roman` | not mapped in current local recovery path | present in richer source/detail surfaces, but no project-local runtime builder currently maps it into search index | missing mapping |
| `hierarchy` | known | runtime search hierarchy can be reconstructed from source `categories` with rule `주제 및 상황 범주 우선 -> 의미 범주 -> 미분류 fallback`; verified by recovery probe | recoverable |
| `surface` / `routing` | not mapped in current local recovery path | runtime constants are visible, but the project-local search generator that stamps them is not recovered | missing mapping |
| `chunk_id` | known | [package-live-payloads.mjs](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/package-live-payloads.mjs) assigns chunk ids from detail-map chunking | recoverable |
| `related_vocab` | not mapped in current local recovery path | runtime search rows already carry it, but current local generator path is not recovered; example chunk packaging can preserve it in chunk examples only | missing mapping |
| `refs.cross_links` | not mapped in current local recovery path | runtime search rows already carry it, but current local generator path is not recovered | missing mapping |
| `is_center_profile` | not mapped in current local recovery path | runtime value exists, but provenance is not yet documented in the local rebuild path | missing mapping |

## Additional Deploy Truth

- deploy parity for example chunks is now fixed.
- current production restore path prepares both:
  - `APP_READY_CHUNK_RICH_*`
  - `APP_READY_CHUNK_EXAMPLES_*`
- this closes the local vs Vercel example mismatch, but it does not change the generator provenance gap above.

## Recovery Probe Result

- script:
  - `npm run probe:search-recovery`
- scope:
  - `id`
  - `word`
  - `pos`
  - `pos_list`
  - `word_grade`
  - `def_ko`
  - `def_en`
  - `surface`
  - `routing`
  - `stats`
  - `chunk_id`
  - `sense_count`
  - `has_subwords`
  - `has_related_forms`
  - `representative_sense_id`
  - `translation_summary`
  - `categories`
- result:
  - runtime rows: `53,480`
  - recovered rows: `53,480`
  - exact matches on recoverable subset: `53,480`
  - mismatches: `0`
- builder artifact:
  - `npm run build:search-recovery`
  - output: `tmp_reports/recovered_APP_READY_SEARCH_INDEX.json`

## PM Interpretation After Probe

- current runtime search index의 large subset은 project-local recovery path로 exact 재구성 가능하다고 봐도 된다.
- 남은 non-trivial gap은 below fields 쪽으로 더 좁혀진다.
  - `related_vocab`
  - `refs.cross_links`
  - `roman`
  - `is_center_profile`

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
- `FIELD_PROVENANCE_MAP_ADDED`
- `ORIGINAL_LANGUAGE_TYPE_OUT_OF_SCOPE`
- `RECOVERABLE_SUBSET_EXACT_MATCH_CONFIRMED`
- `HIERARCHY_RECOVERY_CONFIRMED`
- `CLOSEOUT_ACCEPTED_FOR_CURRENT_SEARCH_SCOPE`

## Next Step

- current search generator recovery scope는 closeout한다.
- next active technical backlog는 `MM3-217 runtime payload builder activation`이다.
- current deploy/runtime truth는 계속 `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build`로 유지한다.

## Revision History

- `R1` / `2026-03-26 07:54 KST` / `Codex PM` / thin/facet source 확인과 partial recovery boundary를 최초 정리
- `R2` / `2026-03-26 09:24 KST` / `Codex PM` / runtime search field provenance map과 example-chunk deploy parity truth를 추가
- `R3` / `2026-03-26 09:56 KST` / `Codex PM` / recoverable subset probe에서 `53,480 / 53,480` exact match를 확인하고 next target을 `hierarchy provenance`로 좁힘
- `R4` / `2026-03-26 10:02 KST` / `Codex PM` / `hierarchy`도 categories 기반 exact recovery가 가능함을 확인하고 next target을 `related_vocab / refs.cross_links`로 재설정
- `R5` / `2026-03-26 10:08 KST` / `Codex PM` / search recovery builder artifact를 추가하고 current learner-facing search scope closeout을 반영
