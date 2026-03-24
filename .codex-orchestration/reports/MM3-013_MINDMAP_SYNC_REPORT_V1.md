# MM3-013_MINDMAP_SYNC_REPORT_V1

## Revision Meta

- Current Revision: `R1`
- Last Updated: `2026-03-23`
- Last Updated By: `MINDMAP_SYNC_AGENT`

## Revision History

| Revision | Date | Editor | Summary |
|---|---|---|---|
| `R1` | `2026-03-23` | `MINDMAP_SYNC_AGENT` | MM3-012의 마인드맵 상호작용 규칙을 IA와 runtime contract에 재반영한 sync 보고서 작성 |

## 1. 목적과 범위

- 본 보고서는 `MM3-012_MINDMAP_INTERACTION_SPEC_V1.md`의 상호작용 규칙을 `MM3-009_IA_PACKAGE_V1.md`와 `MM3-010_RUNTIME_CONTRACT_PACKAGE_V1.md`에 다시 반영한 결과를 기록한다.
- 구현 지시나 코드 변경은 포함하지 않는다.
- 초점은 마인드맵을 별도 모드가 아니라 공통 탐색 캔버스/상태층으로 읽히게 만드는 데 있다.

## 2. 작업 -> 검증 -> learner 포함 3인 전문가 비판 검토 -> 개선 -> 재검증

### 작업

- `MM3-012`에서 정의된 마인드맵 캔버스/상태층 규칙, 진입/동기화/이탈 요점을 읽고, IA와 runtime contract의 누락 지점을 추렸다.
- `MM3-009`에는 화면 구조와 이동 흐름에 마인드맵 전이 규칙이 충분히 드러나지 않는 부분이 있었고, `MM3-010`에는 상태 단위와 동기화 우선순위의 계약 매핑이 더 필요했다.

### 검증

- `MM3-009`를 확인해 홈/검색/결과/상세/표현층/필터 바는 잘 분리되어 있으나, 마인드맵 자체가 캔버스/상태층으로 동작한다는 문장이 별도 규칙으로는 약하다는 점을 확인했다.
- `MM3-010`을 확인해 required fields와 thin/rich 경계는 정리되어 있으나, `selected_word`, `selected_sense`, `selected_category_meaning`, `selected_category_situation`, `active_filters`, `current_mode`의 동기화 순서가 계약 문장으로 더 명확해야 한다는 점을 확인했다.

### learner 포함 3인 전문가 비판 검토

- learner 관점: 첫 화면은 lookup이 먼저여야 하므로, 마인드맵은 화면을 대체하는 새 모드로 보이면 안 된다.
- source 관점: 의미 범주와 주제 및 상황 범주는 분리된 축이므로, 상태층도 하나의 category로 합치면 안 된다.
- PM 관점: `word-first + dual category + sense core`를 유지하려면 동기화 우선순위가 `word -> sense -> category -> filter`로 고정돼야 한다.

### 개선

- `MM3-009`에 마인드맵 캔버스/상태층 절과 진입/동기화/이탈 요점을 추가했다.
- `MM3-010`에 마인드맵 상태 단위 반영과 동기화 우선순위 반영 절을 추가했다.
- 두 문서 모두에서 마인드맵을 source payload와 분리된 view-state/projection 규칙으로 읽히게 보강했다.

### 재검증

- 보강 후에도 `word-first`, `dual category`, `sense core`의 우선순위가 흔들리지 않는지 다시 확인했다.
- 홈/결과/상세/표현층/필터 바의 역할 분리는 유지되고, 마인드맵은 그 위의 공통 상태층으로만 남는지 재점검했다.
- 상태 단위와 화면 단위가 섞이지 않도록, IA는 흐름 규칙을, runtime contract는 projection 순서를 책임지게 정리했다.

## 3. MM3-009 IA package 보강 내용

### 3.1 마인드맵 캔버스/상태층 규칙

- 홈은 기본 landing이고, 마인드맵은 그 위에서 열리는 상태층으로 정리했다.
- 마인드맵은 현재 화면의 중심축을 보여 주지만 화면 자체를 대체하지 않는다.
- `word`, `sense`, `category`, `filter`는 같은 캔버스 위의 독립 축으로 유지한다.
- `selected_word`, `selected_sense`, `selected_category_meaning`, `selected_category_situation`, `active_filters`, `current_mode`는 하나의 복합 상태로 합치지 않는다.
- `current_surface`와 `projection_depth`를 통해 노출 깊이와 표면을 분리했다.

### 3.2 진입/동기화/이탈 요점

- 진입은 홈뿐 아니라 검색/결과/상세/표현층에서도 가능하되, 별도 모드 전환이 선행되지 않도록 정리했다.
- 동기화는 `word -> sense -> category -> filter` 순서로 읽히도록 명시했다.
- 이탈은 상태 삭제가 아니라 홈으로의 초점 재배치로 해석되도록 보강했다.

## 4. MM3-010 runtime contract 보강 내용

### 4.1 상태 단위 반영

- `selected_word`는 entry anchor, `selected_sense`는 sense anchor로 다뤄야 한다.
- `selected_category_meaning`과 `selected_category_situation`은 독립 축으로 유지해야 한다.
- `active_filters`는 orthogonal control로 취급하고, category와 같은 분류층으로 합치지 않는다.
- `current_surface`와 `projection_depth`는 source data가 아니라 렌더링 상태다.

### 4.2 동기화 우선순위 반영

- runtime projection order는 `word -> sense -> category -> filter`로 고정했다.
- word 변경 시 sense를 먼저 재평가하고, 그 다음 category와 filter를 맞추는 계약으로 보강했다.
- sense 변경 시 번역, 예문, 관련어, 문형이 같은 sense를 따라가도록 정리했다.
- category는 두 축을 분리한 채 동기화하고, filter는 마지막에 조정하는 방식으로 계약했다.

### 4.3 required fields와 payload split에의 반영

- 홈과 결과는 `entry + minimal sense + filter state` 중심의 thin projection으로 유지한다.
- 상세는 `entry + full sense tree`를, 표현층은 `subword + linked sense`를 받도록 역할을 유지한다.
- 마인드맵 상태는 별도 payload가 아니라 surface별 projection 우선순위로만 반영되도록 정리했다.

## 5. 남는 해석 포인트

- 현재 보강은 문서 정합성 단계의 sync이므로, 실제 런타임 렌더/상태 갱신 증거가 생기면 다시 evidence 기준 검증이 필요하다.
- 특히 `current_surface`와 `projection_depth`가 UI에서 어떻게 표현되는지는 후속 단계에서 별도로 확인해야 한다.
- 다만 이번 반영만으로도 마인드맵이 독립 모드처럼 읽히는 위험은 줄었고, IA와 runtime contract가 같은 순서로 해석되게 맞췄다.

## 6. Reflection

- 이번 sync의 핵심은 마인드맵을 더 크게 만드는 것이 아니라, MM3 전체의 해석 규칙을 같은 문장으로 다시 읽히게 만드는 것이었다.
- `word-first`는 entry 진입을 지키고, `sense core`는 의미 정합성을 지키고, `dual category`는 축 분리를 지키며, 마인드맵은 그 위의 상태층으로만 남아야 한다.
- 다음 단계에서는 문서 정합성보다 실제 artifact 반영 여부를 evidence 기준으로 확인해야 한다.
