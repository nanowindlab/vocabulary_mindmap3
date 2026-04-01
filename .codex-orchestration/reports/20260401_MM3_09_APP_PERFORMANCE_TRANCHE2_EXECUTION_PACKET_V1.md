# 20260401_MM3_09_APP_PERFORMANCE_TRANCHE2_EXECUTION_PACKET_V1

## Current Revision

- `R1`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

## Tranche

- `T2`

## 목적

- search interaction path에서 사용하는 payload를 `search-only thin payload`로 분리해 footprint와 scan cost를 함께 낮춘다.

## 범위

- `APP_READY_SEARCH_THIN_INDEX.json` 생성
- app search loader가 thin payload를 우선 사용하도록 전환
- runtime bundle packaging/verification에 thin payload 포함
- thin/full payload size 및 sample query parity 측정 스크립트 추가

## 제외

- search prefix split
- first-screen eager payload 축소
- `R2` republish
- `prepare:live(local)` contract fix

## 영향 파일

- `09_app/scripts/runtime-search-recovery-core.mjs`
- `09_app/scripts/rebuild-canonical-runtime.mjs`
- `09_app/scripts/runtime-bundle-core.mjs`
- `09_app/scripts/package-live-payloads.mjs`
- `09_app/scripts/measure-search-thin-payload.mjs`
- `09_app/src/data/loaderAdapter.js`

## 구현 요약

- runtime rebuild 시 full search payload와 별도로 `APP_READY_SEARCH_THIN_INDEX.json`를 생성한다.
- thin payload는 `search`, `reference jump`, `search-select detail jump`에 필요한 최소 필드만 유지한다.
- thin payload는 compact JSON으로 써서 raw byte 절감폭을 실제 fetch path에 반영한다.
- app loader는 thin payload를 먼저 읽고, thin이 없으면 current full live search payload로 fallback한다.
- runtime bundle file list와 package manifest에 thin payload를 추가했다.
- payload footprint / sample query top-1 parity를 재확인할 수 있도록 `measure-search-thin-payload.mjs`를 추가했다.

## 완료 기준

- app search path가 thin payload를 우선 사용한다.
- thin payload가 runtime bundle verification 대상에 포함된다.
- size reduction과 sample query parity가 같은 턴 evidence로 남아 있다.
- local compile이 깨지지 않는다.

## Local Verification

- runtime regenerate:
  - `npm --prefix 09_app run rebuild:canonical-runtime -- --skip-package --skip-verify`
- runtime package:
  - `node 09_app/scripts/package-live-payloads.mjs`
- runtime verify:
  - `npm --prefix 09_app run verify:live`
- payload measure:
  - `node 09_app/scripts/measure-search-thin-payload.mjs`
- local compile smoke:
  - `cd 09_app && ./node_modules/.bin/vite build`

## Before / After

- `APP_READY_SEARCH_INDEX.json`
  - `69,740,763 bytes`
- `APP_READY_SEARCH_THIN_INDEX.json`
  - `40,337,031 bytes`
- saved bytes
  - `29,403,732 bytes`
  - `42.16%` reduction
- sample query benchmark
  - full payload: `99.49 ms`
  - thin payload: `71.32 ms`
- sample query top-1 parity
  - `요리하다` / `보다` / `가게` / `cook` 모두 full vs thin top-1 동일

## 결과 판단

- `T2` local scope는 달성됐다.
- thin-first search path와 fallback path가 동시에 고정됐다.
- local runtime bundle verify는 `PASS`였고 `fileCount=232`다.
- raw client compile은 `vite build` 기준 `PASS`였다.
- `MM3_RUNTIME_PAYLOAD_SOURCE=local npm --prefix 09_app run build`는 existing `prepare:live(local)` contract issue 때문에 여전히 실패한다.
- 이번 tranche에서는 `publish:r2-runtime`를 실행하지 않았으므로 public `R2` bundle은 pre-`T2` 상태다.

## Next Unlock

- `P3 first-screen payload reduction` 범위를 `meaning` first render 최소 eager payload 기준으로 연다.

## Reference

- tasklist:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
- risk note:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`
- local state:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`

## Revision History

- `R1` / `2026-04-01 KST` / `MM_09_APP_PM` / tranche 2 execution packet 생성
