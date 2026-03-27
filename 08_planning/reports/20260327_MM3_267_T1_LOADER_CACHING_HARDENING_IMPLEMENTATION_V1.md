# 20260327_MM3_267_T1_LOADER_CACHING_HARDENING_IMPLEMENTATION_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-27 19:01 KST`

## Last Updated By

- `Codex PM`

## Scope

- execute `MM3-267 / T1 Loader/Caching Hardening`

## Environment Note

- actual learner-facing runtime는 local file access가 아니라 `git push -> Vercel static asset fetch` 기준으로 동작한다.
- 이번 tranche는 repo storage/LFS가 아니라 deployed browser의 `fetch / json parse / cache reuse / interaction timing`에 직접 영향을 주는 코드만 다뤘다.

## Target

- `09_app/src/App.jsx`
- `09_app/src/data/loaderAdapter.js`
- `09_app/src/components/MindmapCanvas.jsx`
- `09_app/tests/smoke.spec.js`

## Implemented

### 1. default meaning tab load를 `idle + hard-timeout` kickoff로 조정

- init 이후 default `meaning` tab은 바로 fetch하지 않고 `requestIdleCallback` 기준으로 먼저 미룬다.
- 단, `requestIdleCallback`이 늦어지거나 background/headless에서 안 잡히는 경우를 막기 위해 hard timeout fallback도 같이 둔다.
- user가 tab click이나 search jump로 명시적으로 `meaning`을 요구하면 queued 상태를 즉시 승격해 바로 load한다.
- 목적은 first shell과 heavy tree fetch를 분리하되, deployed browser에서도 무한 대기 없이 predictable하게 tree load가 시작되게 만드는 것이다.

### 2. `chunk_id` 기준 parsed chunk cache와 in-flight dedupe 추가

- `RICH`/`EXAMPLES` chunk를 per-chunk memory cache로 유지한다.
- 같은 chunk를 다시 여는 경우 fetch/parse를 반복하지 않는다.
- 같은 chunk에 대해 동시에 여러 요청이 들어와도 in-flight promise를 공유한다.
- examples chunk `404`도 chunk 단위로 기억해 unnecessary re-fetch를 막는다.
- 목적은 repeated term click과 same-chunk navigation에서 deployed browser parse churn을 줄이는 것이다.

### 3. runtime interaction probe 추가

- `window.__MM3_RUNTIME_INTERACTION_PERF__` snapshot을 추가했다.
- opt-in perf console에서는 아래 이벤트를 남긴다.
  - tab load
  - detail selection
  - category expansion
- detail selection probe에는 `chunk_id`, `sameChunkAsPrevious`, chunk trace가 포함된다.
- category expansion probe에는 `totalMs`, `nodeCount`, `linkCount`, `renderedTermCount`가 포함된다.

### 4. smoke guard를 current runtime contract에 맞게 보정

- relation smoke는 current live payload 기준으로 실제 존재하는 related-form jump를 사용하도록 바꿨다.
- tree smoke는 deferred tab load 이후 explicit tab intent를 주는 방식으로 guard를 맞췄다.
- 이 수정은 app behavior regression을 가리는 것이 아니라, stale payload assumption과 current defer contract 불일치를 정리한 것이다.

### 5. tree runtime을 `searchIndex -> tab projection`으로 전환

- current symptom 기준 가장 큰 blocker는 `APP_READY_MEANING_TREE.json` `160MB` 추가 fetch였다.
- runtime은 이제 `meaning/situation/unclassified` tree payload를 직접 fetch하지 않는다.
- 대신 already-loaded `APP_READY_SEARCH_INDEX`에서 `categories` 기준으로 tab membership을 다시 계산한다.
- `meaning`: `의미 범주` category projection 기준 `44,410`
- `situation`: `주제 및 상황 범주` category projection 기준 `6,399`
- `unclassified`: neither category 기준 `8,506`
- 이 방식은 current user-facing count를 유지하면서 extra tree network fetch를 제거한다.
- `APP_READY_*_TREE.json`는 validator/build-side artifact로는 남아 있지만 app runtime read path에서는 빠진다.

## Verification

- command:
  - `npm run build`
- result:
  - `passed`
- command:
  - `npx playwright test tests/smoke.spec.js tests/scenario.spec.js`
- result:
  - `5 passed`
- command:
  - production custom domain `Playwright` probe
- result:
  - custom domain shell render 확인
  - runtime data `200` 확인
  - Safari user symptom 기준 추가 tree fetch 제거 필요성 확인

## Additional Task Opened

- `MM3-267B` `Vercel` deployed runtime perf verification: `TODO`
- 이유:
  - actual environment가 `git push -> Vercel`이므로 local validation만으로는 network transfer/compression/cache header 체감을 확정할 수 없다.
  - next step은 deployed URL에서 before/after probe와 user-facing interaction timing을 캡처하는 것이다.
- `MM3-266F` `APP_READY_*` runtime payload repartition design: `TODO`
- 이유:
  - current question scope와 사용자의 follow-up은 `APP_READY_SEARCH_INDEX`, `APP_READY_*_TREE`, detail/example chunk를 어떤 access pattern으로 다시 나눌지 별도 설계가 필요하다.
  - 이 일감은 current runtime hardening과 분리해 data layout redesign packet으로 다루는 편이 검증과 rollback이 명확하다.

## PM Verdict

- `T1 Loader/Caching Hardening` local implementation은 `PARTIAL_ACCEPT`다.
- current symptom을 직접 겨냥한 `searchIndex -> tab projection` runtime path를 추가했다.
- local build/test는 통과했지만, updated production deployment recheck는 아직 남아 있다.

## Next Step

- current branch를 push하고 updated production deployment에서 `meaning` tab loading persistence가 실제로 해소됐는지 재확인한다.

## Revision History

- `R2` / `2026-03-27 19:01 KST` / `Codex PM` / current production symptom을 반영해 tree runtime을 `searchIndex` tab projection으로 전환하고 large tree fetch bypass를 추가
- `R1` / `2026-03-27 17:30 KST` / `Codex PM` / `MM3-267 / T1 Loader/Caching Hardening` local implementation, local verification, deployed follow-up task opening을 고정
