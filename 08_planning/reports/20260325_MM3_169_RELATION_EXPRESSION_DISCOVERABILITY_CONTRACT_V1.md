# 20260325_MM3_169_RELATION_EXPRESSION_DISCOVERABILITY_CONTRACT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 00:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-169A` relation / expression surface discoverability contract

## Inputs

- `08_planning/reports/20260325_MM3_169_RELATION_EXPRESSION_DISCOVERABILITY_PLAN_V1.md`
- `08_planning/reports/20260325_MM3_168_DETAIL_HEADER_CLOSE_COPY_DENSITY_CONTRACT_V1.md`
- `08_planning/reports/20260325_MM3_170_TRANSLATION_SURFACE_COMPLETENESS_REAUDIT_NOTE_V1.md`
- `08_planning/reports/20260325_MM3_171_RUNTIME_PERFORMANCE_PAYLOAD_SPLIT_AUDIT_NOTE_V1.md`
- `08_planning/reports/20260324_MM3_157_EXPRESSION_SCENARIO_FOLLOWUP_PLAN_V1.md`
- `08_planning/reports/20260324_MM3_158_EXPRESSION_SCENARIO_WORKFLOW_ACCEPTANCE_V1.md`
- code:
  - `09_app/src/components/TermDetail.jsx`

## Current Evidence

### A. `관계` 탭은 기능은 있으나 시각 언어가 다른 탭보다 약하다.

- current relation surface:
  - `연관 어휘`, `의미 관계어`, `관련형`, `교차 연결 장면`, `다른 뜻 보기`
- 현재는 대부분 `chip` 계열 렌더다.
- repeated relation helper는 있으나, card-level hierarchy 없이 같은 무게의 chip이 반복되어 보인다.

### B. `표현` 탭은 이미 branch 분리는 되어 있다.

- current expression surface:
  - `바로 탐색 가능한 표현`
  - `부모 어휘 맥락에서 보는 표현`
- 이 branch 구조 자체는 유지 가치가 높다.
- residual은 branch보다 `카드 copy`와 `앞단 discoverability` 쪽에 가깝다.

### C. expression card residual은 세 층으로 나뉜다.

1. state label
  - `상세 연결 없음`
2. count label
  - `의미 2개`
3. example label
  - `예:`

### D. translation residual은 expression card 한정으로 남아 있다.

- main search/detail은 selected language를 반영한다.
- subword card는 여전히 `firstSense.translations[0]`을 그대로 쓴다.
- 따라서 discoverability contract는 copy만이 아니라 translation residual scope도 포함해야 한다.

### E. `MM3-168` top-of-fold contract가 이미 존재한다.

- `핵심` 상단에는 compact expression teaser만 허용된다.
- relation / expression discoverability를 이유로 다시 긴 workflow block을 상단에 추가하면 안 된다.

## Decision Surface

### Workflow 1. Tab-Level Discoverability

#### Option A

- 현재처럼 탭 label + count만 유지

#### Option B

- 탭 label은 유지
- `표현`, `관계` 탭에 각각 짧은 entry cue를 둔다

#### Recommendation

- `Option B`

#### Contract

- `핵심` 상단에는 compact teaser만 유지
- tab entry cue는 탭 자체 또는 탭 직전 microcopy에서 해결
- `표현`
  - `활용 표현 보기`
- `관계`
  - `비교/연결 보기`

### Workflow 2. Relation Surface Contract

#### Recommendation

- 현재 chip-only surface를 `sectioned card + chip hybrid`로 재구성

#### Contract

- `의미 관계어`
  - 가장 강한 relation section
  - disambiguation metadata 유지
  - repeated relation helper 유지
- `관련형`
  - `의미 관계어`보다 한 단계 낮은 시각 위계
- `교차 연결 장면`
  - 연결이 있을 때만 노출
  - primary relation surface로 승격하지 않음
- visual rule:
  - section heading + short helper + chip list
  - chip은 그대로 쓰되, 각 섹션이 card-like container 안에서 분리되어 보이게 한다

#### Why

- 현재 문제는 clickability 부족보다 `모두 같은 시각 언어로 보여 relation hierarchy가 안 읽히는 것`에 가깝다.
- full card list로 바꾸면 과해지고, current chip-only는 약하다.

### Workflow 3. Expression Card Copy Contract

#### Recommendation

- `상세 연결 없음`
  - 유지하되, shorter supporting copy로 의미를 보강
- `의미 2개`
  - `연결 의미 2개`
- `예:`
  - `예문`

#### Contract

- jumpable card:
  - state chip: `독립 항목 연결`
- preview-only card:
  - state chip: `상세 연결 없음`
  - supporting copy에서
    - `현재 표제어 맥락에서 미리 보는 표현`
- count chip:
  - `연결 의미 N개`
- example label:
  - `예문`

#### Why

- `상세 연결 없음`을 완전히 없애면 preview-only branch 의미가 다시 흐려진다.
- 대신 label alone으로 끝내지 말고 supporting copy로 learner meaning을 보강하는 편이 맞다.

### Workflow 4. Expression Translation Residual Scope

#### Recommendation

- expression/subword card도 selected language rule을 main detail과 맞춘다.

#### Contract

- translation pick:
  - preferred language
  - 없으면 영어
  - 다시 없으면 첫 항목
- scope:
  - expression/subword card에 한정
  - source `11` 언어 전체 확장은 이번 단계 scope가 아님
  - current runtime `6`개 정책 안에서 맞춘다
- test:
  - expression/subword selected language regression 추가 필요

#### Why

- 현재 가장 직접적인 learner pain은 `표현 카드에서는 여전히 몽골어만 보임`이다.
- 이것은 discoverability 문제와 번역 residual이 겹친 지점이므로 같은 contract에서 scope를 잡는 편이 맞다.

## Contract Summary

### Top-Of-Fold Rule

- `핵심` 상단은 `MM3-168` contract 유지
- relation/expression discoverability는 tab cue와 tab 내부 contract에서 해결

### Relation Rule

- `의미 관계어 > 관련형 > 교차 연결` 위계 유지
- current chip UI를 sectioned card + chip hybrid로 강화
- repeated relation helper 유지

### Expression Rule

- branch 유지:
  - `바로 탐색 가능한 표현`
  - `부모 어휘 맥락에서 보는 표현`
- copy 보정:
  - `상세 연결 없음` 유지 + supporting copy 보강
  - `의미 N개` -> `연결 의미 N개`
  - `예:` -> `예문`

### Translation Rule

- expression card도 main detail과 같은 selected language fallback chain을 따른다.
- runtime `6개` 언어 정책 밖으로는 확장하지 않는다.

## Downstream Implementation Checklist

- tab cue copy를 어디에 둘지 결정
- relation section container hierarchy 반영
- expression card state/count/example copy 반영
- expression/subword translation pick logic 수정
- expression/subword regression test 추가

## Exit Criteria

- relation/ expression discoverability가 각각 다른 방식으로 정리된다.
- `MM3-168` 상단 contract를 침범하지 않는다.
- `MM3-170` translation reality와 모순되지 않는다.
- `MM3-171` performance constraint를 위반하지 않는다.

## PM Verdict

- `draft acceptable`
- final accept는 review checkpoint 이후로 둔다.

## Next Step

- review checkpoint for `MM3-169A`

## Revision History

- `R1` / `2026-03-25 00:10 KST` / `Codex PM` / relation tab hierarchy, expression card copy, translation residual scope를 하나의 discoverability contract로 최초 고정
