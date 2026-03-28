# 20260325_MM3_192_SECOND_PILOT_FEEDBACK_FULL_COVERAGE_REAUDIT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 17:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- second pilot raw feedback full coverage re-audit and missing-item closeout

## Authoritative Inputs

- `08_planning/pilot_feedback/human pilot test_2차 피드백.md`
- `08_planning/pilot_feedback/20260325_pilot_session_02.md`
- `09_app/src/components/SearchBox.jsx`
- `09_app/src/components/TermDetail.jsx`
- `09_app/src/utils/hierarchyDisplay.js`
- `09_app/src/App.jsx`
- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- `09_app/public/data/live/APP_READY_DETAIL_MAP.json`

## Outputs Checked

- `09_app/src/components/SearchBox.jsx`
- `09_app/src/components/TermDetail.jsx`
- `09_app/src/utils/hierarchyDisplay.js`
- `09_app/src/App.jsx`
- `09_app/tests/residual.spec.js`
- `09_app/tests/pilot-rehearsal.spec.js`
- `09_app/public/data/live/`
- `09_app/public/data/internal/runtime_payloads/`

## Coverage Verdict

### Verified Closed This Turn

1. search result ordering / label explanation
- result:
  - search dropdown 하단에 정렬 규칙 helper 추가
  - `코어` label을 `기본 항목`으로 교체

2. `분류 밖 항목` / `미분류` terminology drift
- result:
  - learner-facing tab label을 `분류 밖 항목`으로 통일
  - unclassified helper copy를 더 짧고 덜 혼란스럽게 교체

3. `상황 미지정` helper 과밀 문구
- result:
  - core helper copy를 간결한 안내 문장으로 축소

4. preview-only 표현 negative messaging
- result:
  - 표현 탭 상단 `표현 학습 파이프라인` card 제거
  - preview-only 카드의 `상세 연결 없음` pill 제거
  - section label을 `현재 표제어에서 먼저 보는 표현`으로 교체

5. `요리하다` 관련형 duplicate
- result:
  - 같은 `target_code`를 가리키는 `☞(가 보라)` / `파생어` 중 learner-facing relation만 남기도록 dedupe

## Previously Verified And Reconfirmed

- tab naming `의미 관계` / `활용 표현`
- `버리다` Enter IME guard
- relation tab `원어 정보` 제거
- `보다` duplicate related form disambiguation
- 표현 카드 repeated meta 축소
- expression card selected-language translation projection
- examples helper density cleanup

## Still Not Fully Reflected

### 1. `TOPIK` examples visible priority

- status:
  - `PARTIAL`
- what is true:
  - UI는 `TOPIK` source first ordering guard를 이미 갖고 있다.
- blocking evidence:
  - `09_app/public/data/live/APP_READY_CHUNK_EXAMPLES_*`: `0 files`
  - `09_app/public/data/internal/runtime_payloads/APP_READY_CHUNK_EXAMPLES_*`: `0 files`
- implication:
  - visible `TOPIK` sentence promotion은 source/runtime example payload가 복구되기 전에는 실제 화면에서 fully reflected될 수 없다.

### 2. `돈` example variety / sentence richness

- status:
  - `PARTIAL`
- runtime evidence:
  - current live detail payload의 `돈 (17204)` first-sense examples는 모두 `구` 유형이다.
  - richer sentence/TOPIK examples를 올릴 runtime-facing payload가 현재 없다.
- implication:
  - ordering rule은 준비됐지만 source diversity 자체는 아직 반영되지 않았다.

### 3. `미분류` surface removal or independent-content split

- status:
  - `DECISION_PENDING`
- what changed:
  - learner-facing label/copy confusion은 줄였다.
- what remains:
  - fallback surface 자체를 제거하거나 별도 독립 콘텐츠로 재편하는 일은 cross-surface taxonomy decision이라 이번 턴 direct fix 범위를 넘는다.

## Contradiction Check

- raw note의 `독립 항목 연결이 전체 단어에서 사실상 두다 1개` perception은 current search index 전체 기준으로는 재현되지 않았다.
- current live `APP_READY_SEARCH_INDEX.json` 기준 `has_subwords` term은 `1,161`건이다.
- 따라서 이 항목은 global runtime claim으로는 `contradicted`, learner-facing preview messaging issue로는 위 direct fix에서 흡수했다.

## Verification

- command:
  - `npx playwright test tests/residual.spec.js -g "expression non-standalone messaging|search helper explains ordering and basic-item label|duplicate related form pointers collapse to one learner-facing relation|situation none path is reframed as general vocabulary|unclassified helper splits grammatical items from uncategorized vocabulary|examples prioritize TOPIK source when chunk examples are available|expression cards follow selected translation language when available|search enter ignores IME composition confirmation before final submit"`
- result:
  - `8 passed`
- command:
  - `npx playwright test tests/pilot-rehearsal.spec.js -g "돈 core and expression preview|보다 and 버리다 semantics surfaces|요리하다 translation selector and examples"`
- result:
  - `3 passed`

## PM Verdict

- `PARTIAL_ACCEPT`

## Next Action

- `MM3-187G`는 `TOPIK` examples source restore / examples variety policy / fallback-surface taxonomy decision bundle로 유지한다.

## Revision History

- `R1` / `2026-03-25 17:05 KST` / `Codex PM` / raw second pilot feedback 전 항목을 runtime/code 기준으로 재감사하고 남은 direct fix를 닫음
