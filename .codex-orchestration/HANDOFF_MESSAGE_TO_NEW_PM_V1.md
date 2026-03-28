# HANDOFF_MESSAGE_TO_NEW_PM_V1

아래를 새 스레드 첫 메시지로 사용:

```text
Use the current control-plane docs as source of truth.

Source of truth:
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/TASKLIST_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/ORCHESTRATION_DASHBOARD.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260329_MM3_277_BOUNDARY_CLEANUP_CLOSEOUT_V1.md

Active work:
- pipeline: M1 Runtime Wiring / Core Explorer
- workflow: none
- step: waiting for next directive
- task id: none

What is already done:
- latest closeout package is MM3-279
- deployment preflight check set completed
- there is no current runtime or product blocker
- source-ambiguous related forms are closed as text-only because SSOT source has no target
- unclassified entries are no longer exposed as a permanent nav tab, but remain searchable
- current deploy boundary can be rebuilt from canonical source with `npm run rebuild:canonical-runtime`, but that path is explicit/manual only
- canonical chunk-id mapping is now source-backed
- integrated review V4 is registered
- valid remediation order is locked as MM3-273 -> MM3-274 -> MM3-275 -> MM3-276 -> MM3-277
- default build path now guarantees canonical mapping availability
- release/build path now runs canonical rebuild provenance first
- chunk manifest and examples now use the same chunk membership source
- current boundary chunk contract validation and node contract tests are now in place
- app runtime and canonical rebuild now share the same projection module
- current boundary source artifact ownership is explicitly documented
- filter panel now uses `TOPIK빈도` and the order `난이도 -> 품사 -> TOPIK빈도 -> 번역 언어`
- default deploy path now uses committed `runtime_payloads` again

Current blocker or mismatch:
- no blocker
- no active execution package is open

Exit condition:
- open a new task id only when the next directive is actually given

Read first:
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/TASKLIST_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/ORCHESTRATION_DASHBOARD.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260329_MM3_272_INTEGRATED_REVIEW_REGISTRATION_AND_VALID_REMEDIATION_PLAN_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260329_MM3_273_BUILD_GRAPH_CLOSURE_CLOSEOUT_V1.md

Immediate next action:
- hold this state until the next active work is opened
- if a new directive arrives, open a new task id instead of reusing MM3-278

Constraints:
- do not change the active task id unless control-plane truth changes
- do not reopen MM3-266F unless a new blocker appears
- keep replies concise and fact-only unless the user asks for depth
```
