# LOADER_VERIFY_AGENT_WORKBOARD_V1

## Agent

- Role: `consumer loader wiring verification lane`
- Owner: `LOADER_VERIFY_AGENT`
- Task ID: `MM3-038`
- Status: `DONE`
- Output Report: `.codex-orchestration/reports/MM3-038_LOADER_WIRING_VERIFICATION_V1.md`

## Scope

- 새 `thin index`와 `facet payload`가 현재 소비 경로와 어떻게 연결되는지 확인한다.

## Required Deliverable

- 현재 loader가 어떤 파일을 읽는지
- `thin index`/`facet payload` 연결 여부
- 미연결 지점
- 다음 조치 제안
- reflection

## Working Rules

- 한국어 작성
- 구현 지시/코드 변경 금지
- read-only verification 우선

## Verification Result

- `09_app/src/data/loaderAdapter.js` 기준 현재 loader는 `APP_READY_SITUATIONS_TREE.json`, `APP_READY_EXPRESSIONS_TREE.json`, `APP_READY_BASICS_TREE.json`, `APP_READY_SEARCH_INDEX.json`과 `CHUNK_RICH / CHUNK_EXAMPLES`만 읽는다.
- `vocab_dictionary/output/unified_live/kcenter_thin_index.json.gz`와 `vocab_dictionary/output/unified_live/kcenter_facet_payload.json.gz`는 존재하지만, 현재 consumer 경로와는 아직 연결되지 않았다.
- 미연결 지점은 `09_app/public/data/live/` 런타임 표면과 `loaderAdapter.js` import/fetch 경로 전반이다.
- 상세 내용은 `.codex-orchestration/reports/MM3-038_LOADER_WIRING_VERIFICATION_V1.md`에 기록했다.
