# Data Layout

- `live/`: app runtime canonical files currently fetched by the frontend.
- `internal/`: build/rebuild helpers and canonical support files not fetched by the app directly.
- `legacy/`: previous-generation app payloads kept for comparison or recovery.
- `archive/`: obsolete backups and fully retired payloads.

Current frontend runtime should only depend on files under `live/`.

Current MM3 live additions:

- `APP_READY_SEARCH_INDEX.json`: MM3 thin-index 기반 검색 표면
- `APP_READY_FACETS.json`: MM3 facet payload 기반 필터 표면
- `APP_READY_MEANING_TREE.json`: MM3 의미 범주 트리 표면
- `APP_READY_SITUATION_TREE.json`: MM3 주제 및 상황 범주 트리 표면
- `APP_READY_UNCLASSIFIED_TREE.json`: MM3 미분류 트리 표면

Additional note:

- `internal/` may contain richer canonical support files for rebuild and validation
- example: `RELATION_GRAPH_CANONICAL_V1.json`
- `internal/` is not a runtime fetch source; learner-facing runtime still depends on `live/` thin projection
