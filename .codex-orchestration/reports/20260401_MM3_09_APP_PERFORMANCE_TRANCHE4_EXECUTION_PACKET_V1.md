# 20260401_MM3_09_APP_PERFORMANCE_TRANCHE4_EXECUTION_PACKET_V1

## Current Revision

- `R1`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

## Tranche

- `T4`

## 목적

- `shell/thin/full` 다층 payload에 대해 hashed remote path와 manifest indirection을 도입해 cache invalidation 계약을 명확히 한다.

## 범위

- `runtime-bundle-manifest.json`를 `v2` contract로 승격
- 각 runtime payload의 `remote_path`를 content hash 기반 `immutable/*` 경로로 변경
- payload별 immutable cache-control, stable manifest cache-control 명시
- naming helper / contract test 추가
- `R2` republish와 remote restore build 재검증

## 제외

- browser-facing response header 실측
- gateway worker 자체 수정
- `P5 interaction cost reduction`

## 영향 파일

- `09_app/scripts/runtime-bundle-core.mjs`
- `09_app/scripts/publish-r2-runtime-bundle.mjs`
- `09_app/scripts/prepare-live-payloads.mjs`
- `09_app/test-contracts/runtime-bundle-naming-contract.test.mjs`

## 구현 요약

- stable pointer는 계속 `runtime-bundle-manifest.json` 하나만 유지한다.
- manifest `v2`는 `naming_strategy=content-addressed-immutable-v1`와 `manifest_cache_control`을 포함한다.
- 각 payload entry는 logical `file`와 hashed `remote_path`, `sha256`, `cache_control`을 함께 가진다.
- payload remote path는 `immutable/<logical>.<hash16>.json` 규칙을 따른다.
- `prepare-live-payloads.mjs`는 이미 `remote_path`를 따라가므로 restore path는 추가 수정 없이 새 contract를 따른다.
- local manifest contract test와 hashed naming helper test를 추가했다.

## 완료 기준

- public manifest가 hashed `remote_path`를 반환한다.
- remote restore build가 새 manifest `v2` 기준으로 통과한다.
- local contract test가 naming rule을 고정한다.

## Local Verification

- local contract:
  - `npm --prefix 09_app run test:contracts`
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

- before naming
  - manifest `v1`
  - `remote_path` = logical filename
  - payload cache policy는 manifest에 명시되지 않음
- after naming
  - manifest `v2`
  - `remote_path` = `immutable/<logical>.<hash16>.json`
  - payload cache policy = `public, max-age=31536000, immutable`
  - manifest cache policy = `public, max-age=0, must-revalidate`
- public manifest snapshot
  - `generated_at=2026-04-01T01:03:51.183Z`
  - `fileCount=233`

## 결과 판단

- `P4/T4` 범위는 local과 deploy-target 둘 다 닫혔다.
- public manifest에서 `v2`, `naming_strategy`, hashed `remote_path`, per-entry `cache_control`이 확인됐다.
- escalated remote restore build도 새 hash path 기준으로 `PASS`했다.
- direct logical payload URL은 더 이상 canonical contract가 아니다.
- canonical restore/read path는 stable manifest -> hashed `remote_path` indirection이다.

## Next Unlock

- `P5 interaction cost reduction`를 list virtualization / tree incremental render / worker parse 후보 기준으로 연다.

## Reference

- tasklist:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
- risk note:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`
- local state:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`

## Revision History

- `R1` / `2026-04-01 KST` / `MM_09_APP_PM` / tranche 4 execution packet 생성
