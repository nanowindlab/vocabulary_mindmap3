# 20260324_MM3_046_NAVIGATION_SHELL_CONTRACT_V1

## 목적

- search-first 구조 위에서 tree/mindmap를 어떤 위치에 둘지 navigation shell 차원에서 고정한다.

## PM 결론

- 기본 landing은 `홈 + 검색`이다.
- tree/mindmap는 기본 화면이 아니라 `구조 탐색 모드`다.
- 상위 축은 MM2 3탭이 아니라 `의미 범주 / 주제 및 상황 범주` 스위처로 간다.
- 표현층은 tree 본체가 아니라 별도 보조 레이어로 둔다.

## 구현 우선순위

1. search/facet 유지
2. tree 축 스위처 정의
3. tree payload 형태 정의
4. tree consumer wiring

## Next Active Work

- `MM3-047 Tree Wiring Execution Readiness`
