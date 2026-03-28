# 20260329_MM3_270_UNCLASSIFIED_TAB_REMOVAL_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 00:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- remove `분류 밖 항목` from main app navigation tabs
- keep search discoverability and search-to-detail route for unclassified entries

## Decision

- `분류 밖 항목`은 main app의 상시 browse tab에서 제외한다.
- search result에는 계속 노출한다.
- search/result로 `unclassified` entry를 열 때는 internal unclassified surface를 유지하되, default `viewMode`는 `list`로 둔다.

## Why

- tab으로 상시 노출해 수천 개 목록을 browse하게 만드는 이점이 현재 거의 없다.
- `분류 밖 항목`은 semantic mindmap의 동등 browse 축보다 fallback/list 성격이 더 강하다.
- 필요한 경우 search hit로는 계속 접근 가능해야 한다.

## Applied Change

- top navigation uses visible tabs:
  - `의미 범주`
  - `주제 및 상황`
- `분류 밖 항목` tab button removed from main nav
- internal `unclassified` route kept for search-driven access
- related residual tests updated

## Verification

- `npx playwright test tests/residual.spec.js -g "unclassified surface uses learner-facing label consistently|unclassified helper splits grammatical items from uncategorized vocabulary|unclassified search route defaults to list view"`
  - `3 passed`

## PM Verdict

- `ACCEPT`
- `UNCLASSIFIED_NAV_TAB_REMOVED`
- `SEARCH_ROUTE_PRESERVED`

## Next State

- current active execution package: `none`
- next directive arrives:
  - open a new task id

## Revision History

- `R1` / `2026-03-29 00:05 KST` / `Codex PM` / `분류 밖 항목` 상시 탭을 제거하고 search route 유지 상태로 closeout
