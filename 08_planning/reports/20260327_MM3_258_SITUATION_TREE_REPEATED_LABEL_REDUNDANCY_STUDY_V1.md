# 20260327_MM3_258_SITUATION_TREE_REPEATED_LABEL_REDUNDANCY_STUDY_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 08:35 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-258A` situation tree repeated child label redundancy study

## Evidence

- current `APP_READY_SITUATION_TREE` runtime payload를 확인한 결과,
  `11,355 / 11,355` rows에서 `scene == category`다.
- examples:
  - `교통 이용하기 > 교통 이용하기`
  - `역사 > 역사`
  - `집 구하기 > 집 구하기`
  - `공공기관 이용하기 > 공공기관 이용하기`

## Meaning

- 이 redundancy는 current UI만의 렌더링 문제가 아니다.
- current source-shaped tree가 이미 `scene/category same-label` 구조로 들어오고 있다.
- 따라서 quick UI relabel만으로 해결하면 false hierarchy를 만들 위험이 있다.

## Why Prior Feedback Felt Ignored

- user feedback는 이미 반복적으로 있었다.
- 하지만 이전 PM round에서는 direct UI cleanup tranche가 우선되면서,
  이 문제를 `독립 debt/study`로 분리 기록하지 못했다.
- 이번 turn에서 별도 study packet과 follow-up task로 고정했다.

## Recommendation

- immediate UI patch로 임의 rename하거나 category line을 숨기지 않는다.
- 먼저 아래 둘 중 어느 방향인지 product decision이 필요하다.
  1. `scene/category 2-layer`를 유지하되 learner-facing rename rule을 추가
  2. `주제 및 상황`만 예외적으로 1-layer rendering으로 collapse

## Follow-Up Task

- `MM3-258B` situation tree repeated label resolution options / implementation decision: `TODO`

## PM Verdict

- `MM3-258A` -> `DONE`
- issue is real and source-shaped

## Revision History

- `R1` / `2026-03-27 08:35 KST` / `Codex PM` / situation tree repeated label redundancy를 runtime evidence 기준으로 고정하고 follow-up task를 분리
