# 어휘 마인드맵 3 (Vocabulary Mindmap 3)

> 한국어 기초사전 집대성본을 단일 사전 SSOT로 삼고, `vocabulary_mindmap2`의 learner-facing 운영 경험을 참고해 새 단어 마인드맵 서비스를 기획하는 프로젝트입니다.

## 현재 phase 목표

- current `09_app/` vocabulary mindmap app은 `Phase 1` closeout baseline으로 본다.
- current active planning은 `Phase 2 separate relation explorer app` kickoff다.
- 운영 강도는 `엄격`으로 고정한다.
- 현재 문서의 역할은 다음 PM 스레드가 문서와 현재 runtime baseline만 읽고도 같은 상태를 재현할 수 있게 만드는 것이다.

## 프로젝트 목표

- 단일 사전 소스는 `vocab_dictionary/`만 사용한다.
- TOPIK 기반 `frequency`, `rank`, `round_count`, `band`, `level` 값은 읽기 전용 레퍼런스인 `vocabulary_mindmap2`에서만 가져온다.
- UI와 layout은 향후 `vocabulary_mindmap2/09_app`를 참고하되, taxonomy와 학습 흐름은 `mindmap3` source 구조에서 다시 발견한다.
- `vocabulary_mindmap2`와 `digital_grammer_dict`는 참고용 read-only 프로젝트로만 취급한다.

## 현재 운영 기준

- Main PM: Codex
- 현재 phase: `Phase 2 Relation Explorer App Planning`
- current PM operating guide: `pm-operating-guide.md`
- 현재 authoritative todo: `08_planning/TASKLIST_V1.md`
- 현재 control plane: `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
- 현재 handoff: `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`

## 우선 읽기 순서

1. `08_planning/TASKLIST_V1.md`
2. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
3. `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
4. `08_planning/reports/20260330_MM3_303_RELATION_EXPLORER_LEARNER_MODE_IMPLEMENTATION_PLAN_V1.md`
5. `pm-operating-guide.md`
6. `.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`

## 핵심 SSOT / 참고 경계

- Primary dictionary SSOT:
  - `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
  - `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`
- Derived canonical runtime build artifact:
  - `vocab_dictionary/output/unified_live/kcenter_chunk_id_mapping.json.gz`
- Read-only TOPIK stats reference:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap2/09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- Read-only PM/process reference:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/digital_grammer_dict/.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`

## 현재 상태 메모

- current artifact truth는 `53,012` entry 기준이다.
- `53,480`은 current live/runtime entry count가 아니라 historical `api_xml_merged` total이다.
- `word-first + dual category + sense core`가 현재 구조 기준이다.
- search + facet, tree shell, detail, expression 보조 진입이 앱에 연결돼 있다.
- `의미 관계어`, `관련형`은 detail panel 탐색 경로로 동작한다.
- `subword`는 현재 대부분 preview 중심이며, exact jumpable item은 매우 드물다.
- `MM3-187F3`~`MM3-187I`, `MM3-196`, `MM3-197` 기준으로 direct learner-facing feedback과 guide 작성은 닫혔다.
- `MM3-171B Render-Side Performance Optimization`은 `MM3-199 R7` 기준으로 closeout됐다.
- terminology note: raw/internal `미분류` bucket을 learner-facing UI에서는 `분류 밖 항목`으로 보여 준다. 둘은 다른 bucket이 아니다.
- 앱 runtime payload는 `JSON` 유지다.
- current gate는 전체 기준 `PARTIAL_OPEN`, core explorer slice 기준 `OPEN`이다.
- `MM3-210`은 closeout됐다.
- `MM3-212`에서 runtime/source payload validation과 count reconciliation은 `PASS`로 고정됐다.
- `MM3-216`에서 TOPIK stats linkage policy를 고정했다.
- current active execution task는 `MM3-307 R2 Ready Deploy Chain And Storage Cleanup`이다.
- latest closeout packet은 `08_planning/reports/20260330_MM3_305_RELATION_FAMILY_TOP_NAV_AND_BUCKET_LEFT_RAIL_RELAYOUT_V1.md`다.
- current review/blocker packet은 `08_planning/reports/20260330_MM3_306_GITHUB_VERCEL_R2_CUTOVER_REVIEW_AND_BLOCKER_V1.md`다.
- current implementation packet은 `08_planning/reports/20260330_MM3_307_R2_READY_DEPLOY_CHAIN_AND_STORAGE_CLEANUP_V1.md`다.
- current blocker는 `Cloudflare R2 not enabled`이고, evidence는 `wrangler r2 bucket list -> Please enable R2 through the Cloudflare Dashboard. [code: 10042]`다.
- current review verdict는 mixed split (`100MB 초과 파일만 R2`)이 insufficient이며, safe cutover unit은 `full build-side runtime bundle`이다.
- `MM3-307`에서 `R2`-ready build chain, dist prune, tracked waste cleanup을 반영했다.
- shipped `09_app/dist/data/internal/runtime_payloads` duplicate는 제거됐고 `dist/data/live`는 `861.42 MB` 기준으로 줄었다.
- latest implementation packet은 `08_planning/reports/20260330_MM3_303A_RELATION_ENTRY_AND_SHELL_SIMPLIFICATION_V1.md`다.
- latest implementation packet 2는 `08_planning/reports/20260330_MM3_303B_RELATION_LAYER_COMPRESSION_AND_DISCLOSURE_V1.md`다.
- latest implementation packet 3는 `08_planning/reports/20260330_MM3_303C_COMPARE_AND_DETAIL_LEARNER_COPY_REFRAME_V1.md`다.
- latest implementation packet 4는 `08_planning/reports/20260330_MM3_303D_TYPE_SCALE_AND_RESPONSIVE_LAYOUT_PASS_V1.md`다.
- current learner-mode redesign verdict는 `PARTIAL_ACCEPT`다.
- current `09_app/`은 Phase 1 frozen baseline이다.
- Phase 2는 separate `관계 탐색 앱`으로 연다.
- same workspace / same repo 안에서 `10_relation_app/`를 여는 방식이 current recommendation이다.
- `MM3-285`, `MM3-286`을 같은 turn bundle로 닫아 relation compare contract와 implementation을 완료했다.
- `MM3-287`, `MM3-288`을 같은 turn bundle로 닫아 expression idiom/proverb contract와 implementation을 완료했다.
- current relation tab은 `빠른 비교 -> 확장 관계 -> 형태·문체 변이 -> 관련형 -> 연관 어휘 -> 교차 연결 장면` 순서를 사용한다.
- current expression tab은 `관용구와 속담` support surface와 `관용구 / 속담` section 구조를 사용한다.
- `MM3-289` verdict는 same-app dedicated route `NOT_READY_YET`다.
- latest closeout report는 `MM3-302 2026-03-30 Relation Explorer Learner Journey Deep Research And UX Review`다.
- `MM3-302` verdict는 relation-first concept `ACCEPT`, current learner-facing UI readiness `REJECT`, redesign direction `ACCEPT_FOR_IMPLEMENTATION`이다.
- `MM3-291`에서 separate relation explorer app의 `MM3` theme continuity, relation family direct opening, subgroup tree, relation study card 중심 scenario가 고정됐다.
- `MM3-292`에서 subgroup split trigger, card minimum field, compare input contract를 current schema 기준으로 고정했다.
- `MM3-292`에서 branch 기준은 current schema direct use/adapt only로 좁히고, totally new DB schema는 열지 않는 contract를 다룬다.
- `MM3-293`에서 same repo / separate app / separate Vercel project topology를 고정했다.
- `MM3-294`에서 `10_relation_app/` shell을 열었고 `npm run build`를 통과했다.
- `활용 표현` later follow-on planning은 `MM3-295`에서 닫았다.
- `MM3-296`에서 actual relation bootstrap과 family JSON을 생성했고 shell을 fetched data 기준으로 연결했으며, updated XML / MM3 payload 기준 재생성도 반영했다.
- `MM3-297`에서 compare/detail/mindmap interaction을 actual interactive state로 올렸다.
- `MM3-299`에서 route hash state와 deeper detail metadata refinement를 반영했다.
- `MM3-300`에서 상단 filter carryover, source 전체 번역 언어 노출, `영어` default, `TOPIK 빈도 1~5` options를 반영했다.
- handoff 시점에는 active preview를 고정하지 않는다.
- current queue는 비어 있다.
- Phase 2 planned queue는 없다.
- source-ambiguous `related_forms`는 SSOT source에 target이 없으므로 `text-only`로 유지하고, current backlog로 다시 열지 않는다.
- `분류 밖 항목`은 main nav tab에서는 제거됐고, search result와 search-driven detail route로만 계속 접근한다.
- current deploy boundary payload는 explicit/manual path로 `npm --prefix 09_app run rebuild:canonical-runtime`로 다시 생성할 수 있다.
- default deploy path는 committed `runtime_payloads/*.json.gz`를 복원해서 사용한다.
- integrated review `V4`는 registered remediation basis이며, current order는 `MM3-273 -> MM3-274 -> MM3-275 -> MM3-276 -> MM3-277`다.
- default build path는 canonical mapping availability를 자동 보장하고, release/build path는 canonical rebuild provenance를 먼저 실행한다.
- chunk manifest와 example chunk build는 같은 chunk membership source를 사용한다.
- current boundary chunk contract validation과 node contract tests가 추가됐다.
- app runtime와 canonical rebuild는 current boundary에서 같은 projection module을 사용한다.
- `kcenter_chunk_id_mapping.json.gz`는 current boundary에서 `09_app` build tooling이 관리하는 derived canonical runtime build artifact다.
- filter panel label은 `TOPIK빈도`를 사용하고, order는 `난이도 -> 품사 -> TOPIK빈도 -> 번역 언어`다.
- current learner-facing `search + facets only` builder surface는 package/build-chain에 non-authoritative sidecar gate로 편입됐다.
- `MM3-217C`에서 initial authoritative candidate는 `search semantic fields + facets`로 고정됐다.
- authoritative write path / rollback / dual-run diff protocol은 정의됐다.
- `chunk_id`는 current tranche에서 runtime-enrichment로 고정됐다.
- current authoritative runtime boundary는 `search semantic fields + facets`다.
- current learner-facing UI refinement roadmap, new design tranche first pass, interaction surface polish tranche, status surface polish tranche는 모두 closeout됐다.
- `MM3-262` XML-to-app reliability audit은 closeout됐다.
- XML-derived detail examples/relations는 package chain의 detail fidelity repair로 app runtime까지 다시 연결된다.
- `MM3-258B`에서 repeated situation label은 learner-facing path collapse + tree category `어휘 목록` rule로 정리됐다.
- review-driven remediation cycle은 닫혔다.
- broader parity / provenance completion은 parked backlog로 유지한다.
- latest review wave 기준 `MM3-257A`, `MM3-258A` study task가 추가됐다.
- latest review wave 02 practical layout fixes는 반영 완료 상태다.
- latest review wave 03 기준 `MM3-260C`, `MM3-261A` top architecture follow-up task가 추가됐다.
- `MM3-257A`, `MM3-258A`, `MM3-260C`, `MM3-261A`는 closeout됐고, current open follow-up은 `MM3-258B`, `MM3-261B`다.
- `PRODUCT_SCENARIO_SPEC_V1.md`는 current learner-facing scenario canonical로 승격됐다.
- latest pilot capture는 `08_planning/pilot_feedback/20260326_pilot_session_04.md`에 정리돼 있다.
- additional human feedback residual queue `MM3-168`~`MM3-173`가 기록돼 있다.
- residual queue는 `MM3-174` 파이프라인 기준으로 관리한다.
- post-closeout 추가 피드백 queue `MM3-202A`~`MM3-206A`는 closeout까지 반영됐고, 최신 packet은 `08_planning/reports/20260326_MM3_202_POST_CLOSEOUT_DETAIL_SURFACE_FOLLOWUP_IMPLEMENTATION_V1.md`다.
- screenshot follow-up `MM3-207A`~`MM3-209A`도 closeout까지 반영됐고, 최신 packet은 `08_planning/reports/20260326_MM3_207_SCREENSHOT_FEEDBACK_RELATION_EXAMPLE_FOLLOWUP_V1.md`다.

## 문서 지도

- `PROJECT_DOCUMENT_MAP.md`
