# 20260329_MM3_278_FILTER_LABEL_AND_ORDER_UPDATE_CLOSEOUT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 02:20 KST`

## Last Updated By

- `Codex PM`

## Scope

- filter panel label update
- filter order update

## Applied

- filter label changed:
  - `Band별` -> `TOPIK빈도`
- filter order changed to:
  - `난이도`
  - `품사별`
  - `TOPIK빈도`
  - `번역 언어`

## Why

- current learner-facing wording에서는 `Band별`보다 `TOPIK빈도`가 의미를 더 직접적으로 전달한다.
- filter panel의 우선 순서는 learner interpretation 기준으로 `난이도 -> 품사 -> TOPIK빈도 -> 번역 언어`가 더 자연스럽다.

## Verification

- `npm run build`
  - `PASS`

## PM Verdict

- `ACCEPT`
- `FILTER_LABEL_AND_ORDER_UPDATED`

## Revision History

- `R1` / `2026-03-29 02:20 KST` / `Codex PM` / filter label과 order를 learner-facing 기준으로 조정하고 closeout
