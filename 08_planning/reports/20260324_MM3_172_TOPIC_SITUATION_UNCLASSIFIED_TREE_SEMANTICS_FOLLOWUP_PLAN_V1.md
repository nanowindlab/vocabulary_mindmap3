# 20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TREE_SEMANTICS_FOLLOWUP_PLAN_V1

## Current Revision

- `R3`

## Last Updated

- `2026-03-24 23:53 KST`

## Last Updated By

- `Codex PM`

## Scope

- `W1 Semantics Baseline`
- `MM3-172A Topic-Situation / Unclassified Tree Semantics Follow-up`

## Objective

- 추가 human feedback에서 남은 tree semantics residual을 한 번에 묶어, `주제 및 상황`, `미분류`, learner-facing terminology baseline을 다시 고정한다.
- downstream `detail / relation / expression` surface contract와 `인앱가이드`가 이 baseline 위에서만 움직이게 만든다.

## Why This Is First

- current feedback는 tree 자체보다 `tree가 무엇을 의미하는지`와 `tree에서 쓰는 용어가 맞는지`를 다시 묻고 있다.
- `역사 > 역사 > 시대적`처럼 duplicated parent가 남아 있으면 detail copy와 guide wording도 다시 흔들린다.
- `미분류`의 tangled 느낌이 실제 taxonomy 문제인지, ordering 문제인지, terminology 문제인지 먼저 분리하지 않으면 뒤 단계에서 잘못된 해결책으로 갈 위험이 있다.

## Inputs

- `08_planning/reports/20260324_MM3_167_ADDITIONAL_HUMAN_TEST_FEEDBACK_COVERAGE_CHECK_V1.md`
- `08_planning/reports/20260324_MM3_174_RESIDUAL_FEEDBACK_PIPELINE_PLAN_V1.md`
- `08_planning/reports/20260324_MM3_113_MISCLASSIFIED_NONE_SCENARIO_PLAN_V1.md`
- `08_planning/reports/20260324_MM3_116_MISCLASSIFIED_NONE_SCENARIO_ACCEPTANCE_V1.md`
- `08_planning/reports/20260324_MM3_154_NONE_UNCLASSIFIED_DEEP_SCENARIO_PLAN_V1.md`
- `08_planning/reports/20260324_MM3_156_NONE_UNCLASSIFIED_MINIMAL_UI_MAPPING_ACCEPTANCE_V1.md`
- screenshot:
  - `/Users/nanowind/Desktop/스크린샷 2026-03-24 오후 9.53.36.png`

## Current Residual Signal

- `주제 및 상황`
  - `역사 > 역사 > 시대적`처럼 대분류와 중분류 명칭이 겹쳐 보인다.
  - 중분류는 다단어와 연결되어 있지만, 대분류는 isolated node처럼 떠 보인다.
- `미분류`
  - mindmap에서 다대다로 얽혀 보인다.
  - learner 시점에서는 taxonomy라기보다 임시 묶음처럼 느껴질 수 있다.
  - ordering도 `난이도 > 품사`보다 `품사 > 난이도`가 더 직관적인지 재검토가 필요하다.
- 용어
  - `상황 미지정`, `일반 어휘`, `분류 밖 항목`, `문법/형태 항목`, `분류 미기재 어휘`가 현재 여러 문서에 흩어져 있다.
  - 이 용어들이 tree/search/detail/guide에서 동일하게 쓰일 baseline이 필요하다.

## W1 Workflow

### Workflow 1. Structure Pattern Split

#### Steps

1. duplicated parent 사례와 isolated parent 사례를 분리 수집한다.
2. `주제 및 상황`에서 구조 중복이 label 문제인지, node model 문제인지, display hierarchy 문제인지 나눈다.
3. `미분류`에서 tangled 느낌이 실제 연결 구조인지, grouping order 문제인지 나눈다.
4. 두 tree의 residual class를 하나로 합치지 않고 separate class set으로 남긴다.

### Workflow 2. Learner Meaning Contract

#### Steps

1. learner가 각 tree를 어떤 질문으로 읽는지 다시 적는다.
2. `주제 및 상황`은 scene-first tree인지, broad context tree인지 정의를 고정한다.
3. `미분류`는 taxonomy 축이 아니라 fallback 확인 surface라는 기존 원칙을 유지할지 재확인한다.
4. `주제 및 상황`용 learner meaning contract와 `미분류`용 learner meaning contract를 분리 출력한다.

### Workflow 3. Terminology Baseline

#### Steps

1. 현재 쓰는 learner-facing 용어를 모은다.
2. 중복/충돌 표현을 제거한다.
3. tree/search/detail이 같이 써야 할 baseline wording set을 정한다.
4. downstream `MM3-168`, `MM3-169`, `MM3-173`에서 그대로 쓰도록 contract를 적는다.
5. surface-by-surface wording map을 만든다.

### Workflow 4. Ordering / Display Decision Surface

#### Steps

1. `난이도 > 품사`와 `품사 > 난이도` 중 learner readability 기준 비교 포인트를 정의한다.
2. duplicated parent를 줄이는 display normalization 후보를 적는다.
3. payload re-bucketing 없이 해결 가능한 것과 아닌 것을 분리한다.
4. structure-only decision surface와 wording-only decision surface를 분리 기록한다.

## Deliverables

- `situation semantics note`
  - duplicated parent
  - isolated parent
  - learner meaning contract
- `unclassified semantics note`
  - tangled grouping
  - ordering candidate
  - learner meaning contract
- `residual class matrix`
  - structure issue
  - wording issue
  - display normalization issue
  - requires payload change / no payload change
- `surface-by-surface wording map`
  - tree
  - search
  - detail
  - mindmap/canvas
  - guide
- `ordering / display decision checklist`
- `downstream handoff bundle for MM3-168 / MM3-169 / MM3-173`

## Do Not

- 이번 단계에서 바로 payload 구조를 바꾸지 않는다.
- `미분류`를 독립 정식 taxonomy처럼 승격하지 않는다.
- tree label 하나만 바꿔서 전체 confusion이 해결된 것처럼 결론내리지 않는다.
- downstream surface contract보다 먼저 guide wording을 확정하지 않는다.

## Review Checkpoint `R1`

- review goal:
  - tree semantics와 terminology baseline이 충돌 없이 downstream 단계의 입력이 되는지 본다.
- review questions:
  1. `주제 및 상황`과 `미분류`를 다시 같은 문제로 뭉치고 있지 않은가
  2. label 문제와 structure 문제를 분리했는가
  3. `surface-by-surface wording map`이 존재하는가
  4. `structure-only fix`와 `wording-only fix`를 따로 판정했는가
  5. 기존 accepted helper terms와 충돌하지 않는가
  6. payload re-bucketing이 필요한 문제와 display normalization으로 닫히는 문제를 구분했는가

## Exit Criteria

- duplicated parent / isolated parent / tangled grouping을 각각 다른 residual class로 분리했다.
- `주제 및 상황`과 `미분류`의 learner 질문이 다른 문제라는 점이 다시 명확해졌다.
- downstream surface contract가 참조할 terminology baseline과 surface wording map이 정리됐다.
- `R1` review를 통과할 수 있는 수준의 W1 input contract가 준비됐다.

## Next Step

- `MM3-172B` pattern/evidence collection
- `MM3-172C` terminology baseline draft
- `MM3-172D` review checkpoint `R1`

## Revision History

- `R1` / `2026-03-24 23:53 KST` / `Codex PM` / W1 semantics baseline의 workflow, step, deliverable, review checkpoint를 최초 고정
- `R2` / `2026-03-24 23:53 KST` / `Codex PM` / review agent findings를 반영해 separate output, wording map, structure-vs-wording 분리 기준을 강화
- `R3` / `2026-03-24 23:53 KST` / `Codex PM` / review agent follow-up에 따라 `mindmap/canvas`를 공식 deliverable 표면에 추가
