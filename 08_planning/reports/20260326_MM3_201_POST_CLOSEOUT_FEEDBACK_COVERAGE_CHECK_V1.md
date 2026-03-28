# 20260326_MM3_201_POST_CLOSEOUT_FEEDBACK_COVERAGE_CHECK_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-26 00:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- post-closeout additional feedback coverage check and todo mapping

## Source

- current user message in PM thread
- raw note copy:
  - `08_planning/pilot_feedback/human pilot test_3차 피드백.md`
- normalized note:
  - `08_planning/pilot_feedback/20260326_pilot_session_03.md`
- screenshot references:
  - `/Users/nanowind/Desktop/스크린샷 2026-03-25 오후 11.47.35.png`
  - `/Users/nanowind/Desktop/스크린샷 2026-03-26 오전 12.00.04.png`
- current evidence surfaces:
  - `09_app/src/components/TermDetail.jsx`
  - `09_app/src/App.jsx`
  - `09_app/src/components/MindmapCanvas.jsx`
  - `08_planning/reports/20260325_MM3_168_DETAIL_HEADER_CLOSE_COPY_DENSITY_CONTRACT_V1.md`
  - `08_planning/reports/20260325_MM3_169_RELATION_EXPRESSION_DISCOVERABILITY_CONTRACT_V1.md`
  - `08_planning/reports/20260325_MM3_170_TRANSLATION_SURFACE_COMPLETENESS_REAUDIT_NOTE_V1.md`
  - `08_planning/reports/20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TERMINOLOGY_BASELINE_DRAFT_V1.md`

## Literal Feedback Anchor

- raw wording preservation은 `08_planning/pilot_feedback/human pilot test_3차 피드백.md`에 두고,
- 이번 packet은 coverage 판정과 todo 반영에만 집중한다.

## Coverage Check

| User Item | Current Coverage | Verdict | Task |
|---|---|---|---|
| `보다` `핵심` 탭의 `상황 미지정` helper와 `표현 활용 워크플로우` card 밀도 재검토 | `MM3-168` contract가 compact teaser를 권했지만 actual UI는 여전히 helper block 비중이 큼 | `contract drift, reopen` | `MM3-202A` |
| `활용 표현` 카드의 반복 support/meta copy 축소 + `파생어` 시각 위계 재검토 | `MM3-169` contract는 copy/hierarchy를 다뤘지만 current preview-only card와 related-form styling은 여전히 과밀/약함 | `contract drift, reopen` | `MM3-203A` |
| `활용 표현` 카드 번역 줄이 `번역 ON/OFF`와 같은 visibility rule을 따르게 할 것 | selected language projection은 반영됐지만 `showEnglish` off consistency는 current subword card에 없음 | `new residual` | `MM3-204A` |
| `예문` helper 문구 제거 검토 + `TOPIK` 회차 숨김 + source label line-wrap policy 정리 | example source restore는 닫혔지만 example presentation policy는 별도 결정이 없음 | `new follow-up` | `MM3-202B` |
| `분류 밖 항목`을 main app에 유지할지 / 별도 앱으로 분리할지, 유지 시 `품사 -> 학습난이도` 재배치 검토 | `MM3-172`는 terminology baseline까지 닫혔지만 product/IA decision은 아직 없다 | `decision pending` | `MM3-205A` |
| 마인드맵 좌측 하단 `Band 범위` legend의 필요성 재검토 | current code에는 legend가 남아 있지만 별도 value review packet은 없다 | `new review task` | `MM3-206A` |

## PM Interpretation

### 1. Positive Reuse Anchor

- `/Users/nanowind/Desktop/스크린샷 2026-03-26 오전 12.00.04.png`의
  - section label
  - expression title
  - right-top type tag
  조합은 learner-facing relation/expression surface의 좋은 시각 기준점으로 본다.
- `파생어` follow-up은 이 positive anchor를 재사용하는 방향이 맞다.

### 2. `분류 밖 항목` Tree Order Preliminary Opinion

- main app 안에 유지한다면 current `학습난이도 -> 품사`보다 `품사 -> 학습난이도`가 더 타당하다.
- 이유:
  - `품사`가 browse 축으로 더 즉각적인 semantic discriminator다.
  - `학습난이도`는 이미 filter로 병행 제어가 가능하다.
  - current fallback surface는 learner가 구조를 해석해야 하는 cost가 커, first branch는 더 직관적인 편이 낫다.
- 다만 separate app split 여부가 먼저 결정되어야 하므로, 이번 턴에서는 `preliminary opinion`까지만 고정한다.

### 3. `Band 범위` Legend Preliminary Opinion

- `mm3`에서는 default fixed chrome으로 유지할 가치는 아직 불분명하다.
- current product focus가 relation/expression/detail comprehension 쪽인 만큼,
  - hide-by-default
  - contextual reveal
  - removal
  중 하나를 비교 검토하는 review task가 먼저 맞다.

## Added To Tasklist

- `MM3-201A` post-closeout additional feedback coverage check
- `MM3-201B` post-closeout additional feedback literal documentation sync
- `MM3-202A` detail top-of-fold helper density re-review scope 정의
- `MM3-202B` example source label presentation follow-up scope 정의
- `MM3-203A` relation / expression hierarchy follow-up scope 정의
- `MM3-204A` expression translation visibility consistency follow-up scope 정의
- `MM3-205A` unclassified surface product / IA decision note
- `MM3-206A` mindmap Band legend value review note

## Downstream Closeout

- implementation closeout:
  - `08_planning/reports/20260326_MM3_202_POST_CLOSEOUT_DETAIL_SURFACE_FOLLOWUP_IMPLEMENTATION_V1.md`
- decision notes:
  - `08_planning/reports/20260326_MM3_205_UNCLASSIFIED_SURFACE_PRODUCT_IA_DECISION_NOTE_V1.md`
  - `08_planning/reports/20260326_MM3_206_MINDMAP_BAND_LEGEND_VALUE_REVIEW_NOTE_V1.md`
- tasklist status:
  - `MM3-202A`~`MM3-206A` `DONE`

## PM Verdict

- 이번 추가 피드백은 기존 `MM3-168`~`MM3-172` family를 완전히 새 tranche로 바꾸지는 않지만,
- existing contract와 current UI 사이의 drift, 그리고 아직 닫히지 않은 product decision을 다시 드러냈다.
- active work는 계속 `MM3-171B`로 유지하고, 이번 피드백은 pending queue로 tasklist에 반영하는 것이 맞다.

## Next Active Work

- `MM3-171B Render-Side Performance Optimization`

## Revision History

- `R1` / `2026-03-26 00:08 KST` / `Codex PM` / post-closeout 추가 피드백을 기록하고 coverage/task mapping을 tasklist 기준으로 반영
- `R2` / `2026-03-26 00:42 KST` / `Codex PM` / downstream implementation/decision closeout과 tasklist `DONE` 상태를 packet에 연결
