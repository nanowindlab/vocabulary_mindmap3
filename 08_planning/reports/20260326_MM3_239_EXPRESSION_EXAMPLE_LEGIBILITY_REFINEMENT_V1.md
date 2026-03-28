# 20260326_MM3_239_EXPRESSION_EXAMPLE_LEGIBILITY_REFINEMENT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 22:44 KST`

## Last Updated By

- `Codex PM`

## Scope

- close `MM3-236D Expression / Example Legibility`

## Implemented

- 표현 탭 상단에 `표현 읽는 순서` overview strip을 추가했다.
- preview-only branch title을 `현재 표제어 맥락에서 먼저 보는 표현`으로 정리했다.
- 표현 카드의 translation row를 chip + value rhythm으로 정리했다.
- 표현 카드의 example row를 compact label chip 형태로 정리했다.
- 예문 탭 상단에 `예문 읽는 순서` overview strip을 추가했다.

## Files

- `09_app/src/components/TermDetail.jsx`
- `09_app/tests/residual.spec.js`

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/residual.spec.js -g "examples surface removes helper chrome and keeps compact source tags|examples prioritize TOPIK source when chunk examples are available|expression tab separates jumpable expressions from preview-only expressions|expression cards follow selected translation language when available|expression cards surface english when english selector is active|expression cards hide translation when translation is off"` -> `6 passed`

## PM Verdict

- `MM3-236D` -> `DONE`
- expression/example legibility refinement는 current canonical 안에서 closeout 가능 상태다.
- next slice는 `MM3-236E Fallback Surface Guidance`다.

## Revision History

- `R1` / `2026-03-26 22:44 KST` / `Codex PM` / expression/example legibility refinement를 구현하고 targeted validation까지 닫음
