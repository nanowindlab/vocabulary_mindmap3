# 20260327_MM3_266F_T1_FORMALIZE_SEARCH_INDEX_DERIVED_TREE_RUNTIME_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 20:56 KST`

## Last Updated By

- `Codex PM`

## Scope

- execute `MM3-266F / T1 Formalize Search-Index-Derived Tree Runtime`

## Implemented

### 1. runtime contract를 코드에 명시

- `loaderAdapter.js` header를 현재 runtime contract에 맞게 다시 정리했다.
- eager runtime, on-demand runtime, build-side tree artifact 경계를 코드 상단 설명으로 고정했다.

### 2. dead tree runtime loader path를 제거

- `loadMeaningTree`
- `loadSituationTree`
- `loadUnclassifiedTree`

위 세 loader export를 제거했다.
- learner-facing runtime이 더 이상 tree trio를 fetch하지 않는다는 점을 코드 구조로도 맞췄다.

### 3. projected tree path를 intended runtime path로 고정

- `App.jsx`에 `searchIndex -> tab projection`이 current runtime contract라는 설명을 추가했다.
- tree trio bypass가 temporary workaround가 아니라 current runtime behavior임을 명시했다.

### 4. build/validation layer 역할만 분리

- `prepare-live-payloads.mjs`
- `verify-runtime-payloads.mjs`
- `validate-runtime-source-alignment.mjs`

위 스크립트에는 tree trio가 여전히 generated build/validation artifact라는 점만 명시했다.
- package/build behavior 자체는 바꾸지 않았다.

## Out Of Scope Kept

- `APP_READY_DETAIL_MAP` demotion
- `APP_READY_SEARCH_INDEX` slimming
- tree trio generation removal
- package/build manifest restructuring

## Validation

- `npm run build` -> `PASS`
- `npx playwright test tests/smoke.spec.js tests/scenario.spec.js` -> `5 passed`

## PM Verdict

- `MM3-266F / T1`: `DONE`

## Next Step

- `T2 DETAIL_MAP demotion preparation`

## Revision History

- `R1` / `2026-03-27 20:56 KST` / `Codex PM` / tree trio runtime demotion contract를 코드와 build-side comments에 정렬하고 local validation을 완료
