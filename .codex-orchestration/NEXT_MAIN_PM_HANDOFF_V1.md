# NEXT_MAIN_PM_HANDOFF_V1

## Current State

- `mindmap3`는 현재 `M1 Runtime Wiring / Core Explorer` phase다.
- primary dictionary SSOT는 `vocab_dictionary/output/unified_live/kcenter_base.json.gz`다.
- 앱 runtime payload는 `JSON` 유지다.
- 운영 강도는 `엄격`으로 확정됐다.
- 현재 active work는 `MM3-096 Human Pilot Scheduling / Execution`이다.
- 전체 implementation gate는 `PARTIAL_OPEN`, core explorer slice는 `OPEN`이다.
- 업무지시와 보고서는 한국어를 기본으로 사용한다.

## What Changed

- source review, taxonomy discovery, scenario, IA, runtime contract, mindmap spec, validation reframe은 모두 문서상 닫혔다.
- search + facet wiring, tree wiring, detail wiring, expression wiring이 모두 앱에 반영됐다.
- build와 Playwright smoke는 현재 core path에서 통과한다.
- latest refinement에서 `의미 관계어`, `관련형`, `subword` 카드 탐색 흐름을 detail panel에 연결했다.
- source-native로 독립 표제어가 없는 표현은 `미리보기 전용` 상태로 명시했다.
- 최신 gate recheck 기준으로 core explorer slice는 `OPEN`, 전체 프로젝트는 `PARTIAL_OPEN`이다.
- `MM3-059`에서 core learner flow QA 우선 경로를 정리했다.
- `MM3-060`에서 QA execution readiness를 고정했다.
- `MM3-061` execution과 `MM3-062` acceptance까지 완료돼 core learner flow QA는 닫혔다.
- `MM3-063`~`MM3-066`까지 scenario-level QA subset도 닫혔다.
- `MM3-067`에서 residual/manual candidate를 정리했다.
- `MM3-068`~`MM3-071`로 residual subset과 runtime QA wave closeout까지 완료했다.
- `MM3-072`에서 situation tree precision path는 `defer, not block`으로 결정했다.
- `MM3-073`에서 다음 슬라이스는 `translation surface policy`가 적절하다고 정리했다.
- `MM3-074`~`MM3-077`로 translation surface tranche도 닫혔다.
- `MM3-078`에서 다음 슬라이스는 `detail / expression micro-polish`가 적절하다고 정리했다.
- `MM3-079`~`MM3-082`로 detail / expression micro-polish tranche도 닫혔다.
- 사용자 결정 반영 후 `MM3-083`~`MM3-085` translation default tranche도 닫혔다.
- `MM3-086`~`MM3-088`에서 compact translation summary는 defer로 정리했고, pilot readiness checkpoint로 넘어갔다.
- `MM3-089`~`MM3-090`에서 현재 explorer는 `PILOT_READY_WITH_LIMITS`로 accept됐다.
- `MM3-091`~`MM3-092`에서 internal pilot checklist와 feedback intake protocol도 정리됐다.
- 사용자 승인에 따라 `MM3-093`~`MM3-095`로 internal human pilot session packet과 execution readiness까지 정리됐다.
- `MM3-151`~`MM3-153`에서 raw feedback 잔여 holdout을 다시 정렬했고, 다음 tranche를 `none / unclassified deep scenario`로 확정했다.
- `MM3-155`에서 새 스레드 PM handoff packet과 copy-paste handoff message를 고정했다.
- `MM3-154`에서 `주제 및 상황 > 없음`과 `미분류`를 서로 다른 learner-facing 문제로 분리 정의했다.
- `MM3-156`에서 path / helper / copy를 최소 UI 변경으로 반영했고 `build`, Playwright `16 passed`로 검증했다.
- `MM3-157`에서 표현층을 `signal -> core helper -> expression tab -> jumpable/preview-only branch` 파이프라인으로 설계했다.
- `MM3-158`에서 그 시나리오를 UI와 test로 반영했고 `build`, Playwright `18 passed`로 검증했다.
- `MM3-159`에서는 motion re-check용 quantitative probe를 추가했고 전체 suite `20 passed` 기준으로 immediate blocking signal은 없다고 봤다.
- `MM3-160`에서 source translation store를 기준으로 runtime live payload를 repair해 영어/베트남어 selector mismatch를 수정했고 Playwright `19 passed`로 검증했다.
- `MM3-161`에서 examples helper를 `현재 의미 -> 대표 예문 fallback -> source label -> 최대 8개`까지 구체화했고 전체 suite `21 passed`로 검증했다.
- `MM3-162`에서 optional human eye re-check를 위한 motion 전용 packet을 추가했다.
- `MM3-163`에서 user human check 결과 `문제 없음`을 확인했고 raw feedback 큰 holdout을 모두 닫았다.
- `MM3-164`에서 git/Vercel 연동을 위해 `live/*.json` 대신 `runtime_payloads/*.json.gz`를 추적하고 build 전에 복원하는 packaging 정책을 고정했다.

## Must Check First

1. `08_planning/TASKLIST_V1.md`
2. `.codex-orchestration/PM_OPERATING_MODEL_V1.md`
3. `08_planning/DOCUMENT_SYSTEM_POLICY_V1.md`
4. `08_planning/reports/20260324_MM3_057_DETAIL_EXPRESSION_REFINEMENT_ACCEPTANCE_V1.md`
5. `08_planning/reports/20260324_MM3_058_POST_REFINEMENT_GATE_RECHECK_V1.md`
6. `08_planning/reports/20260324_MM3_059_CORE_LEARNER_FLOW_QA_PLAN_V1.md`
7. `08_planning/reports/20260324_MM3_060_CORE_LEARNER_FLOW_QA_READINESS_V1.md`
8. `08_planning/reports/20260324_MM3_062_CORE_LEARNER_FLOW_QA_ACCEPTANCE_V1.md`
9. `08_planning/reports/20260324_MM3_066_SCENARIO_LEVEL_QA_ACCEPTANCE_V1.md`
10. `08_planning/reports/20260324_MM3_067_SCENARIO_RESIDUAL_GAP_NOTE_V1.md`
11. `08_planning/reports/20260324_MM3_071_RUNTIME_QA_WAVE_CLOSEOUT_V1.md`
12. `08_planning/reports/20260324_MM3_072_SITUATION_TREE_PRECISION_PATH_DECISION_V1.md`
13. `08_planning/reports/20260324_MM3_073_POST_QA_NEXT_SLICE_DECISION_V1.md`
14. `08_planning/reports/20260324_MM3_077_TRANSLATION_SURFACE_ACCEPTANCE_V1.md`
15. `08_planning/reports/20260324_MM3_078_POST_TRANSLATION_NEXT_SLICE_DECISION_V1.md`
16. `08_planning/reports/20260324_MM3_082_DETAIL_EXPRESSION_MICRO_POLISH_ACCEPTANCE_V1.md`
17. `08_planning/reports/20260324_MM3_083_LEARNER_LOCALE_TRANSLATION_DEFAULT_DECISION_V1.md`
18. `08_planning/reports/20260324_MM3_085_TRANSLATION_DEFAULT_ACCEPTANCE_V1.md`
19. `08_planning/reports/20260324_MM3_086_COMPACT_TRANSLATION_SUMMARY_GAP_NOTE_V1.md`
20. `08_planning/reports/20260324_MM3_087_COMPACT_TRANSLATION_SUMMARY_ENRICHMENT_DECISION_V1.md`
21. `08_planning/reports/20260324_MM3_088_PILOT_READINESS_CHECKPOINT_V1.md`
22. `08_planning/reports/20260324_MM3_090_PILOT_READINESS_ACCEPTANCE_V1.md`
23. `08_planning/reports/20260324_MM3_091_INTERNAL_PILOT_DEMO_CHECKLIST_V1.md`
24. `08_planning/reports/20260324_MM3_138_PILOT_FEEDBACK_COVERAGE_AUDIT_V1.md`
25. `08_planning/reports/20260324_MM3_151_FEEDBACK_COVERAGE_REFRESH_V1.md`
26. `08_planning/reports/20260324_MM3_152_REMAINING_FEEDBACK_HOLDOUT_PRIORITIZATION_V1.md`
27. `08_planning/reports/20260324_MM3_153_NONE_UNCLASSIFIED_DEEP_SCENARIO_DECISION_V1.md`
28. `08_planning/reports/20260324_MM3_154_NONE_UNCLASSIFIED_DEEP_SCENARIO_PLAN_V1.md`
29. `08_planning/reports/20260324_MM3_155_NEW_THREAD_PM_HANDOFF_PACKET_V1.md`
30. `08_planning/reports/20260324_MM3_156_NONE_UNCLASSIFIED_MINIMAL_UI_MAPPING_ACCEPTANCE_V1.md`
31. `08_planning/reports/20260324_MM3_157_EXPRESSION_SCENARIO_FOLLOWUP_PLAN_V1.md`
32. `08_planning/reports/20260324_MM3_158_EXPRESSION_SCENARIO_WORKFLOW_ACCEPTANCE_V1.md`
33. `08_planning/reports/20260324_MM3_160_TRANSLATION_RUNTIME_PAYLOAD_REPAIR_V1.md`
34. `08_planning/reports/20260324_MM3_159_MOTION_MINDMAP_RECHECK_NOTE_V1.md`
35. `vocab_dictionary/scripts/repair_runtime_translation_payloads.py`
36. `08_planning/reports/20260324_MM3_161_EXAMPLE_SOURCE_ORDER_CLARIFICATION_FOLLOWUP_V1.md`
37. `08_planning/reports/20260324_MM3_162_MOTION_HUMAN_CHECK_PACKET_V1.md`
38. `08_planning/reports/20260324_MM3_163_MOTION_HUMAN_RECHECK_ACCEPTANCE_V1.md`
39. `08_planning/reports/20260324_MM3_164_GIT_VERCEL_PAYLOAD_PACKAGING_V1.md`
40. `vercel.json`
41. `09_app/scripts/prepare-live-payloads.mjs`
42. `09_app/public/data/internal/runtime_payloads/`
43. `09_app/tests/residual.spec.js`
44. `09_app/tests/smoke.spec.js`

## Open Decisions

- runtime thin-index generator를 project 안에서 복구/명문화할지

## Next PM Actions

1. raw feedback 기준 큰 holdout은 모두 닫혔다.
2. refreshed runtime 기준으로 human pilot scheduling / execution을 다시 연다.
3. git/Vercel packaging은 동작하지만, generator 경로 복구는 별도 후속 과제로 본다.
