# 20260324_MM3_045_TREE_WIRING_PLAN_V1

## 목적

- MM3 구조를 tree/mindmap 소비 경로에 어떻게 연결할지 PM 기준으로 정리한다.

## 현재 사실

- 현재 앱 shell은 MM2 기반 3탭 구조를 전제로 한다.
- 현재 런타임 tree payload는 비어 있다.
  - `APP_READY_SITUATIONS_TREE.json`
  - `APP_READY_EXPRESSIONS_TREE.json`
  - `APP_READY_BASICS_TREE.json`
- MM3 search payload에서는 상위 루트가 사실상 아래 3종으로만 나온다.
  - `의미 범주`
  - `주제 및 상황 범주`
  - `미분류`

## 문제

- MM2의 `상황과 장소 / 마음과 표현 / 구조와 기초` 3탭은 MM3 source-native 구조가 아니다.
- 따라서 지금 tree wiring을 바로 하면, MM3를 MM2 3탭에 억지로 투영하는 문제가 생긴다.

## PM 판단

- tree wiring은 가능하지만, 먼저 `navigation shell contract`를 정해야 한다.
- 즉 다음 단계는 tree JSON 생성보다 상위 navigation contract를 정하는 것이다.

## 선택지

### A. MM2 3탭 유지 후 임시 매핑

- 장점: 구현 속도 빠름
- 단점: MM3 source-native 구조 왜곡 가능성 큼

### B. MM3 단일 트리 + 축 스위처

- 의미 범주 / 주제 및 상황 범주를 스위처로 두고 tree는 하나로 운영
- 장점: source 정합성 높음
- 단점: 현재 shell 수정 범위가 큼

### C. Search-first 유지 + Tree는 보조 모드

- tree를 기본 진입이 아니라 구조 탐색 모드로 제한
- 장점: search/facet 슬라이스와 가장 자연스럽게 이어짐
- 단점: tree 가시성은 약해질 수 있음

## 추천

- `C`를 기본으로 두고, 내부 tree contract는 `B` 방향으로 설계한다.

정리:
- 홈 기본값은 search-first 유지
- tree는 보조 구조 탐색 모드
- tree 내부 축은 `의미 범주` / `주제 및 상황 범주`
- MM2 3탭은 유지하지 않는다

## 다음 Active Work

- `MM3-046 Navigation Shell Contract`
