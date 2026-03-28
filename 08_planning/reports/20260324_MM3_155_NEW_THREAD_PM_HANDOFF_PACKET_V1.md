# 20260324_MM3_155_NEW_THREAD_PM_HANDOFF_PACKET_V1

## Current Revision

- `R16`

## Last Updated

- `2026-03-25 17:05 KST`

## Last Updated By

- `Codex PM`

## 목적

- 새 스레드의 PM가 현재 상태를 빠르게 복원하고, 같은 운영 규칙으로 바로 이어서 작업할 수 있게 한다.

## Start Here

- `pm-operating-guide.md`
1. `08_planning/TASKLIST_V1.md`
2. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
3. `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
4. `08_planning/DOCUMENT_SYSTEM_POLICY_V1.md`
5. `08_planning/reports/20260324_MM3_138_PILOT_FEEDBACK_COVERAGE_AUDIT_V1.md`
6. `08_planning/reports/20260324_MM3_152_REMAINING_FEEDBACK_HOLDOUT_PRIORITIZATION_V1.md`
8. `08_planning/reports/20260324_MM3_153_NONE_UNCLASSIFIED_DEEP_SCENARIO_DECISION_V1.md`
9. `08_planning/reports/20260324_MM3_154_NONE_UNCLASSIFIED_DEEP_SCENARIO_PLAN_V1.md`
10. `08_planning/reports/20260324_MM3_156_NONE_UNCLASSIFIED_MINIMAL_UI_MAPPING_ACCEPTANCE_V1.md`
11. `08_planning/reports/20260324_MM3_157_EXPRESSION_SCENARIO_FOLLOWUP_PLAN_V1.md`
12. `08_planning/reports/20260324_MM3_158_EXPRESSION_SCENARIO_WORKFLOW_ACCEPTANCE_V1.md`
13. `08_planning/reports/20260324_MM3_159_MOTION_MINDMAP_RECHECK_NOTE_V1.md`
14. `08_planning/reports/20260324_MM3_160_TRANSLATION_RUNTIME_PAYLOAD_REPAIR_V1.md`
15. `08_planning/reports/20260324_MM3_161_EXAMPLE_SOURCE_ORDER_CLARIFICATION_FOLLOWUP_V1.md`
16. `08_planning/reports/20260324_MM3_163_MOTION_HUMAN_RECHECK_ACCEPTANCE_V1.md`
17. `08_planning/reports/20260324_MM3_164_GIT_VERCEL_PAYLOAD_PACKAGING_V1.md`
18. `08_planning/reports/20260324_MM3_165_REFRESHED_RUNTIME_HUMAN_PILOT_REOPEN_NOTE_V1.md`
19. `08_planning/reports/20260324_MM3_166_THIN_INDEX_GENERATOR_FOLLOWUP_DECISION_V1.md`
20. `08_planning/reports/20260325_MM3_175_REFRESHED_INTERNAL_PILOT_CHECKLIST_V1.md`
21. `08_planning/reports/20260325_MM3_176_REFRESHED_INTERNAL_HUMAN_PILOT_SESSION_PACKET_V1.md`
22. `08_planning/reports/20260325_MM3_177_REFRESHED_PILOT_FEEDBACK_INTAKE_PROTOCOL_V1.md`
23. `08_planning/reports/20260325_MM3_178_REFRESHED_HUMAN_PILOT_EXECUTION_HANDOFF_V1.md`
24. `08_planning/reports/20260325_MM3_179_REFRESHED_HUMAN_PILOT_EXECUTION_READINESS_V1.md`
25. `08_planning/reports/20260325_MM3_180_REFRESHED_HUMAN_PILOT_BUNDLE_ACCEPTANCE_V1.md`
26. `08_planning/reports/20260325_MM3_183_HUMAN_PILOT_LAUNCH_SHEET_V1.md`
27. `08_planning/reports/20260325_MM3_184_PLAYWRIGHT_PILOT_REHEARSAL_SUPPORT_V1.md`
28. `08_planning/reports/20260325_MM3_185_DETAIL_RELATION_EXPRESSION_FEEDBACK_IMPLEMENTATION_V1.md`
29. `08_planning/reports/20260325_MM3_186_SECOND_HUMAN_PILOT_FEEDBACK_SYNC_V1.md`
30. `08_planning/reports/20260325_MM3_187_SECOND_HUMAN_PILOT_UNIFIED_PIPELINE_V1.md`
31. `08_planning/reports/20260325_MM3_188_W1_REOPENED_REGRESSIONS_EXECUTION_NOTE_V1.md`
32. `08_planning/reports/20260325_MM3_189_W2_SURFACE_CONTRACT_STUDY_V1.md`
33. `08_planning/reports/20260325_MM3_190_W2_SURFACE_CONTRACT_EXECUTION_NOTE_V1.md`
34. `08_planning/reports/20260325_MM3_191_W2_EXPRESSION_META_EXAMPLE_HELPER_CLEANUP_V1.md`
35. `08_planning/reports/20260325_MM3_192_SECOND_PILOT_FEEDBACK_FULL_COVERAGE_REAUDIT_V1.md`
36. `08_planning/reports/20260325_MM3_193_W3_EXAMPLES_TAXONOMY_POLICY_BUNDLE_V1.md`
37. `08_planning/reports/20260325_MM3_194_EXAMPLE_SOURCE_FEASIBILITY_AND_UNCLASSIFIED_TERM_CLARIFICATION_V1.md`
38. `08_planning/reports/20260325_MM3_195_UI_TERM_CONSISTENCY_AND_EXAMPLE_CHUNK_BUILDER_IMPLEMENTATION_V1.md`
39. `08_planning/reports/20260325_MM3_196_SECOND_HUMAN_PILOT_FEEDBACK_PIPELINE_CLOSEOUT_V1.md`
40. `08_planning/reports/20260325_MM3_197_ACTUAL_IN_APP_GUIDE_V1.md`
41. `08_planning/reports/20260325_MM3_198_FEEDBACK_FULL_APPLY_RECHECK_V1.md`
42. `08_planning/reports/20260325_MM3_199_RENDER_SIDE_PERFORMANCE_QUICKWIN_V1.md`

## Current State

- phase: `M1 Runtime Wiring / Core Explorer`
- current gate:
  - overall: `PARTIAL_OPEN`
  - core explorer slice: `OPEN`
- runtime baseline:
  - raw feedback 큰 holdout 닫힘
  - translation runtime payload repair 반영
- runtime translation language set `11`까지 확장
- examples helper clarification 반영
- motion human re-check `문제 없음`
- `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build` packaging 체인 고정
- Playwright pilot rehearsal `3 passed`
- second pilot capture `pilot_session_02 / 사용자 / 사용자 / 2026-03-25 14:00-14:20 KST`
- `원어 정보` 제거, tab naming, expression repeated meta cleanup 반영
- examples helper density cleanup과 `TOPIK` source 우선 ordering guard 반영
- search ordering/helper, `기본 항목` label, fallback terminology/helper, preview-only expression messaging, `요리하다` duplicate related-form cleanup 반영
- current live runtime에는 `APP_READY_CHUNK_EXAMPLES_*` payload가 없다
- `MM3-193`에서 W3 policy lock 완료
- `MM3-194`에서 raw/internal `미분류`와 learner-facing `분류 밖 항목`이 같은 bucket이라는 점을 명시적으로 고정
- `MM3-195`에서 MM3-side example chunk builder 구현과 runtime chain 연동 완료
- `MM3-196`에서 second human pilot feedback pipeline closeout `ACCEPT`
- `MM3-197`에서 screenshot-inclusive actual in-app guide 작성 완료
- `MM3-198` recheck 기준 direct learner-facing feedback은 닫힘, residual은 performance만 남음
- `MM3-199`에서 selection redraw split, dense category expansion cap, tree build redundant normalize 제거, search index upfront normalize 제거 quick win 반영
- raw note/screenshot preserved and normalized sync completed
- primary SSOT:
  - `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- app runtime:
  - `09_app/public/data/live/`
  - deploy source: `09_app/public/data/internal/runtime_payloads/`

## What Is Done

- source review / validation / taxonomy discovery / scenario / IA / runtime contract까지 문서 기반으로 닫힘
- search + facet / tree shell / detail / expression 기본 wiring 완료
- pilot feedback 기준 주요 tranche 반영 완료:
  - runtime sync bug
  - detail IA redesign
  - filter role clarification
  - card learning policy
  - misclassified/none helper labeling
  - display-level dedup
  - explanation/copy clarification
  - cross-link surface policy
  - translation follow-up
  - relation disambiguation
  - none / unclassified deep scenario reframe
  - none / unclassified minimal UI mapping
  - expression scenario workflow refinement
  - translation runtime payload repair
  - examples helper clarification
  - motion human eye re-check acceptance
  - git / Vercel payload packaging
  - detail header / close / translation dedup
  - relation tab discoverability implementation
  - expression card copy / selected language implementation
  - pilot launch sheet / rehearsal support

## What Is Not Fully Done

- raw feedback 기준 큰 holdout은 모두 닫혔다.
- W2 surface contract cleanup은 닫혔다.
- W3 examples / taxonomy policy bundle은 닫혔다.
- example source restore feasibility / builder path는 닫혔다.
- current live runtime에는 `APP_READY_CHUNK_EXAMPLES_*` payload가 `107 files` 복구됐다.
- example source quality / TOPIK provenance decision도 닫혔다.
- final in-app guide 본문 작성도 닫혔다.
- 남은 active work는 render-side performance optimization이다.
- fallback surface 제거/독립 콘텐츠 분리는 아직 product/taxonomy decision으로 남아 있다.
- 현재 `분류 밖 항목`은 새 bucket이 아니라 raw `미분류` bucket의 learner-facing display name이다.
- 미완 구현은 아래다.
  - render-side 성능 최적화

## Current Active Work

- `MM3-187 Unified Second Human Pilot Residual Pipeline`

## Recommended Next Workflow

1. `MM3-171B`
- render-side performance optimization을 진행한다.

2. 실행 entrypoint
- `08_planning/reports/20260325_MM3_198_FEEDBACK_FULL_APPLY_RECHECK_V1.md`

3. 후속
- actual guide는 current artifact를 유지
- canonical thin-index generator recovery는 parked follow-up

## Reporting Rules For New PM

- 보고와 대화는 한국어, 짧고 팩트 중심
- reasoning은 문서에 남기고, 사용자 응답은 짧게 유지
- 상태 보고는 file list보다
  - 무엇을 닫았는지
  - 무엇이 남았는지
  - 다음 tranche가 무엇인지
  를 우선
- 보고서가 올라오면 링크만 던지지 말고 `한 줄 요약 + verdict + next`를 함께 말할 것

## Conversation Rules For New PM

- 사용자 승인 없이 진행 가능한 단계는 계속 진행
- 사용자 승인 필요 단계만 멈춤
- launch readiness보다 완성도 개선 우선
- raw feedback가 있으면 interpreted report보다 raw note 기준 coverage audit를 우선 신뢰
- display-level 문제와 payload-level 문제를 섞지 말 것

## Control Plane Rule

- handoff 이후에도 authoritative state는 아래만 신뢰
  - `08_planning/TASKLIST_V1.md`
  - `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
  - `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
  - `08_planning/PROJECT_DECISION_LOG_V1.md`

## Copy-Paste Prompt

- 새 스레드 PM는 아래 문서를 먼저 읽고 시작:
  - `pm-operating-guide.md`
  - `08_planning/reports/20260324_MM3_155_NEW_THREAD_PM_HANDOFF_PACKET_V1.md`
  - `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
- 현재 active work:
  - `MM3-187 Unified Second Human Pilot Residual Pipeline`
- current next step:
  - `MM3-171B Render-Side Performance Optimization`
- 운영 규칙:
  - 한국어
  - fact-first
  - 승인 불필요 단계는 계속 진행
  - raw feedback coverage audit 우선

## Revision History

- `R1` / `2026-03-24 16:05 KST` / `Codex PM` / 새 스레드 PM용 handoff packet을 최초 작성
- `R2` / `2026-03-24 17:05 KST` / `Codex PM` / MM3-156 반영 후 남은 holdout과 다음 active work를 갱신
- `R3` / `2026-03-24 17:00 KST` / `Codex PM` / MM3-158 반영 후 표현층 holdout을 닫고 남은 큰 holdout을 motion으로 갱신
- `R4` / `2026-03-24 23:38 KST` / `Codex PM` / MM3-160~166 기준으로 refreshed runtime, active work, next workflow를 현재 상태에 맞게 동기화
- `R5` / `2026-03-25 08:09 KST` / `Codex PM` / MM3-175~185와 실제 구현/리허설 결과를 반영해 current active step과 next workflow를 최신 상태로 동기화
- `R6` / `2026-03-25 08:20 KST` / `Codex PM` / workspace-local PM operating guide를 추가하고 README/document map/handoff entry에 연결
- `R7` / `2026-03-25 12:43 KST` / `Codex PM` / user 확정 기준으로 human pilot session slot actual value를 handoff state에 반영
- `R8` / `2026-03-25 12:47 KST` / `Codex PM` / participant/facilitator actual value와 session id를 반영해 scheduled execution pending 상태로 handoff를 갱신
- `R9` / `2026-03-25 15:20 KST` / `Codex PM` / second human pilot raw feedback preservation과 normalized sync 이후 current active work를 triage 단계로 갱신
- `R10` / `2026-03-25 15:34 KST` / `Codex PM` / unified second pilot residual pipeline 기준으로 current active work와 next workflow를 재동기화
- `R11` / `2026-03-25 15:44 KST` / `Codex PM` / W1A/W1B 실행 및 검증 후 next step을 `MM3-187E` decision pending으로 갱신
- `R12` / `2026-03-25 16:15 KST` / `Codex PM` / W1C root cause repair와 4-test regression 통과 후 next step을 `MM3-187F`로 갱신
- `R13` / `2026-03-25 16:27 KST` / `Codex PM` / 기존 PM 지침 본문을 제거하고 root `pm-operating-guide.md`를 단일 기본 지침으로 재설정
- `R14` / `2026-03-25 16:56 KST` / `Codex PM` / `MM3-191` 기준으로 W2 close, root PM guide 복구, next active step을 `MM3-187G`로 동기화
- `R15` / `2026-03-25 17:05 KST` / `Codex PM` / `MM3-192` 기준으로 full coverage re-audit 결과와 residual blocker를 handoff state에 반영
- `R16` / `2026-03-25 17:05 KST` / `Codex PM` / `MM3-193` 기준으로 W3 policy lock과 next step `MM3-187H`를 handoff state에 반영
- `R17` / `2026-03-25 17:39 KST` / `Codex PM` / `MM3-195` 기준으로 MM3-side example chunk builder 구현 완료와 next step `MM3-187I`를 handoff state에 반영
- `R18` / `2026-03-25 17:52 KST` / `Codex PM` / `MM3-196` 기준으로 second pilot feedback pipeline closeout과 next step `MM3-173E`를 handoff state에 반영
- `R19` / `2026-03-25 19:48 KST` / `Codex PM` / `MM3-197`, `MM3-198` 기준으로 actual guide 작성 완료와 next step `MM3-171B`를 handoff state에 반영
