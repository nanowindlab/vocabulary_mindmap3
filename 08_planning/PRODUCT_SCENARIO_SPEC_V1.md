# PRODUCT_SCENARIO_SPEC_V1

> 상태: `Phase 1 Final Canonical`
> Last Updated: `2026-03-29 12:40 KST`
> Role: Phase 1 learner-facing scenario canonical (`09_app/` frozen baseline)

## Product Intent

- `mindmap2`의 탐색형 학습 UX를 유지하되, `mindmap3`에서는 한국어 기초사전의 richer sense/subword/translation 구조를 learner-friendly detail panel로 확장한다.
- current product baseline은 `word-first + dual category + sense core`다.

## Canonical Rule

- 이 문서는 current learner-facing product scenario의 canonical source로 사용한다.
- current authoritative runtime boundary는 `APP_READY_SEARCH_INDEX`의 `search semantic fields`와 `APP_READY_FACETS`다.
- broader runtime parity work와 canonical `chunk_id` mapping은 이 문서의 main scope가 아니다.

## Scenario 1. 단어 중심 탐색

- 사용자는 `검색`, `리스트`, `마인드맵` 세 경로 중 하나로 같은 단어에 도달한다.
- 검색 결과는 learner가 바로 판단해야 하는 최소 정보를 보여 준다.
  - `word`
  - `def_ko`
  - learner-facing path
  - `band` 중심 learner signal
- 클릭 후 상세 패널에서 아래 순서로 읽는 것을 기본 경로로 본다.
  1. `핵심`
  2. `의미 관계`
  3. `활용 표현`
  4. `예문`

## Scenario 2. 카테고리에서 방사형 확장

- 사용자는 `의미 범주`, `주제 및 상황 범주`, `분류 밖 항목` 축 중 하나를 선택한다.
- 초기 렌더는 `root > category`까지만 유지한다.
- 특정 category를 누르면 해당 category의 term만 radial expansion 한다.
- 다른 category를 누르면 이전 확장은 접힌다.
- tree는 구조 탐색 모드이며, primary learner entry는 여전히 search-first / list-first다.

## Scenario 3. 학습 신호 기반 필터

- 사용자는 learner signal로 `band`를 사용한다.
- `level`은 learner-facing 지표에서 사용하지 않는다.
- `미산출`은 learner-facing main filter에서 제거한다.
- raw TOPIK frequency 수치는 직접 노출하지 않는다.
- learner-facing wording과 definition source는 항상 MM3 사전 값을 기준으로 유지한다.

## Scenario 4. 사전형 상세 학습

- 사용자는 한 단어의 여러 `sense`와 `subwords`를 한 화면에서 구분해 본다.
- `related_forms`와 `related_terms`는 분리 노출한다.
- `의미 관계어`, `관련형`, `subword` 카드 점프는 detail panel 안에서 동작한다.
- `활용 표현`은 상세 내부의 2차 보조 레이어다.
- 별도 top-level expression surface나 auto-open 기본값은 열지 않는다.

## Scenario 5. 예문과 번역

- 예문은 현재 의미 예문과 `TOPIK` source 문장을 함께 보여 준다.
- 현재는 `TOPIK` source가 있으면 먼저, 그다음 dictionary examples가 이어진다.
- compact surface와 detail surface는 `대표 번역 1개` 기준으로 유지한다.
- 나머지 번역은 `전체 번역 보기` 확장으로만 노출한다.
- translation selector 변경 시 search/detail/expression의 대표 번역 surface가 함께 바뀌는 것을 current canonical로 본다.

## Scenario 6. 구조적 점프

- detail panel의 `cross_links`는 다른 category 또는 다른 축으로 jump 시킨다.
- `related_vocab`는 local semantic assist로만 유지한다.
- taxonomy 자체를 relation mesh로 대체하지 않는다.

## Scenario 7. `상황 미지정`과 `분류 밖 항목`

- `주제 및 상황 > 없음 > 없음`은 learner-facing path에서 `주제 및 상황 > 상황 미지정 > 일반 어휘`로 읽는다.
- raw/internal `미분류`는 learner-facing root에서 `분류 밖 항목`으로 읽는다.
- 둘은 같은 bucket이 아니다.
- `분류 밖 항목`은 current main app 안의 fallback interpretation surface로 유지한다.

## UX Rule

- layout과 view mode 구조는 `mindmap2`와 거의 동일하게 유지한다.
- current phase에서는 “새 디자인”보다 “새 source와 learner detail 구조에 맞는 정보 구조 수정”을 우선한다.
- current canonical은 existing surface refinement까지 포함하지만, 별도 new-design tranche를 열었다고 보지는 않는다.
