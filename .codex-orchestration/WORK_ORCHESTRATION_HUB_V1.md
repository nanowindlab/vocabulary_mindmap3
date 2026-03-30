# WORK_ORCHESTRATION_HUB_V1

## Project

- Name: 어휘 마인드맵 3
- Current Phase: `Phase 2 Relation Explorer App Planning`
- Main PM: `Codex`
- PM Canonical Docs: `08_planning/`

## Read Order

1. `08_planning/TASKLIST_V1.md`
2. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
3. `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
4. `08_planning/reports/20260330_MM3_303_RELATION_EXPLORER_LEARNER_MODE_IMPLEMENTATION_PLAN_V1.md`
5. `pm-operating-guide.md`
6. `08_planning/RELATION_EXPLORER_APP_FOUNDATION_V1.md`

## Guardrails

- `vocab_dictionary`가 유일한 사전 SSOT다.
- `vocabulary_mindmap2`와 `digital_grammer_dict`는 read-only reference다.
- 현재 phase에서는 기술 구현보다 문서 체계가 canonical이다.
- 운영 강도는 `엄격`이다.
- 업무지시와 보고서는 한국어를 기본으로 한다.
- `mindmap2`에서 가져오는 것은 운영 참고, UI rhythm, TOPIK stats뿐이며 taxonomy 개념은 그대로 가져오지 않는다.
- 문서 요약보다 실제 artifact를 우선한다.
- active state source of truth는 `08_planning/TASKLIST_V1.md`, `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`, `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`, `08_planning/reports/20260330_MM3_303_RELATION_EXPLORER_LEARNER_MODE_IMPLEMENTATION_PLAN_V1.md`다.
- 스크립트/앱 작업은 사용자가 별도로 다시 열기 전까지 parked backlog다.
- 모든 agent lane은 기본적으로 `작업 -> 검증 -> learner 포함 3인 전문가 비판 검토 -> 개선 -> 재검증` 루프를 거친다.

## Active Work Package

- `MM3-307`
- latest closeout: `MM3-305`
- blocker: `Cloudflare R2 not enabled`

## Immediate Next Outcomes

1. current active execution package는 `MM3-307 R2 Ready Deploy Chain And Storage Cleanup`
2. local prep/workspace cleanup은 완료됐고 actual external cutover만 남아 있다
3. first actual cutover unit은 `full build-side runtime bundle -> R2`다

## Planned Workset

- Phase 2 Workflow A:
  - `WS15 / MM3-303A`
    - `DONE`
    - learner entry and shell simplification
    - write boundary: `10_relation_app/src/App.jsx`, `10_relation_app/src/index.css`
    - expected output: first-screen intent reset + dev-facing shell copy removal + packet `20260330_MM3_303A_RELATION_ENTRY_AND_SHELL_SIMPLIFICATION_V1.md`
  - `WS16 / MM3-303B`
    - `DONE`
    - layer compression and progressive disclosure
    - write boundary: `10_relation_app/src/App.jsx`, `10_relation_app/src/index.css`
    - expected output: filter collapse + right-rail reduction + packet `20260330_MM3_303B_RELATION_LAYER_COMPRESSION_AND_DISCLOSURE_V1.md`
  - `WS17 / MM3-303C`
    - `DONE`
    - learner compare/detail copy split
    - write boundary: `10_relation_app/src/App.jsx`
    - expected output: learner copy hierarchy + debug/detail separation + packet `20260330_MM3_303C_COMPARE_AND_DETAIL_LEARNER_COPY_REFRAME_V1.md`
  - `WS18 / MM3-303D`
    - `DONE`
    - type scale and responsive layout pass
    - write boundary: `10_relation_app/src/index.css`, `10_relation_app/src/App.jsx`
    - expected output: readability-first hierarchy + mobile order pass + packet `20260330_MM3_303D_TYPE_SCALE_AND_RESPONSIVE_LAYOUT_PASS_V1.md`
  - `WS19 / MM3-303E`
    - `DONE`
    - validation and PM acceptance loop
    - write boundary: PM packet/control-plane + validation rerun as needed
    - expected output: acceptance packet `20260330_MM3_303E_LEARNER_MODE_VALIDATION_AND_ACCEPTANCE_V1.md`
- Phase 2 Workflow B:
  - parked follow-on only
- Phase 2 Workflow C:
  - parked follow-on only

- `WS1 / MM3-285` `DONE`
  - relation compare contract
  - write boundary: PM packet + tasklist/control-plane if task state changes
  - expected output: relation contract packet + implementation checklist

- `WS2 / MM3-286` `DONE`
  - relation compare implementation
  - write boundary: `09_app/src/components/TermDetail.jsx` + relation tests + PM packet
  - expected output: relation compare implementation + validation evidence

- `WS3 / MM3-287` `DONE`
  - expression idiom/proverb contract
  - write boundary: PM packet + planning/control-plane docs only as needed
  - expected output: expression contract packet + implementation checklist

- `WS4 / MM3-288` `DONE`
  - expression idiom/proverb implementation
  - write boundary: `09_app/src/components/TermDetail.jsx` + expression tests + PM packet
  - expected output: expression redesign implementation + validation evidence

- `WS5 / MM3-291`
  - `DONE`
  - relation explorer IA canonical
  - write boundary: PM packet + planning docs
  - expected output: IA canonical + study unit definition

- `WS6 / MM3-292`
  - `DONE`
  - relation navigator data contract
  - write boundary: PM packet + data/architecture docs only
  - expected output: shared data contract + derived relation navigator rule

- `WS7 / MM3-293`
  - `DONE`
  - workspace / Vercel multi-project topology
  - write boundary: PM packet + foundation / deploy docs
  - expected output: build/deploy topology rule

- `WS8 / MM3-294`
  - `DONE`
  - relation explorer shell opening
  - write boundary: `10_relation_app/` only
  - expected output: app shell opening

- `WS9 / MM3-295`
  - `DONE`
  - expression follow-on planning
  - write boundary: PM packet + roadmap docs
  - expected output: later expression roadmap registration

- `WS10 / MM3-296`
  - `DONE`
  - relation navigator data wiring
  - write boundary: `10_relation_app/` + shell data adapter only
  - expected output: shell-to-data integration

- `WS11 / MM3-297`
  - `DONE`
  - relation compare detail and mindmap wiring
  - write boundary: `10_relation_app/` only
  - expected output: actual compare/detail jump + mindmap expansion wiring

- `WS12 / MM3-298`
  - `DONE`
  - relation explorer local preview launch
  - write boundary: local run only
  - expected output: user-viewable local preview

- `WS13 / MM3-299`
  - `DONE`
  - relation route and deep detail follow-on
  - write boundary: `10_relation_app/` only
  - expected output: route-level jump + deeper detail fetch refinement

- `WS14 / MM3-300`
  - `DONE`
  - relation top filter carryover
  - write boundary: `10_relation_app/` only
  - expected output: MM3-style top filter carryover

## Active Agents

- `SOURCE_SCHEMA_AGENT`
  - role: working agent
  - board: `.codex-orchestration/SOURCE_SCHEMA_AGENT_WORKBOARD_V1.md`
  - output: `.codex-orchestration/reports/MM3-002_SOURCE_SCHEMA_REVIEW_REPORT_V1.md`
- `REVIEW_AGENT`
  - role: review-only agent
  - board: `.codex-orchestration/REVIEW_AGENT_WORKBOARD_V1.md`
  - output: review verdict appended to source workboard
- `DATA_VALIDATION_AGENT`
  - role: evidence validation lane
  - board: `.codex-orchestration/DATA_VALIDATION_AGENT_WORKBOARD_V1.md`
  - trigger: count drift, artifact/schema mismatch, runtime reflection check
  - current status: `DONE`
- `SCENARIO_AGENT`
  - role: scenario drafting lane
  - board: `.codex-orchestration/SCENARIO_AGENT_WORKBOARD_V1.md`
  - output: `.codex-orchestration/reports/MM3-003_SCENARIO_DRAFT_REPORT_V1.md`
  - current status: `DRAFT_ONLY`
- `SOURCE_DISCOVERY_AGENT`
  - role: source structure discovery lane
  - board: `.codex-orchestration/SOURCE_DISCOVERY_AGENT_WORKBOARD_V1.md`
  - output: `.codex-orchestration/reports/MM3-003_SOURCE_STRUCTURE_DISCOVERY_REPORT_V1.md`
  - current status: `DISPATCHED`
- `TAXONOMY_AGENT`
  - role: taxonomy decision package lane
  - board: `.codex-orchestration/TAXONOMY_AGENT_WORKBOARD_V1.md`
  - output: `.codex-orchestration/reports/MM3-004_TAXONOMY_DECISION_PACKAGE_V1.md`
  - current status: `STANDBY`
- `IA_AGENT`
  - role: IA package lane
  - board: `.codex-orchestration/IA_AGENT_WORKBOARD_V1.md`
  - output: `.codex-orchestration/reports/MM3-009_IA_PACKAGE_V1.md`
  - current status: `DISPATCHED`

## Review Control

- PM review queue: `.codex-orchestration/PM_REVIEW_QUEUE_V1.md`
- User does not need to relay messages to each sub-agent individually.
- Main PM dispatches, receives, and integrates sub-agent outputs in this thread.
- 단, 새 agent dispatch 전에는 사용자에게 먼저 요약 보고와 문서 링크를 제공하고 승인받는다.
- PM는 각 보고서에서 비판 검토와 재검증 흔적이 부족하면 그대로 accept하지 않는다.

## Workflow Discipline

- 예측 가능한 인접 단계는 하나의 workflow로 묶어 전진한다.
- 예:
  - triage -> repair packet -> readiness -> revalidation criteria
  - structure choice -> scenario -> IA -> runtime contract
- PM는 workflow 안에서 단계별 문서와 acceptance를 계속 남기되, 사용자 승인 필요 지점에서만 멈춘다.
