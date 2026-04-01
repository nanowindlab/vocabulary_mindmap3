# 20260401_MM3_09_APP_PERFORMANCE_TRANCHE5_EXECUTION_PACKET_V1

## Current Revision

- `R1`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

## Tranche

- `T5`

## 목적

- large list interaction path의 blocking cost를 낮추기 위해 list row DOM 수를 bounded window로 제한한다.

## 범위

- list view virtualization 도입
- selected term auto-scroll 유지
- Playwright로 virtualization window bound + scroll swap 검증

## 제외

- tree virtualization
- worker parse
- 추가 runtime payload 변경

## 영향 파일

- `09_app/src/App.jsx`
- `09_app/tests/list-virtualization.spec.js`

## 구현 요약

- list view는 전체 `list.map(...)` 대신 fixed-height window virtualization으로 바뀌었다.
- scroll viewport 기준으로 필요한 slice만 렌더하고, 위/아래 spacer로 전체 scroll height를 유지한다.
- selected term이 window 밖으로 나가면 list scroll이 해당 row 근처로 이동한다.
- virtualization window 상태는 `data-rendered-count`, `data-total-count`로 노출해 regression을 쉽게 확인할 수 있다.

## 완료 기준

- large list에서 DOM row 수가 bounded 된다.
- scroll 후 visible row set이 교체된다.
- first-screen shell / mindmap navigation regression이 깨지지 않는다.
- build가 깨지지 않는다.

## Local Verification

- Playwright regression:
  - `npx playwright test tests/first-screen-shell.spec.js tests/mindmap-navigation.spec.js tests/list-virtualization.spec.js --reporter=line`
- local build:
  - `./node_modules/.bin/vite build`

## Before / After

- meaning list total rows
  - `44,410`
- list view rendered rows before scroll
  - `16`
- list view rendered rows after scroll
  - `16`
- scroll change sample
  - first row id before: `9471`
  - first row id after: `13983`

## 결과 판단

- `P5/T5` 범위는 local 기준으로 달성됐다.
- list virtualization smoke와 기존 first-screen / mindmap navigation regression을 합쳐 `5 passed`였다.
- performance tasklist `P0`~`P5`는 모두 완료 상태다.

## Next Unlock

- performance optimization package는 closeout 가능하다.
- 다음 active package는 `09_app git boundary cleanup`과 commit grouping 결정이다.

## Reference

- tasklist:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
- local state:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`

## Revision History

- `R1` / `2026-04-01 KST` / `MM_09_APP_PM` / tranche 5 execution packet 생성
