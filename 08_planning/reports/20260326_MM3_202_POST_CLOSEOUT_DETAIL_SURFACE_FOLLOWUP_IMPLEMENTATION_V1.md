# 20260326_MM3_202_POST_CLOSEOUT_DETAIL_SURFACE_FOLLOWUP_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 00:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-202A` detail top-of-fold helper density re-review scope 정의
- `MM3-202B` example source label presentation follow-up scope 정의
- `MM3-203A` relation / expression hierarchy follow-up scope 정의
- `MM3-204A` expression translation visibility consistency follow-up scope 정의

## Target

- `09_app/src/components/TermDetail.jsx`
- `09_app/src/components/MindmapCanvas.jsx`
- `09_app/tests/residual.spec.js`
- `09_app/tests/pilot-rehearsal.spec.js`
- `09_app/tests/scenario.spec.js`
- `09_app/tests/smoke.spec.js`

## Implemented

### 1. `보다` core top-of-fold helper density 정리

- `상황 미지정` context helper card는 core top-of-fold에서 제거했다.
- `표현 활용 워크플로우` helper card도 제거했다.
- 대신 `활용 표현` tab count를 orange badge로 강조해 discoverability는 가볍게 유지했다.

### 2. expression preview-only card 반복 copy 축소

- preview-only expression card의 반복 supporting copy를 제거했다.
- `의미 N개 연결` meta chip도 제거했다.
- card는 `표현 제목 + 우측 type tag + 정의 + 선택적 번역/예문`만 남기도록 정리했다.

### 3. expression translation visibility rule 정합화

- expression/subword card의 번역 줄도 `showEnglish`가 켜져 있을 때만 노출되도록 바꿨다.
- selected language projection 자체는 그대로 유지했다.

### 4. `관련형` visual hierarchy 강화

- `관련형` section은 chip-only가 아니라 card stack으로 바꿨다.
- 카드 우측 상단 type tag(`파생어` 등)를 강조해, user가 positive reaction을 준 expression card hierarchy를 relation surface에 재사용했다.
- repeated surface disambiguation은 definition body에서 계속 읽히게 유지했다.

### 5. `예문` helper/source label presentation 압축

- `예문` 탭 상단 helper card를 제거했다.
- `TOPIK 29th`, `TOPIK 47` 같은 source label은 learner-facing display에서 `TOPIK`으로 축약했다.
- source label은 example sentence 뒤 inline badge로 붙여, 공간이 남으면 같은 줄 끝을 쓰고 부족하면 자연스럽게 줄바꿈되게 바꿨다.

## Expected Effect

- core top-of-fold에서 뜻보다 먼저 보이던 helper chrome이 줄어든다.
- expression card는 branch 의미를 유지하면서도 반복 copy noise가 줄어든다.
- `번역 ON/OFF` rule이 core/detail과 expression에서 일관된다.
- `관련형`은 `파생어` type을 더 빠르게 읽을 수 있다.
- example source는 더 짧고 덜 시선을 끈다.

## Verification

- command:
  - `npm run build`
- result:
  - `passed`
- command:
  - `npx playwright test`
- result:
  - `37 passed`

## PM Verdict

- `IMPLEMENTED`

## Follow-Up

- `MM3-205A`, `MM3-206A` decision/review output 기준으로 unclassified IA reorder와 legend policy는 separate decision surface로 유지한다.

## Revision History

- `R1` / `2026-03-26 00:42 KST` / `Codex PM` / post-closeout detail / relation / examples / expression residual follow-up 구현과 test closeout을 기록
