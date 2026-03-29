# RELATION_EXPLORER_APP_FOUNDATION_V1

## Role

- `어휘 마인드맵` Phase 1 closeout 이후, separate `관계 탐색 앱` Phase 2 kickoff용 foundation 문서다.
- same workspace / same repo 안에서 separate app을 시작할 수 있는지, 어떻게 하면 drift 없이 운영할지, relation-first app을 어떤 방향으로 설계할지 기록한다.

## Current Position

- `어휘 마인드맵` current app (`09_app/`)은 `Phase 1` closeout 대상으로 본다.
- Phase 1 결과물은 frozen baseline으로 유지한다.
- 다음 확장은 current app 안의 보조 탭 강화가 아니라, separate `관계 탐색 앱`을 `Phase 2`로 여는 방향으로 전환한다.

## Feasibility

### Same Workspace / Same Repo

- 가능하다.
- 현재 workspace는 already monorepo-like structure를 갖고 있다.
- separate relation app은 같은 repo 안에 new app directory를 추가하는 방식이 가장 현실적이다.

### Recommended Directory Shape

- current:
  - `09_app/` = Phase 1 vocabulary mindmap app
- new:
  - `10_relation_app/` = Phase 2 relation explorer app

### Why Same Workspace Works

- same dictionary SSOT를 그대로 공유할 수 있다.
- 기존 validation artifact와 reference packet을 같이 볼 수 있다.
- branch / commit / review / handoff surface를 하나의 repo에서 유지할 수 있다.

## Git / Build / Deploy Guideline

### Git

- same Git repository 유지
- Phase 1 app and Phase 2 app are separate directories
- changes must not silently rewrite both apps unless the task explicitly asks for shared changes

### Local Dev / Build

- recommended command shape:
  - `npm --prefix 09_app run dev`
  - `npm --prefix 10_relation_app run dev`
  - `npm --prefix 09_app run build`
  - `npm --prefix 10_relation_app run build`
- same workspace에서 two apps를 separately run/build 가능하다.

### Vercel

- feasible model:
  - one repository
  - multiple Vercel projects
  - each project points to a different app directory
- official basis:
  - Vercel supports multiple projects connected to the same repository, which is useful for monorepos
  - project-level Root Directory / build settings should separate `09_app` and `10_relation_app`
- safe operating rule:
  - do not let two apps share one implicit repo-root build assumption
  - current root `vercel.json` is tied to `09_app`
  - Phase 2 should use separate project settings or later refactor deployment config so `10_relation_app` has its own explicit build/output boundary

## Guardrails

### Shared Data Guardrail

- dictionary SSOT remains:
  - `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
  - `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`
- relation app must treat these as read-only source inputs.
- separate app must not fork or manually rewrite lexical truth.

### App Boundary Guardrail

- `09_app/` is Phase 1 frozen baseline.
- `10_relation_app/` is Phase 2 working area.
- no silent cross-app UI edits.
- shared helper extraction is allowed only when the task explicitly covers both apps.

### Build Boundary Guardrail

- each app has its own:
  - `package.json`
  - `src/`
  - `public/`
  - `dist/`
- do not rely on one app's build output as another app's runtime dependency without an explicit contract.

### Deployment Guardrail

- Phase 1 app deploy path stays stable unless user explicitly reopens it.
- Phase 2 app deploy path must be isolated by project settings.
- separate domains/subdomains are recommended.

## Brainstorm

## Core Product Difference

- Phase 1 `어휘 마인드맵`:
  - word-first
  - meaning / situation browse
  - detail-driven relation expansion
- Phase 2 `관계 탐색 앱`:
  - relation-first
  - compare / pair / relation-cluster study
  - optional jump to word detail only when needed

## First-Layer Idea

- `관계 탐색`
- inside it, learners do not search one word first.
- they choose a relation family first:
  - `비슷한말`
  - `반대말`
  - `참고어`
  - `높임말/낮춤말`
  - `큰말/작은말`
  - `준말/본말`
  - `파생어/관련형`

## Navigation Shape

### Suggested Flow

1. relation family 선택
2. relation-first tree / navigator 진입
3. sub-group 선택
4. pair / cluster card 목록
5. compare study view
6. optional jump to source word detail

### Example

- `비슷한말`
  - `감정, 상태, 일상 행위, 움직임` 같은 relation-friendly sub-group
  - card:
    - `기쁘다 · 즐겁다 · 행복하다`
    - 차이 한 줄
    - 예문 1개
- `높임말`
  - card:
    - `먹다 ↔ 드시다`
    - 누가 누구에게 쓰는지
    - 짧은 예문
- `파생어`
  - 중심 단어와 파생 계열을 cluster로 보여 줌

## Mindmap Connection

- basic result view should not start from a huge mindmap
- default should be cards / compare view
- `관계도 보기` as secondary mode is better
- relation mindmap can use:
  - center: relation family or relation cluster
  - ring 1: compared words
  - ring 2: adjacent relation variants

## Why Separate App Is Better

- no need to distort current `word-first` MM3 IA
- relation-first learning can become the primary navigation rule
- top-level layers, compare cards, pair study, relation maps can be optimized for study rather than dictionary lookup

## Phase 2 Immediate Questions

1. relation explorer default landing:
   - family grid vs navigator tree
2. study unit:
   - word pair vs relation cluster
3. compare view:
   - 2-column vs 3-column vs card carousel
4. MM3 link-back rule:
   - separate detail page vs open current app detail

## Official Reference

- Vercel Projects overview:
  - [https://vercel.com/docs/projects/](https://vercel.com/docs/projects/)

