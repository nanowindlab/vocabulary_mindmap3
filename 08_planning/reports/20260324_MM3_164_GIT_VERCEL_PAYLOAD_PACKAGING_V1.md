# 20260324_MM3_164_GIT_VERCEL_PAYLOAD_PACKAGING_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-24 23:20 KST`

## Last Updated By

- `Codex PM`

## Scope

- git / Vercel payload packaging

## Problem

- `09_app/public/data/live/*.json`는 runtime에는 필요하지만 파일 크기가 너무 커서 git push와 Vercel 연동에 직접 부담이 된다.
- 대표 위험 파일:
  - `APP_READY_DETAIL_MAP.json` 약 `234MB`
  - `APP_READY_SEARCH_INDEX.json` 약 `125MB`
  - `APP_READY_MEANING_TREE.json` 약 `109MB`

## PM Decision

- `live/*.json`는 git에서 제외한다.
- 대신 deploy용 압축 payload를 git에 추적한다.
  - `09_app/public/data/internal/runtime_payloads/*.json.gz`
- build 전에 압축 payload를 `live/`로 복원한다.
- root repo를 Vercel에 연결해도 동작하도록 `vercel.json`으로 install/build/output을 고정한다.

## Applied

- `.gitignore`
  - `09_app/public/data/live/*.json` 제외
  - `node_modules`, `dist`, test artifacts 제외
- deploy payload directory 추가
  - `09_app/public/data/internal/runtime_payloads/`
- restore script 추가
  - `09_app/scripts/prepare-live-payloads.mjs`
- package script 추가
  - `09_app/scripts/package-live-payloads.mjs`
- verify script 추가
  - `09_app/scripts/verify-runtime-payloads.mjs`
- runtime payload manifest 추가
  - `09_app/public/data/internal/runtime_payloads/MANIFEST.json`
- app build chain 연결
  - `09_app/package.json`
  - `package:live`
  - `prepare:live`
  - `verify:live`
  - `prebuild`
- repo root Vercel config 추가
  - `vercel.json`

## Deploy Artifact Sizes

- `APP_READY_DETAIL_MAP.json.gz` 약 `33MB`
- `APP_READY_SEARCH_INDEX.json.gz` 약 `19MB`
- `APP_READY_MEANING_TREE.json.gz` 약 `16MB`
- 전체 deploy payload 묶음 약 `75MB`

## Verification

- `npm run package:live && npm run build` 통과
- `prepare:live -> verify:live -> build` 체인 통과
- `live/*.json`는 git ignore 적용 확인

## Deploy Pipeline

### Workflow 1. Package

1. `npm run package:live`
2. `live/*.json`를 `runtime_payloads/*.json.gz`로 압축
3. `MANIFEST.json` 갱신

### Workflow 2. Restore

1. `npm run prepare:live`
2. `runtime_payloads/*.json.gz`를 `live/*.json`로 복원

### Workflow 3. Verify

1. `npm run verify:live`
2. manifest / compressed payload / restored live payload 존재 확인

### Workflow 4. Build

1. `npm run build`
2. Vite build

## Operational Note

- 현재는 `runtime_payloads/*.json.gz`를 source-of-deploy로 둔다.
- 장기적으로는 `kcenter_thin_index.json.gz`, `kcenter_facet_payload.json.gz`, `kcenter_base.json.gz`에서 `live/`를 직접 생성하는 canonical generator를 project 안에 복구하는 편이 더 좋다.

## PM Verdict

- `ACCEPT`

## Next Active Work

- `MM3-096 Human Pilot Scheduling / Execution`

## Revision History

- `R1` / `2026-03-24 23:05 KST` / `Codex PM` / git push blocker 완화와 Vercel build packaging 정책을 최초 고정
- `R2` / `2026-03-24 23:20 KST` / `Codex PM` / package/verify workflow와 manifest 기반 deploy pipeline을 추가
