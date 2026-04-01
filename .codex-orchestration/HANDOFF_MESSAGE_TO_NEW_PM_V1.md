# HANDOFF_MESSAGE_TO_NEW_PM_V1

```text
현재 handoff는 active lane 전용으로 읽는다.

Tier 1 먼저 읽기:
- shared-only boundary source:
  - /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/SHARED_CURRENT_STATE_V1.md
- active app-only source:
  - /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md

Tier 2 다음 읽기 (`09_app` only):
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_MM3_09_APP_HANDOFF_PACKET_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_TRANCHE5_EXECUTION_PACKET_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md

Tier 3 reference-only:
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md
  - boundary verification이 필요할 때만 읽는다.

Active lane:
- `09_app`

현재 기준:
- immediate blocker는 없다.
- continuation target은 `09_app git boundary cleanup`과 commit grouping decision이다.
- public `R2` runtime bundle은 `T2 + T3 + T4`까지 반영된 상태다.
- public manifest는 `version=v2`, `fileCount=233`, `generated_at=2026-04-01T01:03:51.183Z`다.
- canonical deploy-target restore path는 stable manifest -> hashed `remote_path` indirection이다.
- shared workspace 다른 project surface는 기본 reference-only다.

즉시 할 일:
- `09_app/**`와 current `09_app` control-plane docs만 계속 본다.
- performance optimization package는 closeout 상태로 본다.
- commit boundary는 runtime/perf core / bugfix+tests / carry-forward UI / docs로 나눠 판단한다.
- 필요하면 runtime/perf core와 bugfix/tests를 분리 commit 한다.
- shared docs는 boundary / deploy truth / handoff root가 바뀔 때만 건드린다.

Build policy:
- local development/testing은 local build / local server 기준이다.
- daily app build는 `R2 restore`만 사용한다.
- deploy-target build도 `R2 restore` 기준이다.
- `vocab_dictionary/`는 exceptional regeneration / repair일 때만 manual 사용이다.
- `R2` regeneration은 daily build가 아니라 separate manual process다.

Scope split:
- shared-only:
  - boundary, deploy truth, handoff root
- `09_app-only`:
  - runtime, search, list, mindmap, performance optimization closeout, translation payload split, search thin payload, first-screen shell payload, hashed manifest indirection
- default no-go:
  - `10_relation_app/**`
  - `10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md`
  - `03_PRD/`, `05_sources/`, `06_data/`, `07_runtime/`, `08_planning/`, `docs/`, `tmp_reports/`, `vocab_dictionary/`

Ownership rule:
- non-owner PM은 상대 lane을 read-only spot-check만 할 수 있다.
- owning app PM이 authoritative app-local state와 lane-level commit/push를 소유한다.
- `Main PM`이 shared current state와 handoff root를 소유한다.
- shared/control-plane doc-only push는 app-local runtime acceptance push와 별개다.
- `09_app PM`은 `git`을 `09_app/**`와 `09_app` lane docs 안에서만 쓴다.
- `10_relation_app PM`은 `git`을 `10_relation_app/**`와 `10_relation_app` lane docs 안에서만 쓴다.
- shared/root git action은 `Main PM` 소유다.

기본 비권장 읽기:
- non-active app local state document
- historical review / archive material

즉시 규칙:
- shared truth는 Tier 1 문서만 소유한다.
- active app current state는 Tier 2 문서가 소유한다.
- lane continuation detail은 lane-specific handoff packet이 필요할 때만 추가로 읽는다.
- inactive app는 reference-only로 취급한다.

Priority docs:
- `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
- `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_MM3_09_APP_HANDOFF_PACKET_V1.md`
- `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
- `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_TRANCHE5_EXECUTION_PACKET_V1.md`
- `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`
```
