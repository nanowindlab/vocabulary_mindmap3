# 20260327_MM3_263_SUBJECT_NONE_POLICY_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 15:40 KST`

## Last Updated By

- `Codex PM`

## Scope

- subject-none cohort policy implementation
- remove `주제 및 상황 범주 = 없음` from canonical learner-facing taxonomy/runtime

## Policy Lock

- `주제 및 상황 = 없음` + `의미 범주` 중복 `4,488`개:
  - `주제 및 상황`에서 제거
  - `의미 범주`에서만 사용
- `주제 및 상황 = 없음 only` `468`개:
  - canonical main set / live runtime search/tree/detail에서 제외
  - 추후 재검토 backlog로 분리

## Implemented

- added:
  - `vocab_dictionary/scripts/apply_subject_none_policy.py`
- updated:
  - `09_app/scripts/runtime-search-recovery-core.mjs`
  - `09_app/package.json`
  - `09_app/tests/residual.spec.js`

## Patched Artifacts

- canonical:
  - `vocab_dictionary/output/unified_live/kcenter_base.json`
  - `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
  - `vocab_dictionary/output/unified_live/kcenter_thin_index.json.gz`
  - `vocab_dictionary/output/unified_live/kcenter_facet_payload.json.gz`
- live runtime:
  - `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
  - `09_app/public/data/live/APP_READY_FACETS.json`
  - `09_app/public/data/live/APP_READY_MEANING_TREE.json`
  - `09_app/public/data/live/APP_READY_SITUATION_TREE.json`
  - `09_app/public/data/live/APP_READY_UNCLASSIFIED_TREE.json`
  - `09_app/public/data/live/APP_READY_DETAIL_MAP.json`

## Verified Results

- canonical base entry count:
  - `53,480 -> 53,012`
- runtime search row count:
  - `53,480 -> 53,012`
- runtime situation tree row count:
  - `11,355 -> 6,399`
- `연관(13974)`:
  - search/detail path -> `의미 범주 > 사회 생활 > 사회 활동`
- `시일(13971)`:
  - search/detail path -> `의미 범주 > 개념 > 시간`
- `실제로(14112)`:
  - live search result exact headword entry 제거
  - situation tree 제거

## Verification

- command:
  - `npm run package:live`
  - `npm run build`
  - `npx playwright test tests/residual.spec.js -g "요리하다 entry keeps relation disambiguation labels|situation repeated labels collapse to a cleaner learner-facing path|subject-none duplicates route through meaning and none-only entries disappear from search"`
- result:
  - `PASS`
  - `3 passed`

## Backlog

- `subject-none only 468` review list는 별도 재검토 대상으로 남긴다.
- current report:
  - `tmp_reports/subject_none_policy_report.json`

## PM Verdict

- `MM3-263`: `DONE`

## Revision History

- `R1` / `2026-03-27 15:40 KST` / `Codex PM` / subject-none cohort exclusion policy를 canonical/live runtime에 적용하고 verification까지 완료
