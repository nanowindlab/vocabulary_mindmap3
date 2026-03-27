# 20260327_MM3_265_UNCLASSIFIED_RECLASSIFICATION_STUDY_OPENING_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 16:25 KST`

## Last Updated By

- `Codex PM`

## Scope

- open `MM3-265` unclassified handling / reclassification comparative study

## Why This Task Exists

- `분류 밖 항목`은 현재 fallback surface로 유지되고 있으나,
  장기적으로
  - 그대로 유지할지
  - 일부를 재분류할지
  - 다른 사전의 처리 방식을 참고해 learner-facing 구조를 다시 잡을지
  를 별도 연구해야 한다.

## Research Questions

1. `분류 밖 항목`을 현재처럼 fallback surface로 유지하는 것이 learner-facing으로 최선인가?
2. 다른 사전들은 category-less / miscellaneous / grammar-like entry를 어떻게 처리하는가?
3. 현재 `8,506`개 항목을
   - 유지
   - 부분 재분류
   - 별도 lane 분리
   중 어떤 방식으로 다루는 것이 가장 자연스러운가?

## Required Study Coverage

- official KRDict sources:
  - `한국어기초사전` browse/category pages
  - `한국어기초사전` Open API metadata semantics
- other dictionary references:
  - `우리말샘`
  - `표준국어대사전`
  - `네이버 국어사전` 등 접근 가능한 major public dictionary/reference surfaces
- comparison lens:
  - category-less entry handling
  - grammar/function item handling
  - miscellaneous/fallback grouping
  - learner-facing browse path vs metadata separation

## Expected Output

- comparative study note
- recommended handling options
- PM recommendation with trade-offs
- if needed, reclassification candidate rules and phased execution proposal

## Initial Findings To Carry Forward

- `분류 밖 항목` current live count: `8,506`
- source 기준 `categories=[]`이므로 현재는 `의미 범주`/`주제 및 상황`과 중복이 `0`
- official KRDict browse taxonomy와 entry metadata는 분리해서 해석해야 한다는 recent `subject-none` work의 교훈을 그대로 적용해야 한다

## Suggested Deliverables

- `MM3-265A` source + external dictionary landscape scan
- `MM3-265B` unclassified cohort internal shape study
- `MM3-265C` PM recommendation / handling decision note

## Revision History

- `R1` / `2026-03-27 16:25 KST` / `Codex PM` / `분류 밖 항목` comparative study task opening과 required coverage를 고정
