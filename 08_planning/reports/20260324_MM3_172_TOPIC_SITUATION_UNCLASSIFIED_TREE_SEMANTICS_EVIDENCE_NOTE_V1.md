# 20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TREE_SEMANTICS_EVIDENCE_NOTE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 23:53 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-172B` duplicated / isolated / tangled pattern evidence collection

## Sources

- `09_app/public/data/live/APP_READY_SITUATION_TREE.json`
- `09_app/public/data/live/APP_READY_UNCLASSIFIED_TREE.json`
- screenshot:
  - `/Users/nanowind/Desktop/스크린샷 2026-03-24 오후 9.53.36.png`
- prior accepted context:
  - `08_planning/reports/20260324_MM3_154_NONE_UNCLASSIFIED_DEEP_SCENARIO_PLAN_V1.md`
  - `08_planning/reports/20260324_MM3_156_NONE_UNCLASSIFIED_MINIMAL_UI_MAPPING_ACCEPTANCE_V1.md`

## Evidence Summary

### A. `주제 및 상황` duplicated parent는 `역사`만의 특이 사례가 아니다.

- current runtime `APP_READY_SITUATION_TREE.json`에서 `scene == category`인 path가 다수 확인된다.
- top duplicated path cohort:
  - `주제 및 상황 범주 > 없음 > 없음`: `4,956`
  - `주제 및 상황 범주 > 심리 > 심리`: `363`
  - `주제 및 상황 범주 > 경제·경영 > 경제·경영`: `269`
  - `주제 및 상황 범주 > 인간관계 > 인간관계`: `251`
  - `주제 및 상황 범주 > 사회 문제 > 사회 문제`: `227`
  - `주제 및 상황 범주 > 학교생활 > 학교생활`: `209`
- 즉, screenshot에 보인 `역사 > 역사`는 isolated accident보다 current situation tree labeling pattern의 한 예로 보는 편이 맞다.

### B. screenshot signal은 runtime path와 일치한다.

- sample runtime row:
  - `시대적` / `관형사`
  - path: `주제 및 상황 범주 > 역사 > 역사`
- screenshot에서도 좌측 tree는 `역사 > 역사 > 시대적`처럼 읽히고, canvas에는 `역사` 계열 node가 상위에 떠 보인다.
- 따라서 현재 pain point는 screenshot-only perception이 아니라 runtime hierarchy label과 canvas display가 같이 만드는 신호다.

### C. duplicated parent 문제는 최소 두 층으로 분리해야 한다.

- `label duplication`
  - scene과 category label이 동일하게 반복되는 문제
- `display isolation`
  - 상위 parent node가 하위 word cluster에 비해 맥락 없이 떠 보이는 문제
- wording만 바꾸면 `display isolation`이 남을 수 있고, display만 다듬으면 `역사 > 역사` 같은 path 문구가 남을 수 있다.

### D. `미분류`는 현재 `학습난이도 > 품사` ordering으로 보인다.

- current runtime top path:
  - `미분류 > 없음 > 품사 없음`: `2,530`
  - `미분류 > 고급 > 명사`: `1,939`
  - `미분류 > 고급 > 동사`: `872`
  - `미분류 > 고급 > 품사 없음`: `651`
  - `미분류 > 없음 > 어미`: `505`
  - `미분류 > 없음 > 명사`: `480`
- sample rows:
  - `시디롬` / `명사` / `미분류 > 고급 > 명사`
  - `과실 치사` / `품사 없음` / `미분류 > 고급 > 품사 없음`
  - `가지치기하다` / `동사` / `미분류 > 고급 > 동사`
- user가 느낀 `품사 > 난이도`가 더 직관적인지 검토할 필요는 있지만, current runtime truth는 분명히 `난이도 > 품사` ordering이다.

### E. `미분류` tangled signal도 단일 문제가 아니다.

- `품사 없음`이 `3,423`으로 가장 크다.
- `명사` `2,614`, `동사` `1,135`도 큰 비중을 차지한다.
- 즉 learner에게는 `문법/형태 항목 fallback`과 `content-like but uncategorized fallback`이 함께 섞여 보일 가능성이 높다.
- 이는 `MM3-154`의 deep scenario 해석과 맞지만, current runtime tree에서는 이 차이가 ordering/path만으로는 충분히 드러나지 않는다.

### F. wording conflict도 별도 evidence class로 남겨야 한다.

- current runtime/internal surface는 여전히 raw/internal wording을 함께 쓴다.
  - `주제 및 상황 범주`
  - `미분류`
- accepted learner-facing wording은 이미 별도로 존재한다.
  - `주제 및 상황`
  - `상황 미지정`
  - `일반 어휘`
  - `분류 밖 항목`
  - `문법/형태 항목`
  - `분류 미기재 어휘`
- 따라서 current residual은 구조 문제만이 아니라, surface별 wording layer가 분리되지 않아 생기는 cross-surface wording conflict도 포함한다.
- screenshot pain point도 tree panel path와 canvas perception이 함께 만든 것이므로, wording/no-wording policy를 canvas까지 포함해 다뤄야 한다.

## Residual Class Draft

- `S-1 Situation label duplication`
- `S-2 Situation parent isolation`
- `S-3 Situation wording conflict`
- `U-1 Unclassified ordering readability`
- `U-2 Unclassified mixed cohort semantics`
- `U-3 Unclassified wording conflict`

## PM Interpretation

- `주제 및 상황` residual은 `label duplication`과 `display isolation`을 separate class로 다뤄야 한다.
- `미분류` residual은 `ordering readability`와 `mixed cohort semantics`를 separate class로 다뤄야 한다.
- 따라서 W1 downstream output은 최소 `situation semantics note`와 `unclassified semantics note` 두 갈래로 유지하는 편이 안전하다.

## Next Step

- `MM3-172C` terminology baseline draft

## Revision History

- `R1` / `2026-03-24 23:53 KST` / `Codex PM` / situation/unclassified tree residual을 runtime path와 screenshot 기준으로 evidence note로 정리
