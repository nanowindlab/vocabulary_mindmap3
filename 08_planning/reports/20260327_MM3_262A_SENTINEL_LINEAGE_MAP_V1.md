# 20260327_MM3_262A_SENTINEL_LINEAGE_MAP_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 11:45 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-262A` first sentinel lineage map
- lock first field-loss matrix for `14112 실제로`

## Sentinel

- entry id: `14112`
- word: `실제로`
- reason:
  - user-reported concrete mismatch
  - `예문`과 `유의어`를 함께 가진 compact sentinel
  - `raw XML -> unified base -> runtime detail/rich/examples -> app projection` 전체를 짧게 추적할 수 있다

## Evidence Paths

- raw XML:
  - `vocab_dictionary/output/api_xml_live/view_14112.xml`
- unified base:
  - `vocab_dictionary/output/unified_live/kcenter_base.json`
  - `vocab_dictionary/output/unified_live/kcenter_base.seed.json`
- runtime:
  - `09_app/public/data/live/APP_READY_DETAIL_MAP.json`
  - `09_app/public/data/live/APP_READY_CHUNK_RICH_chunk-0001.json`
  - `09_app/public/data/live/APP_READY_CHUNK_EXAMPLES_chunk-0001.json`
- app projection:
  - `09_app/src/data/loaderAdapter.js`
  - `09_app/src/components/TermDetail.jsx`
  - `09_app/scripts/example-chunk-sources.mjs`
  - `09_app/scripts/package-live-payloads.mjs`

## Lineage Matrix

| Layer | Examples | Relations | Verdict |
| --- | --- | --- | --- |
| `raw XML` | `문장 2 + 대화 2 + 구 5` | `유의어 4`, homonym preserved | baseline |
| `kcenter_base.seed` | `구 5 + 문장 2 + 대화 1(texts 2)` | `유의어 4`, homonym preserved | `PASS` |
| `kcenter_base` | `구 5 + 문장 2 + 대화 1(texts 2)` | `유의어 4`, homonym preserved | `PASS` |
| `APP_READY_DETAIL_MAP` | `구 5` only | `유의어 4`, homonym preserved | `LAYER_LOSS` on examples |
| `APP_READY_CHUNK_RICH` | `구 5` only | `유의어 4`, homonym preserved | mirrors detail loss |
| `APP_READY_CHUNK_EXAMPLES` | `TOPIK 4 + 구 4` | n/a | `CAP_TRUNCATION` on merged examples |
| `app projection` | `currentSense.examples` from detail map + fallback `examples_bundle` max `8` | relation label uses `word` display only | `DISPLAY_LOSS` risk on homonym visibility |

## Verified Findings

- first failure layer for `문장/대화` examples is:
  - `unified base -> APP_READY_DETAIL_MAP`
- this is not a `raw XML` ingestion failure.
  - `kcenter_base.seed` already contains full dictionary examples and related terms.
  - `kcenter_base` after API merge also preserves them.
- runtime packaging is not the first loss source.
  - `package-live-payloads.mjs` chunks whatever is already inside `APP_READY_DETAIL_MAP`.
  - therefore `CHUNK_RICH` simply inherits the already-truncated detail data.
- example chunk has an additional independent truncation path.
  - `example-chunk-sources.mjs` limits TOPIK sentences to `4`
  - dictionary examples are collected up to `8`
  - merged output is capped again at total `8`
  - for `14112`, this yields `TOPIK 4 + 구 4`, dropping one dictionary `구`
- relation target data is preserved through runtime detail.
  - `실상 / 78662 / homonym 3`
  - `실제 / 14110 / homonym 2`
  - `실지 / 91957 / homonym 2`
  - `실지로 / 91958 / homonym 0`
- relation display still has a visibility gap.
  - `TermDetail.jsx` relation card title is `item.word || meta.word`
  - exact source-style homonym annotation such as `실상3`, `실제2`, `실지2` is not surfaced in the label
  - for some entries this can remain a harmless display simplification, but for repeated surface forms it can hide disambiguation information

## Failure Classification

- `F1` `LAYER_LOSS`
  - dictionary `문장/대화` examples disappear between `kcenter_base` and `APP_READY_DETAIL_MAP`
- `F2` `CAP_TRUNCATION`
  - `APP_READY_CHUNK_EXAMPLES` applies hard caps that can silently remove dictionary examples even after fallback merge
- `F3` `DISPLAY_LOSS`
  - relation homonym information survives in runtime data but is not surfaced in the primary relation label

## PM Verdict

- `MM3-262A`:
  - `DONE`
- verdict:
  - first sentinel lineage map is sufficient to proceed to batch expansion
- important conclusion:
  - current issue is not a single XML fetch miss.
  - at least two independent problems exist:
    - upstream runtime detail example loss
    - downstream example chunk truncation

## Next Step

- next active substep:
  - `MM3-262B` batch heuristic design + candidate harvesting
- immediate focus:
  - find more entries with `문장/대화/구` mixed examples and compare `kcenter_base` vs `APP_READY_DETAIL_MAP`
  - find repeated-surface relation entries where `homonym_no` matters in display
  - isolate the script or generation path that writes truncated `APP_READY_DETAIL_MAP`

## Revision History

- `R1` / `2026-03-27 11:45 KST` / `Codex PM` / `14112 실제로` 기준 first sentinel lineage map과 failure classification을 고정
