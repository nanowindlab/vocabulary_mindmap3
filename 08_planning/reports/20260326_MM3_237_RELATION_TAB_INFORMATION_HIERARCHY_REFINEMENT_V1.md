# 20260326_MM3_237_RELATION_TAB_INFORMATION_HIERARCHY_REFINEMENT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 22:07 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-236B Relation Tab Information Hierarchy`

## Implemented

- relation tab 상단에 `읽는 순서` overview strip을 추가했다.
- `관련형`을 `바로 이동 가능한 관련형`과 `원본에 표면형만 있는 관련형`으로 분리했다.
- source-faithful related-form status를 learner-facing copy로 노출했다.
- relation-related Playwright assertions를 current copy와 hierarchy에 맞춰 정리했다.

## Files

- `09_app/src/components/TermDetail.jsx`
- `09_app/tests/residual.spec.js`

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/residual.spec.js -g "unresolved related form|relation labels disambiguate same surface targets|duplicate related form pointers collapse to one learner-facing relation|unresolved duplicate relations are collapsed"` -> `4 passed`

## PM Verdict

- `MM3-236B` -> `DONE`
- current learner-facing relation tab hierarchy는 source-faithful semantics를 유지한 채 한 단계 더 명확해졌다.
- next slice는 `MM3-236C Detail Top-Of-Fold Density`다.

## Revision History

- `R1` / `2026-03-26 22:07 KST` / `Codex PM` / relation tab hierarchy refinement를 구현하고 relation-focused validation까지 닫음
