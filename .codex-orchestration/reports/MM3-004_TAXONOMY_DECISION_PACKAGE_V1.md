# MM3-004_TAXONOMY_DECISION_PACKAGE_V1

## 핵심 결론

- `mindmap3` taxonomy는 `mindmap2`의 `related_vocab`나 `crosslink`를 뼈대로 삼지 않는다.
- taxonomy의 출발점은 축 이름이 아니라 `mindmap3` source의 구조 자체다.
- 현재 시점에서 `3축`은 가정하지 않는다. source 구조를 충분히 펼친 뒤에 2축, 3축, 다층 구조 중 무엇이 자연스러운지 판정해야 한다.
- 가장 강한 후보는 고정된 축 수보다 `계층형 + 보조면` 구조다. 즉 `entry / sense / subword / translation / categories`를 모두 살리면서, 학습자 흐름을 이끄는 상위 navigation layer를 source에서 재발견하는 방식이다.

## Source 구조에서 보이는 학습자 친화 후보

- `entry`는 단어 표면형이 아니라 학습자의 진입점이다.
- `sense`는 한 entry 아래의 의미 단위이며, 학습자에게는 가장 중요한 비교 단위다.
- `subword`는 관용구/속담/고정 표현처럼 별도 학습 단위로 다뤄야 한다.
- `translation`은 상위 taxonomy가 아니라 의미 보조 계층이다.
- `categories`는 source가 이미 제공하는 구조적 분류 단서이며, 학습자의 시선 이동을 설계하는 데 직접 활용할 수 있다.
- `word_unit`, `word_type`, `word_grade`, `pos`, `homonym_no`, `annotation`, `pronunciation`, `conjugations`, `original_language`, `related_forms`, `related_terms`는 taxonomy 자체보다 더 세밀한 학습 구조 정보를 제공한다.

## MM2 개념을 버려야 하는 이유

- `related_vocab`는 source 구조가 아니라 MM2 runtime의 local assist 개념이다.
- `crosslink`는 탐색 편의를 위해 만든 이동 장치이지, MM3의 분류 뼈대가 아니다.
- MM3는 더 풍부한 source를 갖고 있으므로, 학습자 경험을 raw link 네트워크가 아니라 의미 단위와 구조 단위로 설계해야 한다.
- MM2 방식은 단어를 다른 단어로 연결하는 데 강하지만, MM3가 필요한 것은 의미-표현-하위표현-번역-문법주석의 구조적 흐름이다.

## 상위 구조 옵션 비교

### 옵션 1. 3축 구조

- 장점: MM2와의 연속성이 높고 초기 설명이 쉽다.
- 단점: source가 실제로 3축을 강하게 지지하지 않으면 인위적 축이 될 수 있다.
- 판정: 현재는 보류. source 구조를 먼저 본 뒤 결정해야 한다.

### 옵션 2. 2축 구조

- 장점: 더 단순하고 학습자에게 직관적일 수 있다.
- 단점: MM3의 구조적 풍부함을 일부 누락할 가능성이 있다.
- 판정: 가능성은 열어두되, source가 2개의 강한 상위 축을 보여줄 때만 채택한다.

### 옵션 3. 다층 구조

- 장점: source가 가진 여러 차원의 정보를 가장 잘 보존한다.
- 단점: 초기 UX 설계가 복잡해질 수 있다.
- 판정: 현재 가장 현실적인 기본 후보다.

### 권장 방향

- 지금은 축 수를 먼저 정하지 말고, source 구조에서 먼저 자연스러운 상위 학습 구조 후보를 추출한다.
- 그 다음에 축 수를 결정한다.
- 따라서 taxonomy 결정의 우선순위는 `축 수`가 아니라 `학습자 경험을 설명하는 구조의 성질`이다.

## 첫 화면 정보 우선순위 후보

- 1순위 후보: `대표 의미`, `분류 경로`, `학습 난이도`
- 2순위 후보: `대표 예문`, `발음`, `기본 메타`
- 3순위 후보: `sense 차이`, `translation`, `문형`
- 4순위 후보: `subword`, `related_forms`, 확장 비교

## PM이 결정해야 할 질문

- source 구조가 실제로 몇 개의 상위 학습 구조를 자연스럽게 지지하는가?
- 첫 화면은 분류 중심인가, 의미 중심인가, 학습 흐름 중심인가?
- `categories`를 taxonomy의 축으로 볼 것인가, 보조 경로로 볼 것인가?
- `subwords`를 상위 taxonomy와 같은 층위로 볼 것인가, 별도 학습 레이어로 둘 것인가?
- `translation`은 언제 노출해야 학습자 흐름을 방해하지 않는가?
- `3축`은 유지 조건인가, 결과 조건인가?

## 시나리오 연결

- scenario는 taxonomy가 닫혀야 final form이 된다.
- 현재 scenario 초안은 구조적 쟁점 정리에 유효하지만, final taxonomy package는 아니다.
- taxonomy가 확정되면 scenario는 다시 써야 한다.

## Reflection

- source review package, data validation report, scenario draft를 다시 교차 확인했다.
- self-review 후 `MM2` 개념 재사용 금지와 `3축 미가정`을 더 강하게 분리했다.
- 아직 확정하지 않은 것은 축 수가 아니라, source가 실제로 허용하는 학습 구조의 형태다.

