# vocabulary_mindmap3

`09_app` is the only app included in the default GitHub -> Vercel build path.

Runtime bundle policy:
- Source code, config, restore scripts, and small metadata live in GitHub.
- Full `09_app` runtime bundle lives in Cloudflare R2 bucket `vocabulary-mindmap3-runtime`.
- `09_app` build attempts runtime restore from R2 before Vite build.
- If the public runtime gateway URL is not configured yet, build falls back to the local seed bundle.

`10_relation_app` is intentionally excluded from the default Vercel build scope.

## Current Entry Docs

- shared current state: [SHARED_CURRENT_STATE_V1.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/SHARED_CURRENT_STATE_V1.md)
- `09_app` local state `(active)`: [09_APP_ACTIVE_LOCAL_STATE_V1.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md)
- `10_relation_app` local state `(inactive reference)`: [10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md)
- handoff root `(active lane entry)`: [HANDOFF_MESSAGE_TO_NEW_PM_V1.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/HANDOFF_MESSAGE_TO_NEW_PM_V1.md)
- split baseline: [20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1.md)

## Read Order

1. Read shared current state first.
2. Read the active app local state next.
3. Read the split baseline only when checking ownership, handoff, or document rules.
