# MM3-003_SOURCE_STRUCTURE_DISCOVERY_REPORT_V1

## Revision Meta

- Current Revision: `R2`
- Last Updated: `2026-03-23`
- Last Updated By: `SOURCE_DISCOVERY_AGENT`

## Revision History

| Revision | Date | Editor | Summary |
|---|---|---|---|
| `R1` | `2026-03-23` | `SOURCE_DISCOVERY_AGENT` | 초기 discovery 보고서 작성 |
| `R2` | `2026-03-23` | `SOURCE_DISCOVERY_AGENT` | 공식 KRDict 계층, learner entry flow 비교, sense 중심성, MM2 graph 배제 근거를 보강한 재작성 |

## 1. 목적과 재작업 범위

- 본 보고서는 `MM3-002`의 source review를 입력으로 받아, MM3 source 구조를 학습자 관점에서 다시 해석한 discovery package다.
- 최종 taxonomy를 확정하지는 않는다.
- 대신 결정 가능한 근거 패키지로서 아래를 분리한다.
  - 축 후보
  - 출발점 후보
  - 탐색 레이어
  - 필터
  - 보조 정보
- 사용한 근거는 `vocab_dictionary`의 unified artifact, legacy summary 문서, `DATA_ARCHITECTURE_V1.md`, 그리고 KRDict 공식 [`senseCategory`](https://krdict.korean.go.kr/kor/dicSearch/senseCategory), [`actCategory`](https://krdict.korean.go.kr/kor/dicSearch/actCategory), [`openApiInfo`](https://krdict.korean.go.kr/kor/openApi/openApiInfo)다.

## 2. 작업 -> 검증 -> learner 포함 3인 비판 검토 -> 개선 -> 재검증 흔적

### 1차 작업

- unified artifact의 구조를 먼저 읽고 `entry / sense / subword / translation / related_terms / related_forms / categories`의 역할을 분리했다.
- 공식 KRDict 페이지와 Open API 문서에서 `sense_cat`, `subject_cat`, `category_info`, `sense_info`, `pattern_info`, `example_info`의 공개 구조를 확인했다.

### 1차 검증

- `vocab_dictionary/output/unified_live/kcenter_base.json.gz`를 다시 집계해 category, sense, subword, translation, relation 분포를 재확인했다.
- 이 단계에서 `krdict_final_summary.md`의 일부 수치가 unified artifact와 맞지 않는다는 점을 확인했다.

### learner 포함 3인 비판 검토

- source 관점: `categories`는 하나의 축으로만 고정하기 어렵고, 의미 범주와 주제/상황 범주가 동시에 붙는 엔트리가 많다.
- learner 관점: `word-first`는 가장 쉬운 검색 진입점이지만, 의미 차이를 푸는 데는 `sense-first`가 더 직접적이다.
- PM 관점: 현재 시점에서 taxonomy를 고정하면 source가 가진 다중 진입점 구조를 과도하게 단순화할 위험이 있다.

### 개선

- `축 후보`와 `출발점 후보`를 분리하고, `sense` 중심성을 별도 절로 분리했다.
- legacy summary와 unified artifact 사이의 수치 불일치를 별도 표기로 분리했다.
- `mindmap2`의 `related_vocab`, `crosslink`를 taxonomy 뼈대로 재사용하지 말아야 하는 이유를 source 구조 대비로 다시 정리했다.

### 재검증

- unified artifact의 실제 집계값을 다시 확인했고, 공식 KRDict 문서의 범주 정의도 재확인했다.
- 이 재검증 결과를 반영해 본 보고서는 최종 구조 결정보다 구조 후보와 tradeoff를 남기는 방향으로 정리한다.

## 3. 근거 패키지

### 로컬/내부 아티팩트

- `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`
- `vocab_dictionary/한국어 기초사전_통합스키마_v2.md`
- `vocab_dictionary/krdict_final_summary.md`
- `08_planning/DATA_ARCHITECTURE_V1.md`
- `08_planning/reports/20260323_MM3_002_SOURCE_REVIEW_ACCEPTANCE_V1.md`
- `.codex-orchestration/reports/MM3-002_SOURCE_SCHEMA_REVIEW_REPORT_V1.md`
- `.codex-orchestration/reports/MM3-002_DATA_VALIDATION_REPORT_V1.md`

### 공식 근거

- KRDict [`senseCategory`](https://krdict.korean.go.kr/kor/dicSearch/senseCategory)
- KRDict [`actCategory`](https://krdict.korean.go.kr/kor/dicSearch/actCategory)
- KRDict [`openApiInfo`](https://krdict.korean.go.kr/kor/openApi/openApiInfo)

## 4. 수치와 계산 기준

- 본 절의 수치는 특별히 적지 않은 한 `kcenter_base.json.gz`의 `entries[]`를 기준으로 계산했다.
- `entry`는 `wrapped.entry`를 기준으로 집계했다.
- `categories`는 `entry.categories[]` 항목 수를 token 기준으로 집계했고, `type` 존재 여부는 entry 기준으로 별도 집계했다.
- `sense`는 `entry.senses[]` 길이를 직접 합산했다.
- `subword`와 `related_forms`는 entry 단위 존재 여부로 집계했다.

### 핵심 집계값

| 항목 | 값 | 계산 기준 |
|---|---:|---|
| entries | 53,480 | `len(kcenter_base.entries)` |
| entries with `categories` | 44,974 | `entry.categories` 존재 여부 |
| `의미 범주` token 수 | 44,414 | `entry.categories[].type == 의미 범주` |
| `의미 범주` entry 수 | 44,410 | 의미 범주를 가진 unique entry 수 |
| `주제 및 상황 범주` token 수 | 11,440 | `entry.categories[].type == 주제 및 상황 범주` |
| `주제 및 상황 범주` entry 수 | 11,355 | 주제 및 상황 범주를 가진 unique entry 수 |
| 두 범주를 모두 가진 entry | 10,791 | 동일 entry에서 두 `type` 동시 존재 |
| 의미 범주만 가진 entry | 33,619 | 의미 범주만 존재 |
| 주제 범주만 가진 entry | 564 | 주제 범주만 존재 |
| categories 없는 entry | 8,506 | `entry.categories` 비어 있음 |
| subwords 있는 entry | 1,161 | `entry.subwords` 존재 여부 |
| related_forms 있는 entry | 18,771 | `entry.related_forms` 존재 여부 |
| senses | 73,445 | `sum(len(entry.senses))` |
| related_terms | 33,630 | `sum(len(sense.related_terms))` |
| translations | 788,417 | `sum(len(sense.translations))` |
| example blocks | 589,926 | `sum(len(sense.examples))` |

### 수치 해석

- `krdict_final_summary.md`는 여전히 `53,439` 계열의 오래된 수치를 보존한다.
- unified artifact는 `53,480` entries를 보여주므로, 현재 discovery 보고서는 unified artifact를 source of truth로 본다.
- categories 관련 수치도 legacy summary와 다르다.
  - legacy 문서: `semanticCategory 44,405`, `subjectCategiory 6,379`
  - unified artifact: `의미 범주 token 44,414`, `주제 및 상황 범주 token 11,440`
- 이 차이는 단순 오타로 보기 어렵고, count 기준과 집계 표면이 다른 legacy analysis가 함께 섞여 있기 때문으로 해석하는 것이 안전하다.

## 5. KRDict 공식 범주 구조 지도

### 5.1 의미 범주 `senseCategory`

- 공식 Open API 문서에서 `sense_cat`는 `0~153` 범위의 다중 선택 배열로 노출된다.
- 공식 `senseCategory` 페이지는 이를 `의미 범주별 찾기`라는 독립 진입점으로 제공한다.
- 구조상 큰 뼈대는 다음과 같다.
  - `0 전체`
  - `인간`
  - `삶`
  - `식생활`
  - `의생활`
  - `주생활`
  - `사회 생활`
  - `경제 생활`
  - `교육`
  - `종교`
  - `문화`
  - `정치와 행정`
  - `자연`
  - `동식물`
  - `개념`
- 각 상위 가지는 다시 세부 의미로 내려간다.
  - 예: `인간 > 태도`, `인간 > 감정`, `사회 생활 > 사회 활동`, `개념 > 모양`, `개념 > 색깔`
- 해석 포인트:
  - 이 구조는 단어 검색 보조 태그가 아니라, 의미를 분해하는 공식 분류 체계다.
  - 상위 영역과 하위 세부가 모두 명시되어 있어, 의미 중심 탐색의 뼈대로 쓰기 적합하다.

### 5.2 주제 및 상황 범주 `actCategory`

- 공식 Open API 문서에서 `subject_cat`는 `0~106` 범위의 다중 선택 배열이다.
- 공식 `actCategory` 페이지는 이를 `주제 및 상황 범주별 찾기`라는 별도 진입점으로 보여주고, `초급 / 중급 / 고급` 세 칼럼 흐름으로 배치한다.
- 관찰되는 구조는 strict tree라기보다 학습 난이도 기반의 상황 그리드에 가깝다.
- 초급 쪽은 생활 생존형 진입점이 강하다.
  - 인사하기, 소개하기, 개인 정보 교환하기, 위치 표현하기, 길찾기, 교통 이용하기, 물건 사기, 음식 주문하기, 시간 표현하기, 날짜/요일, 날씨와 계절, 하루 생활, 학교생활, 한국 생활, 약속하기, 전화하기, 감사하기, 사과하기, 여행, 주말 및 휴가, 취미, 가족 행사, 건강, 병원/약국 이용하기, 공공 기관 이용하기, 초대와 방문, 집 구하기, 집안일, 감정/기분, 성격, 복장, 외모
- 중급/고급으로 갈수록 사회적, 추상적, 설명형 주제가 강해진다.
  - 공연과 감상, 대중 매체, 컴퓨터와 인터넷, 사건/사고/재해, 환경 문제, 사회 제도, 문화 비교, 인간관계, 문학, 문제 해결, 실수담, 연애와 결혼, 언어, 경제, 식문화, 기후, 직업과 진로, 직장 생활, 여가 생활, 보건과 의료, 주거 생활, 심리, 외양, 대중문화, 사회 문제, 문화 차이, 예술, 건축, 과학과 기술, 법, 스포츠, 언론, 역사, 정치, 종교, 철학·윤리
- 해석 포인트:
  - 같은 주제가 여러 레벨에 반복 노출되므로, 이 축은 의미 범주처럼 단일 계층 taxonomy로 보는 것보다 learner progression map으로 보는 편이 정확하다.
  - `subject_cat`는 의미 분류보다 말하기/상황 진입을 더 강하게 돕는다.

## 6. MM3 source 구조 분해

| 구조 신호 | 분류 | 근거 | learner 의미 |
|---|---|---|---|
| `entry` | 출발점 후보 | 표제어 단위 중심 노드 | 검색/lookup의 가장 자연스러운 시작점 |
| `sense` | 축 후보와 탐색 레이어의 중심 | 의미, 예문, 번역, 관계어가 모두 sense에 붙음 | 같은 표제어의 의미 차이를 푸는 핵심 단위 |
| `categories` | 축 후보 | 공식 범주와 1:1 대응 가능한 명시 신호 | 의미/상황 분류의 직접 진입점 |
| `subwords` | 탐색 레이어 | 관용구/속담/표현이 grouped entry로 별도 보존됨 | 표제어 아래의 별도 표현층 |
| `related_terms` | 탐색 레이어 | 유의어/반의어/높임말/낮춤말/준말/본말/센말/여린말/큰말/작은말/참고어 | 대비/확장/교체 학습 |
| `related_forms` | 탐색 레이어 | entry-level 파생/참고형 관계 | 형태군 확장, 같은 어휘 가족 탐색 |
| `translations` | 보조 정보 + sense 레이어 | sense 단위 sidecar로 별도 병합됨 | 의미 이해 보조, 언어 대역 확인 |
| `pronunciation`, `conjugations`, `annotation`, `multimedia` | 보조 정보 | 학습 보조 및 설명 레이어 | 인지 부담을 줄이는 상세 패널 정보 |
| `word_grade`, TOPIK stats, `pos`, 외국어 종류 | 필터 | 분류가 아니라 선택 조건 | 범위를 줄이는 탐색 제어 |

## 7. learner entry flow 비교

| 진입 흐름 | 가장 잘 맞는 사용자 의도 | 강점 | 위험/한계 |
|---|---|---|---|
| `word-first` | 이미 아는 단어를 찾을 때 | 가장 빠르고 직관적이다 | 의미 분해가 약해지고, 동형어/다의어 처리에 취약하다 |
| `meaning-first` | 뜻 구분부터 하고 싶을 때 | `sense`와 category를 직접 활용할 수 있다 | 단어를 알고 들어오는 사용자는 한 단계 더 돌아가야 한다 |
| `topic/situation-first` | 말하기, 장면별 표현을 찾을 때 | 학습자 생산 맥락에 가장 가깝다 | 단어 검색 효율은 떨어질 수 있다 |
| `expression/proverb/idiom-first` | 관용적 표현을 찾을 때 | `subwords`를 자연스럽게 노출한다 | 본체 어휘 taxonomy와 섞이면 구조가 흐려진다 |

### 해석

- 네 흐름은 서로 경쟁하는 것이 아니라, 서로 다른 learner intent를 대표한다.
- 따라서 taxonomy를 하나의 시작점으로 고정하기보다, `word-first`를 기본 진입으로 두고 `meaning-first`와 `topic/situation-first`를 병렬 이동 경로로 제공하는 쪽이 source 구조와 더 잘 맞는다.
- `expression/proverb/idiom-first`는 독립 탐색 축이 될 수 있지만, 본체 taxonomy와는 분리된 표현층으로 다루는 편이 안전하다.

## 8. sense 중심성이 중요한 이유

- `sense`는 정의, 예문, 번역, 관련어, 멀티미디어, 문형이 함께 모이는 최소 의미 단위다.
- entry 하나에 여러 sense가 붙기 때문에, entry 중심만으로는 학습자가 실제로 배워야 할 의미 차이를 충분히 표현할 수 없다.
- `kcenter_base.json.gz` 기준으로 `sense`는 73,445개, entry는 53,480개다.
  - 평균적으로 entry 하나당 약 1.37개의 sense가 붙는다.
  - 즉 구조적으로도 “표제어 1개 = 학습 단위 1개”가 아니다.
- 번역 sidecar도 `sense_id` 중심이다.
  - 번역은 entry보다 sense에 더 직접적으로 붙는다.
  - 따라서 taxonomy가 sense와 분리되면, 번역과 관계어의 의미 정합성이 약해진다.
- 공식 Open API도 `sense_info`를 독립 컨테이너로 둔다.
  - 이는 sense가 부가 정보가 아니라 의미 구조의 중심임을 보여준다.

## 9. 왜 MM2 `related_vocab` / `crosslink`를 taxonomy 뼈대에서 버려야 하는가

- MM2의 `related_vocab`와 `crosslink`는 runtime 친화적 탐색 도구로는 유용하지만, source-native taxonomy는 아니다.
- MM3 source는 이미 별도 역할을 가진 구조를 직접 제공한다.
  - `categories`는 공식 범주 축이다.
  - `sense`는 의미 단위다.
  - `subwords`는 표현층이다.
  - `related_terms`는 sense-level 관계망이다.
  - `related_forms`는 entry-level 형태군이다.
  - `translations`는 sense-level sidecar다.
- 따라서 MM2 그래프 뼈대를 가져오면 다음 문제가 생긴다.
  - 관계 유형이 섞여 taxonomy와 보조링크가 혼동된다.
  - 공통 축보다 adjacency 중심 구조가 되어, 공식 범주와의 정합성이 약해진다.
  - learner journey를 구조화하기보다, 기존 UX의 연결망을 재현하는 쪽으로 끌린다.
- 결론:
  - `related_vocab`, `crosslink`는 MM3 taxonomy의 뼈대가 아니라, 이후 runtime projection에서만 고려할 보조 그래프다.

## 10. 가장 강한 상위 구조 후보

### 후보 A: `word-first` 코어 + `sense/category` 보강

- 구조 개념: 사용자는 표제어로 들어오고, 내부에서 sense와 category로 분기한다.
- 근거:
  - lookup 습관에 가장 잘 맞는다.
  - 현재 source의 모든 세부층을 덜 훼손한다.
- tradeoff:
  - category-driven 학습자가 첫 진입에서 덜 만족할 수 있다.

### 후보 B: `sense-first` 코어 + `word` 보조 검색

- 구조 개념: 의미와 범주를 먼저 보여주고, 표제어는 그 안의 표면형으로 둔다.
- 근거:
  - `sense`와 `categories`가 의미 구조의 실제 중심이다.
  - 다의어/동의어/대역어 정합성에 유리하다.
- tradeoff:
  - 초보자나 lookup 중심 사용자의 즉시성은 떨어질 수 있다.

### 후보 C: `topic/situation-first` 코어 + `word/sense` 보조

- 구조 개념: 상황별 표현과 생산 맥락을 먼저 보여주고, 그 안에서 단어와 뜻을 내려간다.
- 근거:
  - KRDict 공식 `actCategory`가 별도 진입점으로 존재한다.
  - 실제 학습 맥락, 특히 말하기/활용에서 강하다.
- tradeoff:
  - 사전 검색의 직접성은 가장 약하다.
  - 범주 설계가 조금만 흔들려도 탐색이 어려워진다.

## 11. PM이 바로 결정해야 할 질문

- 첫 진입면은 `word-first`, `sense-first`, `topic-first` 중 무엇을 기본값으로 둘 것인가?
- `senseCategory`와 `actCategory`를 독립 축으로 둘 것인가, 아니면 하나를 메인 축으로 두고 다른 하나를 보조 진입점으로 둘 것인가?
- `subwords`(관용구/속담/표현)를 독립 런치패드로 열 것인가, 아니면 표제어 상세 안의 표현층으로 둘 것인가?
- `학습난이도 / TOPIK / 품사 / 외국어 종류`를 상시 필터로 둘 것인가, 아니면 문맥별 필터로 둘 것인가?
- `sense`를 runtime URL과 검색 결과의 기본 단위로 강제할 것인가?

## 12. 최종 해석

- 현재 source는 단일 트리보다 `다중 진입점 + 다층 레이어 + orthogonal filter` 모델에 가깝다.
- 따라서 아직 `3축`을 전제로 고정할 근거는 없다.
- 더 강한 결론은 축의 개수보다, learner가 어디서 들어오고 어디서 깊어지는지를 분리해 설계해야 한다는 점이다.
- 이 보고서는 taxonomy를 확정하지 않는다.
- 대신 다음 phase가 후보 구조를 비교할 수 있도록, 공식 범주 구조와 MM3 source 구조의 대응관계를 evidence-backed 형태로 남긴다.

## 13. Reflection

- 공식 KRDict 페이지와 Open API 문서를 다시 확인해 `의미 범주`와 `주제 및 상황 범주`가 독립 진입점이라는 점을 검증했다.
- unified artifact를 다시 집계해 category, sense, relation, translation의 실제 분포를 확인했다.
- learner 포함 비판 검토를 거친 뒤, `축`, `출발점`, `레이어`, `필터`, `보조 정보`를 분리한 구조로 다시 정리했다.
- 남은 불확실성은 source 부족이 아니라 PM이 어떤 learner intent를 먼저 고정할지다.
