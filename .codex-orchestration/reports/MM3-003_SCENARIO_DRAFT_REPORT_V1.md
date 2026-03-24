# MM3-003_SCENARIO_DRAFT_REPORT_V1

## 핵심 사용자군 가정

- 초급 학습자: 단어를 상황별로 빠르게 찾고, 대표 뜻과 예문만 먼저 보고 싶은 사용자
- 중급 학습자: 유사어, 관련어, 하위 표현을 함께 비교하면서 학습 범위를 넓히려는 사용자
- 고급 학습자: sense 차이, 관련 표현, 번역 어휘를 비교하며 정밀하게 탐색하려는 사용자
- 교사/콘텐츠 편집자: 특정 단어의 의미 구조와 예문, cross-link를 검토해 수업/콘텐츠에 재사용하려는 사용자

## 대표 사용 시나리오

### 1. 검색 중심 단어 탐색

- 사용자는 검색창에 표제어를 입력한다.
- 결과 화면에서 `word`, `주요 뜻`, `band`, `level`, `분류 경로`를 빠르게 확인한다.
- 단어를 선택하면 상세 패널에서 대표 뜻, 예문, 관련어, 번역, 하위 표현을 순서대로 본다.

### 2. 분류 축을 따라 들어가기

- 사용자는 3축 중 하나를 선택하고 루트와 카테고리를 훑는다.
- 초기에는 `root > category`까지만 보여서 화면이 과밀해지지 않는다.
- 특정 category를 열면 그 아래 단어만 방사형으로 확장된다.
- 다른 category를 누르면 이전 확장은 접힌다.

### 3. 난이도 기반 필터 탐색

- 사용자는 Band와 Level을 함께 선택해 학습 난이도를 조절한다.
- 검색 결과와 마인드맵 모두에서 같은 필터가 유지된다.
- raw frequency 숫자는 노출하지 않고, 난이도 배지와 색상으로만 힌트를 준다.

### 4. 상세 구조 비교

- 사용자는 한 단어의 여러 sense를 비교한다.
- sense별 정의, 예문, 번역, 관련어가 분리된 상태로 보인다.
- `subwords`와 `related_forms`는 본문 taxonomy를 대체하지 않고, 보조 탐색 요소로만 노출된다.

### 5. 구조적 점프

- 사용자는 상세 패널의 cross-link를 눌러 다른 category나 다른 축으로 이동한다.
- 이동 후에도 현재 선택 단어의 맥락은 유지된다.
- 점프는 relation mesh가 아니라 탐색 경로의 단축으로 처리한다.

## 정보 노출 단계

- 1단계: `검색어`, `대표 뜻`, `분류 경로`, `Band/Level`
- 2단계: `대표 예문`, `관련어`, `발음`, `기본 메타`
- 3단계: `sense별 세부 뜻`, `번역`, `문형`, `cross-link`
- 4단계: `subwords`, `related_forms`, 추가 예문, 세부 비교 정보

## mindmap2에서 유지할 UX 골격

- 3축 중심의 상위 탐색 구조
- `root > category > term`의 단계적 전개
- 검색, 마인드맵, 상세 패널이 서로 연결되는 단일 화면 흐름
- Band/Level 필터와 배지 중심의 학습 힌트
- category 확장과 collapse가 반복되는 탐색 리듬
- 상세 패널에서 local semantic assist를 제공하는 방식

## mindmap3에서 달라져야 할 정보 구조

- 단어보다 `entry/sense/subword/translation` 구조가 먼저 드러나야 한다.
- sense는 하나의 단어 아래 독립된 정보 단위로 취급해야 한다.
- translations는 sidecar 또는 분리된 학습 보조 계층으로 다뤄야 한다.
- subwords와 related_forms는 taxonomy를 바꾸지 않고 보조 탐색만 제공해야 한다.
- count와 band는 `mindmap2`의 projection 신호로 보되, source truth는 아니다.

## taxonomy 결정 전에 열어둘 쟁점

- 3축 이름을 `mindmap2`와 같은 사용자 언어로 유지할지, `mindmap3`에 맞게 재명명할지
- root/category를 `entry.categories` 기준으로 바로 쪼갤지, 별도 taxonomy draft를 둘지
- `band/level`을 검색 필터와 상세 패널 둘 다에 노출할지
- `subwords`를 초기 화면에 바로 보여줄지, 접힌 보조 섹션으로 둘지
- 번역을 전체 노출할지, 학습자 수준별 일부만 노출할지
- cross-link를 탐색 보조로만 둘지, 사용 흐름의 핵심 이동축으로 더 강하게 둘지

## PM이 다음에 결정해야 할 질문

- 첫 번째 taxonomy draft는 `mindmap2`와 최대한 유사하게 갈까, 아니면 `mindmap3` source 구조에 맞춰 다시 설계할까?
- 사용자에게 가장 먼저 보여줄 정보는 `분류 경로`와 `band/level` 중 어느 쪽인가?
- 상세 패널의 첫 화면에 `subwords`와 `translations`를 같이 둘까, 단계적으로 숨길까?
- `mindmap2`의 3축 명칭을 그대로 유지할까?
- scenario 이후 바로 validation lane이 필요한가, 아니면 taxonomy draft 후에 여는가?

## Reflection

- source review acceptance와 data validation 결과를 다시 읽고, 시나리오가 source-backed 구조와 충돌하지 않도록 정리했다.
- 초안 작성 후 `mindmap2`의 UX 골격과 `mindmap3`의 richer source structure를 분리해서 다시 점검했다.
- 남은 불확실성은 taxonomy 이름과 정보 노출 우선순위이며, 이는 의도적으로 PM 결정으로 남겼다.
