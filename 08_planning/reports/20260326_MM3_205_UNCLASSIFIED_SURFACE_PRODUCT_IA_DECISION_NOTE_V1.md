# 20260326_MM3_205_UNCLASSIFIED_SURFACE_PRODUCT_IA_DECISION_NOTE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 00:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-205A` unclassified surface product / IA decision note

## Inputs

- `08_planning/reports/20260326_MM3_201_POST_CLOSEOUT_FEEDBACK_COVERAGE_CHECK_V1.md`
- `08_planning/reports/20260325_MM3_193_W3_EXAMPLES_TAXONOMY_POLICY_BUNDLE_V1.md`
- `08_planning/reports/20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TREE_SEMANTICS_EVIDENCE_NOTE_V1.md`
- `09_app/src/App.jsx`
- `09_app/src/components/TermDetail.jsx`

## Decision

- `분류 밖 항목`은 현재 `main app 안에 유지`한다.
- separate app split은 `not now`로 둔다.
- main app 안에 유지하는 한, 다음 IA implementation tranche의 우선 추천 순서는 `품사 -> 학습난이도`다.

## Why

### 1. current role is still fallback interpretation surface

- `분류 밖 항목`은 raw/internal `미분류` bucket의 learner-facing display name이며,
- search/detail/mindmap을 가로지르는 fallback interpretation surface 역할을 이미 가지고 있다.
- 지금 separate app으로 떼면 learner flow가 오히려 끊긴다.

### 2. browse discriminator는 `품사`가 더 강하다

- `학습난이도`는 이미 filter로 병행 제어할 수 있다.
- learner가 `분류 밖 항목`에 들어왔을 때 먼저 이해하고 싶은 것은 문법 기능/품사 축인 경우가 많다.
- 따라서 top-level browse order는 `품사 -> 학습난이도`가 더 자연스럽다.

### 3. current change should stop at decision, not implementation

- 현재 active primary work는 여전히 `MM3-171B`다.
- unclassified reorder는 IA-level change라 decision과 implementation을 분리하는 편이 맞다.

## What This Means

- separate app split은 current control-plane에서 `defer`다.
- unclassified surface는 계속 main explorer 안에 유지한다.
- future implementation tranche가 열리면 browse order reorder만 별도 적용하면 된다.

## PM Verdict

- `DECISION_FIXED`

## Next Step

- implementation은 별도 tranche로 분리한다.

## Revision History

- `R1` / `2026-03-26 00:42 KST` / `Codex PM` / unclassified surface를 main app에 유지하고 future IA reorder 방향을 `품사 -> 학습난이도`로 고정
