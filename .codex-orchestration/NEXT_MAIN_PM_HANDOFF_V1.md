# NEXT_MAIN_PM_HANDOFF_V1

## Current State

- `mindmap3`는 현재 `M1 Runtime Wiring / Core Explorer` phase다.
- current active work는 `MM3-213 Canonical Thin-Index Generator Recovery / Documentation`이다.
- current exit condition은 exact runtime search generator를 복구하려면 어떤 field provenance가 더 필요한지 경계를 고정하고, next recovery step을 하나로 좁히는 것이다.
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
- `MM3-213` note 기준 thin/facet source는 확인됐지만 exact runtime search generator는 아직 partial recovery 상태다.
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
3. `08_planning/reports/20260326_MM3_216_TOPIK_STATS_LINKAGE_POLICY_DECISION_V1.md`

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

- current blocker는 exact runtime search generator에 필요한 field provenance가 thin/facet source만으로 닫히지 않는다는 점이다.
- current runtime truth는 aligned 상태지만 generator truth는 partial recovery 상태다.
- TOPIK stats policy 자체는 승인 완료 상태다.

## Next PM Actions

1. `MM3-212` validator와 `MM3-213` note를 기준으로 missing provenance fields를 고정한다.
2. exact recovery를 계속할지, partial generator boundary만 문서화하고 멈출지 결정한다.
3. 어떤 선택이든 `npm run validate:source-alignment`를 future gate로 유지한다.
