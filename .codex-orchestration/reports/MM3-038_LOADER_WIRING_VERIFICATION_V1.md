# MM3-038_LOADER_WIRING_VERIFICATION_V1

## 검증 범위

- 대상 로더: [09_app/src/data/loaderAdapter.js](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/src/data/loaderAdapter.js)
- 대상 앱: [09_app/src/App.jsx](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/src/App.jsx)
- 대상 런타임 문서: [09_app/README.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/README.md)
- 대상 런타임 데이터 설명: [09_app/public/data/README.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/public/data/README.md)
- 대상 산출물: [kcenter_thin_index.json.gz](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_thin_index.json.gz), [kcenter_facet_payload.json.gz](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_facet_payload.json.gz)

## 현재 loader가 읽는 파일

- `loadSituationsTree()` -> `09_app/public/data/live/APP_READY_SITUATIONS_TREE.json`
- `loadExpressionsTree()` -> `09_app/public/data/live/APP_READY_EXPRESSIONS_TREE.json`
- `loadBasicsTree()` -> `09_app/public/data/live/APP_READY_BASICS_TREE.json`
- `loadUnifiedSearchIndex()` -> `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- fallback `loadSearchIndex()` -> `09_app/public/data/legacy/APP_READY_SEARCH_INDEX_V1.json`
- `loadCoreManifest()` -> `09_app/public/data/legacy/APP_READY_CORE_TREE_V1.json`
- `loadMetaManifest()` -> `09_app/public/data/legacy/APP_READY_META_TREE_V1.json`
- `loadExpressionManifest()` -> `09_app/public/data/legacy/APP_READY_EXPRESSION_TREE_V1.json`
- `loadEnglishMapping()` -> `09_app/public/data/live/ENGLISH_MAPPING_INVENTORY_V1.json`
- `loadTermDetailChunk()` -> `09_app/public/data/live/APP_READY_CHUNK_RICH_{chunkId}.json` 및 `09_app/public/data/live/APP_READY_CHUNK_EXAMPLES_{chunkId}.json`

## thin index / facet payload 연결 여부

- `thin index`와 `facet payload`는 생성되어 있다.
- `kcenter_thin_index.json.gz`는 top-level `schema_version`, `generated_at`, `entry_count`, `entries` 구조이며 `entries` 길이는 `53,480`이다.
- `kcenter_facet_payload.json.gz`는 top-level `schema_version`, `generated_at`, `entry_count`, `facets` 구조이며 `facets`는 `학습난이도`, `TOPIK`, `품사`, `외국어 종류` 4개다.
- 그러나 현재 `09_app/src/data/loaderAdapter.js`와 `09_app/src/App.jsx`에는 두 파일을 읽는 경로가 없다.
- 따라서 현재 consumer 기준으로는 `thin index`/`facet payload`가 아직 연결되지 않았다.

## 미연결 지점

- `09_app/public/data/live/`에는 현재 `APP_READY_*` 파일만 있고 `kcenter_thin_index.json.gz`와 `kcenter_facet_payload.json.gz`에 대응하는 런타임 파일이 없다.
- `09_app/public/data/README.md`는 frontend가 `live/` 파일만 의존한다고 적고 있지만, 그 `live/` 표면 안에 새 payload 입구가 없다.
- `09_app/src/App.jsx`는 검색 인덱스를 `searchIndex` 배열로만 관리하고, 필터는 local state `bands / levels / poses / query`로만 처리한다.
- `facet payload`의 `selected`와 `options` 구조를 소비하는 코드가 없다.

## 다음 조치 제안

- 다음 검증에서는 `thin index`와 `facet payload`가 `09_app/public/data/live/`로 실제 배치되는지 먼저 확인해야 한다.
- 배치가 확인되면 `loaderAdapter.js`가 그 새 경로를 읽는지, 그리고 `App.jsx`가 검색/필터 상태를 그 payload에서 초기화하는지 재검증해야 한다.
- 배치가 없다면 현재 결과는 runtime wiring 미완료로 유지하는 것이 맞다.

## Reflection

- 산출물 자체는 계약에 맞게 존재하지만, runtime consumer는 여전히 이전 `APP_READY_*` 표면에 머물러 있다.
- 이번 검증에서 중요한 점은 payload 생성 성공이 아니라 소비 입구 부재를 확인하는 것이었다.
- 따라서 현재 상태는 artifact ready, consumer not wired 로 정리하는 것이 가장 정확하다.
