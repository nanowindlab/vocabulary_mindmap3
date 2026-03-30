# HANDOFF_MESSAGE_TO_NEW_PM_V1

아래를 새 스레드 첫 메시지로 사용:

```text
이 프로젝트는 `pm-operating-guide.md`와 `$pm-operating-orchestrator` 기준으로 진행한다.
먼저 읽고 active `pipeline/workflow/step`과 `exit condition`을 정한 뒤 그 기준대로 실행한다.

Source of truth:
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/TASKLIST_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/ORCHESTRATION_DASHBOARD.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_303_RELATION_EXPLORER_LEARNER_MODE_IMPLEMENTATION_PLAN_V1.md

Active package:
- pipeline: `Phase 2 Relation Explorer App Planning`
- workflow: `Deploy Chain Change / Storage Cleanup`
- step: `build-chain implementation and waste cleanup`
- task id: `MM3-307`
- latest closeout: `MM3-305 Relation Family Top Nav And Bucket Left Rail Relayout`

이번 handoff 기준 핵심 사실:
- `09_app/`은 `Phase 1` frozen baseline이다.
- `10_relation_app/`은 separate relation explorer app shell이다.
- topology는 `same repo / separate app / separate Vercel project`다.
- current `Vercel` linked project는 main push마다 auto production deployment를 생성한다.
- current build input은 `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build` 체인이다.
- recent production deployment `864e954`는 `READY`였고 clone completed는 `56.095s`였다.
- current `09_app/dist/data`에는 `live 1269.00 MB`와 `internal/runtime_payloads 151.28 MB`가 함께 들어가 duplicate deploy cost가 있다.
- current git tracked pack size는 `997.51 MiB`다.
- mixed split (`100MB 초과 파일만 R2`)은 insufficient verdict다.
- safe cutover unit은 `full build-side runtime bundle`이다.
- actual blocker는 `Cloudflare R2 not enabled`다.
- evidence는 `wrangler r2 bucket list -> Please enable R2 through the Cloudflare Dashboard. [code: 10042]`다.
- current implementation task는 `R2`-ready build chain 추가, deploy duplicate 제거, tracked waste cleanup까지 직접 진행하는 것이다.
- `MM3-307` local 결과로 `dist/data/internal/runtime_payloads` duplicate는 제거됐고 shipped `dist/data/live`는 `861.42 MB`로 줄었다.
- `MM3-307`에서 `10_relation_app/node_modules`, `10_relation_app/dist`, `tmp_reports/authoritative_runtime_rollbacks`는 git index에서 제거했다.
- relation bootstrap과 family JSON이 생성되어 있다.
- `10_relation_app` build는 통과했다.
- compare/detail/mindmap interaction이 연결되어 있다.
- route hash state와 top filter carryover가 반영되어 있다.
- 번역 언어 filter는 source 지원 언어 전체를 노출하고 default는 `영어`다.
- `TOPIK 빈도` filter는 `1~5`와 `전체`를 노출한다.
- current live/base entry count는 `53,012`이고 historical `api_xml_merged` total은 `53,480`이다.
- current learner-mode redesign verdict는 `PARTIAL_ACCEPT`다.
- `MM3-303A` shell simplification은 완료됐고 `npm run build`를 통과했다.
- `MM3-303B` layer compression은 완료됐고 `npm run build`를 통과했다.
- `MM3-303C` compare/detail learner copy reframe은 완료됐고 `npm run build`를 통과했다.
- `MM3-303D` type scale and responsive layout pass는 완료됐고 `npm run build`를 통과했다.
- `MM3-303E` PM validation verdict는 `PARTIAL_ACCEPT`다.
- `MM3-304` family badge readability fix는 완료됐고 `npm run build`를 통과했다.
- `MM3-305` family top nav / bucket left rail relayout은 완료됐고 `npm run build`를 통과했다.
- subgroup chip density와 browser visual gut-check는 residual risk로 남아 있다.
- active preview는 없다. 필요하면 next PM이 다시 띄워야 한다.

Blocker:
- `Cloudflare R2`가 current account에서 아직 enable되지 않았다.

Exit condition:
- `Cloudflare R2 enablement` 후 actual bucket create / upload / clean regeneration execution을 여는 것이다.

Read first:
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/TASKLIST_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/ORCHESTRATION_DASHBOARD.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_306_GITHUB_VERCEL_R2_CUTOVER_REVIEW_AND_BLOCKER_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_307_R2_READY_DEPLOY_CHAIN_AND_STORAGE_CLEANUP_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_305_RELATION_FAMILY_TOP_NAV_AND_BUCKET_LEFT_RAIL_RELAYOUT_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_303E_LEARNER_MODE_VALIDATION_AND_ACCEPTANCE_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_303_RELATION_EXPLORER_LEARNER_MODE_IMPLEMENTATION_PLAN_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_303C_COMPARE_AND_DETAIL_LEARNER_COPY_REFRAME_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_303B_RELATION_LAYER_COMPRESSION_AND_DISCLOSURE_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_303A_RELATION_ENTRY_AND_SHELL_SIMPLIFICATION_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260330_MM3_302_RELATION_EXPLORER_LEARNER_JOURNEY_DEEP_RESEARCH_AND_UX_REVIEW_V1.md
- /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/RELATION_EXPLORER_APP_FOUNDATION_V1.md

Immediate next action:
- `Cloudflare Dashboard`에서 `R2`를 enable한 뒤 `vocabulary-mindmap3-runtime` bucket create를 다시 시도한다.

Constraints:
- control-plane truth가 바뀌기 전에는 active `task id`를 바꾸지 않는다.
- `09_app/`은 frozen Phase 1 baseline으로 유지한다.
- 보고와 응답은 간결한 fact 위주로 유지한다.
```
