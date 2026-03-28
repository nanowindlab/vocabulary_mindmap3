# 20260325_MM3_194_EXAMPLE_SOURCE_FEASIBILITY_AND_UNCLASSIFIED_TERM_CLARIFICATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 17:14 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-187H` example source restore feasibility and `미분류` / `분류 밖 항목` terminology clarification

## Inputs

- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- `09_app/src/App.jsx`
- `09_app/src/utils/hierarchyDisplay.js`
- `09_app/scripts/package-live-payloads.mjs`
- `09_app/scripts/prepare-live-payloads.mjs`
- `09_app/scripts/verify-runtime-payloads.mjs`
- `08_planning/reports/20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TERMINOLOGY_BASELINE_DRAFT_V1.md`
- `08_planning/reports/20260325_MM3_193_W3_EXAMPLES_TAXONOMY_POLICY_BUNDLE_V1.md`

## Evidence

### 1. Raw/runtime term

- sample runtime item:
  - `APP_READY_SEARCH_INDEX.json`
  - entry id `41693`
- raw hierarchy:
  - `root: 미분류`
  - `scene: 미분류`
  - `category: 미분류`
  - `path_ko: 미분류 > 미분류`

### 2. Learner-facing term mapping

- `09_app/src/utils/hierarchyDisplay.js`
  - raw/internal marker가 `미분류`이면 learner-facing `displayRootLabel`은 `분류 밖 항목`으로 바꾼다.
- `09_app/src/App.jsx`
  - unclassified tab label은 `분류 밖 항목`이다.
  - tree label formatter도 root를 `분류 밖 항목`으로 바꾼다.

### 3. Count alignment

- current live search index에서 raw `미분류` bucket count:
  - `8,506`
- 이는 `MM3-193`의 `분류 밖 항목` 유지 판단과 같은 cohort다.

### 4. Example-source builder path

- `09_app/scripts/package-live-payloads.mjs`
  - package 대상은 `APP_READY_SEARCH_INDEX`, `MEANING_TREE`, `SITUATION_TREE`, `UNCLASSIFIED_TREE`, `FACETS`, `CHUNK_MANIFEST`, `CHUNK_RICH_*`만 포함한다.
- `09_app/scripts/prepare-live-payloads.mjs`
  - restore 대상도 `CHUNK_RICH_*`만 포함한다.
- `09_app/scripts/verify-runtime-payloads.mjs`
  - verify 대상도 `CHUNK_RICH_*`만 포함한다.
- current MM3 repo scripts:
  - `build_kcenter_dataset.py`
  - `link_vm2_topik_stats.py`
  - `repair_runtime_translation_payloads.py`
- current MM3 repo 안에는 `APP_READY_CHUNK_EXAMPLES_*`를 생성하거나 package/verify하는 dedicated path가 없다.

## Clarification Verdict

### `미분류`와 `분류 밖 항목`은 같은가?

- verdict:
  - `같은 underlying bucket이다.`

### 정확히 어떻게 같은가?

- `미분류`
  - raw/internal/payload 용어다.
- `분류 밖 항목`
  - learner-facing display 용어다.
- 즉:
  - raw source에서는 `미분류`
  - UI에서는 그 same bucket을 `분류 밖 항목`으로 보여 준다.

### 무엇이 아닌가?

- 서로 다른 두 taxonomy bucket이 아니다.
- `분류 밖 항목`이 새로 추가된 별도 data root도 아니다.

## PM Interpretation

- 사용자가 `분류 밖 항목을 유지한다`고 들었을 때 헷갈릴 수 있었던 이유는 맞다.
- 현재 문장만 보면 새 bucket을 유지하는 것처럼 읽히지만, 실제 의미는:
  - raw `미분류` bucket을 learner-facing 이름 `분류 밖 항목`으로 계속 노출한다
  - 는 뜻이다.

## Example Source Feasibility Verdict

- `APP_READY_CHUNK_EXAMPLES_*` restore는 현재 repo 안에서 즉시 실행 가능한 기존 builder path가 없다.
- 따라서 source restore는 아래 둘 중 하나가 필요하다.
  - new MM3-side builder path 추가
  - source boundary 변경 승인

## PM Verdict

- `TERM_MAPPING_CONFIRMED`
- `EXAMPLE_SOURCE_BUILDER_MISSING`

## Next Action

- `MM3-187H`는 `example source restore decision` 단계로 유지한다.

## Revision History

- `R1` / `2026-03-25 17:14 KST` / `Codex PM` / raw `미분류`와 learner-facing `분류 밖 항목`의 관계, example-source builder 부재를 evidence 기준으로 고정
