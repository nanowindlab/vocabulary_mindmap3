# DATA_ARCHITECTURE_V1

## 1. Source Layers

### L0. Dictionary SSOT

- Path: `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- Shape:
  - top-level keys: `schema_version`, `generated_at`, `entry_count`, `api_xml_merged`, `entries`
  - actual `entries` length observed on 2026-03-23: `53,480`
- entry structure:
  - `entry.id` = `target_code`
  - `entry.word`
  - `entry.word_grade`
  - `entry.pos[]`
  - `entry.categories[]`
  - `entry.senses[]`
  - `entry.subwords[]`
  - `entry.related_forms[]`

### L0-B. Translation Sidecar

- Path: `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`
- Shape:
  - top-level keys: `schema_version`, `generated_at`, `translation_record_count`, `records`
  - observed `records` length on 2026-03-23: `71,683`
  - record shape: `sense_id`, `entry_id`, `translations[]`

### L0-C. Canonical Chunk Mapping Side Artifact

- Path: `vocab_dictionary/output/unified_live/kcenter_chunk_id_mapping.json.gz`
- Role:
  - current boundary derived canonical runtime build artifact
  - source-backed `entry_id -> chunk_id` mapping
- Ownership:
  - generator owner: `09_app` build tooling
  - generate commands:
    - `npm --prefix 09_app run build:canonical-chunk-mapping`
    - `npm --prefix 09_app run rebuild:canonical-runtime`
- Relationship:
  - derived from `kcenter_base.json.gz`
  - not an independent lexical SSOT
  - manual edit 금지
- Shape:
  - `schema_version`
  - `source_artifact`
  - `chunk_size`
  - `entry_count`
  - `chunk_count`
  - `chunks[]`
  - `records[]`

### L1. Imported TOPIK Stats Sidecar

- Source reference:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap2/09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- Imported fields:
  - `frequency`
  - `rank`
  - `round_count`
  - `band`
  - `level`
- Join policy:
  - conservative matching only
  - primary join keys: normalized `word` + normalized `pos` + normalized `definition`
  - exact match 우선, fuzzy는 reportable threshold를 넘을 때만 허용

### L2. Learner Runtime Projection

- Target path: `09_app/public/data/live/`
- Planned files:
  - `APP_READY_SITUATIONS_TREE.json`
  - `APP_READY_EXPRESSIONS_TREE.json`
  - `APP_READY_BASICS_TREE.json`
  - `APP_READY_SEARCH_INDEX.json`
  - `CHUNK_MANIFEST_V1.json`
  - `APP_READY_CHUNK_RICH_chunk_*.json`
  - `APP_READY_CHUNK_EXAMPLES_chunk_*.json`

## 2. Runtime Projection Principle

- `mindmap2`처럼 얇은 tree/search projection을 유지한다.
- 하지만 detail chunk는 `mindmap3` source richness를 보존해야 한다.
- 최소 보존 필드:
  - `def_ko`
  - `phonetic_romanization`
  - `related_vocab`
  - `refs.cross_links`
  - `translations`
  - `subwords`
  - `related_forms`
  - representative examples

## 3. Current Observations

- `mindmap2` runtime search index observed count: `8,094`
- `mindmap2` app item shape:
  - `id`, `word`, `pos`, `def_ko`, `hierarchy`, `stats`, `chunk_id`, `related_vocab`, `refs`
- `mindmap2` chunk split: `21` rich/example chunk pairs
- `mindmap3` unified source is much larger than `mindmap2`; therefore direct 1:1 runtime carryover는 불가하다.

## 4. Scope Note

- 이 문서는 구현 착수용 설계가 아니라, current PM phase에서 참고해야 할 data surface를 고정하기 위한 planning 문서다.
- runtime generator나 linkage automation은 현재 active scope가 아니다.
- 다음 단계는 이 문서를 바탕으로 `source schema / data structure review package`를 작성하는 것이다.

## 5. Parked Technical Observations (2026-03-23)

- summary path: `vocab_dictionary/output/topik_stats_linkage/summary.json`
- total entries: `53,480`
- matched: `8,698`
- unmatched: `44,782`
- method counts:
  - `exact_definition`: `1,110`
  - `fuzzy_definition`: `1`
  - `single_pos`: `7,587`
  - `ambiguous`: `485`
  - `no_candidate`: `44,297`
- confidence counts:
  - `high`: `1,110`
  - `medium`: `2,307`
  - `low`: `5,281`

## 6. PM Interpretation

- 위 수치는 implementation 재개 시 참고용 관찰값이다.
- 현재 phase에서는 이 수치에 맞춰 새 구현을 진행하지 않는다.
- 지금 필요한 것은 이후 구현 논의가 같은 source surface를 보게 하는 문서적 정렬이다.

## 7. Next Use

- 이 문서는 `MM3-002 source schema / data structure review package`의 베이스로 사용한다.
- scenario 문서는 이 review가 끝난 뒤 작성한다.
