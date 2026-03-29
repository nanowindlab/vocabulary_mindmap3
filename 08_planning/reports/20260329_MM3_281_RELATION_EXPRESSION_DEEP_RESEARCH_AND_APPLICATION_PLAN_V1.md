# 20260329_MM3_281_RELATION_EXPRESSION_DEEP_RESEARCH_AND_APPLICATION_PLAN_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-29 03:36 KST`

## Last Updated By

- `Codex PM`

## Scope

- `의미 관계`와 `활용 표현`을 next application candidate로 검토한다.
- 한국어 사전의 relation / expression / 활용 정보 구조를 official source와 research basis로 폭넓게 조사한다.
- current MM3 relation/expression surface에 바로 연결 가능한 learner-facing opportunity와 operating rule을 정리한다.

## Inputs

- control-plane:
  - `08_planning/TASKLIST_V1.md`
  - `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
  - `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
- current product/runtime:
  - `09_app/src/components/TermDetail.jsx`
  - `08_planning/reports/20260326_MM3_237_RELATION_TAB_INFORMATION_HIERARCHY_REFINEMENT_V1.md`
  - `08_planning/reports/20260324_MM3_158_EXPRESSION_SCENARIO_WORKFLOW_ACCEPTANCE_V1.md`
  - `08_planning/reports/20260324_MM3_057_DETAIL_EXPRESSION_REFINEMENT_ACCEPTANCE_V1.md`
  - `08_planning/reports/20260326_MM3_235_RELATED_FORM_AUDIT_AUTOMATION_V1.md`
- external research focus:
  - official Korean dictionary surfaces and API/distribution policy
  - learner-facing synonym / idiom / expression / example design research
  - corpus-backed expression/usage expansion opportunity

## Current Product Baseline

- relation tab current contract:
  - `연관 어휘`
  - `의미 관계어`
  - `관련형`
  - `교차 연결 장면`
  - `다른 뜻 보기`
- expression tab current contract:
  - `subwords`를 `바로 이동`과 preview-only로 분리한다.
  - 표현층은 detail 내부의 2차 보조 레이어로 유지한다.
- current source-faithful guardrails:
  - source-ambiguous `related_forms`는 `text-only`로 유지한다.
  - target이 source에 없으면 heuristic jump target을 만들지 않는다.
- local baseline already fixed in prior packets:
  - current live `has_subwords` terms: `1,161`
  - base `related_forms`: `18,771`
  - unresolved `related_forms`: `4,303`
  - unresolved bucket `source_ambiguous`: `4,302`

## Initial Research Questions

1. official Korean dictionaries currently expose which relation / expression / 활용 fields in a way that MM3 can trust?
2. learner-facing relation surfaces should distinguish which types first:
   - synonym / antonym / related term
   - derived form / related form
   - idiom / proverb / phrase / expressive pattern
   - collocation / sentence pattern / pragmatic usage note
3. which information belongs in `의미 관계` versus `활용 표현`, and which should stay source-faithful versus inferred?
4. what acquisition/use cases become stronger if MM3 treats relation/expression as an application layer rather than just a detail-side helper?
5. what validation rules are needed so future relation/expression expansion does not reopen current source-faithful boundary risks?

## Planned Process

1. 기획:
   - current MM3 contract, research questions, exit condition을 고정한다.
2. 3인의 전문가 review:
   - lexicography lens
   - Korean learner experience lens
   - product/data operating lens
3. deep research rerun + improvement:
   - review에서 지적된 missing source/questions만 다시 조사한다.
   - application plan을 sharpen한다.
4. validation:
   - source-backed claim / local-product-fit / non-goal separation을 확인한다.

## 3인의 전문가 Review

### Expert 1. Lexicography Lens

- strong point:
  - official dictionary 중심으로 가겠다는 방향은 맞다.
  - current MM3의 source-faithful `related_forms` guardrail도 유지해야 한다.
- critique:
  - initial plan은 `활용 정보`와 `활용 표현`을 같은 층위로 묶고 있었다.
  - official source들은 실제로 `활용`, `문형`, `관용구`, `속담`, `비슷한말`, `반대말`, `참고 어휘`를 분리해서 다룬다.
  - therefore relation/application plan도 source type을 먼저 나누고 learner-facing regroup을 그 위에서 해야 한다.
- required improvement:
  - `의미 관계`, `활용`, `표현`을 data contract 단계에서 분리한다.
  - clickable relation은 source-explicit target만 허용한다.
  - open/community source는 provenance badge를 분리한다.

### Expert 2. Korean Learner Experience Lens

- strong point:
  - current MM3 relation/expression tab은 already useful entry point다.
  - user feedback도 `유의어, 반의어, 관용구, 속담`을 앞쪽에서 보고 싶다는 방향을 주고 있다.
- critique:
  - initial plan은 learner job을 충분히 쪼개지 못했다.
  - beginner는 `비슷한말/반대말/속담 사전처럼 바로 비교`를 원하고,
  - intermediate/advanced는 `문형, 공손도, 쓰임 차이, collocation`까지 필요하다.
  - expression layer를 flat list로 두면 productive learning value가 작다.
- required improvement:
  - `비교`, `말하기/쓰기`, `상황별 표현 선택`의 3 job으로 나눠 설계한다.
  - example는 phrase / sentence / dialogue를 구분해서 보여 준다.
  - politeness / register / speech-act note를 expression layer에 포함한다.

### Expert 3. Product / Data Operating Lens

- strong point:
  - current MM3 local baseline과 relation unresolved risk를 같이 보려는 방향은 맞다.
- critique:
  - initial plan에는 phased rollout과 validation gate가 부족했다.
  - 현재 local baseline상 `has_subwords` term은 `1,161`, base `related_forms`는 `18,771`, unresolved `related_forms`는 `4,303`이라 coverage와 jumpability가 이미 비대칭이다.
  - therefore one-shot surface expansion보다 provenance-tier + phased rollout이 필요하다.
- required improvement:
  - Phase 0에서 source taxonomy / provenance / validation schema를 먼저 고정한다.
  - Phase 1 이후에 only source-backed compare/jump surface를 연다.
  - corpus-assisted expansion은 non-authoritative `Tier 2`로 분리한다.

## Review-Driven Rerun Questions

1. official dictionaries are already separating which relation and expression types?
2. learner dictionary research says what should distinguish `example`, `pattern`, `idiom`, `synonym note`?
3. which external resource can support non-authoritative but useful expansion without breaking current MM3 guardrails?

## Deep Research Findings

### A. Official Source Landscape

#### 1. 한국어기초사전

- `한국어기초사전`은 한국어 학습자와 교사를 위한 학습용 웹 사전이며, 11개 언어 번역 학습사전의 기반 사전이다.
- help 기준으로 `5만 항목`을 대상으로 쉬운 뜻풀이, 실제 예문, 관련어, 관용구, 속담, 문형, 활용형을 제공한다.
- 특정 어휘가 포함된 `속담·관용구`, `뜻풀이`, `용례`를 별도 탭으로 다시 찾을 수 있다.
- Open API는 `word`, `ip(관용구/속담)`, `dfn`, `exam` 검색 target을 제공하고, advanced target에는 `활용`, `활용의 준말`, `관용구`, `속담`, `참고 정보`가 포함된다.
- type filter도 `word`, `phrase`, `expression`을 구분한다.
- implication:
  - learner-facing `활용 표현` 강화를 위한 가장 직접적인 official basis다.
  - example / pattern / multilingual layer를 같이 설계하기 좋다.

#### 2. 표준국어대사전

- `표준국어대사전`은 `자세히 찾기`에서 `활용`, `문형`, `문법`, `뜻풀이`, `용례`, `용례 번역` 등을 조건으로 검색할 수 있다.
- entry 하단에서 `관용구/속담`을 확인할 수 있고, 전체 사전 내려받기도 지원한다.
- implication:
  - widest-coverage normative backstop으로 쓰기 좋다.
  - learner copy의 tone source라기보다 relation/pattern coverage audit source에 가깝다.

#### 3. 우리말샘

- sampled entry 기준 `비슷한말`, `참고 어휘`, `관용구·속담`, `어휘 지도`를 함께 제공한다.
- entry 내부 lexical map에는 `상위어`, `비슷한말`, `참고 어휘`, `하위어`, `반대말` 같은 relation slot이 구조적으로 드러난다.
- implication:
  - relation graph richness가 높다.
  - 다만 open/community source 성격이 있으므로 provenance badge 없이 MM3 core truth로 바로 승격하면 안 된다.

#### 4. 온용어

- `온용어`는 `관련 용어`, `용어 개념도`, `지식그래프` 탐색과 JSON/Excel 다운로드를 지원한다.
- graph export 항목은 `주제, 출발어, 도착어, 관계, 관계속성`이다.
- sampled term `ㄹ 불규칙 활용`도 `동의어` 묶음과 concept graph를 함께 제공한다.
- implication:
  - grammar / concept relation surface의 graph presentation 참고 모델로 유용하다.
  - MM3 lexical SSOT 대신 optional knowledge-graph layer 참고원으로 적합하다.

#### 5. 모두의 말뭉치

- 국립국어원은 `원시 말뭉치, 분석 말뭉치, 병렬 말뭉치`를 주기적으로 공개한다.
- official 소개는 말뭉치가 `사전 편찬`, `언어교육`, `언어 연구`, `AI`에 쓰이며 자연스러운 용례와 실제 사용 빈도를 잡는 데 유용하다고 설명한다.
- implication:
  - MM3에서 `Tier 2` corpus-backed example / collocation / speech-act note를 붙일 근거원으로 적합하다.
  - 하지만 current source-faithful lexical jump truth를 대체해서는 안 된다.

### B. Research Basis From Learner-Dictionary Studies

#### 1. 학습용 유의어 사전 기술

- 봉미경(2011)은 학습용 유의어 사전이 `lexical`, `stylistic`, `collocational`, `grammatical` variation을 구분해서 기술해야 한다고 본다.
- implication:
  - `의미 관계`는 단순 유의어 나열보다
    - 개념 차이
    - 문체/격식
    - 결합 제약
    - 문형/통사 차이
    를 비교 메모로 보여 주는 쪽이 learner value가 높다.

#### 2. 학습자 사전의 용례 기술

- 원미진(2011)은 learner dictionary example이 `semantic`, `morpho-syntactic`, `pragmatic` 기능을 모두 가져야 하고,
- `구`, `문장`, `대화` 예문 3종을 갖추는 것이 효과적이라고 본다.
- implication:
  - MM3 `활용 표현`은 preview-only 카드보다 phrase/sentence/dialogue stack이 더 맞다.
  - productive use를 지원하려면 활용/결합/공손도 정보가 같이 필요하다.

#### 3. 관용 표현 사전 미시 구조

- 도원영·왕보하(2009)는 learner-oriented idiom dictionary가 `발음`, `정의`, `예문`, `문형`, `화용 정보`, `참조 정보`를 함께 가져야 한다고 본다.
- implication:
  - MM3 `활용 표현`에서 관용구/속담/표현을 강화할 때도
    - definition only
    - jump only
    가 아니라 pattern + pragmatic note + cross-reference를 같이 보여 줘야 한다.

#### 4. 표현 문형과 숙달도

- 이유미(2019)는 제안/명령/요청/사과/거절/바람 표현에서 숙달도에 따라 expression pattern 사용 양상이 달라지고, 특히 고급 집단에서 공손 전략 사용이 증가한다고 본다.
- implication:
  - `활용 표현`은 lexical list가 아니라 speech-act / politeness-aware scaffold로 확장될 여지가 있다.

## Improved Application Plan

### 1. Surface Contract Recommendation

#### `의미 관계`

- keep:
  - `연관 어휘`
  - `의미 관계어`
  - `관련형`
  - `교차 연결`
- change:
  - `의미 관계어`는 `비슷한말/반대말/참고어/상하위/가까운 비교어` 같은 relation kind를 명시한다.
  - `관련형`은 파생/활용 기반 family와 source-explicit related form을 유지하되, unresolved는 계속 `text-only`다.
  - relation card에는 provenance를 붙인다:
    - `official`
    - `open dictionary`
    - `corpus-supported`
- new value:
  - learner가 `왜 비슷하지만 다르게 쓰는지`를 바로 비교할 수 있게 한다.

#### `활용 표현`

- split internal modules:
  - `활용 정보`
    - conjugation / irregularity
    - sentence pattern
    - grammatical frame
  - `표현 정보`
    - subword
    - idiom
    - proverb
    - phrase / dialogue pattern
- example stack:
  - `구`
  - `문장`
  - `대화`
- support note:
  - politeness
  - register
  - speech act
  - jumpable / preview-only
- new value:
  - current tab을 productive speaking/writing helper로 올릴 수 있다.

### 2. Source Tier Policy

- `Tier 1 official explicit`
  - 한국어기초사전
  - 표준국어대사전
  - source-explicit MM3 SSOT fields
- `Tier 1.5 open official ecosystem`
  - 우리말샘
  - 온용어
  - usable with explicit provenance badge
- `Tier 2 corpus-supported`
  - 모두의 말뭉치 기반 example/collocation/pattern reinforcement
- `Tier 3 inferred`
  - heuristic or model-generated suggestion
  - default off
  - PM/experimental lane only

### 3. Recommended Future Tranche Order

#### Phase 0. Schema / Provenance Contract

- define canonical relation kinds
- define `활용` vs `표현` field split
- add provenance and jumpability metadata
- validation gate:
  - unresolved source relation is never clickable
  - each displayed relation/expression has source tier

#### Phase 1. Relation Compare MVP

- source-backed synonym/antonym/reference compare cards
- lexical/stylistic/collocational/grammatical difference notes
- entry criterion:
  - source-explicit relation exists
  - at least one differentiator note exists

#### Phase 2. Expression Coach MVP

- phrase/sentence/dialogue example stack
- sentence pattern + politeness/register note
- jumpable vs preview-only clarity
- entry criterion:
  - expression item has example or pattern support

#### Phase 3. Corpus-Assisted Enrichment

- corpus-backed collocation suggestions
- speech-act clustering
- ranking by frequency / naturalness
- non-authoritative label 유지

### 4. What To Keep Closed

- source-ambiguous `related_forms` heuristic jump reopen 금지
- `활용 표현`을 immediate top-level taxonomy로 승격하지 않음
- official source와 open/community source를 한 layer로 섞지 않음
- corpus frequency를 lexical truth처럼 노출하지 않음

## Validation

### Source-Backed Claim Check

- official-source claims:
  - `한국어기초사전` help + Open API
  - `표준국어대사전` help
  - `우리말샘` sampled entry and lexical map
  - `온용어` sampled term page and graph export
  - `모두의 말뭉치` official introduction
- research claims:
  - 봉미경(2011)
  - 원미진(2011)
  - 도원영·왕보하(2009)
  - 이유미(2019)

### Local Product Fit Check

- current MM3 contract already separates `의미 관계` and `활용 표현`.
- prior packets confirm:
  - `has_subwords` term `1,161`
  - base `related_forms` `18,771`
  - unresolved `related_forms` `4,303`
  - unresolved `source_ambiguous` `4,302`
- therefore:
  - coverage is real enough to justify product investment
  - but clickability cannot be expanded indiscriminately

### Instruction Coverage Check

- 기획: `DONE`
- 3인의 전문가 review: `DONE`
- deep research rerun + improvement: `DONE`
- validation: `DONE`

## Research Basis

- Official:
  - [한국어기초사전 도움말](https://krdict.korean.go.kr/m/kor/help)
  - [한국어기초사전 Open API 안내](https://krdict.korean.go.kr/eng/openApi/openApiInfo)
  - [표준국어대사전 도움말](https://stdict.korean.go.kr/help/helpList.do)
  - [우리말샘 sample entry](https://opendict.korean.go.kr/dictionary/view?sense_no=533953)
  - [온용어 sample term](https://kli.korean.go.kr/term/trgtWord/indexTrgtWord.do?trgtWordNo=2000033)
  - [모두의 말뭉치 소개](https://kli.korean.go.kr/corpus/introduce/introduceList.do)
- Research:
  - [봉미경(2011) 학습용 유의어 사전 기술을 위한 기초 연구](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001597593)
  - [원미진(2011) 한국어 학습자 사전의 용례 기술 방법에 대한 연구](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001597595)
  - [도원영·왕보하(2009) 『한중관용구사전』편찬을 위한 연구](https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART001417370)
  - [이유미(2019) 한국어 학습자의 숙달도에 따른 표현 문형 사용 양상 연구](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002514990)

## Exit Condition

- official source + research basis + local product baseline이 한 packet 안에서 정렬된다.
- `의미 관계` / `활용 표현`별 application opportunity가 우선순위와 non-goal까지 포함해 제시된다.
- 3인의 전문가 review와 rerun/improvement 흔적이 packet 안에 남는다.
- final recommendation이 current MM3 source-faithful policy와 충돌하지 않는다고 검증된다.

## Non-Goals

- current runtime/code implementation reopen
- `related_forms` heuristic target generation
- `활용 표현`을 immediate top-level taxonomy로 승격
- 현재 closeout된 `MM3-269`~`MM3-280` reopen

## PM Verdict

- `ACCEPT`
- `READY_FOR_FUTURE_TRANCHE`

## Revision History

- `R1` / `2026-03-29 03:25 KST` / `Codex PM` / relation/expression deep research and application planning package opening
- `R2` / `2026-03-29 03:36 KST` / `Codex PM` / 3인의 전문가 review, research rerun, validation을 반영해 final application plan으로 승격
