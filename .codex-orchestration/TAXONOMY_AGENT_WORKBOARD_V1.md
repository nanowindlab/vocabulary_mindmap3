# TAXONOMY_AGENT_WORKBOARD_V1

## Agent

- Role: `taxonomy decision package lane`
- Owner: `TAXONOMY_AGENT`
- Task ID: `MM3-004`
- Status: `DONE`
- Output Report: `.codex-orchestration/reports/MM3-004_TAXONOMY_DECISION_PACKAGE_V1.md`

## Scope

- `mindmap3`의 source 구조 전체를 학습자 관점으로 다시 정리하고, taxonomy decision package 초안을 작성한다.
- `3축`은 선가정하지 않는다.
- `mindmap2`의 `related_vocab`, `crosslink` 개념을 taxonomy 뼈대로 재사용하지 않는다.

## Inputs

- `MM3-002` accepted source review package
- `MM3-003` source-structure extraction 방향
- `mindmap2` UX reference

## Required Deliverable

- 최소 포함 항목:
  - source 구조에서 learner-facing 상위 학습 구조 후보 추출
  - `entry / sense / subword / translation / categories`가 taxonomy에 주는 의미
  - MM2 개념을 버려야 하는 이유와 대체 구조
  - `3축`, `2축`, 다층 구조 등 가능한 상위 구조 옵션 비교
  - 첫 화면 정보 우선순위 후보
  - PM용 결정 질문
  - reflection 섹션

## Working Rules

- 보고서와 workboard는 한국어로 작성한다.
- source의 모든 구조 정보를 활용하되, 단순 사전 구조 나열이 아니라 학습자의 시선, 흐름, 경험 관점으로 재정리한다.
- source가 직접 지지하지 않는 taxonomy를 단정하지 않는다.
- 구현 지시나 코드 변경은 하지 않는다.

## Latest Report

- `.codex-orchestration/reports/MM3-004_TAXONOMY_DECISION_PACKAGE_V1.md`

## Dispatch Rule

- 사용자 승인 후 dispatch 완료.
