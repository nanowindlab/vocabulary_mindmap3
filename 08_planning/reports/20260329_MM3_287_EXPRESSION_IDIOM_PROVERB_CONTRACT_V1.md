# 20260329_MM3_287_EXPRESSION_IDIOM_PROVERB_CONTRACT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 11:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `활용 표현`을 current data reality에 맞게 `관용구 / 속담` 중심 support surface로 재정의한다.
- section order, helper copy, navigation emphasis rule을 먼저 고정한다.

## Inputs

- `08_planning/reports/20260326_MM3_236_MM3_UI_REFINEMENT_ROADMAP_V1.md`
- `08_planning/reports/20260329_MM3_282_PROJECT_DB_BASELINE_AND_RELATION_EXPRESSION_STRENGTHENING_V1.md`
- `09_app/src/components/TermDetail.jsx`

## Contract

### Primary Reading Model

- current `활용 표현`은 general expression network가 아니다.
- current runtime에서는 almost all expression items가 `관용구 / 속담`이다.
- therefore the tab must read as:
  - `관용구와 속담` support surface
  - not a navigation-first expression launcher

### First-Read Order

1. overall helper:
   - current word와 연결된 관용구/속담을 뜻과 예문 중심으로 본다
2. `관용구`
3. `속담`
4. `기타 표현` only if any exist

### Navigation Emphasis Rule

- jumpability is secondary
- card-level `독립 항목 연결` chip may remain
- but there is no top-level `바로 이동` first-read section anymore

### Copy Rule

- top title:
  - `관용구와 속담`
- top helper:
  - `현재 단어에 연결된 관용구와 속담을 뜻과 예문 중심으로 먼저 봅니다.`
- `관용구` helper:
  - `현재 단어와 함께 자주 배우는 관용구를 먼저 확인합니다.`
- `속담` helper:
  - `현재 단어에 연결된 속담을 뜻과 예문 중심으로 읽습니다.`
- empty state:
  - `관용구·속담 데이터가 없습니다.`

## Bundle Decision

- same-turn bundle allowed:
  - `MM3-287 + MM3-288`
- reason:
  - same tab
  - same file boundary
  - same expression-focused regression boundary

## Downstream Implementation Checklist

- remove top-level jump-first framing
- group current subwords by `unit`
- render `관용구` and `속담` as primary sections
- keep existing translation/example card behavior
- add expression grouping regression

## PM Verdict

- `ACCEPT`
- `CONTRACT_LOCKED`
- `BUNDLED_WITH_MM3_288`

## Revision History

- `R1` / `2026-03-29 11:10 KST` / `Codex PM` / expression idiom/proverb contract와 same-turn bundle decision을 고정
