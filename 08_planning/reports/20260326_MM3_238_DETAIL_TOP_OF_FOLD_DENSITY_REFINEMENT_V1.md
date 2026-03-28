# 20260326_MM3_238_DETAIL_TOP_OF_FOLD_DENSITY_REFINEMENT_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-26 22:14 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-236C Detail Top-Of-Fold Density`

## Implemented

- detail header에 current sense definition preview를 추가했다.
- detail header에 compact translation preview chip을 추가했다.
- `닫기` chrome을 text-only로 단순화했다.
- header meta chip의 spacing과 path chip density를 압축했다.
- context helper card를 copy는 유지한 채 compact row로 줄였다.

## Files

- `09_app/src/components/TermDetail.jsx`
- `09_app/tests/residual.spec.js`

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/residual.spec.js -g "detail header keeps pronunciation inline and removes duplicate translation section|unresolved related form|relation labels disambiguate same surface targets|duplicate related form pointers collapse to one learner-facing relation|unresolved duplicate relations are collapsed|situation none path is reframed as general vocabulary|unclassified helper splits grammatical items from uncategorized vocabulary"` -> `7 passed`

## PM Verdict

- `MM3-236C` -> `DONE`
- current header contract 범위의 top-of-fold density refinement는 closeout 가능 상태다.
- next slice는 `MM3-236D Expression / Example Legibility`다.

## Revision History

- `R1` / `2026-03-26 22:07 KST` / `Codex PM` / detail header definition/translation preview와 text-only close chrome을 반영하고 targeted validation을 통과시킴
- `R2` / `2026-03-26 22:14 KST` / `Codex PM` / meta/helper density compact pass까지 반영하고 `MM3-236C`를 closeout함
