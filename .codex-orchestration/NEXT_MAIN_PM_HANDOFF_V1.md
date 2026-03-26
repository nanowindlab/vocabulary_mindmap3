# NEXT_MAIN_PM_HANDOFF_V1

## Current State

- `mindmap3`는 현재 `M1 Runtime Wiring / Core Explorer` phase다.
- current active work는 `MM3-217 Runtime Payload Builder Activation`이다.
- current exit condition은 recovered search/facet pieces를 builder scope로 조직화하고 current builder boundary를 search/facet 중심으로 고정하는 것이다.
- current gate는 overall `PARTIAL_OPEN`, core explorer slice `OPEN`이다.
- deploy/runtime truth는 `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build` 체인이다.

## Verified Now

- second human pilot feedback pipeline은 `ACCEPT`로 닫혔다.
- screenshot-inclusive actual in-app guide가 작성됐다.
- example chunk는 live `107 files`, compressed `107 files`로 복구됐다.
- `MM3-171B`는 `MM3-199 R7` 기준으로 closeout됐다.
- `MM3-210`은 closeout됐다.
- `MM3-212`에서 runtime/source alignment validation script를 추가했고 payload reconciliation은 `PASS`다.
- `MM3-216`에서 TOPIK stats linkage policy를 고정했다.
- `MM3-213`은 current learner-facing search scope 기준으로 closeout됐다.
- `original_language_type`는 learner-facing scope에서 사용하지 않기로 정리됐다.
- `probe:search-recovery` 기준 current learner-facing runtime search row는 `53,480 / 53,480` exact match다.
- `build:search-recovery`로 local rebuild artifact도 생성 가능하다.
- post-closeout feedback queue `MM3-202A`~`MM3-206A`는 closeout까지 반영됐다.
- screenshot feedback queue `MM3-207A`~`MM3-209A`도 closeout까지 반영됐다.
- `npm run build`가 통과했다.
- `Playwright` full suite는 `39 passed`다.

## Important Clarification

- raw/internal `미분류`와 learner-facing `분류 밖 항목`은 서로 다른 bucket이 아니다.
- same underlying bucket의 layer-specific naming이다.

## Tier 1 Reads

1. `pm-operating-guide.md`
2. `08_planning/TASKLIST_V1.md`
3. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
4. `08_planning/reports/20260326_MM3_214_NEXT_PM_HANDOFF_PACKET_V1.md`

## Tier 2 Reads

1. `08_planning/reports/20260326_MM3_212_PAYLOAD_VALIDATION_COUNT_RECONCILIATION_V1.md`
2. `08_planning/reports/20260326_MM3_213_CANONICAL_THIN_INDEX_GENERATOR_RECOVERY_NOTE_V1.md`
3. `08_planning/reports/20260326_MM3_217_RUNTIME_PAYLOAD_BUILDER_ACTIVATION_NOTE_V1.md`

## Tier 3 Reference On Demand

- `08_planning/reports/20260325_MM3_196_SECOND_HUMAN_PILOT_FEEDBACK_PIPELINE_CLOSEOUT_V1.md`
- `08_planning/reports/20260325_MM3_195_UI_TERM_CONSISTENCY_AND_EXAMPLE_CHUNK_BUILDER_IMPLEMENTATION_V1.md`
- `08_planning/reports/20260325_MM3_194_EXAMPLE_SOURCE_FEASIBILITY_AND_UNCLASSIFIED_TERM_CLARIFICATION_V1.md`
- `08_planning/reports/20260326_MM3_201_POST_CLOSEOUT_FEEDBACK_COVERAGE_CHECK_V1.md`
- `08_planning/reports/20260326_MM3_202_POST_CLOSEOUT_DETAIL_SURFACE_FOLLOWUP_IMPLEMENTATION_V1.md`
- `08_planning/reports/20260326_MM3_205_UNCLASSIFIED_SURFACE_PRODUCT_IA_DECISION_NOTE_V1.md`
- `08_planning/reports/20260326_MM3_206_MINDMAP_BAND_LEGEND_VALUE_REVIEW_NOTE_V1.md`
- `08_planning/reports/20260326_MM3_207_SCREENSHOT_FEEDBACK_RELATION_EXAMPLE_FOLLOWUP_V1.md`
- `08_planning/pilot_feedback/20260326_pilot_session_04.md`

## Open Blocker

- current blocker는 full runtime payload builder scope를 어디까지 둘지 아직 고정되지 않았다는 점이다.
- current runtime truth는 aligned 상태이고, learner-facing search row exact rebuild도 확인됐다.
- TOPIK stats policy 자체는 승인 완료 상태다.
- `original_language_type` 자체는 blocker가 아니다.

## Next PM Actions

1. `MM3-217`에서 builder scope를 search/facet 중심으로 고정할지 결정한다.
2. recovered search builder를 canonical builder surface로 승격할지 결정한다.
3. 어떤 선택이든 `npm run validate:source-alignment`를 future gate로 유지한다.
