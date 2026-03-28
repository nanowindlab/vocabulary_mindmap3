# 20260326_MM3_232_RELATED_FORM_TARGET_REPAIR_V1

## Current Revision

- `R3`

## Last Updated

- `2026-03-26 16:20 KST`

## Last Updated By

- `Codex PM`

## Scope

- source-faithful data-side repair for unresolved `related_forms` targets

## Applied

- builder-level conservative exact-match backfill added to:
  - `vocab_dictionary/scripts/build_kcenter_dataset.py`
- runtime/source repair script added:
  - `vocab_dictionary/scripts/repair_runtime_related_form_targets.py`
- source base and live detail map patched with the same exact-match rule
- `kcenter_link_integrity.json` summary synced to the repaired source state
- source-explicit multi target은 유지한다.
- source ambiguity는 text-only로 남긴다.

## Repair Rule

- single exact-match는 그대로 backfill한다.
- source-explicit multi target은 유지한다.
- source ambiguity는 text-only로 남긴다.
- no exact-match만 unresolved로 남긴다.
- fuzzy or heuristic disambiguation은 적용하지 않는다.

## Before / After

- source related_forms unresolved total:
  - `4,563 -> 4,303`
- source dangling related_forms:
  - `1,085 -> 1,019`
- resolved single exact-match backfill:
  - `130`
- resolved multi exact-match expansion:
  - `150`

## Sample Repairs

- `감상 -> 감상하다`
  - `target_code: 59945`
- `보수 -> 보수하다`
  - `target_code: 59268`
- `갈다(14580) -> 갈리다`
  - `target_code: 14708`
- `감정1(17312) -> 감정적`
  - `target_code: 16182 / 16183`
- `감정2(15232) -> 감정적`
  - `text-only`
- `연동 -> 연동하다`
  - `target_code: 601747`
- `노력 -> 노력하다`
  - `target_code: 64375`

## Verification

- `python3 vocab_dictionary/scripts/repair_runtime_related_form_targets.py`
  - `PASS`
- `npm run validate:source-alignment`
  - `PASS`
- `npm run build`
  - `PASS`

## Residual Tail

- unresolved `related_forms` still remain where:
  - no exact internal word match exists
  - source ambiguity가 남아 있다
- source-explicit multi-target exposure는 current rule로 accept한다.
- deeper heuristic disambiguation은 별도 future tranche로 두는 것이 맞다.

## PM Verdict

- `ACCEPT`
- `SOURCE_FAITHFUL_REPAIR_APPLIED`
- `DEEP_REPAIR_DEFERRED`

## Next Active Work

- `MM3-229 Runtime Boundary Maintenance`

## Revision History

- `R1` / `2026-03-26 16:20 KST` / `Codex PM` / related form target conservative repair과 before/after evidence를 최초 고정
- `R2` / `2026-03-26 16:20 KST` / `Codex PM` / multi exact-match 관련형을 전부 연결하는 rule과 updated before/after counts를 반영
- `R3` / `2026-03-26 16:20 KST` / `Codex PM` / source-faithful rule에 맞춰 explicit multi-target과 ambiguity text-only를 다시 반영
