# 20260327_MM3_262B_BATCH_CANDIDATE_HARVEST_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 12:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- execute `MM3-262B` batch heuristic design + candidate harvesting
- quantify whether `14112 실제로` issue is isolated or systemic

## Heuristic

### H1. Example type-loss candidate

- compare `kcenter_base` vs `APP_READY_DETAIL_MAP`
- candidate condition:
  - base has `문장` or `대화`
  - detail has neither `문장` nor `대화`
  - or detail total example text count is lower than base

### H2. Relation display-risk candidate

- inspect `APP_READY_DETAIL_MAP.senses[].related_terms`
- candidate condition:
  - same related surface appears more than once within one sense
  - display label can collapse distinctions because UI title is word-first

## Evidence

- source:
  - `vocab_dictionary/output/unified_live/kcenter_base.json`
- runtime:
  - `09_app/public/data/live/APP_READY_DETAIL_MAP.json`
- code:
  - `vocab_dictionary/scripts/build_kcenter_dataset.py`
  - `09_app/scripts/package-live-payloads.mjs`
  - `09_app/scripts/example-chunk-sources.mjs`
  - `09_app/src/components/TermDetail.jsx`

## Results

### 1. Example type-loss is systemic

- `sentence_dialogue_dropped`: `37,318`
- `example_text_count_reduced`: `47,079`
- combined candidate set: `47,079`

### 2. Representative candidate samples

- `9471` `요리하다`
  - base: `구/문장/대화`, text count `19`
  - detail: `구`, text count `10`
- `13943` `역사학`
  - base: `구/문장/대화`, text count `9`
  - detail: `구`, text count `5`
- `13960` `시도`
  - base: `구/문장/대화`, text count `15`
  - detail: `구`, text count `5`
- `13965` `시선`
  - base: `구/문장/대화`, text count `28`
  - detail: `구`, text count `10`
- `14112` `실제로`
  - base: `구/문장/대화`, text count `9`
  - detail: `구`, text count `5`

### 3. Relation display-risk candidates exist at scale

- repeated related-surface candidate count: `544`
- representative samples:
  - `14005` `닷새` -> `닷샛날`
  - `14459` `법원` -> `재판소`
  - `15416` `물가` -> `가격`
- current repeated samples are not all homonym-number cases.
  - some are duplicate merge/display cases with `target_code "0"` or `null`
  - however they confirm that relation label/path compression can hide distinctions at scale

## Additional Isolation

- `build_kcenter_dataset.py` preserves dictionary/API examples and relations at unified-base layer.
  - `merge_examples()` is additive/unique-preserving
  - `merge_relations()` is additive/merge-preserving
- `package-live-payloads.mjs` does not create the first loss.
  - it chunks existing `APP_READY_DETAIL_MAP`
  - therefore `APP_READY_DETAIL_MAP` is already truncated before chunk packaging
- `example-chunk-sources.mjs` adds a second independent truncation.
  - TOPIK cap `4`
  - merged examples cap `8`

## PM Verdict

- `MM3-262B`:
  - `DONE`
- verdict:
  - example loss is a systemic runtime-detail generation issue, not a single-entry anomaly
- key conclusion:
  - fix priority should move to upstream detail-map generation path isolation before any piecemeal entry repair

## Next Step

- next active substep:
  - `MM3-262C` upstream detail-map generation path isolate
- immediate questions:
  - what process writes `APP_READY_DETAIL_MAP.json`
  - where are non-`구` examples filtered or omitted
  - whether current detail map is legacy/stale artifact or built by a hidden/older generator

## Revision History

- `R1` / `2026-03-27 12:05 KST` / `Codex PM` / batch candidate harvesting 수치와 representative samples를 고정
