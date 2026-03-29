# 20260326_MM3_236_MM3_UI_REFINEMENT_ROADMAP_V1

## Current Revision

- `R6`

## Last Updated

- `2026-03-29 10:31 KST`

## Last Updated By

- `Codex PM`

## Scope

- keep `MM3 UI refinement roadmap` history
- append the current relation/expression integrated reinforcement follow-on roadmap to the same roadmap surface

## Roadmap Intent

- current learner-facing canonical surface를 source-faithful semantics 위에서 refinement한다.
- full redesign이 아니라 current surface의 hierarchy, copy, card grammar, guidance를 더 잘 읽히게 만드는 tranche다.

## Design Direction

- primary:
  - `Utility & Function`
- secondary:
  - `Warmth & Approachability`

## Non-Goals

- full visual redesign
- taxonomy 재설계
- source semantics 변경
- authoritative runtime boundary 확장

## Tranche Order

### `MM3-236B` Relation Tab Information Hierarchy

- status:
  - `DONE`
- scope:
  - `의미 관계어`
  - `관련형`
  - `교차 연결 장면`
- target:
  - relation tab hierarchy를 더 분명히 한다
  - source-faithful related-form rule을 learner-facing으로 더 잘 보이게 한다

### `MM3-236C` Detail Top-Of-Fold Density

- status:
  - `DONE`
- header / close / meta chip / helper density refinement
- initial implementation:
  - header definition preview
  - compact translation preview chip
  - text-only close chrome
  - compact meta chip spacing
  - compact context helper row

### `MM3-236D` Expression / Example Legibility

- status:
  - `DONE`
- expression card readability
- example metadata rhythm
- translation selector / representative translation readability polish

### `MM3-236E` Fallback Surface Guidance

- status:
  - `DONE`
- `상황 미지정` / `분류 밖 항목` helper wording
- onboarding / guide alignment

## Why `MM3-236B` First

- user가 relation 정보 위계 개선을 바로 다음 UI step으로 지목했다.
- current data semantics를 더 바꾸지 않고도 learner-facing clarity를 가장 빠르게 높일 수 있다.
- recently fixed related-form rule이 relation tab 안에서 직접 보이므로, information hierarchy refinement 효과가 가장 즉각적이다.

## Follow-On Roadmap After `MM3-236` Closeout

## Follow-On Intent

- current MM3 안에서 relation/expression integrated reinforcement를 이어간다.
- separate app split은 current stage에서 열지 않는다.
- relation은 compare utility로, expression은 idiom/proverb-first support layer로 먼저 강화한다.

## Phase Transition Note

- `09_app/` current app is now treated as `Phase 1` closed baseline.
- follow-on product direction moves to `Phase 2 separate relation explorer app`.

## Phase 2 Tranche Order

### `MM3-291` Relation Explorer IA Canonical

- status:
  - `PLANNED`
- target:
  - relation-first app IA와 study unit을 canonical로 고정

### `MM3-292` Relation Navigator Data Contract

- status:
  - `PLANNED`
- target:
  - shared DB 기준 relation navigator source contract를 고정

### `MM3-293` Workspace / Vercel Multi-Project Topology

- status:
  - `PLANNED`
- target:
  - same repo / separate app / separate deploy boundary를 고정

### `MM3-294` Relation Explorer App Shell Opening

- status:
  - `PLANNED`
- target:
  - `10_relation_app/` shell opening

## Follow-On Non-Goals

- separate app opening
- top-level expression product split
- current source-faithful relation rule 완화
- full writing/speaking coach immediate opening

## Follow-On Tranche Order

### `MM3-285` Relation Compare Contract

- status:
  - `DONE`
- target:
  - `의미 관계`를 quick compare surface로 재정의

### `MM3-286` Relation Compare Implementation And Validation

- status:
  - `DONE`
- target:
  - relation compare contract를 learner-facing surface로 반영하고 검증

### `MM3-287` Expression Idiom-Proverb Contract

- status:
  - `DONE`
- target:
  - `활용 표현`을 current data reality에 맞게 `관용구 / 속담` 중심으로 재정의

### `MM3-288` Expression Idiom-Proverb Implementation And Validation

- status:
  - `DONE`
- target:
  - preview-heavy expression layer를 support surface로 구현하고 검증

### `MM3-289` In-App Dedicated Route Readiness Gate

- status:
  - `DONE`
- target:
  - same-app dedicated route만 readiness gate로 평가

## Follow-On Workflow

### Workflow A. Relation-First Contract To Execution

1. `MM3-285`
2. `MM3-286`

### Workflow B. Expression Reframe To Execution

1. `MM3-287`
2. `MM3-288`

### Workflow C. Dedicated Route Readiness Gate

1. `MM3-289`

## Workset Anchor

- current execution workset은 [WORK_ORCHESTRATION_HUB_V1.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md) `Planned Workset` section을 기준으로 본다.

## PM Verdict

- `DONE`
- `FOLLOW_ON_ROADMAP_UPDATED`

## Next Active Work

- `MM3-291 Relation Explorer IA Canonical`

## Revision History

- `R1` / `2026-03-26 16:00 KST` / `Codex PM` / MM3 UI refinement roadmap를 최초 개설하고 first slice를 relation hierarchy로 고정
- `R2` / `2026-03-26 22:07 KST` / `Codex PM` / `MM3-236B`를 close하고 `MM3-236C`를 current slice로 올림
- `R3` / `2026-03-26 22:14 KST` / `Codex PM` / `MM3-236C`를 close하고 `MM3-236D`를 current slice로 올림
- `R4` / `2026-03-26 22:44 KST` / `Codex PM` / `MM3-236D`를 close하고 `MM3-236E`를 current slice로 올림
- `R5` / `2026-03-26 22:50 KST` / `Codex PM` / `MM3-236E`를 close하고 roadmap 전체를 closeout함
- `R6` / `2026-03-29 10:31 KST` / `Codex PM` / `MM3-284` 결과를 반영해 relation/expression integrated reinforcement follow-on roadmap을 같은 roadmap surface에 추가
- `R7` / `2026-03-29 10:47 KST` / `Codex PM` / `MM3-285`, `MM3-286` relation-first tranche를 같은 turn에 closeout하고 next active work를 `MM3-287`로 갱신
- `R8` / `2026-03-29 11:10 KST` / `Codex PM` / `MM3-287`, `MM3-288` expression tranche를 같은 turn에 closeout하고 next active work를 `MM3-289`로 갱신
- `R9` / `2026-03-29 11:15 KST` / `Codex PM` / `MM3-289` dedicated route readiness gate를 closeout하고 follow-on workflow를 current directive 기준으로 모두 닫음
- `R10` / `2026-03-29 12:40 KST` / `Codex PM` / phase1 closeout과 phase2 separate relation explorer opening을 roadmap에 반영
