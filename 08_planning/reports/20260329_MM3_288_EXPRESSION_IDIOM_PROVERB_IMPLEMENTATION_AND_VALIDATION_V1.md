# 20260329_MM3_288_EXPRESSION_IDIOM_PROVERB_IMPLEMENTATION_AND_VALIDATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 11:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- implement the `MM3-287` expression idiom/proverb contract
- validate the bundled expression tranche in the same turn

## Applied

- expression tab top reading model changed from generic `표현층` to `관용구와 속담`
- top helper now explains that the tab is for reading idioms/proverbs tied to the current word
- current subwords are grouped by `unit`
  - `관용구`
  - `속담`
  - `기타 표현` only if any exist
- `바로 이동` top-level subsection was removed
- jumpability remains only as a secondary card signal
- empty state copy now matches the idiom/proverb-first contract
- regression test added for separate idiom/proverb section rendering

## Files

- `09_app/src/components/TermDetail.jsx`
- `09_app/tests/residual.spec.js`

## Why

- current data reality is:
  - `subwords` entries: `1,150`
  - total subwords: `2,864`
  - `관용구 2,213`
  - `속담 651`
  - jumpable subword items are effectively near-zero
- therefore support-first reading is more truthful than navigation-first framing

## Verification

- `npm --prefix 09_app run build`
  - `PASS`
- `npx playwright test tests/residual.spec.js -g "expression non-standalone messaging|expression cards follow selected translation language when available|expression cards hide translation when translation is off|expression tab groups idioms and proverbs separately"`
  - `4 passed`

## PM Verdict

- `ACCEPT`
- `EXPRESSION_IDIOM_PROVERB_IMPLEMENTED`
- `EXPRESSION_IDIOM_PROVERB_VALIDATED`

## Next State

- current active execution package: `none`
- next execution tranche:
  - `MM3-289 In-App Dedicated Route Readiness Gate`

## Revision History

- `R1` / `2026-03-29 11:10 KST` / `Codex PM` / expression idiom/proverb contract를 구현하고 targeted expression validation까지 같은 turn에 closeout
