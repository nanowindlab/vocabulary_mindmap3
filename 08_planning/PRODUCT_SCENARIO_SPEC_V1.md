# PRODUCT_SCENARIO_SPEC_V1

> 상태: `Draft Scaffold`
> 현재 phase에서 final scenario canonical이 아니라, source review 이후 확장될 초안 골격이다.

## Product Intent

- `mindmap2`의 탐색형 학습 UX를 유지하되, `mindmap3`에서는 한국어 기초사전의 richer sense/subword/translation 구조를 learner-friendly detail panel로 확장한다.

## Current Rule

- 이 문서는 source schema / data structure review 전에 final로 확정하지 않는다.
- 현재는 “어떤 종류의 시나리오를 써야 하는가”를 미리 잡는 scaffold 문서로만 본다.

## Scenario 1. 단어 중심 탐색

- 사용자는 검색창에서 표제어를 찾는다.
- 검색 결과는 `word`, `def_ko`, `band`, `level`, `path_ko`를 바로 보여준다.
- 클릭 시 detail panel에서 뜻풀이, 대표 예문, 관련어, 번역, 하위 표현을 본다.

## Scenario 2. 카테고리에서 방사형 확장

- 사용자는 3축 중 하나를 선택한다.
- 초기에는 `root > category`까지만 렌더링한다.
- 특정 category를 누르면 해당 category의 term만 radial expansion 한다.
- 다른 category를 누르면 이전 확장은 접힌다.

## Scenario 3. 학습 난이도 기반 필터

- 사용자는 `Band 1~5`와 `Beginner/Intermediate/Advanced/Unrated`를 조합해 필터링한다.
- raw TOPIK frequency 수치는 노출하지 않는다.
- 배지는 `mindmap2`의 한국어 명칭을 유지하되, `mindmap3` detail 구조에 맞게 상단 요약 영역에서 우선 노출한다.

## Scenario 4. 사전형 상세 학습

- 사용자는 한 단어의 여러 `sense`와 `subwords`를 한 화면에서 구분해 본다.
- `related_forms`와 `related_terms`는 분리 노출한다.
- 번역은 learner utility가 높은 언어 우선 정렬을 추후 검토하되, 현재는 source 보존을 우선한다.

## Scenario 5. 구조적 점프

- detail panel의 `cross_links`는 다른 category 또는 다른 축으로 jump 시킨다.
- `related_vocab`는 local semantic assist로만 유지한다.
- taxonomy 자체를 relation mesh로 대체하지 않는다.

## Initial UX Rule

- layout과 view mode 구조는 `mindmap2`와 거의 동일하게 유지한다.
- 이번 phase에서는 “새 디자인”보다 “새 source와 learner detail 구조에 맞는 정보 구조 수정”이 우선이다.
