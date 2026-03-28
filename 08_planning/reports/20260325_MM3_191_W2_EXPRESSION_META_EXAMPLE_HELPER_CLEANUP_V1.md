# 20260325_MM3_191_W2_EXPRESSION_META_EXAMPLE_HELPER_CLEANUP_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 16:56 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-187F3` expression meta / example helper cleanup

## Inputs

- `08_planning/pilot_feedback/human pilot test_2차 피드백.md`
- `08_planning/pilot_feedback/20260325_pilot_session_02.md`
- `08_planning/reports/20260325_MM3_187_SECOND_HUMAN_PILOT_UNIFIED_PIPELINE_V1.md`
- `08_planning/reports/20260325_MM3_190_W2_SURFACE_CONTRACT_EXECUTION_NOTE_V1.md`
- `09_app/src/components/TermDetail.jsx`
- `09_app/tests/residual.spec.js`
- `09_app/tests/pilot-rehearsal.spec.js`

## Implemented

### 1. Expression card repeated meta cleanup

- file:
  - `09_app/src/components/TermDetail.jsx`
- change:
  - repeated `부모 표제어` meta 제거
  - multi-sense 카드만 `의미 N개 연결`로 축소 표기
  - supporting copy를 더 짧게 정리

### 2. Examples helper density cleanup

- file:
  - `09_app/src/components/TermDetail.jsx`
- change:
  - examples helper copy를 한 문장으로 압축
  - `TOPIK` source가 있을 때 먼저 노출하고, 나머지는 현재 의미 예문을 이어서 보여주는 merge/sort guard 추가
  - example card/source test id 추가

## Runtime Note

- current live runtime에는 `APP_READY_CHUNK_EXAMPLES_*` payload가 없다.
- 따라서 learner가 즉시 보게 되는 변화는 helper density cleanup과 example ordering guard다.
- 실제 `TOPIK` 카드 상위 노출은 example chunk가 복구되거나 다시 공급될 때부터 visible effect가 난다.

## Verification

- command:
  - `npx playwright test tests/residual.spec.js -g "examples helper explains source and ordering|examples prioritize TOPIK source when chunk examples are available|expression cards follow selected translation language when available|relations tab does not render original-language section|search enter ignores IME composition confirmation before final submit"`
- result:
  - `5 passed`
- command:
  - `npx playwright test tests/pilot-rehearsal.spec.js -g "요리하다 translation selector and examples|돈 core and expression preview"`
- result:
  - `2 passed`

## PM Verdict

- `W2_CLOSED_WITH_RUNTIME_GUARD`

## Next Active Work

- `MM3-187G W3 Examples / Taxonomy Policy`

## Revision History

- `R1` / `2026-03-25 16:56 KST` / `Codex PM` / expression repeated meta 축소와 examples helper / TOPIK ordering guard 반영 결과를 기록
