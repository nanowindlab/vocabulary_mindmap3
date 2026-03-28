# NEXT_MAIN_PM_HANDOFF_V1

## Current State

- `mindmap3`는 현재 `M1 Runtime Wiring / Core Explorer` phase다.
- current active work는 `none`이다.
- latest closeout package는 `MM3-268 2026-03-28 Feedback Intake / Execution Plan`이다.
- current exit condition은 다음 active work가 생기면 그 task id 기준으로 새 packet을 연다.
- current gate는 overall `PARTIAL_OPEN`, core explorer slice `OPEN`이다.
- deploy/runtime truth는 `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build` 체인이다.
- current learner-facing `search + facets only` builder surface는 package/build-chain에 **non-authoritative sidecar gate**로 편입됐다.
- current builder contract is authoritative for `search semantic fields + facets` when executed through the approved promote path.
- current sidecar output is **comparison / validation only**.

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
- `MM3-217` formal validation / review / hardening / revalidation packets이 추가됐다.
- current learner-facing `search + facets` builder surface는 local canonical builder로 exact recovery 가능하다.
- `MM3-223`에서 current learner-facing `search + facets only` surface의 package/build-chain sidecar promotion이 승인됐다.
- `npm run prepackage:live`와 `npm run build`는 same sidecar gate를 통과한다.
- `MM3-224`에서 authoritative promotion criteria와 evidence gap이 고정됐다.
- `npm run audit:authoritative-promotion` 기준 semantic authority candidate readiness는 `true`다.
- `MM3-225`에서 authoritative runtime write path / rollback / dual-run diff protocol이 정의됐다.
- `npm run plan:authoritative-runtime`는 `PLAN_READY`, `npm run diff:authoritative-runtime`는 `PASS`다.
- `MM3-226`에서 current tranche `chunk_id` policy는 runtime-enrichment로 고정됐고, canonical mapping은 parked backlog `MM3-226A`로 분리됐다.
- `MM3-227`에서 actual authoritative runtime switch가 실행됐고, post-switch diff / rollback-ready / build verification이 통과했다.
- current search semantic fields + facets boundary is now authoritative runtime truth.
- `MM3-228`에서 recurring gate bundle `npm run check:authoritative-runtime-boundary`를 추가했고 `PASS`를 확인했다.
- `MM3-229`에서 `MM3-217` closeout과 next active work 전환이 고정됐다.
- `MM3-230`에서 maintenance protocol을 고정했고, doc-only 턴에서는 recurring gate 생략 가능 조건을 명시했다.
- `MM3-231`에서 `PRODUCT_SCENARIO_SPEC_V1.md`를 final canonical로 승격했다.
- `MM3-232`에서 related form source-faithful repair를 적용했고 unresolved total `4,563 -> 4,303`, dangling forms `1,085 -> 1,019`로 줄였다.
- `MM3-234`에서 source-ambiguous related form을 text-only로 고정하는 policy를 잠궜다.
- `MM3-235`에서 related-form audit automation을 추가했고 unresolved `4,303` 중 `4,302`가 source ambiguity임을 고정했다.
- `MM3-236`에서 MM3 UI refinement roadmap를 열었고, first slice를 relation tab information hierarchy로 고정했다.
- `MM3-237`에서 relation tab hierarchy refinement를 구현했고 targeted Playwright `4 passed`로 `MM3-236B`를 닫았다.
- `MM3-238`에서 detail top-of-fold density를 closeout했고 targeted Playwright `7 passed`를 확인했다.
- `MM3-239`에서 expression/example legibility refinement를 closeout했고 targeted Playwright `6 passed`를 확인했다.
- `MM3-240`에서 fallback surface guidance refinement를 closeout했고 targeted Playwright `2 passed`를 확인했다.
- `MM3-241`에서 MM3 UI refinement roadmap 전체를 closeout했다.
- `MM3-242`에서 user approval 기준 new design tranche를 열었다.
- `MM3-243`에서 explorer chrome visual refresh를 반영했고 smoke `2 passed`를 확인했다.
- `MM3-243` first slice는 sidebar/list/detail shell까지 확장됐고 smoke `2 passed`를 다시 확인했다.
- `MM3-243`는 search/dropdown/detail internals까지 포함해 closeout됐다.
- `MM3-244`에서 mindmap canvas control/tooltip surface refresh를 반영했고 targeted Playwright `3 passed`를 확인했다.
- `MM3-244`는 node/link visual restyle까지 포함해 closeout됐다.
- `MM3-245`에서 detail surface card harmonization을 반영했고 targeted Playwright `3 passed`를 확인했다.
- `MM3-246`에서 new design tranche 전체를 closeout했다.
- `MM3-247`에서 interaction surface polish tranche를 열었다.
- `MM3-248`에서 filter/dropdown surface refresh를 반영했고 targeted Playwright `2 passed`를 확인했다.
- `MM3-249`에서 filter/dropdown surface refresh를 closeout했다.
- `MM3-250`에서 search result panel guidance를 반영했고 targeted Playwright `4 passed`를 확인했다.
- `MM3-252`에서 interaction surface polish tranche 전체를 closeout했다.
- `MM3-253`에서 status surface polish tranche를 열었다.
- `MM3-254`에서 loading/empty/no-result surface refresh를 반영했고 smoke `2 passed`를 확인했다.
- `MM3-255`에서 status surface polish tranche 전체를 closeout했다.
- `MM3-256`에서 user review wave 01을 intake했고 immediate practical compression/search row fix를 반영했다.
- `MM3-259`에서 review wave 02 기준 top-shell/detail compression, search row density, split-header alignment fix를 반영했다.
- `MM3-260`에서 top architecture three-expert review와 improved plan을 고정했다.
- `MM3-257`에서 category-level count semantics를 고정했고 3축 공통 implementation을 반영했다.
- `MM3-258`에서 situation tree repeated label redundancy가 source-shaped issue임을 runtime evidence로 고정했다.
- `MM3-261`에서 top architecture consolidation implementation을 반영했고 `MM3 Explorer` wording도 `Explorer`로 정리했다.
- `MM3-262` plan packet이 추가됐고 first sentinel `14112 실제로` 기준 audit taxonomy를 잠갔다.
- `MM3-262A` sentinel lineage map packet이 추가됐다.
- `MM3-262`는 closeout됐다.
- `MM3-262A/B/C` packets이 추가됐고, current runtime detail fidelity issue는 repaired state다.
- post-repair 기준 `kcenter_base -> APP_READY_DETAIL_MAP` example loss diff는 `0`이다.
- `14112 실제로`는 runtime detail/rich에서 `9` example texts, examples chunk에서 `27` examples로 복구됐다.
- `MM3-258B`는 closeout됐다.
- repeated `scene/category` situation label은 learner-facing path collapse + category structural label `어휘 목록`으로 정리됐다.
- `MM3-261B` opening packet이 추가됐다.
- `MM3-261B` first polish batch packet이 추가됐다.
- first polish batch에서는 shell contrast / edge rhythm / panel emphasis만 정리했고 structure는 유지했다.
- `MM3-263` subject-none policy packet이 추가됐다.
- `주제 및 상황 = 없음` 중복 `4,488`개는 `의미 범주`로만 남기고, none-only `468`개는 live canonical/runtime에서 제외했다.
- current runtime search row count는 `53,012`, situation tree row count는 `6,399`다.
- `MM3-264` taxonomy packet이 추가됐다.
- `주제 및 상황`은 `A` canonical middle layer로 묶이고, `E`는 quick-entry overlay로만 노출된다.
- `MM3-265` opening packet이 추가됐다.
- `분류 밖 항목` 처리/재분류는 external dictionary comparison까지 포함한 별도 study task로 분리됐다.
- `MM3-266` opening packet이 추가됐다.
- 자료 구조 자체의 저장/분할/중복 제거 최적화는 별도 study/design task로 분리됐다.
- `MM3-266A` payload weight and duplication audit packet이 추가됐다.
- current weight baseline은 canonical source `1.45 GB`, runtime live `1.37 GB`, compressed runtime `195.9 MB`다.
- `MM3-266B` options study packet이 추가됐다.
- `MM3-266C` recommended architecture packet이 추가됐다.
- `MM3-267` opening packet이 추가됐다.
- current runtime performance work는 `LFS`/storage와 분리된 next task로 고정됐다.
- current `MM3-267` packet은 boot/search, immediate meaning load, chunk refetch, canvas redraw를 separate bottlenecks로 다시 잠갔다.
- first tranche는 `T1 Loader/Caching Hardening`으로 고정됐다.
- `MM3-267` implementation packet이 추가됐다.
- default meaning tab은 `idle + hard-timeout` kickoff로 내려갔고 explicit tab/search intent는 immediate load로 승격된다.
- `chunk_id` parsed chunk cache + in-flight dedupe가 추가됐다.
- `window.__MM3_RUNTIME_INTERACTION_PERF__` interaction probe가 추가됐다.
- runtime tab tree path is now derived from `APP_READY_SEARCH_INDEX` category projection, so the app no longer fetches the three large tree payloads at runtime.
- `npm run build`가 통과했다.
- `npx playwright test tests/smoke.spec.js tests/scenario.spec.js`가 `5 passed`다.
- `MM3-267B` `Vercel` deployed perf verification은 closeout됐다.
- latest production custom domain recheck 기준 `의미 범주(44,410)`과 tree scene list가 다시 렌더된다.
- `MM3-266F` closeout chain은 완료됐고 current active work는 계속 `MM3-261B`다.
- `MM3-261B` batch 03 `detail primary card spacing cadence` 구현은 `build PASS`, `Playwright 5 passed`로 검증됐다.
- `MM3-266F` draft 기준 preferred target은:
  - hot: `APP_READY_SEARCH_INDEX`, `APP_READY_FACETS`
  - on-demand: `APP_READY_CHUNK_RICH_*`, `APP_READY_CHUNK_EXAMPLES_*`, `CHUNK_MANIFEST_V1`
  - demote from learner runtime fetch: tree trio
  - demote from primary runtime truth: `APP_READY_DETAIL_MAP`
- `MM3-266F` execution plan packet이 추가됐다.
- selected first tranche는 `T1 Formalize Search-Index-Derived Tree Runtime`이다.
- `MM3-266F` execution plan은 PM validation / 3-expert review / PM improvement / revalidation까지 닫혔다.
- current plan verdict is `ACCEPT_FOR_IMPLEMENTATION`.
- `MM3-266F / T1` implementation packet이 추가됐다.
- dead tree runtime loader path는 제거됐고 projected tree path가 current runtime contract로 고정됐다.
- `MM3-266F / T2` preparation packet이 추가됐다.
- `DETAIL_MAP` demotion의 현재 blocker는:
  - runtime fallback dependency
  - chunk build dependency
  - repair script dependency
- fallback retirement decision은 `debug-only fallback`으로 고정됐다.
- chunk build source migration decision은 `canonical direct path`로 고정됐다.
- `debug-only fallback gate + canonical-direct chunk builder` plan packet이 추가됐다.
- `canonical-direct chunk builder` implementation은 local packaging까지 통과했다.
- `debug-only fallback gate` implementation packet이 추가됐다.
- normal learner runtime no longer uses `DETAIL_MAP` as a silent fallback.
- PM은 authoritative output으로 완전히 승격할 수 있도록 지속적으로 개선해야 한다.
- post-closeout feedback queue `MM3-202A`~`MM3-206A`는 closeout까지 반영됐다.
- screenshot feedback queue `MM3-207A`~`MM3-209A`도 closeout까지 반영됐다.
- `Playwright` full suite는 `39 passed`다.

## Important Clarification

- raw/internal `미분류`와 learner-facing `분류 밖 항목`은 서로 다른 bucket이 아니다.
- same underlying bucket의 layer-specific naming이다.

## Tier 1 Reads

1. `pm-operating-guide.md`
2. `08_planning/TASKLIST_V1.md`
3. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
4. `08_planning/reports/20260328_MM3_268_NEXT_PM_HANDOFF_PACKET_V1.md`

## Tier 2 Reads

1. `08_planning/reports/20260328_MM3_268_FEEDBACK_INTAKE_AND_EXECUTION_PLAN_V1.md`
2. `08_planning/reports/20260328_MM3_268_NEXT_PM_HANDOFF_PACKET_V1.md`
3. `08_planning/reports/20260328_MM3_268A_EXAMPLE_TYPE_PRIORITY_DECISION_DRAFT_V1.md`
4. `08_planning/reports/20260328_MM3_268B_UNCLASSIFIED_FLOATING_NODE_ANALYSIS_V1.md`

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

- current blocker는 current limited authoritative boundary 안에서는 없다.
- `chunk_id`는 current semantic authority gate 밖의 runtime-enrichment로 고정됐다.
- `MM3-226A` canonical `chunk_id` mapping 신규 생성은 parked backlog로 남아 있다.
- TOPIK stats policy 자체는 승인 완료 상태다.
- `original_language_type` 자체는 blocker가 아니다.
- `MM3-217C` 지속적 개선 track은 tasklist에서 계속 유지되어야 한다.

## Next PM Actions

1. `MM3-268A`~`MM3-268H`는 모두 `DONE`이다.
2. current active execution package는 `none`이다.
3. 다음 feedback이나 PM directive가 오기 전까지는 새 active work를 열지 않는다.
