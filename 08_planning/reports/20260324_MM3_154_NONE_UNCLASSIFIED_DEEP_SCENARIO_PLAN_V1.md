# 20260324_MM3_154_NONE_UNCLASSIFIED_DEEP_SCENARIO_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 16:35 KST`

## Last Updated By

- `Codex PM`

## 목적

- raw feedback `F-030`, `F-031`에 대해 `주제 및 상황 > 없음`과 `미분류`를 learner-facing deep scenario 기준으로 다시 정의한다.

## Inputs

- `08_planning/pilot_feedback/human pilot test.md`
- `08_planning/reports/20260324_MM3_138_PILOT_FEEDBACK_COVERAGE_AUDIT_V1.md`
- `08_planning/reports/20260324_MM3_153_NONE_UNCLASSIFIED_DEEP_SCENARIO_DECISION_V1.md`
- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- `09_app/public/data/live/APP_READY_SITUATION_TREE.json`
- `09_app/public/data/live/APP_READY_UNCLASSIFIED_TREE.json`
- `09_app/src/App.jsx`
- `09_app/src/components/TermDetail.jsx`

## Evidence Summary

- raw feedback는 두 신호를 분리해서 지적했다.
  - `F-030`: `주제 및 상황 범주 > 없음 > 없음` 구조 자체가 혼란스럽다.
  - `F-031`: `미분류` 진입 시 기준이 갑자기 `학습난이도/품사`로 바뀌어 보이며 별도 시나리오가 필요하다.
- runtime 기준 `주제 및 상황 > 없음 > 없음` exact path는 `4,956건`이다.
- same cohort `4,956건` 중 다수는 이미 `의미 범주`를 갖고 있다.
  - 상위 의미 범주 예시:
    - `개념 > 성질` `295`
    - `개념 > 정도` `271`
    - `개념 > 모양` `245`
    - `인간 > 인지 행위` `236`
    - `사회 생활 > 사회 활동` `216`
- `주제 및 상황 > 없음`은 특정 scene이 비어 있어도 일반 의미 학습은 가능한 어휘군이다.
  - 대표 사례: `가다`, `보다`, `당당하다`, `연구원`
- `미분류`는 runtime 기준 `8,506건`이다.
- `미분류`는 하나의 성격이 아니다.
  - 문법/기능형 POS(`어미`, `조사`, `접사`, `보조 동사`, `보조 형용사`): `1,080건` (`12.7%`)
  - 기타 content-like 항목(`명사`, `동사`, `품사 없음` 등): `7,426건` (`87.3%`)
- `미분류` 대표 사례:
  - 문법/기능형: `버리다`(보조 동사), `가다`(보조 동사), `-리`(어미), `같이`(조사)
  - 기타 content-like: `시디롬`, `과실 치사`, `대응하다`, `아스팔트`

## PM Interpretation

- `주제 및 상황 > 없음`은 `분류 실패`가 아니라 `특정 장면에 고정되지 않는 일반 어휘`로 보는 편이 learner 해석에 맞다.
- `미분류`는 `상황 미지정`과 같은 문제가 아니라 `main taxonomy 바깥 fallback 영역`이다.
- 따라서 `F-030`과 `F-031`은 같은 문구로 완화하면 안 되고, 서로 다른 학습 시나리오로 설명해야 한다.

## Learner-Facing Deep Scenario

### S1. `주제 및 상황 > 없음`

- learner 질문:
  - `이 단어는 왜 상황 탭에 있는데 특정 장면이 없지?`
- learner-facing 해석:
  - `이 단어는 특정 장면 하나에 묶이기보다 여러 상황에서 넓게 쓰이는 일반 어휘다.`
- 학습 동선:
  - situation tree에서 scene drill-down보다
  - 의미, 관계, 예문 중심으로 해석한다.
- minimal UI mapping 원칙:
  - `없음 > 없음` 중복 표시는 제거한다.
  - scene layer는 `상황 미지정`
  - category layer는 `일반 어휘`
  - detail helper는 `특정 장면보다 일반 의미로 익히는 편이 적절한 어휘`로 설명한다.

### S2. `미분류`

- learner 질문:
  - `왜 갑자기 의미/상황이 아니라 난이도/품사로 보이지?`
- learner-facing 해석:
  - `이 영역은 의미/상황 taxonomy에 안정적으로 실리지 않은 항목을 임시로 모아 둔 fallback 진입이다.`
- 학습 동선:
  - main scene 탐색용 3축이 아니라
  - 검색 후 보조 확인, 문법형 확인, 기타 미기재 어휘 확인용 진입으로 설명한다.
- 하위 시나리오는 최소 두 개로 나눈다.
  - 문법/기능형 항목:
    - `보조 동사`, `보조 형용사`, `조사`, `어미`, `접사`
    - learner에게는 `문법/형태 항목`으로 설명한다.
  - 기타 content-like 항목:
    - `명사`, `동사`, `품사 없음`, 복합 명사형 어휘
    - learner에게는 `분류 미기재 어휘`로 설명한다.
- minimal UI mapping 원칙:
  - root helper는 `분류 밖 항목` 의미를 먼저 드러낸다.
  - 현재 `학습난이도 -> 품사` 정렬은 유지하되, `왜 이렇게 보이는지`를 먼저 설명한다.
  - detail helper는 POS에 따라 동적으로 갈라진다.
    - 문법/기능형: `문법/형태 항목`
    - 기타: `분류 미기재 어휘`

## Do Not

- `주제 및 상황 > 없음`과 `미분류`를 같은 `없음` 문제로 취급하지 않는다.
- `미분류`를 `의미 범주`나 `주제 및 상황`과 동등한 제3 taxonomy처럼 설명하지 않는다.
- 이번 tranche에서 payload re-bucketing까지 바로 밀어 넣지 않는다.
- 문법/기능형 항목을 억지로 scene taxonomy에 배치하지 않는다.

## MM3-154 Acceptance Criteria

- `F-030`, `F-031`이 서로 다른 learner 질문이라는 점이 문서상 명확하다.
- runtime evidence가 `없음`과 `미분류`의 차이를 뒷받침한다.
- 다음 UI tranche가 payload 재생성 없이 path/copy/helper 수정으로 연결 가능하다.
- control plane이 `MM3-154` active work를 같은 상태로 가리킨다.

## Next Slice Recommendation

- follow-up candidate:
  - `MM3-156 None / Unclassified Minimal UI Mapping`
- focus:
  - `없음 > 없음` 제거
  - `상황 미지정 > 일반 어휘` learner-facing path 고정
  - `미분류` helper를 `문법/형태 항목` vs `분류 미기재 어휘`로 분기

## Revision History

- `R1` / `2026-03-24 16:35 KST` / `Codex PM` / none/unclassified deep scenario를 evidence 기반 learner-facing plan으로 최초 정리
