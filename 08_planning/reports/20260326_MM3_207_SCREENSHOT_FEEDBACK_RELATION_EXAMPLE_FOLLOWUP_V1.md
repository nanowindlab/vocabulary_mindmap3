# 20260326_MM3_207_SCREENSHOT_FEEDBACK_RELATION_EXAMPLE_FOLLOWUP_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 01:28 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-207A` screenshot feedback coverage check
- `MM3-207B` screenshot archive sync
- `MM3-208A` relation tab renderer parity / grouped related-form follow-up
- `MM3-209A` example source right-edge alignment follow-up

## Inputs

- `08_planning/pilot_feedback/human pilot test_4차 피드백.md`
- `08_planning/pilot_feedback/20260326_pilot_session_04.md`
- screenshot archive:
  - `08_planning/pilot_feedback/screenshots/20260326_pilot_session_04_screen_01.png`
  - `08_planning/pilot_feedback/screenshots/20260326_pilot_session_04_screen_02.png`
  - `08_planning/pilot_feedback/screenshots/20260326_pilot_session_04_screen_03.png`
  - `08_planning/pilot_feedback/screenshots/20260326_pilot_session_04_screen_04.png`
  - `08_planning/pilot_feedback/screenshots/20260326_pilot_session_04_screen_05.png`
- code:
  - `09_app/src/components/TermDetail.jsx`
  - `09_app/tests/residual.spec.js`
  - `09_app/tests/smoke.spec.js`

## Problem Reframing

### 1. `보다 -> 보이다`는 learner-facing duplicate impression 문제다.

- raw payload는 `보이다` 두 sense를 분리해 가지고 있다.
- 하지만 UI에서는 같은 headword / same type tag로 반복 노출돼 user에게는 duplicate처럼 읽힌다.

### 2. relation tab은 relation type별 renderer가 섞여 있었다.

- `의미 관계어`
  - chip renderer
- `관련형`
  - card renderer

- same tab 안에서 relation type마다 다른 visual grammar를 쓰고 있었다.

### 3. 예문 source badge는 trailing metadata지만 정렬은 더 정돈될 수 있다.

- 예문 뒤 inline badge는 방향은 맞지만,
- current placement는 문장 끝에 고정되지 않아 시각적으로 어정쩡해 보일 수 있다.

## Implemented

### 1. screenshot archive sync

- 이번 round의 5개 screenshot을 project-local evidence path로 복사했다.
- Desktop absolute path 의존 없이 `pilot_feedback/screenshots/` 아래에서 참조 가능하다.

### 2. relation tab renderer parity

- `의미 관계어`도 chip이 아니라 card renderer로 통일했다.
- type label(`유의어`, `참고어`, `준말`)은 card 우측 상단 tag로 올렸다.
- `먹다` screenshot처럼 old chip grammar가 남아 있던 경로를 정리했다.

### 3. grouped related-form card

- `관련형`은 same surface + same type 조합을 word-level card로 묶는다.
- `보다 -> 보이다`처럼 same headword가 두 sense로 갈라질 때는 card 1개 안에 definition row를 여러 개 두는 방식으로 바꿨다.
- 즉 learner-facing에서는 `보이다`가 카드 1개로 보이고, sense distinction은 내부 row에서 읽힌다.

### 4. example source badge right-edge alignment

- example sentence와 source badge를 flex-wrap row로 바꿨다.
- 공간이 충분하면 source badge는 같은 행 오른쪽 끝으로 간다.
- 공간이 부족하면 다음 줄로 넘어가되 오른쪽 끝 정렬을 유지한다.
- source label의 trailing metadata 원칙은 유지했다.

## Verification

- command:
  - `npx playwright test`
- result:
  - `37 passed`

## PM Verdict

- `IMPLEMENTED`

## Task Closeout

- `MM3-207A`: `DONE`
- `MM3-207B`: `DONE`
- `MM3-208A`: `DONE`
- `MM3-209A`: `DONE`

## Next Active Work

- `MM3-171B Render-Side Performance Optimization`

## Revision History

- `R1` / `2026-03-26 01:28 KST` / `Codex PM` / screenshot archive, relation renderer parity, grouped related-form card, example source right-edge alignment을 반영
