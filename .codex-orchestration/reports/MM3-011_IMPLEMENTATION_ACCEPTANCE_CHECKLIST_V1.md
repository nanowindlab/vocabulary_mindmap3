# MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1

## Revision Meta

- Current Revision: `R1`
- Last Updated: `2026-03-23`
- Last Updated By: `ACCEPTANCE_AGENT`

## 1. 목적과 범위

- 본 문서는 구현 단계가 열렸을 때 어떤 evidence를 기준으로 accept할지 정의하는 체크리스트다.
- 기준 축은 `MM3-009 IA Package`, `MM3-010 Runtime Contract Package`, `MM3-005 Scenario Rewrite Report`, `MM3-007 Implementation Gate Definition`에 맞춘다.
- 핵심 원칙은 `word-first + dual category + sense core`를 해치지 않으면서, `다중 진입점 + 다층 레이어 + orthogonal filter`가 runtime에서 유지되는지 확인하는 것이다.
- 검수 순서는 `작업 -> 검증 -> learner 포함 3인 전문가 비판 검토 -> 개선 -> 재검증`으로 고정한다.

## 2. acceptance 증거 원칙

- 증거는 문서 설명이 아니라 실제 렌더/구성/반영 결과여야 한다.
- 같은 항목이라도 `IA`, `runtime contract`, `count`, `learner flow` 중 어디에서 확인되는지 구분해야 한다.
- 구조가 맞아도 count나 required field가 흔들리면 accept하지 않는다.
- learner 관점에서 초급 사용자의 첫 탐색 부담이 커졌다면 구조상 합격이더라도 보류한다.

## 3. 필수 acceptance 항목

### 3.1 구조 적합성

- [ ] 홈 / 결과 / 상세 / 표현층 / 필터 바의 역할이 서로 겹치지 않고 분리되어 있다.
- [ ] `word-first`가 기본 진입으로 유지된다.
- [ ] `의미 범주`와 `주제 및 상황 범주`는 병렬 진입으로 남아 있고, 하나가 다른 하나를 대체하지 않는다.
- [ ] `sense`가 상세의 중심 단위로 유지된다.
- [ ] `subword`는 본체 taxonomy가 아니라 별도 표현층으로 취급된다.
- [ ] `TOPIK / 학습난이도 / 품사 / 외국어 종류`는 범주가 아니라 orthogonal filter로 유지된다.

### 3.2 화면 단위 대응

- [ ] 홈은 thin projection만으로도 닫힌다.
- [ ] 결과는 entry 요약과 sense 요약으로 다의어를 구분할 수 있다.
- [ ] 상세는 full sense tree를 제공한다.
- [ ] 표현층은 subword 중심으로 독립 렌더된다.
- [ ] 필터 바는 dictionary 본문이 아니라 facet metadata만 사용한다.

## 4. count 검수 항목

### 4.1 canonical count 일치

- [ ] runtime에서 확인한 전체 entry count가 canonical count `53,480`과 일치한다.
- [ ] count summary가 stale summary `53,439`를 재노출하지 않는다.
- [ ] count 불일치가 있으면 원인 설명이 아니라 우선 fail로 처리한다.

### 4.2 count 표기 정합성

- [ ] 홈, 결과, 상세의 count 표기가 서로 다른 기준을 섞지 않는다.
- [ ] 결과 목록 count와 필터 적용 후 count가 같은 집계 축을 사용한다.
- [ ] sense count, subword count, entry count가 서로 혼동되지 않는다.
- [ ] count가 표시되지 않는 화면은 숨김이 아니라 의도된 비노출인지 확인된다.

### 4.3 count fail 조건

- [ ] canonical count와 runtime count가 불일치한다.
- [ ] stale summary가 여전히 기본값으로 노출된다.
- [ ] 화면별 count 기준이 달라 사용자가 동일한 총량으로 오해할 수 있다.

## 5. required field 검수 항목

### 5.1 entry

- [ ] 홈과 결과에서 `entry.id`, `entry.word`, `entry.pos`가 안정적으로 나온다.
- [ ] 화면에 따라 `entry.word_grade`, `entry.categories` 요약이 함께 제공된다.
- [ ] `has_subwords`, `sense_count`, `has_related_forms`가 thin projection에서 일관되게 계산된다.

### 5.2 sense

- [ ] 결과 카드마다 최소 1개 sense 요약이 나온다.
- [ ] 상세에서는 각 sense에 `definition`과 `translation`이 정합적으로 묶인다.
- [ ] `examples`, `related_terms`, `syntactic_patterns`는 상세에서만 rich detail로 확장된다.

### 5.3 subword / translation / filters

- [ ] 표현층은 `subword` 전체와 연결 sense를 구분해 렌더한다.
- [ ] `translation`은 entry 공통 필드가 아니라 sense sidecar로 유지된다.
- [ ] 필터 바는 `학습난이도`, `TOPIK`, `품사`, `외국어 종류`의 선택 상태와 옵션 집합을 제공한다.

### 5.4 required field fail 조건

- [ ] 홈/결과에서 rich detail 필드가 과도하게 노출된다.
- [ ] 상세에서 `sense`와 `translation`의 결속이 끊어진다.
- [ ] 표현층의 `subword`가 entry 부속물처럼만 처리된다.
- [ ] 필터가 taxonomy처럼 렌더되어 범주와 섞인다.

## 6. runtime reflection 검수 항목

### 6.1 구조 반영

- [ ] runtime payload split이 `thin index / detail payload / expression payload / facet payload`로 구분된다.
- [ ] 홈과 결과는 thin projection만으로 닫힌다.
- [ ] 상세와 표현층은 rich detail을 허용하되 기본 노출이 과도하지 않다.
- [ ] `entry`, `sense`, `subword`, `translation`, `filters`의 역할이 화면별로 유지된다.

### 6.2 반영 품질

- [ ] 같은 필드가 화면마다 필요한 깊이만큼만 노출된다.
- [ ] 번역과 예문이 sense 단위로 보존된다.
- [ ] 필터 상태가 홈과 결과에서 공유되지만 주인공처럼 보이지 않는다.
- [ ] `mindmap2`식 연결망 관성이 구조 뼈대로 되살아나지 않는다.

### 6.3 runtime reflection fail 조건

- [ ] 실제 payload가 IA의 화면 분리를 따르지 않는다.
- [ ] thin projection과 rich detail의 경계가 무너진다.
- [ ] 필터가 탐색 축처럼 동작해 orthogonal control 역할을 잃는다.
- [ ] `sense`보다 `entry` 요약이 더 강한 판별 수단으로 쓰인다.

## 7. learner flow 검수 항목

### 7.1 기본 흐름

- [ ] 첫 진입에서 사용자는 검색으로 시작할 수 있다.
- [ ] 검색이 없더라도 의미 범주, 주제 및 상황 범주, 표현층 보조 진입이 보인다.
- [ ] 결과에서 사용자는 같은 표제어의 다른 sense를 빠르게 비교할 수 있다.
- [ ] 상세에서 정의, 예문, 번역, 관련어가 sense 기준으로 읽힌다.

### 7.2 부담 완화

- [ ] 첫 화면이 설명 과다로 막히지 않는다.
- [ ] 표현층은 2차 노출로 유지되어 초기에 인지 부담을 키우지 않는다.
- [ ] 필터는 상단 고정이더라도 시각 밀도가 낮다.
- [ ] 사용자가 한 화면에서 너무 많은 선택지를 동시에 강요받지 않는다.

### 7.3 learner flow fail 조건

- [ ] 첫 화면이 `word-first`보다 `situation-first`를 강하게 밀어 learner 부담을 높인다.
- [ ] 의미 범주와 주제 및 상황 범주가 하나의 덩어리처럼 보여 의도가 흐려진다.
- [ ] 표현층이 홈의 1차 핵심 진입처럼 과도하게 노출된다.
- [ ] 초급 learner 기준으로 선택 비용이 IA보다 커진다.

## 8. fail 조건

- [ ] canonical count 불일치가 있다.
- [ ] IA의 화면 분리가 runtime에서 재현되지 않는다.
- [ ] required field가 화면별 계약과 어긋난다.
- [ ] `sense` 중심 정합성이 깨진다.
- [ ] `translation`이 sense sidecar가 아니라 entry 공통층으로 재배치된다.
- [ ] `subword`가 본체 구조와 섞인다.
- [ ] 필터가 orthogonal control이 아니라 taxonomy처럼 보인다.
- [ ] learner flow가 검색 중심 기본값을 유지하지 못한다.

## 9. review / PM acceptance 기준

### 9.1 review 기준

- [ ] review lane이 구조, count, required field, runtime reflection, learner flow를 모두 분리해서 점검한다.
- [ ] learner 포함 3인 전문가 비판 검토에서 반대 의견이 구조적 쟁점으로 남지 않는다.
- [ ] 반대 의견이 남더라도 `residual risk`로 국소화될 수 있어야 한다.

### 9.2 PM acceptance 기준

- [ ] 구조가 `word-first + dual category + sense core`와 충돌하지 않는다.
- [ ] runtime contract가 IA를 충분히 반영한다.
- [ ] count와 required field가 모두 통과한다.
- [ ] learner flow가 초급 기준에서 과도한 부담을 만들지 않는다.
- [ ] 남는 리스크가 구현 결함이 아니라 후속 refinement 수준으로 제한된다.

### 9.3 PM reject 기준

- [ ] 한 항목이라도 fail 조건이 발생하면 PM accept를 보류한다.
- [ ] review 결과가 `PARTIAL_ACCEPT`여도 핵심 항목 실패가 있으면 accept하지 않는다.
- [ ] 구조적 문제를 residual risk로 과소평가하지 않는다.

## 10. 실행 순서

1. 작업 산출물을 실제 artifact 기준으로 확인한다.
2. count와 required field를 먼저 검증한다.
3. runtime reflection으로 IA 반영 여부를 확인한다.
4. learner 포함 3인 전문가 비판 검토를 수행한다.
5. 비판 내용을 반영해 개선한다.
6. 동일 기준으로 재검증한다.

## 11. Reflection

- 이 체크리스트의 핵심은 구현을 빨리 통과시키는 것이 아니라, IA와 runtime contract가 실제 artifact로 번역됐는지 증거 기반으로 가르는 데 있다.
- `count`, `required field`, `runtime reflection`, `learner flow`를 분리해 두지 않으면 구조 합격과 실제 운영 합격이 쉽게 섞인다.
- 특히 `sense` 중심 정합성과 `word-first` 기본 진입이 동시에 유지되는지 보는 것이 이번 단계의 가장 중요한 기준이다.
