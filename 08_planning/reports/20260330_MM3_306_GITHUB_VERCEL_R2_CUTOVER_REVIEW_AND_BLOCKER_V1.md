# 20260330_MM3_306_GITHUB_VERCEL_R2_CUTOVER_REVIEW_AND_BLOCKER_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-30 13:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- current `GitHub -> Vercel -> app build` chain audit
- `R2`-based cutover simulation
- actual execution blocker confirmation

## Goal

- current deploy chain을 artifact 기준으로 다시 확인한다.
- large-file pressure를 줄이는 `R2` cutover shape를 simulation으로 검토한다.
- process가 안전하면 actual regeneration / commit / upload로 넘어갈 준비 상태를 고정한다.

## Evidence

- `vercel.json`
- `.vercel/project.json`
- `09_app/package.json`
- `09_app/scripts/prepare-live-payloads.mjs`
- `09_app/scripts/package-live-payloads.mjs`
- `09_app/scripts/verify-runtime-payloads.mjs`
- `09_app/src/data/loaderAdapter.js`
- `09_app/dist/data`
- `git count-objects -vH`
- `git ls-files` tracked size scan
- `Vercel` project/deployment/build logs
- `wrangler whoami`
- `wrangler r2 bucket list`

## Current Chain Audit

### 1. current auto deploy rule

- current `Vercel` project `vocabulary-mindmap3`는 `GitHub main push -> production deployment`로 실제 동작 중이다.
- recent evidence:
  - commit `864e954`
  - deployment `dpl_3t9vqZAX6ZfYd8eR8yjhBA8cv18d`
  - state `READY`

### 2. current build entry

- root `vercel.json`은 아래로 고정돼 있다.
  - install: `npm --prefix 09_app install`
  - build: `npm --prefix 09_app run build`
  - output: `09_app/dist`

### 3. current payload source

- current build는 `09_app/public/data/internal/runtime_payloads/*.json.gz`를 build input으로 사용한다.
- `prepare:live`가 `runtime_payloads/*.json.gz -> public/data/live/*.json` 복원을 수행한다.
- app runtime은 `live/*.json`만 fetch한다.

### 4. current storage cost

- current tracked git pack:
  - `size-pack: 997.51 MiB`
  - `size: 1.03 GiB`
- recent `Vercel` build log:
  - clone completed `56.095s`
- current deployment output duplication:
  - `09_app/dist/data/live`: `1269.00 MB`
  - `09_app/dist/data/internal/runtime_payloads`: `151.28 MB`

### 5. current waste candidates

- build/deploy에 불필요한 duplicate:
  - `09_app/public/data/internal/runtime_payloads/**`
- current repo tracked waste:
  - `10_relation_app/node_modules/**` tracked `6265` files
  - `10_relation_app/dist/**` tracked
  - `vocab_dictionary/output/unified_live/*.json` raw large files tracked
  - old rollback snapshot large artifact tracked

## Simulation Review

### Verdict 1. `GitHub push -> Vercel auto build`는 이미 동작한다.

- 별도 manual `vercel build`는 필수 deployment step이 아니라 preflight check다.
- 현재 linked project 기준 main push만으로 production deployment가 생성된다.

### Verdict 2. `100MB 초과 파일만 R2`로 보내는 mixed split은 이 프로젝트에서 부족하다.

- reason:
  - current app build/runtime는 top-level payload만이 아니라 chunk bundle 전체 completeness를 요구한다.
  - `APP_READY_CHUNK_RICH_*`, `APP_READY_CHUNK_EXAMPLES_*`, `CHUNK_MANIFEST_V1`이 함께 맞아야 한다.
  - 일부만 `R2`, 일부만 git tracked raw/json 또는 gz로 남기면 restore/verify/source-of-truth가 다시 갈라질 가능성이 높다.

### Verdict 3. safe cutover unit은 `full build-side runtime bundle`이다.

- current tranche recommendation:
  - build input 전체를 `R2` bundle로 이동
  - git에는 code / small manifest / config만 유지
  - build 전에 `R2`에서 `live/*.json`를 restore
  - current app runtime contract는 일단 유지

### Verdict 4. current `public/data/internal/runtime_payloads`는 deploy surface에서 제거해야 한다.

- reason:
  - app runtime이 직접 사용하지 않는다.
  - 현재 deployment output에 `151.28 MB` duplicate를 추가한다.
  - `R2` cutover가 열리면 `public/` 아래에 둘 이유가 사라진다.

### Verdict 5. `R2` source는 public test endpoint보다 stable endpoint가 더 적합하다.

- `r2.dev`는 test 성격이 강하고 production 기준 권장 경로가 아니다.
- therefore preferred target:
  - public custom domain attached bucket
  - 또는 authenticated private bucket + build-time secret
- current repo/automation simplicity를 보면 first cut은 `public custom domain or equivalent stable public endpoint`가 더 단순하다.

## Actual Blocker

- `wrangler whoami`: `PASS`
- `wrangler r2 bucket list`: `FAIL`
- error:
  - `Please enable R2 through the Cloudflare Dashboard. [code: 10042]`

즉 현재 account에서는 `R2` 자체가 아직 활성화되지 않았다.

## PM Decision

- current turn에서는 actual cutover execution을 시작하지 않는다.
- 먼저 `Cloudflare R2 enablement`를 unblock해야 한다.
- unblock 후 first actual execution unit은 아래 순서로 연다.

## Next Unlock Sequence

1. `Cloudflare Dashboard`에서 `R2` enable
2. runtime bucket 생성
3. clean canonical regeneration
4. full build-side runtime bundle upload
5. `prepare:live`를 local gz restore에서 `R2` restore로 전환
6. `public/data/internal/runtime_payloads` deploy duplicate 제거
7. local build/verify
8. commit/push
9. `Vercel` auto deployment verification

## User Question Resolution

### `Vercel`은 자동으로 빌드되겠지?

- yes.
- current linked `GitHub` project 기준 main push만으로 auto deployment가 생성된다.
- 별도 step은 아래 둘뿐이다.
  - preflight용 local `vercel build`는 optional
  - `R2`/custom-domain/env one-time setup은 initial cutover 때만 필요

## PM Verdict

- current review verdict: `PARTIAL_ACCEPT_WITH_BLOCKER`
- process direction은 맞다.
- actual execution은 `R2 enablement` 전까지 blocked다.
