# 20260327_MM3_260_TOP_ARCHITECTURE_THREE_EXPERT_REVIEW_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 10:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- user review wave 03
- top architecture functional/spatial review

## Question 1. category-level count task 의미

- 결론:
  - `새 task를 열면 된다`가 맞다.
  - 다만 단순 미구현이라서 바로 붙이면 되는 수준은 아니고,
    `count가 정확히 무엇을 뜻하는지`를 먼저 고정해야 한다.

### Why it is not just a one-line patch

1. `count semantics`를 먼저 정해야 한다.
- scene count처럼
  - direct child category count인지
  - 해당 category 아래 visible term 총합인지
  - filter 적용 후 count인지
  - category expansion cap 이후 count인지
정의가 필요하다.

2. filter alignment를 같이 봐야 한다.
- 현재 tree는 `filteredList` 기준으로 rebuild된다.
- 따라서 category count도 같은 filtered dataset을 기준으로 계산해야 일관된다.

3. situation tree와 연결돼 있다.
- `주제 및 상황`은 repeated child label 문제가 있어서
  count를 추가해도 redundancy가 그대로면 value가 제한적일 수 있다.

## Question 2. Top Architecture Three-Expert Review

### Expert 1. Functional PM Lens

- 현재 상단 4개 구역은
  - `MM3 Explorer`
  - `Current Surface`
  - `Interaction Controls`
  - `Tree Navigation / Explorer View`
  로 나뉘어 있다.

- 기능 관점 문제:
  - 현재 task에 바로 필요한 정보가 여러 strip로 분산돼 있다.
  - `Current Surface`와 `Explorer View`가 같은 상태를 중복 설명한다.
  - filter는 조작 surface인데 별도 full-width rail을 차지해 조작 대비 점유 비중이 크다.
  - search box와 result dropdown은 badge/context가 늘어나면서 핵심 headword 폭이 부족해진다.

### Expert 2. Information Architecture Lens

- 현재 구조는
  - global nav
  - context summary
  - controls
  - workspace header
  순으로 layer가 늘어나 있다.

- IA 관점 문제:
  - global state와 local state가 분리되지 않고 반복된다.
  - `의미 범주`라는 현재 축은 nav tab에도 있고, `Current Surface`에도 있고, `Explorer View`에도 있다.
  - left pane header와 right pane header가 같은 레벨인데 높이가 다르고 분리선도 어긋나서
    one-workspace로 읽히지 않는다.

### Expert 3. Visual Systems Lens

- 현재 surface는 전체적으로 정돈됐지만,
  상단 rail이 많아질수록 content canvas보다 chrome이 먼저 눈에 들어온다.

- visual 관점 문제:
  - 상단 strip들이 모두 card-like outline을 가져서 위계 차이가 약하다.
  - `Current Surface`는 미감상 안정적이지만,
    실제로는 `canvas 시작 전 여백`처럼 느껴질 수 있다.
  - split header line이 끊겨 보여 한 화면이 아니라 두 개의 카드가 붙은 것처럼 보인다.

## Shared Conclusion

- 현재 top architecture는 `깔끔하지만 practical density가 부족하다`.
- 핵심 문제는 미감이 아니라
  `상단 상태/설명 rail이 1개 많다`는 점이다.

## Improved Plan

### A. top architecture consolidation

- `Current Surface` strip은 제거 후보로 본다.
- 현재 축 정보는 아래 둘 중 하나로 흡수한다.
  - top nav active tab
  - `Explorer View` header

### B. controls compression

- `Interaction Controls`는 full-width strip 유지 여부를 다시 본다.
- 후보:
  - top nav 우측 inline controls
  - compact expandable tray

### C. split header unification

- `Tree Navigation`과 `Explorer View`는
  - 동일 height
  - 동일 baseline
  - 동일 divider line
로 맞춘다.

### D. search priority rule

- search result row에서는
  - headword
  - pos
  - essential discriminators
가 먼저다.
- default route badge는 계속 de-emphasize한다.

### E. detail practical reading rule

- `핵심 뜻`과 번역은 좌우 동등 분할보다
  `뜻 우선 / 번역 보조`
  원칙을 유지한다.
- 현재처럼 stacked layout이 기본 방향이다.
- 추가 follow-up은
  번역 box의 높이와 line-break rhythm 재검토 쪽이다.

## Task Output

- `MM3-260A` top architecture three-expert review: `DONE`
- `MM3-260B` top architecture improved plan lock: `DONE`
- `MM3-260C` detail core/translation practical reading re-review: `TODO`
- `MM3-261A` top architecture consolidation implementation tranche: `TODO`

## Revision History

- `R1` / `2026-03-27 10:10 KST` / `Codex PM` / category count semantics를 설명하고 top 4-strip architecture에 대한 three-expert review와 improved plan을 고정
