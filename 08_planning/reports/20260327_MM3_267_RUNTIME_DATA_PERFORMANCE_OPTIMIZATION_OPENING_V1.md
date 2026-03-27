# 20260327_MM3_267_RUNTIME_DATA_PERFORMANCE_OPTIMIZATION_OPENING_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-27 17:13 KST`

## Last Updated By

- `Codex PM`

## Scope

- open `MM3-267` runtime data performance optimization task

## Goal

- `LFS`/storage 문제와 분리해, app runtime의 느린 초기 로딩과 반복 클릭 시 간헐적 프리징을 `data structure / loading behavior` 기준으로 개선할 next task를 준비한다.

## Explicit Constraint

- 지금 단계는 storage/LFS 결정을 실행하는 단계가 아니다.
- 먼저 runtime behavior 문제를 bounded execution task로 정리한다.

## Inputs

- `08_planning/reports/20260325_MM3_171_RUNTIME_PERFORMANCE_PAYLOAD_SPLIT_AUDIT_NOTE_V1.md`
- `08_planning/reports/20260327_MM3_266A_PAYLOAD_WEIGHT_AND_DUPLICATION_AUDIT_V1.md`
- `09_app/src/App.jsx`
- `09_app/src/data/loaderAdapter.js`
- `09_app/src/components/MindmapCanvas.jsx`

## Runtime Evidence Snapshot

### 1. initial boot은 `MM3-171` 시점보다 좁아졌지만 아직 light boot는 아니다.

- `App.jsx` init path는 현재 `APP_READY_SEARCH_INDEX.json`과 `APP_READY_FACETS.json`만 `Promise.all`로 먼저 읽는다.
- current live bytes:
  - `APP_READY_SEARCH_INDEX.json`: `181,733,540`
  - `APP_READY_FACETS.json`: `4,114`
- current live row baseline:
  - search index: `53,012`
  - meaning tree: `44,410`
  - situation tree: `6,399`
  - unclassified tree: `8,506`
- 즉 `MM3-171`의 `search + 3 tree upfront` 구조는 일부 해소됐지만, search index 단독으로도 여전히 heavy boot payload다.

### 2. default tab이 `meaning`이라 first paint 직후 meaning tree가 사실상 자동 로드된다.

- `activeTab` default가 `meaning`이고, init 종료 직후 deferred tab effect가 meaning tree를 바로 fetch/normalize한다.
- current live `APP_READY_MEANING_TREE.json`는 `160,435,724` bytes다.
- 결과적으로 user는 `search index boot` 뒤에 `meaning tree fetch + normalize + setState` cost를 거의 같은 session opening 안에서 체감한다.

### 3. 반복 클릭 프리징 후보는 detail fallback보다 `chunk refetch/reparse` 쪽이 더 강하다.

- current search index `53,012 / 53,012` rows 모두 `chunk_id`를 가진다.
- `handleSelectTerm()`은 term 선택마다 `loadTermDetailChunk(term.id, term.chunk_id)`를 호출한다.
- `loadTermDetailChunk()`는 in-memory parsed chunk cache가 없어서 같은 chunk를 다시 눌러도 `RICH` chunk를 다시 fetch/parse한다.
- current chunk baseline:
  - `APP_READY_CHUNK_RICH_*`: `107 files`, total `402,787,701` bytes
  - `APP_READY_CHUNK_EXAMPLES_*`: `107 files`, total `148,078,614` bytes
  - largest rich chunk: `5,902,999` bytes
  - largest examples chunk: `3,472,522` bytes
- 반복 클릭이나 같은 category 안에서 연속 term navigation이 있을 때 network/cache hit 여부와 무관하게 parse churn은 계속 남는다.

### 4. interaction cost는 loader cost와 별개로 canvas redraw에서 다시 발생할 수 있다.

- `activeTree`는 `filteredList` 기준으로 다시 만들어진다.
- `MindmapCanvas`는 draw마다 `flattenTree()` 후 `d3.forceSimulation()`을 새로 만든다.
- category expand 시 term 노드는 최대 `240`개까지 열릴 수 있다.
- 따라서 체감 프리징은 `detail chunk load`와 `canvas redraw/simulation`이 겹치는 순간 더 크게 보일 가능성이 높다.

## Framing Decision

- current task는 storage/LFS migration이 아니라 runtime-facing `load timing / parse churn / redraw cost`를 줄이는 execution task로 고정한다.
- current bottleneck은 아래 두 축으로 분리한다:
  - `Boot/Tab Load`: search index boot + immediate meaning tree load
  - `Interaction`: repeated chunk fetch/parse + category expansion redraw
- first tranche는 storage layout 재설계보다 먼저, 현재 runtime contract 안에서 줄일 수 있는 `loading behavior`와 `cache behavior`를 다룬다.

## Bounded Problem Statement

- user-visible initial load는 아직 `search index`와 `meaning tree`가 같은 opening window 안에서 연달아 큰 cost를 만든다.
- repeated term selection은 chunk-level cache 부재 때문에 같은 chunk를 다시 fetch/parse하며, detail open latency를 누적시킨다.
- category expansion은 loader와 별개로 `tree rebuild + force simulation` 비용을 다시 발생시켜 interaction freeze로 체감될 수 있다.
- 따라서 `MM3-267`는 runtime payload 자체의 저장 형태가 아니라, current payload를 어떻게 늦게 읽고, 덜 다시 파싱하고, 더 좁게 그릴지의 문제로 다룬다.

## First Execution Tranche

### Tranche Name

- `T1 Loader/Caching Hardening`

### Objective

- storage/LFS decision 없이 current runtime contract 안에서 first-load와 repeated detail-open 체감을 줄일 첫 bounded execution slice를 고정한다.

### In Scope

- default meaning tree auto-load behavior를 explicit intent 또는 delayed stage로 미루는 방안 검토/적용
- `chunk_id` 기준 parsed chunk cache 추가
- detail open / chunk load / category expand timing probe 추가
- first improvement target을 `initial boot`, `first meaning open`, `same-chunk repeat click`으로 고정

### Out Of Scope

- `LFS` 도입 여부
- tracked artifact/storage layer 재구성
- canonical seed/full snapshot deduplication
- runtime payload shard layout redesign
- `APP_READY_DETAIL_MAP` 제거/재설계 같은 broader architecture migration

### Expected Code Touch

- `09_app/src/App.jsx`
- `09_app/src/data/loaderAdapter.js`
- `09_app/src/components/MindmapCanvas.jsx`

## Verification Plan

### Measurement Windows

1. app boot: `init start -> payloadsReady -> firstStableRender`
2. default meaning open: `meaning fetch start -> normalize done -> tab ready`
3. detail open: `term select -> chunk payload ready -> detail state patched`
4. repeated click: `same chunk second open` vs `first open`
5. category expand: `category click -> first stable canvas after draw`

### Before/After Checks

- initial boot snapshot console output
- meaning tab first-open timing snapshot
- same chunk repeated term open latency comparison
- category expansion latency on dense category
- regression guard: search/select/detail rendering parity 유지

### Acceptance Signal

- first paint 이전 mandatory payload scope가 늘어나지 않는다.
- meaning tree load가 boot critical path에서 분리되거나, 동일 path 안에 남더라도 timing evidence상 clearly bounded된다.
- same-chunk repeat selection에서 redundant fetch/parse가 제거되거나 유의미하게 감소한다.
- category expansion freeze 원인이 loader인지 draw인지 구분 가능한 probe output이 남는다.

## PM Verdict

- `MM3-267` opening 자체는 유지하되, `runtime problem framing + first tranche definition`까지 이번 revision에서 고정한다.
- next substep은 `T1 Loader/Caching Hardening` execution prep과 measurement hook lock이다.

## Expected Output

- runtime performance framing note
- first execution tranche definition
- verification plan
- execution-prep code touch boundary

## Revision History

- `R2` / `2026-03-27 17:13 KST` / `Codex PM` / current runtime evidence를 반영해 boot/interaction bottleneck을 재구성하고 first tranche와 verification plan을 고정
- `R1` / `2026-03-27 18:05 KST` / `Codex PM` / runtime data performance optimization next-task opening을 고정
