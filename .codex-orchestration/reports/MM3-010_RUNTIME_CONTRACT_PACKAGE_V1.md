# MM3-010_RUNTIME_CONTRACT_PACKAGE_V1

## Revision Meta

- Current Revision: `R2`
- Last Updated: `2026-03-23`
- Last Updated By: `MINDMAP_SYNC_AGENT`

## Revision History

| Revision | Date | Editor | Summary |
|---|---|---|---|
| `R1` | `2026-03-23` | `RUNTIME_CONTRACT_AGENT` | 홈/결과/상세/표현층/필터 바의 runtime contract 초안 작성 |
| `R2` | `2026-03-23` | `MINDMAP_SYNC_AGENT` | MM3-012의 마인드맵 상태 단위와 동기화 우선순위를 runtime contract에 재반영 |

## 1. 목적과 범위

- 본 문서는 `word-first + dual category + sense core`를 runtime 관점으로 번역한 계약 패키지다.
- 핵심 원칙은 `다중 진입점 + 다층 레이어 + orthogonal filter`다.
- 대상 화면은 홈 / 결과 / 상세 / 표현층 / 필터 바다.
- 이 문서는 구현 지시서가 아니라, 화면별 required fields와 thin projection / rich detail의 경계를 정의하는 runtime contract 문서다.

## 2. 작업 -> 검증 -> learner 포함 3인 전문가 비판 검토 -> 개선 -> 재검증

### 작업

- `DATA_ARCHITECTURE_V1.md`와 통합 스키마를 기준으로 `entry / sense / subword / translation / filters`의 런타임 역할을 분리했다.
- `MM3-012`의 마인드맵 상호작용 규칙을 기준으로, 상태 단위를 source payload와 view-state로 다시 나눠 보강할 지점을 점검했다.
- IA 패키지와 시나리오 재작성 보고서를 대조해, 화면별로 필요한 최소 정보와 확장 정보를 나눴다.

### 검증

- `entry`는 lookup의 출발점, `sense`는 의미 해석의 중심, `subword`는 표현층, `translation`은 sense sidecar, `filters`는 orthogonal control이라는 구조를 재확인했다.
- 홈과 결과는 얇은 projection으로 충분하지만, 상세와 표현층은 rich detail을 보존해야 한다는 전제를 다시 점검했다.
- 마인드맵의 `selected_word`, `selected_sense`, `selected_category_meaning`, `selected_category_situation`, `active_filters`, `current_mode`가 서로 다른 동기화 층이라는 점을 확인했다.

### learner 포함 3인 전문가 비판 검토

- learner 관점: 첫 화면은 빠른 확인이 우선이므로 홈과 결과는 무거운 상세 필드를 늘리지 않는 편이 맞다.
- source 관점: 번역과 예문은 entry보다 sense에 더 강하게 결속되므로, entry 단위로만 흘리면 정합성이 약해진다.
- PM 관점: 필터를 taxonomy처럼 보이게 만들면 진입점과 조건이 섞이므로, 별도 orthogonal control로 고정해야 한다.

### 개선

- 화면별 required fields를 최소/확장으로 나눠, 같은 필드라도 어느 화면에서 필수인지 다르게 정의했다.
- `thin projection`과 `rich detail`의 경계를 `render 가능 최소치`와 `학습 가능 충분치`로 분리했다.
- 구현 acceptance에 사용할 수 있는 required-field 기준 초안을 별도 절로 분리했다.
- runtime contract 안에서 마인드맵 상태는 source payload로 합치지 않고, 표면별 projection 순서와 우선순위로만 반영하도록 보강했다.

### 재검증

- 홈/결과/상세/표현층/필터 바가 같은 payload를 강제로 공유하지 않아도 된다는 점을 확인했다.
- `entry`, `sense`, `subword`, `translation`, `filters`의 역할이 화면마다 달라져도 source 정합성이 유지되는 구조로 재확인했다.
- `word -> sense -> category -> filter`의 동기화 순서가 화면별 required fields와 payload split에 그대로 반영되는지 다시 점검했다.

## 3. runtime contract 총괄

- `entry`는 모든 화면의 기본 좌표다.
- `sense`는 상세의 중심 단위이며, 결과 화면에서도 최소 요약이 필요하다.
- `subword`는 표현층과 상세 확장에 필요하지만, 홈과 결과의 기본 렌더에는 필수 아님이다.
- `translation`은 상세와 결과의 의미 판별에 필요하고, 홈에서는 선택적이다.
- `filters`는 모든 화면에서 상태를 공유하지만, 필터 바가 주인공이 되어서는 안 된다.
- 마인드맵 상태는 `selected_word`, `selected_sense`, `selected_category_meaning`, `selected_category_situation`, `active_filters`, `current_mode`, `current_surface`, `projection_depth`로 분리해 해석한다.
- 이 상태들은 source payload가 아니라 표면별 projection 규칙으로 계약한다.

### 3.1 마인드맵 상태 단위 반영

- `selected_word`는 entry anchor다.
- `selected_sense`는 sense anchor다.
- `selected_category_meaning`과 `selected_category_situation`은 독립 축이므로 하나의 category 값으로 합치지 않는다.
- `active_filters`는 orthogonal control이므로 category와 같은 분류층으로 취급하지 않는다.
- `current_surface`와 `projection_depth`는 렌더링 상태이지 source 데이터가 아니다.

### 3.2 동기화 우선순위 반영

- runtime projection order는 `word -> sense -> category -> filter`다.
- `word`가 바뀌면 해당 entry의 `sense`를 먼저 재평가하고 그 뒤에 category와 filter를 맞춘다.
- `sense`가 바뀌면 번역, 예문, 관련어, 문형은 같은 sense를 따라간다.
- category는 두 축을 독립적으로 유지한 채 맞추고, filter는 마지막에 조정한다.
- 새 검색어와 충돌하는 filter는 가능한 경우 완화하거나 얇게 유지한다.

## 4. 화면별 required fields

| 화면 | required `entry` | required `sense` | required `subword` | required `translation` | required `filters` |
|---|---|---|---|---|---|
| 홈 | 검색 제안/최근 카드용 `entry.id`, `entry.word`, `entry.pos`, `entry.word_grade`, `entry.categories` 요약 | 기본 홈 상태는 불필요, 추천 카드에서만 `primary sense` 요약 필요 | 불필요, 표현층 진입 버튼만 있으면 충분 | 불필요 또는 `primary sense`의 1개 요약 번역만 허용 | 상시 필요, 현재 선택 상태와 축 요약이 필요 |
| 결과 | 각 후보의 `entry.id`, `entry.word`, `entry.pos`, `entry.word_grade`, `entry.categories` 요약, `has_subwords`, `sense_count` | 결과 카드마다 최소 1개 `sense` 요약, 다의어 구분용 `sense.id`, `definition` 필요 | 결과 카드 본문에는 불필요, 표현층 배지/힌트 정도만 가능 | 결과 카드의 의미 판별용으로 `sense`별 짧은 번역 1개 이상 필요 | 상시 필요, 결과 재정렬과 범위 축소를 위해 필요 |
| 상세 | `entry.id`, `entry.word`, `entry.pos`, `entry.word_grade`, `entry.categories`, `entry.related_forms` 요약 | 필수, 전체 `sense` 목록과 각 `definition`, `reference`, `syntactic_patterns` 필요 | 상세 하위 확장으로 `subword` 전체가 필요할 수 있음 | 필수, 각 `sense`의 번역 배열 전체가 필요 | 선택적이지만 상태를 유지해야 함 |
| 표현층 | 연결된 `entry.id`, `entry.word`, `entry.pos`, `entry.categories` 요약 | 표현별 참조 sense가 있으면 최소 1개 필요 | 필수, `subword` 자체가 본체다 | 필수, 표현별 의미 확인용 번역이 필요 | 선택적, 표현 유형 좁히기용 보조 필터만 필요 |
| 필터 바 | 직접 렌더용 `entry` 불필요 | 직접 렌더용 `sense` 불필요 | 직접 렌더용 `subword` 불필요 | 직접 렌더용 `translation` 불필요 | 필수, `학습난이도`, `TOPIK`, `품사`, `외국어 종류`의 현재 상태와 선택 옵션이 필요 |

## 5. 필드 역할 세부 계약

### 5.1 `entry`

- 홈과 결과에서는 `entry`를 얇게 써야 한다.
- 필수 구성은 `id`, `word`, `pos`, `word_grade`, `categories` 요약, `sense_count`, `has_subwords`, `has_related_forms` 정도로 제한하는 편이 안전하다.
- 상세에서는 `entry`가 전체 컨테이너가 되지만, 모든 하위 필드를 한 번에 강제하지는 않는다.

### 5.2 `sense`

- 결과 화면에서는 sense가 다의어 구분의 최소 단위다.
- 상세에서는 sense가 중심 단위이며, 정의와 예문, 번역, 문형, 관련어가 여기에 모여야 한다.
- `sense`가 없으면 번역과 예문 정합성도 함께 흔들리므로, 상세에서는 항상 필수다.

### 5.3 `subword`

- `subword`는 본체 어휘의 보조 태그가 아니라 별도 표현층이다.
- 홈과 결과에서는 표시해도 되지만, 기본 렌더에 필수는 아니다.
- 상세와 표현층에서는 `subword`의 독립성, 예문, 정의, 연결 대상이 핵심이다.

### 5.4 `translation`

- `translation`은 entry 공통 필드가 아니라 sense 단위 sidecar로 다뤄야 한다.
- 결과에서는 짧은 의미 판별용으로 요약만 필요하고, 상세에서는 전체 번역 배열이 필요하다.
- 홈에서는 번역이 없어도 화면이 완성되어야 한다.

### 5.5 `filters`

- 필터는 분류체계가 아니라 조건이다.
- `학습난이도`, `TOPIK`, `품사`, `외국어 종류`는 상시 보이되, 기본 상태는 요약만 보여야 한다.
- 홈과 결과의 필터 상태는 공유되어야 하지만, 각 화면이 필터의 세부 조합을 모두 펼칠 필요는 없다.

## 6. thin projection과 rich detail의 경계

### Thin projection

- 목적은 빠른 탐색과 낮은 인지 부하다.
- 허용 필드:
  - `entry.id`
  - `entry.word`
  - `entry.pos`
  - `entry.word_grade`
  - `entry.categories` 요약
  - `sense.id`
  - `sense.definition` 요약
  - `sense.translations`의 1개 또는 소수 요약
  - `has_subwords`
  - `sense_count`
  - `has_related_forms`
- 적용 화면:
  - 홈의 추천/최근/대표 카드
  - 결과 목록

### Rich detail

- 목적은 학습, 비교, 해석, 확장이다.
- 허용 필드:
  - `entry` 전체
  - `sense` 전체
  - `examples`
  - `related_terms`
  - `related_forms`
  - `subwords`
  - `translation` 전체 배열
  - `pronunciation`
  - `conjugations`
  - `annotation`
  - `syntactic_patterns`
  - `multimedia`
- 적용 화면:
  - 상세
  - 표현층

### 경계 원칙

- 홈과 결과는 thin projection만으로 닫혀야 한다.
- 상세와 표현층은 rich detail을 허용하되, 필요 없는 필드를 모두 기본 노출하지 않아야 한다.
- 같은 `sense`라도 결과에서는 요약, 상세에서는 전체로 역할이 바뀐다.

## 7. runtime payload split 제안

- 제안 1: `thin index`
  - 홈과 결과가 사용하는 최소 인덱스다.
  - `entry` 요약, 대표 `sense` 요약, 필터 상태, 카운트만 담는다.
- 제안 2: `detail payload`
  - entry 1개 단위의 rich payload다.
  - 전체 sense, 번역, 예문, 관련어, 관련형, 보조 메타를 포함한다.
- 제안 3: `expression payload`
  - 표현층 전용 payload다.
  - `subword` 중심이며, parent entry와 연결된 참조만 얇게 포함한다.
- 제안 4: `facet payload`
  - 필터 바 전용 payload다.
  - 필터 옵션, 선택 상태, 집계값만 담고 dictionary 본문을 담지 않는다.

### 분리 기준

- 홈/결과는 `entry + minimal sense + filter state`까지만 받는다.
- 상세는 `entry + full sense tree`를 받는다.
- 표현층은 `subword + linked sense`만 받는다.
- 필터 바는 `facet metadata`만 받는다.

## 8. 화면별 요약만 / 상세 전용 필드

### 홈과 결과에서 요약만 허용

- `entry.categories`는 전체 트리가 아니라 요약 레이블만 허용한다.
- `sense.definition`은 긴 본문이 아니라 대표 정의만 허용한다.
- `translation`은 전체 배열이 아니라 대표 1개 또는 상위 1~2개만 허용한다.
- `subword`는 전체 본문이 아니라 존재 여부와 개수 정도만 허용한다.

### 상세에서만 필요한 필드

- `examples`
- `related_terms`
- `related_forms`
- `conjugations`
- `pronunciation`
- `annotation`
- `syntactic_patterns`
- `multimedia`
- `subwords`의 전체 정의와 연결 정보

### 표현층에서 우선 필요한 필드

- `subword` 전체
- `subword.senses`
- `subword.senses.translations`
- `subword.senses.examples`
- parent `entry`의 최소 참조 정보

## 9. implementation acceptance 초안

### 필수 기준

- 홈은 `entry` 없이도 렌더 가능해야 하며, 추천/최근 카드가 있으면 thin projection으로 닫혀야 한다.
- 결과는 각 카드에서 `entry` 요약과 최소 1개 `sense` 요약으로 다의어를 구분할 수 있어야 한다.
- 상세는 최소 1개 이상의 `sense`를 항상 보여야 하며, 번역과 예문을 sense 단위로 정합적으로 묶어야 한다.
- 표현층은 `subword`를 entry의 부속물로만 취급하지 않고 독립 단위로 렌더해야 한다.
- 필터 바는 범주와 섞이지 않고 독립 상태로 유지되어야 한다.

### 검수 가능 조건

- 홈/결과에서 rich detail 필드가 과도하게 노출되면 불합격이다.
- 상세에서 `translation`과 `sense`가 분리되면 불합격이다.
- 표현층에서 `subword`가 본체와 구분되지 않으면 불합격이다.
- 필터가 taxonomy처럼 보이면 불합격이다.

### 최소 required-field 판정 초안

- `entry`: `id`, `word`, `pos`는 최소 필수, `word_grade`와 `categories`는 화면에 따라 필수.
- `sense`: `id`, `definition`은 최소 필수, 상세에서는 `translations`, `examples`까지 필수.
- `subword`: 표현층에서는 `text`, `unit`, `senses`가 필수.
- `translation`: 상세에서는 각 sense마다 1개 이상 필수, 결과에서는 요약 1개 이상 권장.
- `filters`: 필터 바에서는 현재 선택 상태와 옵션 집합이 필수.

## 10. decision 복귀 조건

- 홈과 결과가 thin projection만으로 충분하지 않다고 반복 관측될 때
- `subword`가 표현층이 아니라 본체 탐색의 주력 진입점이 될 때
- `sense`보다 `entry` 요약이 더 자주 정답 판별에 사용될 때
- 필터가 orthogonal control이 아니라 주 탐색 축처럼 사용될 때
- 번역이 sense가 아니라 entry 수준으로 재배치될 필요가 확인될 때

## 11. Reflection

- 이번 계약 패키지의 핵심은 필드를 더 많이 정의하는 것이 아니라, 같은 필드라도 화면마다 필요한 깊이를 다르게 선언하는 것이었다.
- `word-first + dual category + sense core`는 runtime에서 `entry`를 얕게, `sense`를 깊게, `subword`를 독립적으로, `filters`를 비주류 제어로 배치할 때 가장 안정적이다.
- 남은 불확실성은 구조가 아니라 실제 렌더 밀도이며, 다음 검증에서는 화면별 체류와 선택 패턴을 기준으로 다시 판정해야 한다.
