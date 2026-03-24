# MINDMAP_AGENT_WORKBOARD_V1

## Agent

- Role: `mindmap interaction spec lane`
- Owner: `MINDMAP_AGENT`
- Task ID: `MM3-012`
- Status: `DONE`
- Output Report: `.codex-orchestration/reports/MM3-012_MINDMAP_INTERACTION_SPEC_V1.md`

## Scope

- 마인드맵이 MM3 구조 안에서 어떻게 진입, 동기화, 이탈하는지 상호작용 구조를 정의한다.

## Required Deliverable

- 기본 landing과 마인드맵의 관계
- 홈 / 검색 / 결과 / 상세 / 표현층과 마인드맵의 진입/이탈 구조
- 검색/범주/표현층/단어 선택 시 마인드맵 동기화 규칙
- 마인드맵 상태 단위 정의
- MM2 기본화면 모델을 유지할지 여부와 그 이유
- reflection

## Working Rules

- 한국어 작성
- 구현 지시/코드 변경 금지
- 기본 프로세스 `작업 -> 검증 -> learner 포함 3인 전문가 비판 검토 -> 개선 -> 재검증`

## Current State

- 작업 완료
- 마인드맵을 기본 화면이 아닌 MM3 공통 탐색 상태층으로 정리
- 홈 / 검색 / 결과 / 상세 / 표현층 진입, 동기화, 이탈 규칙과 상태 단위를 반영한 상호작용 명세 작성 완료

## Result

- `.codex-orchestration/reports/MM3-012_MINDMAP_INTERACTION_SPEC_V1.md` 작성 완료
- `word-first + dual category + sense core`와 `다중 진입점 + 다층 레이어 + orthogonal filter`를 유지하는 방향으로 정리
- MM2 기본화면 모델은 유지하지 않는다고 명시
