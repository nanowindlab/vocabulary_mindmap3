# 20260329_MM3_293_WORKSPACE_VERCEL_MULTI_PROJECT_TOPOLOGY_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 21:50 KST`

## Last Updated By

- `Codex PM`

## Scope

- same workspace / same repo 기반 separate relation app topology를 닫는다.
- local run/build boundary와 Vercel multi-project boundary를 current repo reality 기준으로 고정한다.

## Inputs

- `08_planning/RELATION_EXPLORER_APP_FOUNDATION_V1.md`
- `vercel.json`
- `09_app/package.json`
- `08_planning/reports/20260329_MM3_292_RELATION_NAVIGATOR_DATA_CONTRACT_V1.md`

## Planning

- current repo는 `09_app` production boundary를 already 가진다.
- Phase 2는 `10_relation_app`를 same repo 안에서 separate app directory로 연다.
- deploy도 one repo / multiple projects model로 분리한다.

## Validation

- current root `vercel.json` 확인 결과:
  - `installCommand = npm --prefix 09_app install`
  - `buildCommand = npm --prefix 09_app run build`
  - `outputDirectory = 09_app/dist`
- therefore current repo-root deploy assumption은 `09_app`에 묶여 있다.
- foundation doc 기준 local run/build pattern도 app별 prefix separation을 전제로 한다.

## 3인의 전문가 검토

### Expert 1. Deploy Ops Lens

- strong point:
  - separate Vercel project per app이 맞다.
- critique:
  - repo-root single build assumption을 두 app이 공유하면 drift가 생긴다.
- required improvement:
  - Phase 1 root boundary는 유지
  - Phase 2는 project-level root directory로 분리

### Expert 2. Repo Hygiene Lens

- strong point:
  - same repo 유지가 SSOT/handoff/review trace에 유리하다.
- critique:
  - shell opening 전에 shared helper extraction을 서두르면 cross-app churn이 커질 수 있다.
- required improvement:
  - `09_app` frozen baseline 유지
  - `10_relation_app` write boundary 명시

### Expert 3. Product Rollout Lens

- strong point:
  - shell first, deploy second 순서가 안전하다.
- critique:
  - app이 아직 없는데 deploy config를 먼저 뒤집으면 unnecessary instability가 생긴다.
- required improvement:
  - `MM3-294` shell opening 후 Phase 2 project attach
  - until then, root config는 `09_app` 기준 유지

## Improvement

### Canonical Topology

- repository:
  - one repo
- app directories:
  - `09_app/` = Phase 1 frozen baseline
  - `10_relation_app/` = Phase 2 working area
- local commands:
  - `npm --prefix 09_app run dev`
  - `npm --prefix 10_relation_app run dev`
  - `npm --prefix 09_app run build`
  - `npm --prefix 10_relation_app run build`
- Vercel:
  - separate project for `09_app`
  - separate project for `10_relation_app`
  - project-level root directory separation

### Boundary Rule

- current root `vercel.json` stays Phase 1 boundary until `10_relation_app` shell exists.
- do not force one repo-root implicit build assumption across both apps.
- shared SSOT is allowed.
- silent cross-app UI/code edits are not allowed.

## Revalidation

- same repo / separate app / separate Vercel project rule is coherent with current root config.
- no extra deploy blocker exists for `MM3-294` shell opening.
- next step can move to `10_relation_app/` write boundary only.

## Exit Condition

- app directory boundary fixed
- local run/build boundary fixed
- Vercel multi-project rule fixed
- root config freeze-until-shell rule fixed

## PM Verdict

- `ACCEPT`
- `TOPOLOGY_LOCKED`
- `MM3-293_DONE`
- `BUNDLED_WITH_MM3-292`

## Revision History

- `R1` / `2026-03-29 21:50 KST` / `Codex PM` / planning, validation, 3-expert review, improvement, revalidation을 거쳐 same repo / separate app / separate Vercel project topology를 고정
