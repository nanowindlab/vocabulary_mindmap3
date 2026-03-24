# 20260323_MM3_004_PM_STRUCTURE_OPTIONS_V1

## 목적

- `MM3-003` discovery 보고서의 `PM이 바로 결정해야 할 질문`을 그대로 다시 던지지 않고,
- 실제 의사결정이 가능한 `상위 구조 후보 비교안`으로 압축한다.

## 전제

- `mindmap2`의 `related_vocab`, `crosslink`는 taxonomy 뼈대로 사용하지 않는다.
- `학습난이도 / TOPIK / 품사 / 외국어 종류`는 축이 아니라 필터다.
- `의미 범주`, `주제 및 상황 범주`는 공식 KRDict 진입점이므로 강한 구조 신호다.
- `sense`는 의미 분해와 번역 정합성 때문에 핵심 레이어다.

## PM이 질문을 처리하는 방식

- raw 질문을 다시 늘어놓지 않는다.
- 아래처럼 처리한다.
  - 지금 당장 결정할 것
  - 아직 열어둘 것
  - 추천안
  - 추천안을 택했을 때의 tradeoff

## 지금 당장 결정할 것

### D1. 첫 진입 기본값

선택지:
- `word-first`
- `sense-first`
- `topic/situation-first`

내 추천:
- `word-first`를 기본 진입으로 둔다.

이유:
- 사전형 제품에서 가장 자연스럽다.
- 초급 학습자와 lookup intent를 가장 덜 거슬린다.
- 대신 내부 구조는 `sense`와 category로 바로 분기되게 설계할 수 있다.

tradeoff:
- category-first 학습자는 한 번 더 들어가야 한다.

### D2. category 구조의 기본 프레임

선택지:
- `의미 범주` 중심
- `주제 및 상황 범주` 중심
- `dual system` 중심

내 추천:
- `dual system`으로 간다.

정의:
- `의미 범주`는 개념 축
- `주제 및 상황 범주`는 상황 축

이유:
- source가 두 구조를 모두 공식 진입점으로 제공한다.
- 한쪽만 메인으로 두면 다른 한쪽의 learner intent를 약하게 만든다.
- MM3 source는 단일 트리보다 `다중 진입점 + 다층 레이어 + orthogonal filter`에 가깝다.

tradeoff:
- IA가 단순 1트리보다 복잡해진다.

### D3. 표현층의 위치

선택지:
- `속담/관용구/표현`을 독립 축으로 둔다
- 별도 출발점으로 둔다
- 상세 패널 보조 레이어로만 둔다

내 추천:
- `독립 축`이 아니라 `별도 출발점 + 표현층 레이어`로 둔다.

이유:
- source의 `subwords`는 중요하지만, 본체 taxonomy를 대체할 만큼 광범위한 상위 구조는 아니다.
- learner 입장에서는 표현만 따로 들어가고 싶은 경우가 분명히 존재한다.

tradeoff:
- 홈에서 너무 강하게 노출하면 core 구조가 흐려질 수 있다.

## 아직 열어둘 것

- `3축` 여부
- `sense-first`를 기본 URL 단위로 강제할지
- 번역을 첫 화면 보조 정보로 둘지, 상세 패널로 미룰지
- 필터를 상시 노출할지, context-aware로 둘지

## 상위 구조 후보 압축

### 후보 A. `word-first + dual category + sense core`

구조:
- 첫 진입: 단어 검색
- 병렬 진입: `의미 범주`, `주제 및 상황 범주`
- 내부 중심: `sense`
- 표현층: `subword`, `related_terms`, `related_forms`

장점:
- 사전형 lookup과 학습 흐름을 둘 다 살린다.
- source 구조를 가장 덜 훼손한다.
- `3축`을 억지로 만들 필요가 없다.

단점:
- 홈 구조 설명이 조금 더 필요하다.

### 후보 B. `topic-first + meaning support + word lookup`

구조:
- 첫 진입: `주제 및 상황 범주`
- 보조 진입: 검색
- 내부 분해: `sense`, `의미 범주`

장점:
- 말하기/상황별 학습에 강하다.
- learner journey가 눈에 잘 들어온다.

단점:
- 사전형 즉시 검색성이 떨어질 수 있다.
- 중급 이상 흐름은 좋지만 초급 lookup intent는 약해질 수 있다.

### 후보 C. `sense-first semantic explorer`

구조:
- 첫 진입: 의미 중심 탐색
- 표제어는 보조 표면형

장점:
- 다의어, 번역, 의미 분해에 가장 강하다.

단점:
- 일반 사용자에게는 가장 낯설다.
- 학습용 고급 모드에는 맞지만 기본 제품 구조로는 무겁다.

## 추천 결론

- 현 시점 추천은 `후보 A`
- 즉,
  - 기본 진입은 `word-first`
  - category 구조는 `의미 범주 + 주제 및 상황 범주`의 dual system
  - 내부 학습 단위는 `sense core`
  - 표현은 `별도 출발점 + 표현층 레이어`

## 왜 raw 질문보다 이 비교안이 나은가

- 질문을 다시 던지지 않고 구조 후보를 압축한다.
- 각 선택지가 learner experience에 어떤 영향을 주는지 바로 본다.
- 지금 결정할 것과 나중에 열어둘 것을 분리한다.

## 다음 단계 제안

1. 위 후보 A/B/C 중 PM 기준 provisional choice를 정한다.
2. 그 choice를 바탕으로 `MM3-004 scenario rewrite`를 진행한다.
3. 그 뒤 implementation gate를 다시 판정한다.
