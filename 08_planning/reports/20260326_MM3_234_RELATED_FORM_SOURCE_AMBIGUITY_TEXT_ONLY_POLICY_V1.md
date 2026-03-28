# 20260326_MM3_234_RELATED_FORM_SOURCE_AMBIGUITY_TEXT_ONLY_POLICY_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 16:20 KST`

## Last Updated By

- `Codex PM`

## Scope

- policy for source-ambiguous `related_forms`

## Decision

- source가 명시적으로 target을 주지 않는 `related_forms`는 `text-only`로 고정한다.
- source-explicit multiple은 그대로 유지한다.
- source-explicit single은 그대로 연결한다.

## Example

- `감정1` -> `감정적 2`, `감정적 1`
  - source-explicit multiple
  - both keep
- `감정2` -> `감정적`
  - source-ambiguous
  - text-only
- `감정3` -> `감정하다`
  - source-explicit single
  - keep

## PM Verdict

- `APPROVED_BY_USER`
- `SOURCE_AMBIGUITY_TEXT_ONLY`

## Revision History

- `R1` / `2026-03-26 16:20 KST` / `Codex PM` / source ambiguity text-only policy를 최초 고정
