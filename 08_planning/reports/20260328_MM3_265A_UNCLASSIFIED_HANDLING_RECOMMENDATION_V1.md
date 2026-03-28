# 20260328_MM3_265A_UNCLASSIFIED_HANDLING_RECOMMENDATION_V1

- Packet name: `20260328_MM3_265A_UNCLASSIFIED_HANDLING_RECOMMENDATION_V1`
- Packet role: `decision`
- Task ID: `MM3-265A`
- Parent pipeline or workflow: `M1 Runtime Wiring / Core Explorer / Unclassified Handling`
- Status: `DONE`
- Current Revision: `R1`
- Last Updated: `2026-03-28 22:41 KST`
- Last Updated By: `Codex PM`

## Comparative Scan Summary

- `한국어기초사전`은 `품사 없음`, `등급 없음` 같은 metadata를 통계/검색 축으로 다루고, learner-facing 의미 범주 browse와는 분리한다.
- `우리말샘`은 자세히 찾기/품사 기반 검색 중심으로 접근하게 하며, category-less item을 별도 semantic map으로 전면 배치하지 않는다.
- `표준국어대사전`도 자세히 찾기에서 `품사`, `전문 분야`, `찾는 말` 등 metadata 조건 검색을 제공한다.

## Decision

- `분류 밖 항목`은 semantic mindmap의 동등 레이어라기보다 metadata/list 성격으로 먼저 다루는 것이 맞다.
- 따라서 기본 진입은 `리스트`로 두고, mindmap은 보조 탐색으로 남기는 쪽이 가장 안전하다.

## Applied Change

- `unclassified` tab을 직접 열거나,
- search/result로 `unclassified` entry를 열 때
- 기본 `viewMode`를 `list`로 전환하도록 반영했다.

## Revision History

- `R1` / `2026-03-28 22:41 KST` / `Codex PM` / external dictionary handling lens를 반영해 `unclassified` 기본 진입을 `list`로 고정
