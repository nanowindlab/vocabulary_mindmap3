# 20260324_MM3_044_NEXT_IMPLEMENTATION_SLICE_DECISION_V1

## 목적

- search + facet 이후 어떤 구현 슬라이스를 다음으로 열지 결정한다.

## 후보

### 후보 A. Tree Wiring

- `APP_READY_*_TREE.json`를 MM3 구조에 맞춰 재생성/연결

### 후보 B. Detail Wiring

- 상세 패널이 `entry/sense/subword/translation`을 MM3 기준으로 읽도록 연결

### 후보 C. Expression Wiring

- 표현층을 별도 구조로 연결

## PM 추천

- 다음 슬라이스는 `후보 A. Tree Wiring`

## 이유

- 현재 가장 큰 구조적 미연결은 마인드맵/사이드바 쪽이다.
- search/facet은 이미 닫혔으므로, 다음은 홈의 구조 탐색 면을 MM3에 맞추는 편이 자연스럽다.
- detail을 먼저 열면 범위가 커질 가능성이 더 높다.

## Next Active Work

- `MM3-045 Tree Wiring Plan`
