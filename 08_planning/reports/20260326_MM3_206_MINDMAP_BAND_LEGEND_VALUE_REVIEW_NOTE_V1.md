# 20260326_MM3_206_MINDMAP_BAND_LEGEND_VALUE_REVIEW_NOTE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 00:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-206A` mindmap Band legend value review note

## Inputs

- `08_planning/reports/20260326_MM3_201_POST_CLOSEOUT_FEEDBACK_COVERAGE_CHECK_V1.md`
- `09_app/src/components/MindmapCanvas.jsx`
- current mindmap tooltip / band ring / filter surface

## Decision

- `MM3`에서는 좌측 하단 fixed `Band 범위` legend를 기본 chrome에서 제거한다.

## Why

### 1. current learner task priority is not band-study-first

- current `MM3` usage는 relation / expression / detail comprehension이 더 핵심이다.
- fixed legend가 계속 떠 있으면, main canvas chrome 대비 가치가 낮은 정보가 시야를 점유한다.

### 2. band signal is still available elsewhere

- term node band ring
- tooltip band badge
- filter panel의 `Band별`
- detail panel의 Band chip

- 즉 legend를 제거해도 band signal 자체가 사라지지 않는다.

### 3. user feedback aligns with declutter

- `mm2`에서는 중요했지만, `mm3`에서는 고정 chrome 가치가 불명확하다는 피드백이 있었다.
- current surface는 reduction 쪽이 더 설득력 있다.

## Applied Change

- `MindmapCanvas`의 lower-left fixed legend block을 제거했다.
- tooltip band badge와 filter/detail band signal은 그대로 유지했다.

## Verification

- command:
  - `npx playwright test`
- result:
  - `37 passed`

## PM Verdict

- `REVIEW_APPLIED`

## Revision History

- `R1` / `2026-03-26 00:42 KST` / `Codex PM` / fixed Band legend 제거 결정과 runtime 적용 결과를 기록
