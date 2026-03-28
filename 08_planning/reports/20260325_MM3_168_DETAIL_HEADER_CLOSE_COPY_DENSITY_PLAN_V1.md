# 20260325_MM3_168_DETAIL_HEADER_CLOSE_COPY_DENSITY_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 00:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-168A` detail header / close / copy density follow-up

## Objective

- 추가 feedback의 detail residual 중 `닫기 버튼`, `표제어/발음 header`, `핵심 장문 helper density`를 하나의 surface contract로 다시 묶는다.
- `W1` terminology baseline과 `W2` translation/performance constraint를 입력으로 받아, 이후 `MM3-169` relation/expression surface와 충돌하지 않는 detail 상단 contract를 준비한다.

## Inputs

- `08_planning/reports/20260324_MM3_167_ADDITIONAL_HUMAN_TEST_FEEDBACK_COVERAGE_CHECK_V1.md`
- `08_planning/reports/20260324_MM3_174_RESIDUAL_FEEDBACK_PIPELINE_PLAN_V1.md`
- `08_planning/reports/20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TERMINOLOGY_BASELINE_DRAFT_V1.md`
- `08_planning/reports/20260325_MM3_170_TRANSLATION_SURFACE_COMPLETENESS_REAUDIT_NOTE_V1.md`
- screenshot:
  - `/Users/nanowind/Desktop/스크린샷 2026-03-24 오후 9.36.15.png`

## Current Residuals

- `닫기`
  - close 이후 sync bug는 이미 닫혔지만, 버튼 자체 affordance는 별도 검토가 남아 있다.
- `header`
  - 표제어 / 발음 / 스피커 아이콘 / band chip이 상단에서 공간을 어떻게 나눌지 다시 봐야 한다.
- `핵심 helper`
  - `표현 활용 워크플로우`처럼 길이가 긴 지시문이 상단 밀도를 높인다.
- `번역`
  - 중복 surface는 줄었지만, 상단 hierarchy 안에서 번역/설명/copy 밀도는 계속 같이 봐야 한다.

## Workflow

### Workflow 1. Header Contract

1. 표제어 / 발음 / band chip / close 버튼의 상단 배치를 다시 정리한다.
2. 발음을 표제어 오른쪽에 붙이는 안과 helper/meta 영역으로 분리하는 안을 비교한다.
3. 스피커 아이콘 제거 여부를 interaction 손실 없이 판단한다.

### Workflow 2. Close Affordance Contract

1. `X 닫기`의 위치와 시인성을 본다.
2. close affordance가 header hierarchy를 방해하는지 본다.
3. close 이후 동작 설명은 제거하고 affordance 자체만 개선할지 판단한다.

### Workflow 3. Core Copy Density Contract

1. `핵심` 탭 상단 helper를 `상시 노출`, `접기`, `더보기`, `경량 카피` 중 어떤 패턴이 맞는지 본다.
2. translation card / helper / meaning selector가 같은 fold 위에 과밀하게 놓이지 않도록 원칙을 적는다.
3. downstream `MM3-169` relation/expression discoverability helper와 중복되지 않게 역할을 나눈다.

## Deliverables

- header layout option set
- close affordance option set
- core helper density rule
- detail top-of-fold contract for `MM3-169`

## Constraints

- selected language rule은 `MM3-170` audit 결과를 깨지 않는다.
- performance상 top-of-fold에 새 무거운 fetch를 추가하지 않는다.
- expression/relation helper를 `핵심` 상단에서 다시 과도하게 중복 노출하지 않는다.

## Exit Criteria

- header / close / helper density를 하나의 contract로 읽을 수 있다.
- `MM3-169`가 relation/expression discoverability를 설계할 때 detail 상단과 충돌하지 않는다.
- `W2`에서 나온 translation/performance constraint를 위반하지 않는다.

## Next Step

- `MM3-169A` relation / expression surface discoverability follow-up

## Revision History

- `R1` / `2026-03-25 00:10 KST` / `Codex PM` / W3 시작점으로 detail header / close / copy density follow-up plan을 최초 작성
