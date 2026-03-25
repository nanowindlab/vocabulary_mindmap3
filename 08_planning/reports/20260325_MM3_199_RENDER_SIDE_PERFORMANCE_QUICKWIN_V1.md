# 20260325_MM3_199_RENDER_SIDE_PERFORMANCE_QUICKWIN_V1

## Current Revision

- `R7`

## Last Updated

- `2026-03-26 07:54 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-171B` render-side performance quick win

## Target

- `09_app/src/components/MindmapCanvas.jsx`
- `09_app/src/App.jsx`
- `09_app/src/data/loaderAdapter.js`

## Problem

- current canvas path는 `selectedTermId`가 바뀔 때마다 `draw()` 전체가 다시 돌았다.
- 이 경로는 node/link rebuild, force simulation 재시작, zoom group 재생성을 포함해 selection highlight 비용에 비해 지나치게 무거웠다.
- initial-load 쪽에서는 `APP_READY_SEARCH_INDEX`가 여전히 전건 `normalizeItem()` 경로를 타고 있어 packet `R4` 설명과 actual runtime이 일치하지 않았다.
- first-stable-render 기준 measurement window도 아직 런타임에서 바로 확인할 수 없었다.
- `search index raw init keep` 이후에도 default meaning tab이 `APP_READY_MEANING_TREE` fetch/parse/normalize를 init path에서 바로 먹고 있어 shell render가 가장 큰 tree payload와 계속 묶여 있었다.

## Implemented

### 1. Selection-only redraw split

- selection highlight를 full redraw에서 분리했다.
- graph redraw dependency에서 `selectedTermId`를 제거했다.
- node fill / text / selection ring / band ring을 selection-only update effect에서 다시 칠하도록 바꿨다.

### 2. Dense category expansion cap

- expanded category에서 term node를 무제한 렌더하지 않도록 cap을 걸었다.
- current cap:
  - `240`
- selected term는 cap 밖에 있어도 강제로 포함되게 처리했다.
- ordering은 `band -> rank -> label` 우선으로 안정화했다.

### 3. Tree build redundant normalize 제거

- `App.jsx`에서 이미 normalized된 list를 tree build 시 다시 `normalizeItem()` 하지 않도록 바꿨다.
- `리스트` 뷰일 때는 mindmap tree 자체를 만들지 않도록 분기했다.

### 4. Search index upfront normalize 제거

- packet `R4`의 intended change와 달리 `App.jsx` init 경로가 여전히 search index 전건 `normalizeItem()`을 돌고 있었다.
- 이번 revision에서 init 시 `APP_READY_SEARCH_INDEX`를 raw로 유지하고 `idxMap`만 만들도록 actual runtime을 바로잡았다.
- learner-facing hierarchy path는 `SearchBox`에서 상위 노출 result에 대해서만 lazily 계산한다.

### 5. Initial-load instrumentation baseline

- loader layer에서 payload별 `fetch` / `json parse` 시간을 opt-in trace로 수집할 수 있게 했다.
- app init 시 아래 measurement window를 `window.__MM3_INITIAL_LOAD_PERF__`로 노출한다.
  - payloads ready
  - search index map build
  - meaning tree normalize
  - state queued
  - first stable render
- console output은 아래 중 하나일 때만 켠다.
  - `DEV`
  - `?mm3Perf=1`
  - `localStorage.MM3_PERF_DEBUG=1`

### 6. Meaning tree deferred initial load

- init path에서는 `APP_READY_SEARCH_INDEX`와 `APP_READY_FACETS`만 먼저 준비하고 첫 shell render를 연다.
- default `meaning` tab의 tree fetch/normalize는 tab-level deferred load로 내려 initial shell과 분리했다.
- active tab이 아직 준비되지 않았을 때는 main pane과 sidebar에 loading state를 표시해 empty state와 구분되게 했다.
- perf snapshot에는 `deferredTabs.meaning`을 추가해 `meaning tree` ready 시점과 row count를 함께 남긴다.

## Expected Effect

- 같은 tree/expanded state에서 단어 선택만 바뀔 때
  - full graph rebuild를 피한다
  - force simulation 재시작을 피한다
  - selection response가 더 가벼워진다
- 매우 큰 category expansion에서는
  - node/link 수가 직접 줄어든다
  - force simulation cost가 낮아진다
- list-view 상태에서는 불필요한 tree build 비용을 피한다
- initial load에서 search index full normalize CPU를 피한다
- first stable render가 default `meaning tree` fetch/parse/normalize와 직접 묶이지 않게 된다
- next deeper split 후보를 blind guess가 아니라 measured baseline 기준으로 고를 수 있다

## Verification

- command:
  - `npm run build`
- result:
  - `passed`
- command:
  - `npx playwright test`
- result:
  - `39 passed`
- probe:
  - `/?mm3Perf=1`
- result:
  - `payloadsReadyMs = 1548.4`
  - `firstStableRenderMs = 1694.3`
  - `meaningNormalizeMs = 42.2`
  - `deferredTabs.meaning.readyMs = 3020.5`
  - `deferredTabs.meaning.rows = 44410`

## PM Verdict

- `CLOSEOUT_ACCEPTED`

## Remaining Performance Residue

- first stable render는 `search index + facet` 기준으로 앞당겨졌고, `meaning tree` cost는 deferred milestone로 분리됐다.
- deeper `search-head thinning` 또는 additional split은 별도 reopen 사유가 생길 때만 다시 연다.

## Next Step

- `MM3-171B`는 closeout한다.
- next active work는 user feedback follow-up `MM3-210`으로 이동한다.

## Revision History

- `R1` / `2026-03-25 22:10 KST` / `Codex PM` / selection-triggered full redraw 제거 quick win을 기록
- `R2` / `2026-03-25 22:10 KST` / `Codex PM` / dense category expansion cap과 selected-term inclusion quick win을 같은 task에 반영
- `R3` / `2026-03-25 22:10 KST` / `Codex PM` / tree build redundant normalize 제거와 list-view tree skip quick win을 같은 task에 반영
- `R4` / `2026-03-25 22:10 KST` / `Codex PM` / search-result lazy hierarchy display path 정리와 initial-load 쪽 intended follow-up을 packet에 반영
- `R5` / `2026-03-25 23:24 KST` / `Codex PM` / search index raw init keep를 actual runtime에 반영하고 initial-load instrumentation baseline을 추가
- `R6` / `2026-03-26 07:25 KST` / `Codex PM` / default meaning tree init load를 deferred path로 옮기고 post-defer perf snapshot과 `37 passed` 검증을 반영
- `R7` / `2026-03-26 07:54 KST` / `Codex PM` / `39 passed` 기준으로 `MM3-171B` quick-win threshold를 충족했다고 판단하고 closeout verdict를 반영
