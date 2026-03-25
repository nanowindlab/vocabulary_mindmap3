# 20260326_MM3_215_FRONTEND_SHELL_ADAPTATION_PLANNING_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 07:54 KST`

## Last Updated By

- `Codex PM`

## Scope

- `PARK-003 frontend shell adaptation` planning

## Plain-Language Summary

- 지금 앱은 `mindmap2` shell을 옮겨 온 baseline이다.
- 데이터는 더 풍부해졌는데, 바깥 화면 구조는 그 richness를 아직 충분히 못 살린다.
- 이번 문서의 목적은 “무엇을 어떻게 바꿀지”를 사람이 읽고 바로 이해할 수 있게 정리하는 것이다.

## Current Problems In Plain Korean

### 1. 중요한 정보가 탭 안쪽에 너무 많이 숨어 있다.

- `의미 선택`, `예문`, `의미 관계`, `활용 표현`이 모두 detail panel 안쪽 탭 이동을 요구한다.
- 사용자는 단어를 눌렀을 때 “이 단어를 어디부터 봐야 하는지”를 즉시 파악하기 어렵다.

### 2. 검색/필터/상세의 위계가 약하다.

- search, filters, tree, detail가 모두 한 번에 보이지만 각 영역의 우선순위가 분명하지 않다.
- 특히 desktop에서는 “현재 내가 어디를 보고 있는가”보다 “무엇을 다 볼 수 있는가”가 먼저 보인다.

### 3. 현재 shell은 `rich data`보다 `thin browsing`에 더 가깝다.

- `mindmap3`는 sense, examples, related forms, expressions가 richer한데,
- 현재 shell은 이를 본격적으로 탐색하기보다 탭 전환으로 밀어 넣는 구조다.

### 4. 큰 화면과 작은 화면의 역할 분리가 명확하지 않다.

- desktop에서는 list/detail을 더 적극적으로 동시에 보여 줄 수 있고,
- 좁은 화면에서는 pane 전환이 더 분명해야 한다.
- 현재는 그 차이가 구조적으로 충분히 드러나지 않는다.

## External Research Summary

### A. List-detail은 큰 화면과 작은 화면에서 다르게 동작해야 한다.

- Android adaptive guidance는 list-detail 패턴에서
  - 큰 화면: list pane + detail pane를 나란히 두고
  - 작은 화면: 한 번에 한 pane만 보여 주는 것을 권장한다.
- source:
  - [Android Developers: Build a list-detail layout](https://developer.android.com/develop/ui/compose/layouts/adaptive/list-detail)

### B. 큰 화면에서는 navigation을 숨기지 말고, 위치를 분명히 보여 주는 편이 좋다.

- Nielsen Norman Group checklist는 larger screens에서 visible navigation을 쓰고,
- application local navigation은 left side에 두며,
- current location을 시각적으로 표시하라고 권장한다.
- source:
  - [NNG Menu Design Checklist PDF](https://media.nngroup.com/media/articles/attachments/PDF_Menu-Design-Checklist.pdf)

### C. 큰 화면에서도 search는 항상 눈에 띄어야 한다.

- NNG iPad usability report는 큰 화면에서 visible search box가 중요하고,
- 화면 아래 tab bar는 잘 안 보일 수 있다고 지적한다.
- source:
  - [NNG Usability of iPad Apps and Websites PDF](https://media.nngroup.com/media/reports/free/iPad_App_and_Website_Usability_1st_Edition.pdf)

### D. facet은 query context에 따라 더 똑똑하게 보일 수 있다.

- Algolia overview는 facet이 static일 수도 있지만 dynamic하게 query context에 따라 바뀔 수 있다고 설명한다.
- 즉 모든 filter를 항상 같은 강도로 노출할 필요는 없다.
- source:
  - [Algolia: Faceted Search Overview](https://www.algolia.com/blog/ux/faceted-search-an-overview)

### E. Material adaptive guidance는 fixed layout보다 canonical layout + breakpoint adaptation을 권장한다.

- Material guidance는 mobile-to-large-screen 적응에서 canonical layouts와 flexible breakpoints를 권장한다.
- source:
  - [Material Adaptive Layout Guidance](https://developer.android.com/codelabs/adaptive-material-guidance)

## What To Review Item By Item

### 1. Search / Filter Zone

- 지금:
  - filter panel이 열리면 정보량이 많고, 중요 filter와 덜 중요한 filter가 같은 강도로 보인다.
- 바꿀 방향:
  - desktop에서는 `search + primary filters`를 항상 보이게 유지
  - secondary filters는 펼침 형태로 내린다
- concrete items:
  - `Band`, `품사`는 primary
  - `번역 언어`, `난이도`는 secondary 또는 contextual
  - active filter chips와 clear-all은 더 눈에 띄게

### 2. Tree / List / Detail Layout

- 지금:
  - tree, main pane, detail pane가 있지만 역할 분리가 약하다.
- 바꿀 방향:
  - wide desktop에서는 `navigation/tree + main exploration + detail` 3영역을 분명히 둔다
  - medium width에서는 `main + detail` 2영역
  - narrow width에서는 detail을 overlay/drawer처럼 분리

### 3. Detail Panel Information Order

- 지금:
  - core definition을 본 뒤에야 sense switch, examples, relations, expressions를 찾아 들어간다.
- 바꿀 방향:
  - title 아래에 `sense selector`를 더 앞쪽으로 올린다
  - selected sense 기준 `example preview` 1~2개를 core에 일부 노출한다
  - relation / expression은 tab 안에만 두지 말고 요약 count와 대표 preview를 core에 둔다

### 4. Tab Strategy

- 지금:
  - 탭을 눌러야만 다음 layer가 보인다.
- 바꿀 방향:
  - 탭은 유지하되, “완전 분리된 방”이 아니라 “확장 상세 영역”처럼 쓴다
  - core에서 preview를 먼저 보여 주고, 탭은 full view 역할로 쓴다

### 5. Search Result Card

- 지금:
  - 검색 결과는 의미와 번역은 보여 주지만, rich-data affordance는 더 넣을 수 있다.
- 바꿀 방향:
  - `sense count`, `has related forms`, `has expressions`, `Band` 같은 useful metadata를 더 잘 드러낸다
  - 단, jargon은 피한다

### 6. Unavailable Data Handling

- 지금:
  - 일부 relation target은 source absence 또는 unresolved 상태다.
- 바꿀 방향:
  - broken jump 대신 “연결 대상 없음”처럼 plain-language status를 일관되게 표시한다
  - data truth를 숨기지 않는다

## Proposed Options

### Option A. Minimal Shell Polish

- search/filter visibility만 정리
- detail panel order는 크게 안 건드림
- 장점:
  - 구현비용이 낮다
- 단점:
  - `mindmap3` rich data 활용 개선 폭이 작다

### Option B. Recommended: MM3-Rich Moderate Adaptation

- search/filter 우선순위 재배치
- list/detail adaptive pane 정리
- detail panel에서 sense/examples/relations preview 강화
- tabs는 유지하되 full view 역할로 축소
- 장점:
  - 현재 구조를 부수지 않고도 data utility를 올릴 수 있다
- 단점:
  - layout, copy, test 범위가 중간 정도로 커진다

### Option C. Large Shell Redesign

- shell navigation과 pane structure를 더 크게 재설계
- detail panel과 main exploration의 역할도 다시 쪼갠다
- 장점:
  - 가장 큰 UX 개선 가능
- 단점:
  - 범위가 커서 현재 phase와 충돌할 수 있다

## PM Recommendation

- `Option B`가 맞다.

이유:

- current app는 이미 usable baseline이다.
- 지금 필요한 건 full redesign이 아니라 rich data를 더 잘 쓰게 만드는 구조 개선이다.
- `Option B`는 현재 IA와 test baseline을 버리지 않으면서도 user-visible utility를 올릴 수 있다.

## Concrete Deliverables If Approved

1. `shell adaptation scope doc`
2. `responsive pane behavior spec`
3. `detail panel information order spec`
4. `search result metadata spec`
5. `filter priority / disclosure spec`
6. `updated implementation checklist`

## Explicit Non-Goals

- taxonomy 변경
- TOPIK stats policy 변경
- source absence synthetic repair
- full visual redesign

## Approval Question In Plain Korean

- 현재 shell을 완전히 갈아엎지 않고,
- `search/filter 우선순위`, `adaptive pane`, `detail panel 정보 배치`, `preview 강화` 수준으로
- `Option B` 범위의 shell adaptation planning/implementation을 진행해도 되는가?

