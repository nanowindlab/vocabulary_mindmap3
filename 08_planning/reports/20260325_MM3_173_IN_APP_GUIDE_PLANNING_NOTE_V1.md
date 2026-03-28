# 20260325_MM3_173_IN_APP_GUIDE_PLANNING_NOTE_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-25 00:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `W4 Enablement Closeout`
- `MM3-173A` terminology / in-app guide planning note

## Objective

- `W1`과 `W3`에서 확정된 wording / hierarchy / learner flow를 기반으로, 정식 배포용 screenshot 포함 인앱가이드의 planning note를 만든다.
- 아직 바뀔 수 있는 UI를 guide source-of-truth로 성급히 승격하지 않도록, guide는 `plan` 단계로 제한한다.

## Inputs

- `08_planning/reports/20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TERMINOLOGY_BASELINE_DRAFT_V1.md`
- `08_planning/reports/20260325_MM3_168_DETAIL_HEADER_CLOSE_COPY_DENSITY_CONTRACT_V1.md`
- `08_planning/reports/20260325_MM3_169_RELATION_EXPRESSION_DISCOVERABILITY_CONTRACT_V1.md`
- `08_planning/reports/20260325_MM3_169_RELATION_EXPRESSION_DISCOVERABILITY_ACCEPTANCE_V1.md`
- `08_planning/reports/20260324_MM3_167_ADDITIONAL_HUMAN_TEST_FEEDBACK_COVERAGE_CHECK_V1.md`

## Guide Planning Pipeline

### Workflow 1. Audience Fix

1. guide audience를 `초급 사용자`로 고정한다.
2. 학습자 질문 기준으로 section order를 짠다.

### Workflow 2. Surface Selection

1. screenshot이 필요한 surface를 고른다.
2. 아직 contract만 있고 구현이 안 된 화면은 guide source에서 제외한다.

### Workflow 3. Section Order

1. app 진입과 탐색 흐름
2. detail `핵심 / 관계 / 표현 / 예문`
3. translation language 사용법
4. `주제 및 상황` / `분류 밖 항목` 해석
5. expression preview vs jump path

### Workflow 4. Screenshot Checklist

1. 핵심 screen과 캡처 포인트를 정의한다.
2. stale screenshot risk가 있는 항목은 `pending capture`로 둔다.

## Draft Section Set

- `어떻게 탐색하나`
- `상세에서 무엇을 보나`
- `관계와 표현은 언제 보나`
- `번역 언어는 어떻게 바꾸나`
- `주제 및 상황`과 `분류 밖 항목`은 무엇인가

## Screenshot Candidate List

- main explorer 첫 진입
- search result -> detail 진입
- detail `핵심`
- detail `관계`
- detail `표현`
- detail `예문`
- translation language selector
- `주제 및 상황 > 상황 미지정 > 일반 어휘`
- `분류 밖 항목`

## Guardrails

- `MM3-172` terminology baseline을 벗어난 표현을 쓰지 않는다.
- `MM3-168`, `MM3-169` contract가 구현되기 전에는 확정 screenshot으로 취급하지 않는다.
- guide는 현재 시점에서 `planning note`로만 유지한다.
- 구현되지 않은 residual backlog를 final user guide 섹션으로 직접 서술하지 않는다.

## Next Step

- `MM3-173D` review checkpoint `R4`

## PM Verdict

- `IN_PROGRESS`

## Revision History

- `R1` / `2026-03-25 00:10 KST` / `Codex PM` / W4 guide planning note를 최초 작성
- `R2` / `2026-03-25 00:10 KST` / `Codex PM` / review finding에 따라 stale next step, 예문 capture, guide scope guardrail을 보강
