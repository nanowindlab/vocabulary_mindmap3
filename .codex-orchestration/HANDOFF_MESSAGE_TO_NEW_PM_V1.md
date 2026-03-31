# HANDOFF_MESSAGE_TO_NEW_PM_V1

```text
현재 handoff는 active lane 전용으로 읽는다.

Tier 1 read first:
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/SHARED_CURRENT_STATE_V1.md

Tier 2 read next:
- read exactly one active app local state surface selected from Tier 1
- if active lane is `09_app`:
  - /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md
- if active lane is `10_relation_app`:
  - /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md

Tier 3 lane-specific handoff packet when present:
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1.md
- if active lane is `09_app`:
  - /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_MM3_09_APP_HANDOFF_PACKET_V1.md
- if active lane is `10_relation_app`:
  - lane-specific packet를 추가하면 그 문서를 읽는다

Active lane:
- current test handoff lane: `09_app`

Current blocker:
- none for runtime parity
- public `APP_READY_FACETS.json` restored to `entry_count=53012`
- remote restore build passed against current R2 bundle
- remaining open item is `09_app` git boundary cleanup

Immediate next action:
- split `09_app/package.json` commit candidate from mode-only and untracked changes
- decide whether `09_app/scripts/rebuild-canonical-facets.mjs` stays as lane-local repair script
- keep `10_relation_app` closed unless shared cross-app coordination actually reopens it

Build policy:
- daily app build uses `R2 restore` only
- `vocab_dictionary/` is manual-only for exceptional regeneration / repair
- `R2` regeneration runs as a separate manual process, not as daily build

Ownership rule:
- non-owner PM may spot-check the other lane read-only only
- owning app PM owns authoritative app-local state and lane-level commit/push
- `Main PM` owns shared current state and handoff root
- shared/control-plane doc-only push is separate from app-local runtime acceptance push
- `09_app PM` uses `git` only inside `09_app/**` and `09_app` lane docs
- `10_relation_app PM` uses `git` only inside `10_relation_app/**` and `10_relation_app` lane docs
- shared/root git action belongs to `Main PM`

Do not read by default:
- the non-active app local state document
- historical review/archive material

Immediate rule:
- shared truth는 Tier 1 문서만 소유
- active app current state는 Tier 2 문서가 소유
- lane continuation detail은 Tier 3 lane-specific handoff packet이 있을 때 그 문서를 추가로 읽는다
- inactive app는 reference-only로 취급
```
