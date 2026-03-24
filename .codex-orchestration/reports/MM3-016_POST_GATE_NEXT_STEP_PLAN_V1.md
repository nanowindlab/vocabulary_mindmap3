# MM3-016_POST_GATE_NEXT_STEP_PLAN_V1

## Revision Meta

- Current Revision: `R1`
- Last Updated: `2026-03-23`
- Last Updated By: `POST_GATE_AGENT`

## 1. 목적

- 본 문서는 `PARTIAL_OPEN` 상태에서 무엇을 먼저, 어떤 범위까지, 어떤 순서로 열지 정리한다.
- 기준 근거는 `MM3-015_IMPLEMENTATION_GATE_RECHECK_V1`, `MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1`, `MM3-014_RUNTIME_UI_REFINEMENT_NOTE_V1`, `MM3-009_IA_PACKAGE_V1`, `MM3-010_RUNTIME_CONTRACT_PACKAGE_V1`이다.
- 구현 지시서가 아니라, PM가 어떤 검증부터 승인할지 빠르게 판단할 수 있게 하는 실행 순서 문서다.

## 2. 결론

- 현재 gate는 `OPEN`이 아니라 `PARTIAL_OPEN`으로 유지한다.
- 먼저 열어야 하는 것은 기능 범위가 아니라 `검증 범위`다.
- 열 수 있는 범위는 `thin projection / rich detail` 경계와 `required field` 정합성 확인에 한정한다.
- 열면 안 되는 범위는 count 보정, taxonomy 재설계, 화면 확장, learner flow 재구성이다.

## 3. 다음 구현/검증 우선순위

1. `count 정합성`을 먼저 닫는다.
2. `required field`를 화면별로 닫는다.
3. `runtime reflection`으로 IA와 contract 반영 여부를 닫는다.
4. `learner flow`와 `dual category` 가시성을 분리 검토한다.
5. 위 4개가 닫힌 뒤에만 제한적 개방 여부를 다시 판단한다.

### 우선순위 판단 이유

- count가 틀리면 나머지 검증은 신뢰를 잃는다.
- required field가 흔들리면 thin projection과 rich detail의 분리 자체가 무너진다.
- runtime reflection이 닫히지 않으면 IA가 실제 artifact에 번역됐는지 증명할 수 없다.
- learner flow는 구조 합격 뒤에 보는 보류 조건이 아니라, 구조가 실제로 초급 사용자에게 과부하를 주는지 확인하는 마지막 관문이다.

## 4. 제한적으로 열 수 있는 범위

- 기존 합의된 계약 안에서만 `thin projection`, `rich detail`, `facet payload`의 경계를 점검한다.
- 홈과 결과는 얇은 노출만 허용하고, 상세와 표현층만 rich detail 허용 여부를 본다.
- `entry`, `sense`, `subword`, `translation`, `filters`의 역할이 화면별로 어떻게 남는지 확인하는 수준까지만 연다.
- `navigation_origin`, filter provenance, `dual category` 가시성은 구조 변경이 아니라 후속 검증 항목으로만 다룬다.
- 문서상 정합성 확인과 증거 대조까지만 허용하고, 설계 범위를 새로 넓히지는 않는다.

## 5. 먼저 하면 안 되는 범위

- count 불일치가 확인된 상태에서 기능 확장을 먼저 시작하는 것.
- `word-first + dual category + sense core`를 흔드는 재설계.
- filter를 taxonomy처럼 다시 묶는 방향의 해석 변경.
- 표현층을 본체 taxonomy의 일부처럼 끌어올리는 변경.
- 홈/결과에 rich detail을 앞당겨 넣는 방향의 확장.
- learner flow를 바꾸기 전에 화면 구조 자체를 다시 재편하는 것.

## 6. 최소 검증 순서

| 순서 | 검증 항목 | 통과 기준 | 실패 시 조치 |
|---|---|---|---|
| 1 | canonical count 대 runtime count | `53,480`과 일치하고 `53,439` stale summary가 재노출되지 않음 | 즉시 중단, 확장 보류 |
| 2 | required field | 홈/결과/상세/표현층/필터 바별 필수 필드가 문서 계약과 일치 | 해당 화면 검증만 재실행 |
| 3 | runtime reflection | thin index / detail payload / expression payload / facet payload 구분이 artifact에서 보임 | IA 반영 불충분으로 판정 |
| 4 | learner flow | 초급 사용자 기준 첫 진입 부담이 높아지지 않음 | 구조 유지 여부 재검토 |
| 5 | 3인 비판 검토 재확인 | learner/source/PM 관점 반대 의견이 residual risk로 국소화됨 | PM accept 보류 |

### 최소 검증 원칙

- 하나의 실패가 있으면 다음 단계로 넘어가지 않는다.
- 설명이 맞는지보다 실제 artifact가 맞는지를 먼저 본다.
- 동일 항목을 여러 화면에서 중복 확인하더라도, 판단 기준은 같아야 한다.

## 7. PM용 실행 제안

- 먼저 `count`와 `required field`를 묶은 짧은 검증 묶음을 승인한다.
- 그 다음에만 `runtime reflection` 검증을 열어 `IA -> contract -> artifact` 일치 여부를 본다.
- `learner flow`는 마지막에 별도 승인한다. 이 단계에서는 구조 바꾸기보다 부담 증가 여부만 본다.
- `navigation_origin`, filter provenance, `dual category`는 지금은 설계 논의가 아니라 residual risk 메모로만 유지한다.
- PM 결론은 `open/close` 이분법이 아니라, 어떤 검증이 아직 닫히지 않았는지를 기준으로 내려야 한다.

## 8. PM 판단 가이드

- `count`가 실패하면: 개방 보류.
- `required field`가 실패하면: 화면별 계약 보류.
- `runtime reflection`이 실패하면: IA 반영 보류.
- `learner flow`가 실패하면: 구조적 accept 보류.
- 위 항목이 모두 통과하면: 제한적 개방 범위를 다시 정의할 수 있다.

## 9. Reflection

- `PARTIAL_OPEN`의 핵심은 기능을 서둘러 여는 것이 아니라, 열어도 되는 만큼만 여는 데 있다.
- 지금 단계에서 중요한 것은 구현 범위를 늘리는 것이 아니라, 이미 합의된 IA와 runtime contract가 실제 artifact에서 닫히는지 확인하는 것이다.
- count, required field, runtime reflection, learner flow를 분리하지 않으면 구조 합격과 운영 합격이 섞인다.
- 따라서 다음 단계는 확장이 아니라 증거 축적이며, PM 판단도 그 순서를 따라야 한다.
