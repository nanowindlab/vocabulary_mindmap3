# 20260327_MM3_262_XML_TO_APP_DATA_RELIABILITY_AUDIT_PLAN_V1

## Header

- Packet name: `MM3-262 XML-to-App Data Reliability Audit Plan`
- Packet role: `plan`
- Task ID: `MM3-262`
- Parent pipeline or workflow: `M1 Runtime Wiring / Core Explorer`
- Status: `IN_PROGRESS`
- Current Revision: `R1`
- Last Updated: `2026-03-27 11:20 KST`
- Last Updated By: `Codex PM`

## Purpose

- Why this packet exists:
  - `raw XML -> unified base -> runtime payload -> app projection` 전구간을 다시 추적해 hidden loss, partial merge, stale projection, display-only loss를 찾기 위한 audit plan을 고정한다.
- What it decides, verifies, or locks:
  - `MM3-262`를 current top-priority audit task로 재고정한다.
  - first sentinel `14112 실제로`를 seed evidence로 사용한다.
  - 예문/관련어처럼 layer마다 조용히 잘리거나 축약될 수 있는 필드를 우선 감사 축으로 고정한다.

## Instruction Coverage

- Explicit user instructions reflected here:
  - XML source에서 app까지 데이터 연결 과정을 전부 재검토
  - 오류 혹은 누락이 있는지 찾을 수 있도록 계획 수립
  - 숨은 문제를 찾는 audit 방식 정의
  - `실제로` XML 사례를 최우선 sentinel로 반영
  - XML 기준 `문장/대화/구` 예문 누락과 `유의어` 연결 누락 가능성을 별도 추적 축으로 반영
- Requested exclusions or non-goals:
  - 이번 packet은 plan/audit lock이 목적이며, implementation fix 자체를 완료로 간주하지 않는다.
- Formatting or reporting constraints:
  - control-plane은 간결하게 유지하고 detailed reasoning은 이 packet에만 둔다.
- Any blocked instruction and reason:
  - `unified base` 내부 lookup key가 `id` direct map이 아니라 별도 traversal이 필요해, first pass에서는 sentinel evidence와 layer pointers를 우선 고정한다.

## Source Of Truth

- Authoritative tasklist row:
  - `08_planning/TASKLIST_V1.md` -> `MM3-262 XML-to-App Data Reliability Audit`
- Dashboard pointer:
  - `.codex-orchestration/ORCHESTRATION_DASHBOARD.md` -> `MM3-262` / current step `MM3-262A lineage map`
- Handoff pointer:
  - `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
- Related workboard or review queue item:
  - none

## Inputs

- Required docs:
  - `README.md`
  - `08_planning/TASKLIST_V1.md`
  - `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
  - `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
- Required reports:
  - `08_planning/reports/20260327_MM3_261_TOP_ARCHITECTURE_CONSOLIDATION_IMPLEMENTATION_V1.md`
  - `08_planning/reports/20260327_MM3_258_SITUATION_TREE_REPEATED_LABEL_REDUNDANCY_STUDY_V1.md`
- Required artifacts or evidence paths:
  - `vocab_dictionary/output/api_xml_live/view_14112.xml`
  - `vocab_dictionary/output/unified_live/kcenter_base.json`
  - `09_app/public/data/live/APP_READY_DETAIL_MAP.json`
  - `09_app/public/data/live/APP_READY_CHUNK_RICH_chunk-0001.json`
  - `09_app/public/data/live/APP_READY_CHUNK_EXAMPLES_chunk-0001.json`
  - `09_app/scripts/example-chunk-sources.mjs`
  - `09_app/src/components/TermDetail.jsx`

## Findings Or Decisions

- first sentinel `14112 실제로` raw XML에는 dictionary examples `9개`가 있다.
  - `문장 2`
  - `대화 2`
  - `구 5`
- same sentinel raw XML에는 `유의어 4개`가 있다.
  - `실상` -> `78662` / homonym `3`
  - `실제` -> `14110` / homonym `2`
  - `실지` -> `91957` / homonym `2`
  - `실지로` -> `91958` / homonym `0`
- `APP_READY_DETAIL_MAP`과 `APP_READY_CHUNK_RICH_chunk-0001`의 `14112`는 `구 5개`만 유지하고 있다.
  - 즉 `문장/대화` loss는 app render 이전 layer에서 이미 발생한다.
- `APP_READY_CHUNK_EXAMPLES_chunk-0001`의 `14112`는 `TOPIK 4 + 구 4`로 총 `8개`만 남아 있다.
  - XML의 `문장/대화`는 이 layer에서도 보이지 않는다.
  - dictionary `구`도 `5개` 중 `1개`가 추가로 잘린 상태다.
- `09_app/scripts/example-chunk-sources.mjs`에는 hidden truncation risk가 명시적으로 존재한다.
  - `entrySentenceMap.set(entryId, items.slice(0, 4))` -> TOPIK fallback가 `4개`로 cap된다.
  - `collectDictionaryExamples()` 내부 `items.length >= 8` -> dictionary examples 자체가 `8개`에서 cap된다.
  - merged loop `merged.length >= 8` -> TOPIK + dictionary merge 후 total `8개`에서 다시 cap된다.
- relation data는 runtime detail layer에 남아 있지만 app projection에서 homonym disambiguation loss risk가 있다.
  - `TermDetail` relation card label이 `item.word || meta.word` 기준이라 `실상3/실제2/실지2`처럼 user-facing disambiguation이 사라질 수 있다.
- 이번 audit은 문제를 아래 failure class로 분류한다.
  - `LAYER_LOSS`: 상위 layer에서 존재하던 field/type이 하위 layer에서 사라짐
  - `PARTIAL_MERGE`: 일부 값만 유지되고 나머지가 조용히 탈락
  - `CAP_TRUNCATION`: hard cap에 의해 정상 데이터가 잘림
  - `DISPLAY_LOSS`: runtime엔 남아 있으나 app projection에서 의미 구분이 사라짐
  - `STALE_ARTIFACT`: build/promote chain 중 이전 artifact가 남아 최신 source와 불일치
  - `SENSE_MISALIGNMENT`: sense boundary mismatch로 예문/관계어가 다른 sense 또는 대표 sense에 잘못 귀속

## Verdict Or Outcome

- Verdict:
  - `MM3-262`는 최우선 active audit로 유지
- Scope of acceptance or rejection:
  - `plan lock`만 승인
  - fix acceptance는 sentinel matrix와 batch audit evidence 이후 별도
- Residual risk:
  - `14112`는 하나의 sentinel일 뿐이며, 같은 유형의 hidden loss가 다른 entry에서도 반복될 가능성이 높다.

## Next Unlock Or Blocker

- Next unlock condition:
  - first sentinel 기준으로 `raw XML -> unified base -> runtime detail/rich/examples -> app projection` field-loss matrix가 작성되고 first failure layer가 분리되어야 한다.
- Immediate next action:
  - `MM3-262A`에서 `14112` sentinel matrix를 작성한다.
  - example/relation field schema를 layer별로 비교한다.
  - same failure class를 찾기 위한 batch heuristics를 추가한다.
- Open blocker if any:
  - `kcenter_base.json` entry lookup normalization이 아직 packet 본문 수준으로 정리되지 않았다.
  - app 실제 surface capture 없이 relation disambiguation loss가 data loss인지 display loss인지 최종 확정할 수 없다.

## Linked Artifacts

- PM-owned packet links:
  - `08_planning/reports/20260327_MM3_262_XML_TO_APP_DATA_RELIABILITY_AUDIT_PLAN_V1.md`
- Agent report links:
  - none
- Runtime or data artifact links:
  - `vocab_dictionary/output/api_xml_live/view_14112.xml`
  - `09_app/public/data/live/APP_READY_DETAIL_MAP.json`
  - `09_app/public/data/live/APP_READY_CHUNK_RICH_chunk-0001.json`
  - `09_app/public/data/live/APP_READY_CHUNK_EXAMPLES_chunk-0001.json`
  - `09_app/scripts/example-chunk-sources.mjs`
  - `09_app/src/components/TermDetail.jsx`

## Revision History

- `R1` / `2026-03-27 11:20 KST` / `Codex PM` / `14112 실제로` sentinel evidence를 바탕으로 XML-to-app reliability audit plan과 failure taxonomy를 고정
