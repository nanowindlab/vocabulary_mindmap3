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
- 현재 authoritative todo: `08_planning/TASKLIST_V1.md`
- 현재 control plane: `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
- 현재 handoff: `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`

## 우선 읽기 순서

1. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
2. `.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`
3. `08_planning/TASKLIST_V1.md`
4. `.codex-orchestration/PM_OPERATING_MODEL_V1.md`
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
- 앱 runtime payload는 `JSON` 유지다.
- current gate는 전체 기준 `PARTIAL_OPEN`, core explorer slice 기준 `OPEN`이다.
- 다음 핵심 작업은 `MM3-096 Human Pilot Scheduling / Execution`이다.

## 문서 지도

- `PROJECT_DOCUMENT_MAP.md`
