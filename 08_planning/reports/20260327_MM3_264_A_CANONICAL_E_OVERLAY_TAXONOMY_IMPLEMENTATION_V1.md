# 20260327_MM3_264_A_CANONICAL_E_OVERLAY_TAXONOMY_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 16:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- implement `A` as canonical learner-facing taxonomy for `주제 및 상황`
- implement `E` as quick-entry overlay only

## Canonical Decision

- canonical taxonomy:
  - `A. 생활 영역형`
- overlay only:
  - `E. 서비스/생활 운영형`

## Implemented

### 1. `A` canonical situation taxonomy

- added:
  - `09_app/src/utils/situationTaxonomy.js`
- behavior:
  - raw `주제 및 상황` leaf 80개를 refined `A` middle layer로 매핑
  - learner-facing path는 `주제 및 상황 > A middle layer > raw leaf` 형식으로 노출

### 2. tree grouping

- updated:
  - `09_app/src/utils/hierarchyDisplay.js`
  - `09_app/src/App.jsx`
- behavior:
  - `주제 및 상황` tree scene이 raw leaf가 아니라 canonical `A` middle layer 기준으로 묶인다
  - category는 raw leaf로 유지된다

### 3. `E` quick-entry overlay

- updated:
  - `09_app/src/App.jsx`
- behavior:
  - `주제 및 상황` 탭에만 `E` quick-entry overlay 추가
  - practical group 버튼 -> leaf shortcut 버튼
  - leaf 선택 시 canonical destination list로 좁혀 들어간다
  - tree/breadcrumb/canonical path 자체는 `A`만 사용한다

### 4. regression coverage

- updated:
  - `09_app/tests/residual.spec.js`
- verified:
  - canonical `A` path 표시
  - `E` quick-entry overlay 동작
  - scene count badge 동작
  - existing relation/subject-none behavior 유지

## Validation

- command:
  - `npm run build`
  - `npx playwright test tests/residual.spec.js -g "요리하다 entry keeps relation disambiguation labels|situation paths use canonical A taxonomy grouping|subject-none duplicates route through meaning and none-only entries disappear from search|scene nodes show child-category count and total term count|situation quick entry overlay narrows to the selected practical leaf"`
- result:
  - `PASS`
  - `5 passed`

## PM Verdict

- `MM3-264`: `DONE`

## Notes

- `A`는 canonical taxonomy
- `E`는 quick-entry overlay
- tree / breadcrumb / detail path / control-plane은 `A`만 사용

## Revision History

- `R1` / `2026-03-27 16:10 KST` / `Codex PM` / `A canonical + E overlay` taxonomy와 UI 반영을 구현하고 validation까지 완료
