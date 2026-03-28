# 20260325_MM3_171_RUNTIME_PERFORMANCE_PAYLOAD_SPLIT_AUDIT_NOTE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 00:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-171A` runtime performance / payload split audit

## Evidence

- app init load:
  - `09_app/src/App.jsx:346`
- detail chunk load:
  - `09_app/src/App.jsx:448`
  - `09_app/src/data/loaderAdapter.js:121`
- runtime loader paths:
  - `09_app/src/data/loaderAdapter.js:26`
- build/package/prepare chain:
  - `09_app/package.json`
  - `09_app/scripts/prepare-live-payloads.mjs`
- canvas render path:
  - `09_app/src/components/MindmapCanvas.jsx:42`
  - `09_app/src/components/MindmapCanvas.jsx:163`

## Findings

### 1. local delay의 1차 후보는 초기 대용량 payload 동시 로드다.

- app init에서 아래 파일을 `Promise.all`로 동시에 읽는다.
  - `APP_READY_SEARCH_INDEX.json` `131,862,909`
  - `APP_READY_MEANING_TREE.json` `115,023,841`
  - `APP_READY_SITUATION_TREE.json` `30,351,467`
  - `APP_READY_UNCLASSIFIED_TREE.json` `19,744,181`
  - `APP_READY_FACETS.json` `4,113`
- 합계 약 `296.99MB`다.
- 그 직후 전건 `normalizeItem()`이 다시 돈다.

### 2. `runtime_payloads` 체인은 배포/복구 최적화이지 런타임 지연 해결책은 아니다.

- `prepare:live`는 `.json.gz`를 `live/*.json`으로 복원한다.
- 브라우저는 결국 inflate된 `live/*.json`을 읽는다.
- 따라서 local 체감 지연은 build/package 체인만으로는 줄지 않는다.

### 3. detail은 이미 일부 split돼 있지만 search/tree는 아직 upfront load다.

- search index row `53,480` 전건에 `chunk_id`가 붙어 있다.
- rich chunk는 `107개`다.
- `APP_READY_DETAIL_MAP.json`은 `245,842,330` bytes로 매우 크지만 정상 경로에서는 기본 로드가 아니다.
- 즉 1차 병목은 detail map보다 `search + 3 tree` upfront load일 가능성이 높다.

### 4. detail open 경로에는 작은 낭비가 남아 있다.

- `loadTermDetailChunk()`는 `RICH`와 `EXAMPLES` chunk를 항상 같이 fetch한다.
- 현재 `APP_READY_CHUNK_EXAMPLES_*`는 `live/`, `runtime_payloads/` 모두 `0개`다.
- 큰 병목은 아니어도 반복 fetch 낭비는 남아 있다.

### 5. render 병목 후보도 별개로 존재한다.

- `MindmapCanvas`는 category expansion 시 term 수 제한 없이 모두 노출한다.
- draw마다 D3 force simulation을 새로 돈다.
- 따라서 large payload init 외에도 `dense category expansion`에서는 render 병목이 따로 생길 수 있다.

## Counts

- meaning rows: `44,410`
- situation rows: `11,355`
- unclassified rows: `8,506`
- search rows: `53,480`

## Split Candidates

- `Candidate A`
  - search/tree lazy load
- `Candidate B`
  - thinner search-head + secondary resolve payload
- `Candidate C`
  - missing examples chunk conditional fetch
- `Candidate D`
  - canvas density control

## Payload vs Render Distinction

- payload 병목 신호:
  - `fetch + json parse + normalize` 구간이 크다
  - 초기 진입에서 특히 심하다
- render 병목 신호:
  - 데이터가 올라온 뒤 특정 category expansion / zoom / drag에서 심하다
  - canvas draw/simulation 구간이 크다

## Suggested Measurement Windows

1. `fetch start -> response received`
2. `response received -> json parse done`
3. `json parse done -> normalize/setState done`
4. `setState done -> first stable render`

## PM Interpretation

- current local delay의 가장 강한 1차 원인은 `초기 대용량 JSON 동시 로드 + 전건 normalize`다.
- 2차 원인은 `MindmapCanvas` dense expansion / force simulation일 가능성이 높다.
- `prepare/live/package` 체인을 손보는 것만으로는 런타임 지연을 해결할 수 없다.

## W2 Output

- `runtime payload bottleneck note`
- `render bottleneck candidate note`
- `payload split candidate list`
- `measurement window proposal`

## Next For `R2`

- lazy load와 search-head thinning 중 무엇이 먼저인지 우선순위 결정 필요
- missing examples chunk fetch를 quick cleanup으로 바로 제거할지 판단 필요

## Revision History

- `R1` / `2026-03-25 00:10 KST` / `Codex PM` / runtime performance와 payload split audit 결과를 초기 load, detail fetch, canvas render 기준으로 정리
