# 어휘 마인드맵 3 (Vocabulary Mindmap 3)

> 한국어 기초사전 집대성본을 단일 사전 SSOT로 삼고, `vocabulary_mindmap2`의 learner-facing 운영 경험을 참고해 새 단어 마인드맵 서비스를 기획하는 프로젝트입니다.

## 현재 phase 목표

- 이번 phase는 `core explorer runtime wiring`을 안정화하고 learner flow QA로 넘길 기준을 고정하는 것이다.
- 운영 강도는 `엄격`으로 고정한다.
- 현재 문서의 역할은 다음 PM 스레드가 문서와 현재 runtime baseline만 읽고도 같은 상태를 재현할 수 있게 만드는 것이다.

## 프로젝트 목표

- 단일 사전 소스는 `vocab_dictionary/`만 사용한다.
- TOPIK 기반 `frequency`, `rank`, `round_count`, `band`, `level` 값은 읽기 전용 레퍼런스인 `vocabulary_mindmap2`에서만 가져온다.
- UI와 layout은 향후 `vocabulary_mindmap2/09_app`를 참고하되, taxonomy와 학습 흐름은 `mindmap3` source 구조에서 다시 발견한다.
- `vocabulary_mindmap2`와 `digital_grammer_dict`는 참고용 read-only 프로젝트로만 취급한다.

## 현재 운영 기준

- Main PM: Codex
- 현재 phase: `M1 Runtime Wiring / Core Explorer`
- current PM operating guide: `pm-operating-guide.md`
- 현재 authoritative todo: `08_planning/TASKLIST_V1.md`
- 현재 control plane: `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
- 현재 handoff: `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`

## 우선 읽기 순서

1. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
2. `.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`
3. `08_planning/TASKLIST_V1.md`
4. `pm-operating-guide.md`
5. `08_planning/DOCUMENT_SYSTEM_POLICY_V1.md`
6. `08_planning/DATA_ARCHITECTURE_V1.md`
7. `08_planning/PRODUCT_SCENARIO_SPEC_V1.md`
8. `08_planning/PROJECT_DECISION_LOG_V1.md`

## 핵심 SSOT / 참고 경계

- Primary dictionary SSOT:
  - `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
  - `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`
- Read-only TOPIK stats reference:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap2/09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- Read-only PM/process reference:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/digital_grammer_dict/.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`

## 현재 상태 메모

- current artifact truth는 `53,480` 기준이다.
- `word-first + dual category + sense core`가 현재 구조 기준이다.
- search + facet, tree shell, detail, expression 보조 진입이 앱에 연결돼 있다.
- `의미 관계어`, `관련형`, `subword` 카드 점프까지 detail panel에서 동작한다.
- `MM3-187F3`~`MM3-187I`, `MM3-196`, `MM3-197` 기준으로 direct learner-facing feedback과 guide 작성은 닫혔다.
- `MM3-171B Render-Side Performance Optimization`은 `MM3-199 R7` 기준으로 closeout됐다.
- terminology note: raw/internal `미분류` bucket을 learner-facing UI에서는 `분류 밖 항목`으로 보여 준다. 둘은 다른 bucket이 아니다.
- 앱 runtime payload는 `JSON` 유지다.
- current gate는 전체 기준 `PARTIAL_OPEN`, core explorer slice 기준 `OPEN`이다.
- `MM3-210`은 closeout됐다.
- `MM3-212`에서 runtime/source payload validation과 count reconciliation은 `PASS`로 고정됐다.
- `MM3-216`에서 TOPIK stats linkage policy를 고정했다.
- 다음 active step은 `MM3-261B Top Architecture Theme Continuity Art-Direction Polish`다.
- current learner-facing `search + facets only` builder surface는 package/build-chain에 non-authoritative sidecar gate로 편입됐다.
- `MM3-217C`에서 initial authoritative candidate는 `search semantic fields + facets`로 고정됐다.
- authoritative write path / rollback / dual-run diff protocol은 정의됐다.
- `chunk_id`는 current tranche에서 runtime-enrichment로 고정됐다.
- current authoritative runtime boundary는 `search semantic fields + facets`다.
- current learner-facing UI refinement roadmap, new design tranche first pass, interaction surface polish tranche, status surface polish tranche는 모두 closeout됐다.
- `MM3-262` XML-to-app reliability audit은 closeout됐다.
- XML-derived detail examples/relations는 package chain의 detail fidelity repair로 app runtime까지 다시 연결된다.
- `MM3-258B`에서 repeated situation label은 learner-facing path collapse + tree category `어휘 목록` rule로 정리됐다.
- 다음 핵심 작업은 `MM3-261B` theme continuity art-direction polish다.
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
