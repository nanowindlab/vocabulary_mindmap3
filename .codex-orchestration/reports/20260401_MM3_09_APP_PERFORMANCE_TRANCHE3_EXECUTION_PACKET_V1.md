# 20260401_MM3_09_APP_PERFORMANCE_TRANCHE3_EXECUTION_PACKET_V1

## Current Revision

- `R1`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

## Tranche

- `T3`

## 목적

- first screen에서 실제 term row 전체 대신 `meaning tree shell`만 eager load하도록 바꿔 초기 진입 payload를 줄인다.

## 범위

- `APP_READY_MEANING_TREE_SHELL.json` 생성 및 package/publish 대상 포함
- app initial load를 meaning shell eager + full payload background load 구조로 변경
- filter panel default closed
- `prepare:live(local)`가 local bundle manifest + gzip contract를 따르도록 수정
- first-screen Playwright smoke 추가

## 제외

- hashed payload naming
- immutable cache policy 문서화
- list virtualization
- tree virtualization

## 영향 파일

- `09_app/src/utils/tabProjection.js`
- `09_app/scripts/rebuild-canonical-runtime.mjs`
- `09_app/scripts/package-live-payloads.mjs`
- `09_app/scripts/runtime-bundle-core.mjs`
- `09_app/scripts/prepare-live-payloads.mjs`
- `09_app/src/data/loaderAdapter.js`
- `09_app/src/App.jsx`
- `09_app/scripts/measure-first-screen-payload.mjs`
- `09_app/playwright.config.mjs`
- `09_app/tests/first-screen-shell.spec.js`
- `09_app/tests/mindmap-navigation.spec.js`
- `09_app/test-contracts/prepare-live-local-contract.test.mjs`

## 구현 요약

- meaning tab initial render에 필요한 tree structure/count만 가진 `APP_READY_MEANING_TREE_SHELL.json`를 추가했다.
- app initial load는 shell payload 하나만 eager로 읽고, full meaning tree / search thin / facet / translation manifest는 background로 넘겼다.
- filter panel을 기본 collapsed로 바꿔 first-screen에 즉시 필요한 control surface만 남겼다.
- `prepare:live(local)`는 이제 `internal/runtime_payloads/MANIFEST.json`를 읽고 각 `.json.gz`를 풀어 `live/`로 복원한다.
- Playwright로 first-screen shell 및 search-selected mindmap navigation 회귀를 함께 고정했다.
- `T2 + T3` 상태를 `R2`에 republish했고, remote restore build까지 다시 통과했다.

## 완료 기준

- first screen eager payload 수와 bytes가 감소한다.
- first screen에서 empty state 없이 meaning tree shell이 보인다.
- local build와 remote restore build가 모두 통과한다.
- search-selected mindmap navigation 회귀가 없다.

## Local Verification

- payload regenerate:
  - `npm --prefix 09_app run rebuild:canonical-runtime -- --skip-package --skip-verify`
- runtime package:
  - `node 09_app/scripts/package-live-payloads.mjs`
- first-screen payload measure:
  - `node 09_app/scripts/measure-first-screen-payload.mjs`
- local contract:
  - `npm --prefix 09_app run test:contracts`
- Playwright regression:
  - `npx playwright test tests/first-screen-shell.spec.js tests/mindmap-navigation.spec.js --reporter=line`
- local build:
  - `MM3_RUNTIME_PAYLOAD_SOURCE=local npm --prefix 09_app run build`

## Deploy-Target Verification

- `R2` republish:
  - `npm --prefix 09_app run publish:r2-runtime`
- public manifest spot-check:
  - `curl -sS https://mm3-runtime-gateway.nanowind.workers.dev/runtime-bundle-manifest.json`
- remote restore build:
  - `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`

## Before / After

- eager payload contract before
  - files: `APP_READY_MEANING_TREE.json` + `APP_READY_FACETS.json` + `APP_READY_TRANSLATION_LANGUAGES.json`
  - count: `3`
  - total bytes: `63,050,840`
- eager payload contract after
  - files: `APP_READY_MEANING_TREE_SHELL.json`
  - count: `1`
  - total bytes: `38,262`
- delta
  - saved bytes: `63,012,578`
  - reduction: `99.94%`
  - payload count reduction: `2`

## 결과 판단

- `P3/T3` 범위는 local과 deploy-target 둘 다 닫혔다.
- public runtime bundle manifest는 `generated_at=2026-04-01T00:31:02.684Z`, `fileCount=233` 상태다.
- shell payload가 public manifest에 포함되고 remote restore build도 `PASS`했다.
- first-screen shell smoke + search-selected mindmap navigation regression은 Playwright `4 passed`였다.
- `prepare:live(local)` contract fix도 같은 턴에 test와 build로 닫혔다.

## Next Unlock

- `P4 runtime cache and naming strategy`를 `shell/thin/full` 다층 payload 기준으로 연다.

## Reference

- tasklist:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
- risk note:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`
- local state:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`

## Revision History

- `R1` / `2026-04-01 KST` / `MM_09_APP_PM` / tranche 3 execution packet 생성
