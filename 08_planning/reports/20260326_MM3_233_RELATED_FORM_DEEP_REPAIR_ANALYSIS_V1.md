# 20260326_MM3_233_RELATED_FORM_DEEP_REPAIR_ANALYSIS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 16:20 KST`

## Last Updated By

- `Codex PM`

## Scope

- residual analysis after conservative related-form target repair

## Current Residual

- unresolved `related_forms` total:
  - `4,382`
- unresolved buckets:
  - `unresolved_no_target_code + no exact match`: `3,282`
  - `unresolved_zero_code + no exact match`: `1,016`
  - `unresolved_no_target_code + multi exact match`: `68`
  - `unresolved_zero_code + multi exact match`: `15`
  - `unresolved_missing_entry + no exact match`: `1`

## What The Residual Means

- the majority is **not** a missed easy exact-match case anymore.
- most remaining items need one of these:
  - no-match derivation generation
  - multi-entry disambiguation
  - product rule for ambiguous learner-facing jump targets

## High-Signal Residual Pattern

- multi exact match is dominated by `명사 / 관형사` sibling pairs for `-적`.
- examples:
  - `감정 -> 감정적`
  - `가정 -> 가정적`
  - `야만 -> 야만적`
  - `단편 -> 단편적`
  - `환경 -> 환경적`

## PM Interpretation

- conservative exact-match repair was safe because it did not change meaning selection.
- deeper repair from here would require a product/data rule such as:
  - prefer `관형사`
  - prefer `명사`
  - expose both
  - keep unresolved text-only
- that choice changes learner-facing semantics, so it should not be auto-applied without approval.

## PM Verdict

- `APPROVAL_REQUIRED_FOR_DEEP_REPAIR`

## Revision History

- `R1` / `2026-03-26 16:20 KST` / `Codex PM` / conservative repair 이후 residual 구조와 approval boundary를 최초 정리
