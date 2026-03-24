# 20260324_MM3_039_CONSUMER_TARGET_CONTRACT_V1

## 목적

- 현재 MM2 기반 앱 shell이 어떤 새 payload를 언제 소비해야 하는지 최소 연결 목표를 고정한다.

## 현 상태

- 생성된 새 payload:
  - `kcenter_thin_index.json.gz`
  - `kcenter_facet_payload.json.gz`
- 현재 consumer는 여전히 `APP_READY_SITUATIONS_TREE.json`, `APP_READY_EXPRESSIONS_TREE.json`, `APP_READY_BASICS_TREE.json`, `APP_READY_SEARCH_INDEX.json`, `CHUNK_RICH/CHUNK_EXAMPLES`를 읽는다.

## 최소 연결 목표

### Target 1. Search Consumer

- `APP_READY_SEARCH_INDEX.json`를 새 `thin index` 기반으로 대체 또는 생성한다.
- 최소 필드:
  - `id`
  - `word`
  - `pos`
  - `def_ko`
  - `word_grade`
  - `categories` 요약
  - 대표 `translation` 요약

### Target 2. Filter Consumer

- 현재 하드코딩된 필터 옵션 대신 `facet payload`를 읽을 수 있게 한다.
- 최소 필터:
  - `학습난이도`
  - `TOPIK`
  - `품사`
  - `외국어 종류`

### Target 3. Keep-as-is Consumer

- 기존 `tree`, `detail chunk`는 당장 교체하지 않는다.
- 이유:
  - 현재 MM3의 상위 구조와 3축 구조는 MM2 shell과 아직 완전히 일치하지 않는다.
  - 검색/필터부터 연결하는 것이 범위가 가장 작다.

## 구현 원칙

- 1차는 `검색 + 필터`만 wiring
- 2차에서 `tree`
- 3차에서 `detail / expression`

## 범위 밖

- MM2 shell 전체 리팩터링
- 3축 재정의와 앱 구조 재편
- detail payload / expression payload까지 한 번에 연결

## PM 결론

- 다음 구현 단계는 `search + facet wiring`만 여는 것이 맞다.
