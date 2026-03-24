# PROJECT_DOCUMENT_MAP

## 1. Control Plane

- `README.md`: 프로젝트 진입점
- `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`: 현재 milestone, active work, risks
- `.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`: 읽기 순서와 실행 가드레일
- `.codex-orchestration/PM_OPERATING_MODEL_V1.md`: Main PM 운영 규칙
- `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`: 다음 PM handoff
- `.codex-orchestration/PM_REVIEW_QUEUE_V1.md`: PM review verdict queue

## 2. Planning SSOT

- `08_planning/README.md`: planning zone entry
- `08_planning/TASKLIST_V1.md`: authoritative todo / completion state
- `08_planning/DOCUMENT_SYSTEM_POLICY_V1.md`: 문서 권한/동기화 규칙
- `08_planning/DATA_ARCHITECTURE_V1.md`: 데이터 계층과 runtime projection 설계
- `08_planning/PRODUCT_SCENARIO_SPEC_V1.md`: learner-facing usage scenario와 UX 수정 방향
- `08_planning/PROJECT_DECISION_LOG_V1.md`: durable policy / architecture decision log

## 3. Dictionary Source

- `vocab_dictionary/한국어 기초사전_통합스키마_v2.md`: unified schema
- `vocab_dictionary/krdict_final_summary.md`: source summary
- `vocab_dictionary/`: read-only source zone for current PM phase

## 4. Frontend Runtime

- `09_app/`: active implementation surface
- `09_app/public/data/live/`: current app runtime payload
- `09_app/tests/smoke.spec.js`: current browser smoke baseline

## 5. Reports

- `08_planning/reports/`: PM 단독 보고서, acceptance, decision, policy 문서
- `.codex-orchestration/reports/`: agent working report, 초안, 검토, 검증 결과
- `08_planning/reports/20260323_MM3_002_SOURCE_REVIEW_ACCEPTANCE_V1.md`: PM acceptance for source review package
- `08_planning/reports/20260323_MM3_004_PM_STRUCTURE_OPTIONS_V1.md`: PM 구조 비교안
- `08_planning/reports/20260323_MM3_007_IMPLEMENTATION_GATE_DEFINITION_V1.md`: 구현 게이트 정의
- `08_planning/reports/20260323_MM3_008_FRESH_SUMMARY_REWRITE_NEED_DECISION_V1.md`: fresh summary rewrite 필요 여부 판단
- `08_planning/reports/20260323_MM3_009_IA_PACKAGE_ACCEPTANCE_V1.md`: IA package acceptance
- `08_planning/reports/20260323_MM3_010_RUNTIME_CONTRACT_ACCEPTANCE_V1.md`: runtime contract acceptance
- `08_planning/reports/20260324_MM3_057_DETAIL_EXPRESSION_REFINEMENT_ACCEPTANCE_V1.md`: detail / expression refinement acceptance
- `08_planning/reports/20260324_MM3_058_POST_REFINEMENT_GATE_RECHECK_V1.md`: refinement 이후 gate 재판정
- `08_planning/reports/20260324_MM3_059_CORE_LEARNER_FLOW_QA_PLAN_V1.md`: core learner flow QA 우선 경로 정의
- `08_planning/reports/20260324_MM3_060_CORE_LEARNER_FLOW_QA_READINESS_V1.md`: core learner flow QA 실행 전 readiness
- `08_planning/reports/20260324_MM3_062_CORE_LEARNER_FLOW_QA_ACCEPTANCE_V1.md`: core learner flow QA acceptance
- `08_planning/reports/20260324_MM3_066_SCENARIO_LEVEL_QA_ACCEPTANCE_V1.md`: scenario-level QA acceptance
- `08_planning/reports/20260324_MM3_067_SCENARIO_RESIDUAL_GAP_NOTE_V1.md`: scenario residual / manual candidate note
- `08_planning/reports/20260324_MM3_071_RUNTIME_QA_WAVE_CLOSEOUT_V1.md`: runtime QA wave closeout
- `08_planning/reports/20260324_MM3_072_SITUATION_TREE_PRECISION_PATH_DECISION_V1.md`: situation tree precision path decision
- `08_planning/reports/20260324_MM3_073_POST_QA_NEXT_SLICE_DECISION_V1.md`: post-QA next slice decision
- `08_planning/reports/20260324_MM3_077_TRANSLATION_SURFACE_ACCEPTANCE_V1.md`: translation surface acceptance
- `08_planning/reports/20260324_MM3_078_POST_TRANSLATION_NEXT_SLICE_DECISION_V1.md`: post-translation next slice decision
- `08_planning/reports/20260324_MM3_082_DETAIL_EXPRESSION_MICRO_POLISH_ACCEPTANCE_V1.md`: detail / expression micro-polish acceptance
- `08_planning/reports/20260324_MM3_083_LEARNER_LOCALE_TRANSLATION_DEFAULT_DECISION_V1.md`: learner locale / translation default decision
- `08_planning/reports/20260324_MM3_085_TRANSLATION_DEFAULT_ACCEPTANCE_V1.md`: translation default acceptance
- `08_planning/reports/20260324_MM3_086_COMPACT_TRANSLATION_SUMMARY_GAP_NOTE_V1.md`: compact translation summary gap note
- `08_planning/reports/20260324_MM3_087_COMPACT_TRANSLATION_SUMMARY_ENRICHMENT_DECISION_V1.md`: compact translation summary enrichment decision
- `08_planning/reports/20260324_MM3_088_PILOT_READINESS_CHECKPOINT_V1.md`: pilot readiness checkpoint
- `08_planning/reports/20260324_MM3_090_PILOT_READINESS_ACCEPTANCE_V1.md`: pilot readiness acceptance
- `08_planning/reports/20260324_MM3_091_INTERNAL_PILOT_DEMO_CHECKLIST_V1.md`: internal pilot demo checklist
- `08_planning/reports/20260324_MM3_092_PILOT_FEEDBACK_INTAKE_PROTOCOL_V1.md`: pilot feedback intake protocol
- `08_planning/reports/20260324_MM3_093_HUMAN_PILOT_SESSION_DECISION_V1.md`: human pilot session decision
- `08_planning/reports/20260324_MM3_094_INTERNAL_HUMAN_PILOT_SESSION_PACKET_V1.md`: internal human pilot session packet
- `08_planning/reports/20260324_MM3_095_INTERNAL_HUMAN_PILOT_EXECUTION_READINESS_V1.md`: internal human pilot execution readiness
- `08_planning/reports/20260324_MM3_097_HUMAN_PILOT_FEEDBACK_TRIAGE_V1.md`: human pilot feedback triage
- `08_planning/reports/20260324_MM3_100_RUNTIME_SYNC_BUG_FIX_ACCEPTANCE_V1.md`: runtime sync bug fix acceptance
- `08_planning/reports/20260324_MM3_101_POST_PILOT_CLUSTER_NEXT_SLICE_DECISION_V1.md`: post-pilot next slice decision
- `08_planning/reports/20260324_MM3_102_DETAIL_IA_REDESIGN_PLAN_V1.md`: detail IA redesign plan
- `08_planning/reports/20260324_MM3_105_DETAIL_IA_REDESIGN_ACCEPTANCE_V1.md`: detail IA redesign acceptance
- `08_planning/reports/20260324_MM3_106_FILTER_ROLE_CLARIFICATION_PLAN_V1.md`: filter role clarification plan
- `08_planning/reports/20260324_MM3_109_FILTER_ROLE_CLARIFICATION_ACCEPTANCE_V1.md`: filter role clarification acceptance
- `08_planning/reports/20260324_MM3_110_CARD_LEARNING_POLICY_DECISION_V1.md`: card learning policy decision
- `08_planning/reports/20260324_MM3_112_CARD_LEARNING_POLICY_ACCEPTANCE_V1.md`: card learning policy acceptance
- `08_planning/reports/20260324_MM3_113_MISCLASSIFIED_NONE_SCENARIO_PLAN_V1.md`: misclassified / none scenario plan
- `08_planning/reports/20260324_MM3_116_MISCLASSIFIED_NONE_SCENARIO_ACCEPTANCE_V1.md`: misclassified / none scenario acceptance
- `08_planning/reports/20260324_MM3_117_DATA_DEDUP_CLEANUP_PLAN_V1.md`: data / dedup cleanup plan
- `08_planning/reports/20260324_MM3_119_DATA_DEDUP_CLEANUP_ACCEPTANCE_V1.md`: data / dedup cleanup acceptance
- `08_planning/reports/20260324_MM3_123_EXPLANATION_COPY_CLARIFICATION_ACCEPTANCE_V1.md`: explanation / copy clarification acceptance
- `08_planning/reports/20260324_MM3_127_CROSSLINK_SURFACE_POLICY_ACCEPTANCE_V1.md`: cross-link surface policy acceptance
- `08_planning/reports/20260324_MM3_128_PAYLOAD_LEVEL_DEDUP_DECISION_V1.md`: payload-level dedup decision
- `08_planning/reports/20260324_MM3_129_PAYLOAD_LEVEL_DEDUP_DECISION_RESULT_V1.md`: payload-level dedup decision result
- `08_planning/reports/20260324_MM3_130_PILOT_FEEDBACK_WAVE_CLOSEOUT_V1.md`: pilot feedback wave closeout
- `08_planning/reports/20260324_MM3_131_MAIN_EXPLORER_READINESS_RECHECK_V1.md`: main explorer readiness recheck
- `08_planning/reports/20260324_MM3_134_NARROW_DUPLICATE_METADATA_CLEANUP_ACCEPTANCE_V1.md`: narrow duplicate metadata cleanup acceptance
- `08_planning/reports/20260324_MM3_135_MAIN_EXPLORER_READINESS_VERDICT_V1.md`: main explorer readiness verdict
- `08_planning/reports/20260324_MM3_136_INTERNAL_USE_LAUNCH_BOUNDARY_NOTE_V1.md`: internal use / launch boundary
- `08_planning/reports/20260324_MM3_137_INTERNAL_USE_OPS_CHECKLIST_V1.md`: internal use ops checklist
- `08_planning/reports/20260324_MM3_138_PILOT_FEEDBACK_COVERAGE_AUDIT_V1.md`: raw pilot feedback coverage audit
- `08_planning/reports/20260324_MM3_146_TRANSLATION_SURFACE_FOLLOWUP_ACCEPTANCE_V1.md`: translation surface follow-up acceptance
- `08_planning/reports/20260324_MM3_147_RELATION_DISAMBIGUATION_PLAN_V1.md`: relation disambiguation plan
- `08_planning/reports/20260324_MM3_150_RELATION_DISAMBIGUATION_ACCEPTANCE_V1.md`: relation disambiguation acceptance
- `08_planning/reports/20260324_MM3_151_FEEDBACK_COVERAGE_REFRESH_V1.md`: feedback coverage refresh
- `08_planning/reports/20260324_MM3_152_REMAINING_FEEDBACK_HOLDOUT_PRIORITIZATION_V1.md`: remaining feedback holdout prioritization
- `08_planning/reports/20260324_MM3_153_NONE_UNCLASSIFIED_DEEP_SCENARIO_DECISION_V1.md`: next holdout tranche decision
- `08_planning/reports/20260324_MM3_154_NONE_UNCLASSIFIED_DEEP_SCENARIO_PLAN_V1.md`: none / unclassified learner-facing deep scenario plan
- `08_planning/reports/20260324_MM3_155_NEW_THREAD_PM_HANDOFF_PACKET_V1.md`: new thread PM handoff packet
- `08_planning/reports/20260324_MM3_156_NONE_UNCLASSIFIED_MINIMAL_UI_MAPPING_ACCEPTANCE_V1.md`: none / unclassified minimal UI mapping acceptance
- `08_planning/reports/20260324_MM3_157_EXPRESSION_SCENARIO_FOLLOWUP_PLAN_V1.md`: expression scenario pipeline plan
- `08_planning/reports/20260324_MM3_158_EXPRESSION_SCENARIO_WORKFLOW_ACCEPTANCE_V1.md`: expression scenario workflow acceptance
- `08_planning/reports/20260324_MM3_159_MOTION_MINDMAP_RECHECK_NOTE_V1.md`: motion / mindmap quantitative recheck note
- `08_planning/reports/20260324_MM3_160_TRANSLATION_RUNTIME_PAYLOAD_REPAIR_V1.md`: english / vietnamese translation runtime payload repair
- `08_planning/reports/20260324_MM3_161_EXAMPLE_SOURCE_ORDER_CLARIFICATION_FOLLOWUP_V1.md`: example source/order clarification follow-up
- `08_planning/reports/20260324_MM3_162_MOTION_HUMAN_CHECK_PACKET_V1.md`: motion human eye check packet
- `08_planning/reports/20260324_MM3_163_MOTION_HUMAN_RECHECK_ACCEPTANCE_V1.md`: motion human re-check acceptance
- `08_planning/reports/20260324_MM3_164_GIT_VERCEL_PAYLOAD_PACKAGING_V1.md`: git / Vercel payload packaging policy
- `.codex-orchestration/HANDOFF_MESSAGE_TO_NEW_PM_V1.md`: copy-paste handoff message
- `08_planning/pilot_feedback/20260324_pilot_session_01.md`: normalized pilot session note
- 보고서 파일명은 유지될 수 있으나, 내부 revision history를 반드시 포함한다
- `vocab_dictionary/output/topik_stats_linkage/`: TOPIK stats linkage outputs
