# MM3-014_RUNTIME_UI_REFINEMENT_NOTE_V1

## Revision Meta

- Current Revision: `R1`
- Last Updated: `2026-03-23`
- Last Updated By: `REFINEMENT_AGENT`

## Revision History

| Revision | Date | Editor | Summary |
|---|---|---|---|
| `R1` | `2026-03-23` | `REFINEMENT_AGENT` | review와 PM 점검에서 남은 residual risk와 후속 보강 포인트를 단일 문서로 정리 |

## 1. 목적과 범위

- 본 문서는 `MM3-009_IA_PACKAGE_V1.md`, `MM3-010_RUNTIME_CONTRACT_PACKAGE_V1.md`, `MM3-012_MINDMAP_INTERACTION_SPEC_V1.md`, `MM3-013_MINDMAP_SYNC_REPORT_V1.md`를 함께 읽고, review 및 PM 점검에서 남은 residual risk를 정리한 refinement note다.
- 구현 지시나 코드 변경은 포함하지 않는다.
- 초점은 현재 구조에서 유지할 것, 후속 보강이 필요한 것, 즉시 수정할 항목과 구현 이후 검증으로 넘길 항목을 분리하는 데 있다.

## 2. 작업 -> 검증 -> learner 포함 3인 전문가 비판 검토 -> 개선 -> 재검증

### 작업

- IA, runtime contract, interaction spec, sync report를 함께 읽어 구조가 이미 고정한 불변값과 아직 얇은 경계 지점을 분리했다.
- review와 PM 점검에서 남은 지적을 기준으로, `navigation_origin`, filter provenance, `dual category` 가시성에 대한 보강 필요성을 추렸다.

### 검증

- `word-first + dual category + sense core`가 여전히 중심 원칙인지 확인했다.
- 마인드맵이 별도 모드가 아니라 공통 탐색 상태층으로 해석되는지 확인했다.
- `selected_word`, `selected_sense`, `selected_category_meaning`, `selected_category_situation`, `active_filters`, `current_mode`, `current_surface`, `projection_depth`가 서로 다른 층위로 분리되어 있는지 확인했다.

### learner 포함 3인 전문가 비판 검토

- learner 관점: 첫 진입은 빠른 lookup이 우선이므로, 현재 구조가 탐색 비용을 올리지 않는지 점검해야 한다.
- source 관점: 의미 범주와 상황 범주는 같은 UI 단위처럼 보여도 출처와 역할이 다르므로, 가시성은 병렬이되 의미는 분리되어야 한다.
- PM 관점: `word -> sense -> category -> filter` 순서를 지키더라도, 진입 출처와 복귀 맥락이 부족하면 상태 해석이 애매해질 수 있다.

### 개선

- 유지해야 할 구조와 후속 보강 대상을 분리했다.
- `navigation_origin`을 보조 상태로 다루어야 하는 이유를 명시했다.
- filter provenance와 `dual category` 가시성 문제를 별도 항목으로 분리했다.
- 즉시 수정할 문서 수준 보강과, 구현 이후 실제 UI/상태에서 검증할 항목을 나눴다.

### 재검증

- 현재 구조의 핵심 원칙은 유지 가능하고, 남은 리스크는 구조 붕괴가 아니라 해석 경계의 명시 부족이라는 점을 재확인했다.
- 따라서 이번 문서는 구조 변경이 아니라 residual risk 기록과 후속 검증 기준 정리에 목적을 둔다.

## 3. 현재 구조에서 유지할 것

- `word-first`를 기본 진입 원칙으로 유지한다.
- `dual category`는 `의미 범주`와 `주제 및 상황 범주`의 병렬 축으로 유지한다.
- `sense core`는 상세 해석과 번역 정합성의 중심으로 유지한다.
- 필터는 taxonomy가 아니라 orthogonal control로 유지한다.
- 마인드맵은 별도 화면이 아니라 공통 탐색 상태층으로 유지한다.
- `selected_word`, `selected_sense`, `selected_category_meaning`, `selected_category_situation`, `active_filters`, `current_mode`, `current_surface`, `projection_depth`의 분리는 유지한다.
- thin projection과 rich detail의 경계는 유지한다.
- MM2의 graph 중심 관성은 구조 뼈대에 다시 들이지 않는다.

## 4. 후속 보강이 필요한 것

### 4.1 `navigation_origin` 보강 필요성

- 현재 문서들은 `current_surface`와 `projection_depth`를 통해 표면과 노출 깊이를 분리하고 있지만, 어디에서 들어왔는지와 어디로 돌아가야 하는지는 충분히 드러나지 않는다.
- `navigation_origin`은 source data가 아니라 복귀 맥락을 보존하는 보조 상태로 다루는 편이 안전하다.
- 특히 홈, 검색, 결과, 상세, 표현층 사이를 오갈 때, 같은 표면으로 돌아가도 출발 지점이 다르면 복귀 동작이 달라질 수 있다.
- 따라서 `navigation_origin`은 선택 상태와 별개로 해석되어야 하며, 현재 구조의 얇은 부분을 메우는 후속 보강 포인트다.

### 4.2 필터 provenance 차이

- 필터 provenance는 `어떤 조건이 어디서 왔는가`를 뜻하는 상태 이력이다.
- category provenance는 `무엇을 의미 축으로 선택했는가`에 가까운 source-native 분류 이력이다.
- 둘은 모두 선택 이력처럼 보일 수 있지만, 하나는 조건의 출처이고 다른 하나는 의미 축의 출처다.
- 위험은 필터 chip과 category label이 같은 시각 언어를 쓰면서, learner가 둘을 같은 분류 체계로 오해하는 것이다.
- 따라서 필터는 조건의 누적과 조정으로 읽히고, category는 의미 축의 선택과 비교로 읽히도록 분리되어야 한다.

### 4.3 `dual category` 가시성 문제

- `의미 범주`와 `주제 및 상황 범주`는 병렬 축이므로, 한쪽이 다른 쪽의 하위 항목처럼 보이면 안 된다.
- 특히 thin projection에서는 공간 제약 때문에 둘 중 하나만 눈에 띄는 위험이 있다.
- 반대로 rich detail에서 둘을 과도하게 펼치면 learner가 한 화면에서 의미 축과 상황 축을 동시에 판단해야 하는 부담이 커진다.
- 따라서 가시성은 병렬 유지, 노출 강도는 비대칭 조절이 적절하다.
- 핵심은 두 축을 같이 보여 주되, 서로를 설명하는 구조로 만들지 않는 것이다.

## 5. 즉시 수정할 항목 vs 구현 이후 검증으로 넘길 항목

| 구분 | 항목 | 판정 | 이유 |
|---|---|---|---|
| 즉시 수정 | `navigation_origin`을 보조 상태로 명시 | 필요 | 현재 상태 단위 설명만으로는 진입 출처와 복귀 맥락이 약하다 |
| 즉시 수정 | filter provenance를 category provenance와 분리해 서술 | 필요 | 조건 이력과 의미 축 이력이 같은 것으로 오해될 수 있다 |
| 즉시 수정 | `dual category`를 병렬 가시성 원칙으로 재서술 | 필요 | 한 축이 다른 축의 하위로 보이는 순간 구조 의도가 흐려진다 |
| 구현 이후 검증 | 실제 UI에서 `navigation_origin`이 복귀 동작에 반영되는지 확인 | 필요 | 문서 수준 명시는 가능하지만, 실재 동작은 구현 후에만 검증 가능하다 |
| 구현 이후 검증 | 필터 chip과 category label의 시각 언어가 충분히 구분되는지 확인 | 필요 | 스타일/배치의 실제 결과를 봐야 오해 가능성을 판단할 수 있다 |
| 구현 이후 검증 | thin projection에서 `dual category`가 과소 노출되지 않는지 확인 | 필요 | 밀도와 가독성의 균형은 렌더 결과를 봐야 한다 |
| 구현 이후 검증 | rich detail에서 `dual category`가 과노출되지 않는지 확인 | 필요 | 정보량은 문장으로만 확정할 수 없고 실제 화면으로 확인해야 한다 |

## 6. Residual Risk 요약

- `navigation_origin`이 없으면 진입 출처와 복귀 맥락이 얇아질 수 있다.
- 필터 provenance가 category provenance와 섞이면 조건과 의미 축의 경계가 흐려질 수 있다.
- `dual category`가 한 화면에서 충분히 병렬로 보이지 않으면, 의미 범주와 상황 범주가 사실상 한 축으로 소비될 수 있다.
- 반대로 세 축을 동시에 강하게 드러내면 learner 부담이 올라갈 수 있으므로, 노출 강도는 보강 대상이다.
- 현재 리스크는 구조 붕괴보다는 해석 경계의 명시 부족에 가깝다.

## 7. Reflection

- 이번 refinement의 핵심은 새 구조를 추가하는 것이 아니라, 이미 합의된 구조의 얇은 경계를 더 정확히 적는 것이었다.
- `word-first`는 lookup 우선순위를 지키고, `sense core`는 해석 정합성을 지키며, `dual category`는 축 분리를 지킨다.
- 남은 과제는 이 원칙을 깨지 않으면서, 진입 출처와 조건 이력, 병렬 가시성의 해석 여지를 줄이는 것이다.
- 따라서 다음 단계는 구조 재설계가 아니라, 문서와 구현 검증 기준을 같은 방향으로 맞추는 것이다.
