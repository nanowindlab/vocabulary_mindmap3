# MM3-002_SOURCE_SCHEMA_REVIEW_REPORT_V1

## Source Inventory

- `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`
- `vocab_dictionary/한국어 기초사전_통합스키마_v2.md`
- `vocab_dictionary/krdict_final_summary.md`
- `08_planning/DATA_ARCHITECTURE_V1.md`
- `vocabulary_mindmap2/09_app/public/data/live/APP_READY_SEARCH_INDEX.json`

## Top-Level Payload Shapes

- `kcenter_base.json.gz`
  - top keys: `schema_version`, `generated_at`, `entry_count`, `api_xml_merged`, `entries`
  - observed `entries` length: `53,480`
  - both `entry_count` and `api_xml_merged` are `53,480`
- `kcenter_translations.json.gz`
  - top keys: `schema_version`, `generated_at`, `translation_record_count`, `records`
  - observed `records` length: `71,683`
- `APP_READY_SEARCH_INDEX.json`
  - observed array length: `8,094`
  - per-row shape includes `id`, `word`, `pos`, `def_ko`, `hierarchy`, `stats`, `chunk_id`, `related_vocab`, `refs`, `is_center_profile`, `roman`, `surface`, `routing`

## Entry / Sense / Subword / Translation Summary

- Entry shape in `kcenter_base` is `{ meta, entry }`.
- `entry` keys are `id`, `word`, `homonym_no`, `word_unit`, `word_type`, `pos`, `word_grade`, `annotation`, `pronunciation`, `original_language`, `conjugations`, `categories`, `senses`, `subwords`, `related_forms`.
- First observed entry, `9471 / 요리하다`, shows:
  - `senses[]` with stable sense IDs like `9471#sense-001`
  - `source_ids.json` and `source_ids.api` preserved per sense
  - `examples[]` stored as typed blocks with `texts[]`
  - `translations[]` stored inline per sense
  - `related_terms[]` and `related_forms[]` stored at entry/sense level as applicable
- Aggregated source counts from `kcenter_base`:
  - entries: `53,480`
  - entries with `subwords`: `1,161`
  - entries with `related_forms`: `18,771`
  - total senses: `73,445`
  - embedded sense translations: `788,417`
  - example blocks: `589,926`
- `subwords[]` uses shape `{ text, unit, source_type, link_target_code, link_confidence, senses }`.
- Translation sidecar shape is `{ sense_id, entry_id, translations[] }`, and the first observed record is `13943#sense-001`.

## Count Drift And Inconsistency

- The live artifact and the summary doc disagree on the primary entry count.
  - artifact: `kcenter_base.entries = 53,480`
  - summary doc: `unique target_code = 53,439`
- The summary doc also states `53,439 / 53,439` API XML coverage, which does not match the artifact count observed in `kcenter_base.json.gz`.
- The source architecture note in `08_planning/DATA_ARCHITECTURE_V1.md` has already been updated to reflect the observed `53,480` base count, but the historical summary still preserves the older number.
- For `mindmap2`, the live search index snapshot has `8,094` rows. Its band distribution is finite and sparse in the snapshot:
  - `band 1`: `347`
  - `band 2`: `462`
  - `band 3`: `648`
  - `band 4`: `1,684`
  - `band 5`: `3,588`
  - `band null`: `1,365`
- The same `mindmap2` snapshot contains `Beginner`, `Intermediate`, and `Unrated` levels, but no `Advanced` rows in the observed file.

## Learner Runtime Implications

- `mindmap3` source is structurally richer than `mindmap2` runtime payloads, so a direct 1:1 carryover is not appropriate.
- The runtime projection must preserve:
  - sense IDs and `source_ids`
  - typed examples with multi-utterance `texts[]`
  - translation sidecar records
  - grouped `subwords` rather than flattening them into the main tree
  - `related_forms` as a separate learner aid, not as taxonomy structure
- `mindmap2`-style `stats.band` / `stats.level` can remain a thin learning signal, but they should be treated as a projection layer, not as the dictionary source of truth.
- The source schema already implies that scenario and runtime design must separate:
  - taxonomy navigation
  - sense-level detail
  - subword/related-form assistance
  - translation lookup

## Open Questions For PM

- Which taxonomy should become the first learner-facing navigation layer for `mindmap3`?
- Should scenario writing start from `entry.categories` or from a separate taxonomy draft derived from the same source?
- How should `mindmap2` stats be attached to `mindmap3` entries when word/definition alignment is ambiguous?
- Should `subwords` be surfaced in the first runtime detail panel or in a secondary disclosure area?
- Do we keep translations as full sidecar data in runtime, or project them into a limited in-panel language subset?

## Reflection

- Re-checked the primary source files and confirmed the `kcenter_base` top-level keys, the translation sidecar shape, and the `mindmap2` search index contract.
- After self-review, I tightened the report around observed counts only and separated artifact-backed facts from PM questions.
- Remaining uncertainty is not about the source shape itself, but about downstream taxonomy and runtime projection policy, which is intentionally out of scope for this review.

