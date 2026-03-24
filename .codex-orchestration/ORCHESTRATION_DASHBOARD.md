# ORCHESTRATION_DASHBOARD

## Current Status

- Milestone: `M1 Runtime Wiring / Core Explorer`
- Active Work: `MM3-096 Human Pilot Scheduling / Execution`
- PM Owner: `Codex`
- User Constraint: external references are read-only
- Operating Mode: `Strict`
- Current Gate: `PARTIAL_OPEN`

## Completed This Turn

- `MM3-040` search + facet wiring accepted
- `MM3-042` browser smoke accepted
- `MM3-043` gate recheck after wiring accepted
- `MM3-048` tree wiring accepted
- `MM3-050` detail wiring accepted
- `MM3-053` expression wiring accepted
- `MM3-057` detail / expression refinement accepted
- `MM3-058` post-refinement gate recheck accepted
- `MM3-059` core learner flow QA plan 작성
- `MM3-062` core learner flow QA acceptance
- `MM3-066` scenario-level QA acceptance
- `MM3-067` scenario residual gap note 작성
- `MM3-071` runtime QA wave closeout
- `MM3-072` situation tree precision path decision
- `MM3-073` post-QA next slice decision
- `MM3-077` translation surface acceptance
- `MM3-078` post-translation next slice decision
- `MM3-082` detail / expression micro-polish acceptance
- `MM3-085` translation default acceptance
- `MM3-087` compact translation summary enrichment decision
- `MM3-088` pilot readiness checkpoint
- `MM3-090` pilot readiness acceptance
- `MM3-091` internal pilot demo checklist
- `MM3-092` pilot feedback intake protocol
- `MM3-093` human pilot session decision
- `MM3-095` internal human pilot execution readiness
- `MM3-154` none / unclassified deep scenario plan
- `MM3-156` none / unclassified minimal UI mapping acceptance
- `MM3-157` expression scenario follow-up plan
- `MM3-158` expression scenario workflow acceptance
- `MM3-159` motion / mindmap quantitative probe recheck
- `MM3-162` motion human check packet
- `MM3-163` motion human re-check acceptance
- `MM3-160` translation runtime payload repair
- `MM3-161` example source/order clarification follow-up
- `MM3-164` git / Vercel payload packaging
- `MM3-155` new thread PM handoff packet / handoff message 정리

## In Progress

- `MM3-096A`: refreshed runtime 기준으로 pilot scheduling / execution 재오픈
- `MM3-096B`: participant / facilitator / path를 다시 확정

## Current Runtime Baseline

- canonical count: `53,480`
- runtime payload format: `JSON`
- active live payloads:
  - `APP_READY_SEARCH_INDEX.json`
  - `APP_READY_FACETS.json`
  - `APP_READY_MEANING_TREE.json`
  - `APP_READY_SITUATION_TREE.json`
  - `APP_READY_UNCLASSIFIED_TREE.json`
  - `APP_READY_DETAIL_MAP.json`

## Pending

- 없음

## Risks

- `R1`: human pilot를 다시 열면 새 feedback wave가 다시 열릴 수 있다.
- `R2`: `runtime_payloads/*.json.gz`는 배포 가능하지만 장기적으로는 canonical generator 복구가 더 바람직하다.
- `R3`: pilot scheduling은 코드보다 사람 일정/운영 정렬 이슈에 더 크게 좌우된다.

## Canonical Pointers

- Tasklist: `08_planning/TASKLIST_V1.md`
- PM operating model: `.codex-orchestration/PM_OPERATING_MODEL_V1.md`
- Document policy: `08_planning/DOCUMENT_SYSTEM_POLICY_V1.md`
- Working hub: `.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`
- PM review queue: `.codex-orchestration/PM_REVIEW_QUEUE_V1.md`
- Latest refinement plan: `08_planning/reports/20260324_MM3_055_DETAIL_EXPRESSION_REFINEMENT_PLAN_V1.md`
- Latest refinement readiness: `08_planning/reports/20260324_MM3_056_DETAIL_EXPRESSION_REFINEMENT_READINESS_V1.md`
- Latest acceptance report: `08_planning/reports/20260324_MM3_057_DETAIL_EXPRESSION_REFINEMENT_ACCEPTANCE_V1.md`
- Latest gate recheck: `08_planning/reports/20260324_MM3_058_POST_REFINEMENT_GATE_RECHECK_V1.md`
- Latest QA plan: `08_planning/reports/20260324_MM3_059_CORE_LEARNER_FLOW_QA_PLAN_V1.md`
- Latest QA readiness: `08_planning/reports/20260324_MM3_060_CORE_LEARNER_FLOW_QA_READINESS_V1.md`
- Latest QA acceptance: `08_planning/reports/20260324_MM3_062_CORE_LEARNER_FLOW_QA_ACCEPTANCE_V1.md`
- Latest scenario QA acceptance: `08_planning/reports/20260324_MM3_066_SCENARIO_LEVEL_QA_ACCEPTANCE_V1.md`
- Latest residual note: `08_planning/reports/20260324_MM3_067_SCENARIO_RESIDUAL_GAP_NOTE_V1.md`
- Latest closeout: `08_planning/reports/20260324_MM3_071_RUNTIME_QA_WAVE_CLOSEOUT_V1.md`
- Latest decision: `08_planning/reports/20260324_MM3_072_SITUATION_TREE_PRECISION_PATH_DECISION_V1.md`
- Latest next-slice decision: `08_planning/reports/20260324_MM3_073_POST_QA_NEXT_SLICE_DECISION_V1.md`
- Latest translation acceptance: `08_planning/reports/20260324_MM3_077_TRANSLATION_SURFACE_ACCEPTANCE_V1.md`
- Latest micro-polish acceptance: `08_planning/reports/20260324_MM3_082_DETAIL_EXPRESSION_MICRO_POLISH_ACCEPTANCE_V1.md`
- Latest translation-default acceptance: `08_planning/reports/20260324_MM3_085_TRANSLATION_DEFAULT_ACCEPTANCE_V1.md`
- Latest compact decision: `08_planning/reports/20260324_MM3_087_COMPACT_TRANSLATION_SUMMARY_ENRICHMENT_DECISION_V1.md`
- Latest pilot acceptance: `08_planning/reports/20260324_MM3_090_PILOT_READINESS_ACCEPTANCE_V1.md`
- Latest pilot protocol: `08_planning/reports/20260324_MM3_092_PILOT_FEEDBACK_INTAKE_PROTOCOL_V1.md`
- Latest human-pilot readiness: `08_planning/reports/20260324_MM3_095_INTERNAL_HUMAN_PILOT_EXECUTION_READINESS_V1.md`
- Latest deep-scenario plan: `08_planning/reports/20260324_MM3_154_NONE_UNCLASSIFIED_DEEP_SCENARIO_PLAN_V1.md`
- Latest minimal-ui acceptance: `08_planning/reports/20260324_MM3_156_NONE_UNCLASSIFIED_MINIMAL_UI_MAPPING_ACCEPTANCE_V1.md`
- Latest expression-scenario plan: `08_planning/reports/20260324_MM3_157_EXPRESSION_SCENARIO_FOLLOWUP_PLAN_V1.md`
- Latest expression acceptance: `08_planning/reports/20260324_MM3_158_EXPRESSION_SCENARIO_WORKFLOW_ACCEPTANCE_V1.md`
- Latest motion recheck note: `08_planning/reports/20260324_MM3_159_MOTION_MINDMAP_RECHECK_NOTE_V1.md`
- Latest motion human packet: `08_planning/reports/20260324_MM3_162_MOTION_HUMAN_CHECK_PACKET_V1.md`
- Latest motion acceptance: `08_planning/reports/20260324_MM3_163_MOTION_HUMAN_RECHECK_ACCEPTANCE_V1.md`
- Latest translation runtime repair: `08_planning/reports/20260324_MM3_160_TRANSLATION_RUNTIME_PAYLOAD_REPAIR_V1.md`
- Latest example clarification follow-up: `08_planning/reports/20260324_MM3_161_EXAMPLE_SOURCE_ORDER_CLARIFICATION_FOLLOWUP_V1.md`
- Latest deploy packaging note: `08_planning/reports/20260324_MM3_164_GIT_VERCEL_PAYLOAD_PACKAGING_V1.md`
- Latest handoff packet: `08_planning/reports/20260324_MM3_155_NEW_THREAD_PM_HANDOFF_PACKET_V1.md`
- Data architecture: `08_planning/DATA_ARCHITECTURE_V1.md`
- Scenario spec: `08_planning/PRODUCT_SCENARIO_SPEC_V1.md`
- Decision log: `08_planning/PROJECT_DECISION_LOG_V1.md`
- Handoff: `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
