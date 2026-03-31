# SHARED_CURRENT_STATE_V1

## Current Revision

- `R3`

## Last Updated

- `2026-03-31 KST`

## Last Updated By

- `Codex PM`

## Role

- current workspace의 단일 shared control-plane current state surface
- project truth, cross-app policy, deploy boundary, handoff root를 소유
- app-local execution state는 소유하지 않음

## Parent Coordination

- `Parent coordination id`: `MM3-COORD-20260331A`

## Shared Truth

- default `GitHub -> Vercel` build target은 `09_app`
- current `Vercel` project는 `vocabulary-mindmap3`
- root build command는 `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`
- `09_app` runtime bundle 전체는 `Cloudflare R2` bucket `vocabulary-mindmap3-runtime`에 저장
- current public runtime gateway는 `https://mm3-runtime-gateway.nanowind.workers.dev`
- `10_relation_app`은 same workspace 안의 separate app lane이지만 current default auto-build scope에는 포함되지 않음

## Cross-App Policy

- shared는 `parent coordination id`만 소유
- `09_app`, `10_relation_app`은 각자 `local child task id`를 소유
- app-local 문서는 자기 앱 execution truth만 소유
- 서로의 app-local state는 수정하거나 소유하지 않음
- cross-app 영향이 생기면 shared surface에서만 조정

## Current Surfaces

- shared current state surface:
  - this document
- current app local surfaces:
  - `09_app` `(active)`: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
  - `10_relation_app` `(inactive reference)`: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md`
- split baseline:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1.md`
- handoff root:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/HANDOFF_MESSAGE_TO_NEW_PM_V1.md`

## Handoff Rule

- `Tier 1`: shared current state surface
- `Tier 2`: 해당 앱 local state surface
- `Tier 3`: on-demand reference only

## Current Note

- `09_app` local state surface는 current runtime/deploy lane 기준으로 열려 있다
- `10_relation_app` local state surface는 대칭 구조 anchor로 생성되었지만 현재는 placeholder baseline이다

## Active Lane Selection Rule

- handoff 시 Tier 2는 아래 중 active lane 하나만 선택한다
  - current active lane: `09_app`
  - inactive reference lane: `10_relation_app`
- `10_relation_app`이 actual active execution lane으로 전환되면 이 문서에서 active/inactive 라벨을 먼저 갱신한다

## Revision History

- `R3` / `2026-03-31 KST` / `Codex PM` / current app local surface에 active/inactive 라벨 추가 및 handoff용 active lane selection rule 명시
- `R2` / `2026-03-31 KST` / `Codex PM` / `10_relation_app` local state surface anchor 추가 및 current note 갱신
- `R1` / `2026-03-31 KST` / `Codex PM` / initial shared current state surface 생성
