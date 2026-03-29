# 20260329_MM3_286_RELATION_COMPARE_IMPLEMENTATION_AND_VALIDATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 10:47 KST`

## Last Updated By

- `Codex PM`

## Scope

- implement the `MM3-285` relation compare contract
- validate the bundled relation tranche in the same turn

## Applied

- relation terms are now split into:
  - `빠른 비교`
  - `확장 관계`
  - `형태·문체 변이`
- current relation tab order is now:
  - `빠른 비교`
  - `확장 관계`
  - `형태·문체 변이`
  - `관련형`
  - `연관 어휘`
  - `교차 연결 장면`
  - `다른 뜻 보기`
- learner-facing helper copy was added for:
  - compare section
  - extended relation section
  - form/style variant section
  - related-form section
- `관련형` helper now explicitly tells the user that only source-explicit jump targets are shown.
- regression test added:
  - compare section and variant section are rendered separately for `간지럽다`

## Files

- `09_app/src/components/TermDetail.jsx`
- `09_app/tests/residual.spec.js`

## Why

- relation data is already broad enough to support compare-first reading.
- current user value is highest when `유의어 / 반대말 / 참고어` are surfaced first.
- morphology/style variants should not compete with core compare terms in the same first-read block.

## Verification

- `npm --prefix 09_app run build`
  - `PASS`
- `npx playwright test tests/residual.spec.js -g "요리하다 entry keeps relation disambiguation labels|unresolved related form is hidden from the default relation surface|unresolved duplicate relations are collapsed|relation labels disambiguate same surface targets|relation compare groups quick compare before form variants|duplicate related form pointers collapse to one learner-facing relation|relations tab does not render original-language section"`
  - `7 passed`

## PM Verdict

- `ACCEPT`
- `RELATION_COMPARE_IMPLEMENTED`
- `RELATION_COMPARE_VALIDATED`

## Next State

- current active execution package: `none`
- next execution tranche:
  - `MM3-287 Expression Idiom-Proverb Contract`

## Revision History

- `R1` / `2026-03-29 10:47 KST` / `Codex PM` / relation compare contract를 구현하고 targeted relation validation까지 같은 turn에 closeout
