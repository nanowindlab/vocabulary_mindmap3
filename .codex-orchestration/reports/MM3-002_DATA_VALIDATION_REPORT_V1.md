# MM3-002_DATA_VALIDATION_REPORT_V1

## Authoritative Inputs Read

- `.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`
- `.codex-orchestration/DATA_VALIDATION_AGENT_WORKBOARD_V1.md`
- `.codex-orchestration/reports/MM3-002_SOURCE_SCHEMA_REVIEW_REPORT_V1.md`
- `08_planning/DATA_ARCHITECTURE_V1.md`
- `vocab_dictionary/krdict_final_summary.md`
- `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`
- `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap2/09_app/public/data/live/APP_READY_SEARCH_INDEX.json`

## Outputs Checked

- `kcenter_base.json.gz`
- `kcenter_translations.json.gz`
- `krdict_final_summary.md`
- `DATA_ARCHITECTURE_V1.md`
- `MM3-002_SOURCE_SCHEMA_REVIEW_REPORT_V1.md`
- `APP_READY_SEARCH_INDEX.json`

## Checks Performed

- Verified `kcenter_base.json.gz` top-level keys and payload shape.
- Verified `entry_count`, `api_xml_merged`, and `entries` length from the base artifact.
- Verified `kcenter_translations.json.gz` top-level keys and record count.
- Compared `krdict_final_summary.md` against the observed artifact counts.
- Spot-checked the first entry and the first translation record shapes.
- Recomputed aggregate counts for entries with subwords, related forms, total senses, embedded translations, and example blocks.
- Recomputed `mindmap2` band and level distribution from the live search index snapshot.

## Verified Claims

- `kcenter_base.json.gz` observed entry count is `53,480`.
- `kcenter_base.json.gz` top-level payload is complete as described: `schema_version`, `generated_at`, `entry_count`, `api_xml_merged`, `entries`.
- `kcenter_base.json.gz` first record has `{ meta, entry }`, and `entry` contains the expected core keys.
- `kcenter_translations.json.gz` has `{ schema_version, generated_at, translation_record_count, records }` and `71,683` records.
- `krdict_final_summary.md` still states `53,439 / 53,439` and `unique target_code = 53,439`.
- The source review report is evidence-backed on the factual claims I spot-checked.

## Contradicted Or Unverified Claims

- Contradicted: `krdict_final_summary.md` count claims do not match the observed `kcenter_base.json.gz` count of `53,480`.
- Unverified by this validation pass: forward-looking taxonomy and runtime projection questions in the source review report, because they are policy decisions rather than artifact facts.
- No factual contradictions were found in the source review report itself beyond the already-flagged count drift.

## Schema Completeness Evidence

- Base artifact top-level keys: `schema_version`, `generated_at`, `entry_count`, `api_xml_merged`, `entries`.
- First entry top-level keys: `meta`, `entry`.
- First entry core keys: `id`, `word`, `homonym_no`, `word_unit`, `word_type`, `pos`, `word_grade`, `annotation`, `pronunciation`, `original_language`, `conjugations`, `categories`, `senses`, `subwords`, `related_forms`.
- Translation sidecar first record keys: `sense_id`, `entry_id`, `translations`.
- Aggregated counts verified from `kcenter_base.json.gz`:
  - entries: `53,480`
  - entries with subwords: `1,161`
  - entries with related_forms: `18,771`
  - total senses: `73,445`
  - embedded sense translations: `788,417`
  - example blocks: `589,926`

## Count Drift Evidence

- Artifact: `kcenter_base.json.gz` `entry_count = 53,480`, `api_xml_merged = 53,480`, `entries length = 53,480`.
- Historical summary: `krdict_final_summary.md` still reports `53,439 / 53,439` and `unique target_code = 53,439`.
- Result: the summary is stale relative to the current unified artifact.

## Residual Risk

- The count drift remains in the historical summary document until that document is revised or explicitly deprecated.
- `mindmap2` stats are only a reference snapshot for validation; they should not be treated as source truth for `mindmap3`.
- Taxonomy and runtime projection policy remain outside the scope of this validation pass.

## Verdict For The Source Review Package

- `ACCEPT`
- Reason: the source review report is supported by the observed artifacts, and the only hard contradiction is the already-explicit count drift between the historical summary and the unified artifact.

## Reflection Note

- Re-checked the exact top-level keys, record counts, and sample record shapes instead of relying on the report summary.
- After self-review, I separated hard artifact facts from forward-looking policy questions so the verdict only reflects evidence-backed claims.
- Remaining uncertainty is limited to product direction, not source integrity.

