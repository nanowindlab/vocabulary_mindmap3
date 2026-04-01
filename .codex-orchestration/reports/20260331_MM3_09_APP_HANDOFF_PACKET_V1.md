# 20260331_MM3_09_APP_HANDOFF_PACKET_V1

## Current Revision

- `R12`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

## Surface

- `09_app`

## Parent Coordination

- `Parent coordination id`: `MM3-COORD-20260331A`
- `Local child task id`: `MM3-COORD-20260331A-09`

## 목적

- current `09_app` runtime/deploy lane 기준으로 next PM이 바로 이어받을 수 있는 handoff packet을 남긴다.

## Current Truth

- active lane은 `09_app`
- default `GitHub -> Vercel` build target은 `09_app`
- current runtime bundle source는 `Cloudflare R2` bucket `vocabulary-mindmap3-runtime`
- current runtime restore gateway는 `https://mm3-runtime-gateway.nanowind.workers.dev`
- current build command는 `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`
- local search runtime path는 `APP_READY_SEARCH_THIN_INDEX.json` 우선, full live search payload fallback 기준이다
- first-screen eager runtime path는 `APP_READY_MEANING_TREE_SHELL.json` 기준이다
- deploy-target canonical restore path는 stable manifest -> hashed `remote_path` indirection 기준이다
- shared workspace를 쓰지만 current handoff package는 `09_app-only` continuation 기준으로 닫는다

## What Changed This Turn

- `T5` scope로 list virtualization을 도입했다.
- list view는 전체 row 대신 bounded window만 렌더한다.
- selected term이 viewport 밖에 있으면 list scroll이 해당 row 근처로 이동하도록 맞췄다.
- virtualization regression을 Playwright에 추가했다.
- performance optimization tasklist `P0`~`P5`를 모두 닫았다.

## Verified Evidence

- local contract:
  - `npm --prefix 09_app run test:contracts`
- local build:
  - `./node_modules/.bin/vite build`
- Playwright regression:
  - `npx playwright test tests/first-screen-shell.spec.js tests/mindmap-navigation.spec.js tests/list-virtualization.spec.js --reporter=line`

## Current Output Snapshot

- local runtime bundle verify:
  - `fileCount=233`
  - `PASS`
- list virtualization snapshot:
  - total rows: `44,410`
  - rendered rows before scroll: `16`
  - rendered rows after scroll: `16`
  - first row id before: `9471`
  - first row id after: `13983`
- Playwright regression:
  - `5 passed`

## Current Commit/Push Boundary

- boundary A `09_app runtime/perf core`
  - `09_app/scripts/package-live-payloads.mjs`
  - `09_app/scripts/prepare-live-payloads.mjs`
  - `09_app/scripts/publish-r2-runtime-bundle.mjs`
  - `09_app/scripts/rebuild-canonical-runtime.mjs`
  - `09_app/scripts/runtime-bundle-core.mjs`
  - `09_app/scripts/runtime-search-recovery-core.mjs`
  - `09_app/scripts/build-runtime-translation-overlays.mjs`
  - `09_app/scripts/measure-search-thin-payload.mjs`
  - `09_app/scripts/measure-first-screen-payload.mjs`
  - `09_app/src/App.jsx`
  - `09_app/src/data/loaderAdapter.js`
  - `09_app/src/utils/tabProjection.js`
  - `09_app/src/utils/translationPayloads.js`
- boundary B `mindmap bugfix + regression tests`
  - `09_app/src/components/MindmapCanvas.jsx`
  - `09_app/playwright.config.mjs`
  - `09_app/tests/**`
  - `09_app/test-contracts/**`
- boundary C `carry-forward app UI changes already in worktree`
  - `09_app/src/components/SearchBox.jsx`
  - `09_app/src/components/SidebarTree.jsx`
- boundary D `control-plane docs`
  - `.codex-orchestration/**`
- generated/no-commit
  - `09_app/test-results/`

## Shared Vs 09_App Scope

- `shared-only`
  - `SHARED_CURRENT_STATE_V1.md`
  - `HANDOFF_MESSAGE_TO_NEW_PM_V1.md`
  - deploy truth, parent coordination id, cross-app boundary only
- `09_app-only`
  - this packet
  - `09_APP_ACTIVE_LOCAL_STATE_V1.md`
  - `09_app/**`
  - performance optimization tasklist / tranche packet / risk note
- default no-go for this handoff
  - `10_relation_app/**`
  - `10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md`
  - other workspace project surfaces under `03_PRD/`, `05_sources/`, `06_data/`, `07_runtime/`, `08_planning/`, `docs/`, `tmp_reports/`, `vocab_dictionary/`

## Ownership And Attribution

- `10_relation_app PM`의 `09_app` 관찰은 first sanity check 목적의 read-only advisory로만 취급한다.
- `09_app` authoritative packet / blocker / acceptance / commit-push 판단은 `09_app PM` 또는 `Main PM`이 확정한다.
- branch `codex-09-app-runtime-boundary`에는 shared/control-plane doc-only commit/push가 이미 존재한다.
- 위 doc-only push는 `09_app` runtime acceptance push가 아니며, 현재 app-local push boundary를 열지 않는다.
- `09_app PM`의 `git` command 사용 범위는 `09_app/**`와 `09_app` lane packet/state docs로 제한한다.
- `09_app PM`은 `10_relation_app/**` 대상 `git` command와 상대 lane commit/push 판단용 `git` inspection을 수행하지 않는다.
- shared/root git action이 필요하면 `Main PM`으로 escalation한다.

## Build And Regeneration Policy

- local 개발/테스트 기본은 local build / local server 기준으로 진행한다.
- daily app build는 `R2 restore`만으로 닫는다.
- deploy-target build는 `R2 restore` 기준으로 닫는다.
- base runtime payload translation은 `영어`만 기본 포함한다.
- 비영어 translation은 언어별 overlay payload를 lazy load한다.
- `vocab_dictionary/`는 exceptional regeneration / repair 때만 수동으로 사용한다.
- `R2` regeneration은 app daily build와 분리된 별도 manual process다.

## Current Blocker

- `없음`

## Next Unlock Condition

- performance optimization package closeout과 commit grouping 결정을 고정

## Immediate Next Action

1. `09_app` continuation은 아래 4개 문서를 먼저 읽고 commit boundary A/B/C/D 중 어떤 단위로 commit할지 결정한다.
2. shared boundary 이슈가 없는 한 `10_relation_app`과 other workspace project surface는 읽지 않는다.
3. performance optimization package는 closeout 상태로 취급한다.
4. 필요하면 runtime/perf core와 bugfix/tests를 분리 commit 한다.

## Read Tier

- `Tier 1`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/SHARED_CURRENT_STATE_V1.md`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
- `Tier 2`
  - this packet
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_TRANCHE5_EXECUTION_PACKET_V1.md`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`
- `Tier 3`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1.md`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md` only when boundary verification이 필요할 때

## Revision History

- `R12` / `2026-04-01 KST` / `MM_09_APP_PM` / `T5` list virtualization closeout, optimization package complete, next active package를 `git boundary cleanup`으로 갱신
- `R11` / `2026-04-01 KST` / `MM_09_APP_PM` / `T4` hashed manifest contract closeout, public manifest `v2`, next unlock을 `P5` 기준으로 갱신
- `R10` / `2026-04-01 KST` / `MM_09_APP_PM` / `T3` first-screen shell closeout, `R2` republish+remote build pass, current commit boundary 재정리
- `R9` / `2026-04-01 KST` / `MM_09_APP_PM` / `T2` thin search payload closeout, local/public runtime truth 분리, next unlock을 `P3` 기준으로 갱신
- `R8` / `2026-04-01 KST` / `MM_09_APP_PM` / shared-only vs 09_app-only scope distinction, handoff read priority, default no-go workspace scope 반영
- `R7` / `2026-04-01 KST` / `MM_09_APP_PM` / performance optimization tasklist / tranche packet / risk note 포인터와 next action 반영
- `R6` / `2026-04-01 KST` / `MM_09_APP_PM` / 영어 기본 + 언어별 lazy translation overlay 구조와 payload split 반영
- `R5` / `2026-03-31 KST` / `MM_09_APP_PM` / canonical/live facets rebuild, R2 full republish, remote restore build pass로 runtime parity blocker 해제
- `R4` / `2026-03-31 KST` / `MM_09_APP_PM` / concrete updater label 정규화와 `09_app` lane git boundary 규칙 추가
- `R3` / `2026-03-31 KST` / `Codex PM` / cross-lane advisory status와 shared doc-only push 분리 규칙 추가
- `R2` / `2026-03-31 KST` / `Codex PM` / public gateway spot-check 결과 `APP_READY_FACETS.json` stale mismatch와 current `09_app` commit/push boundary audit 반영
- `R1` / `2026-03-31 KST` / `Codex PM` / initial handoff packet 작성
