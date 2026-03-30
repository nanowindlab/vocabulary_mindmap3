# 20260330_MM3_307_R2_READY_DEPLOY_CHAIN_AND_STORAGE_CLEANUP_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-30 13:30 KST`

## Last Updated By

- `Codex PM`

## Scope

- current repo/build chain을 `R2`-ready 상태로 정리한다
- immediate tracked/deploy waste를 제거한다
- actual `R2` upload path를 가능한 지점까지 실행한다

## Goal

- `09_app` build가 local `gz restore`에만 고정되지 않도록 `R2`-ready restore path를 추가한다.
- deployment output에 들어가는 불필요한 duplicate artifact를 줄인다.
- current repo에서 바로 제거 가능한 tracked waste를 정리한다.
- `R2` actual execution이 되면 clean regeneration / upload까지 이어간다.

## Expected Output

- updated build/deploy scripts
- updated ignore policy
- removed tracked waste where safe
- validation evidence
- exact remaining blocker if `R2` actual upload still cannot complete

## Applied

- `09_app/scripts/prepare-live-payloads.mjs`
  - `MM3_RUNTIME_PAYLOAD_SOURCE=r2` mode 추가
  - `MM3_RUNTIME_BUNDLE_BASE_URL` 기반 remote manifest + raw JSON restore 추가
- `09_app/scripts/runtime-bundle-core.mjs`
  - runtime bundle file set / chunk expansion / hash helper 공통화
- `09_app/scripts/publish-r2-runtime-bundle.mjs`
  - raw runtime bundle + manifest upload script 추가
- `09_app/scripts/prune-dist-runtime-files.mjs`
  - `dist/data/internal/runtime_payloads` 제거
  - `dist/data/live`에서 stale legacy/debug file 제거
- `09_app/package.json`
  - `publish:r2-runtime`, `prune:dist-runtime` 추가
  - `build` 뒤 dist prune 연결
- `.gitignore`
  - `10_relation_app/node_modules`
  - `10_relation_app/dist`
  - `10_relation_app.zip`
  - `.wrangler`
  - `tmp_reports/authoritative_runtime_rollbacks`
- tracked waste index cleanup
  - `10_relation_app/node_modules/**`
  - `10_relation_app/dist/**`
  - `tmp_reports/authoritative_runtime_rollbacks/**`

## Validation

### local current path

- `npm --prefix 09_app run build` `PASS`
- `dist/data/internal/runtime_payloads`: `151.28 MB -> 0.00 MB`
- `dist/data/live`: `1269.00 MB -> 861.42 MB`
- stale shipped files removed from `dist/data/live`
  - `APP_READY_BASICS_TREE.json`
  - `APP_READY_EXPRESSIONS_TREE.json`
  - `APP_READY_SITUATIONS_TREE.json`
  - `APP_READY_DETAIL_MAP.json`

### remote restore simulation

- local fixture server 기준
  - `MM3_RUNTIME_PAYLOAD_SOURCE=r2`
  - `MM3_RUNTIME_BUNDLE_BASE_URL=http://127.0.0.1:8877`
- sandbox 밖 재실행 기준
  - `npm --prefix 09_app run prepare:live` `PASS`
  - `npm --prefix 09_app run build` `PASS`

## Actual External Attempt

- `wrangler login` `PASS`
- `wrangler whoami` `PASS`
- `wrangler r2 bucket create vocabulary-mindmap3-runtime` `FAIL`

## Remaining Blocker

- `Cloudflare R2`가 current account에서 아직 enable되지 않았다.
- actual error:
  - `Please enable R2 through the Cloudflare Dashboard. [code: 10042]`

## PM Verdict

- local prep/workspace cleanup: `DONE`
- actual external cutover: `BLOCKED_ON_R2_ENABLEMENT`

## Revision History

- `R2` / `2026-03-30 13:30 KST` / `Codex PM` / `R2`-ready build chain, dist prune, tracked waste cleanup, remote restore simulation, actual bucket create failure까지 반영
- `R1` / `2026-03-30 13:20 KST` / `Codex PM` / implementation package opening
