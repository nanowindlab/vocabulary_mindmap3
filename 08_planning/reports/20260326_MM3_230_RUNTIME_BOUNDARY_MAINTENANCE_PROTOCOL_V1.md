# 20260326_MM3_230_RUNTIME_BOUNDARY_MAINTENANCE_PROTOCOL_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 13:03 KST`

## Last Updated By

- `Codex PM`

## Scope

- operating protocol for `MM3-229 Runtime Boundary Maintenance`

## Default Rule

- `npm run check:authoritative-runtime-boundary`는 **계속 유지**한다.
- 다만 모든 턴마다 무조건 돌리는 것은 아니다.

## Must Run

- 아래 변경이 있으면 반드시 실행한다.
  - `09_app/scripts/` 아래 runtime builder / package / prepare / verify / diff 관련 수정
  - `APP_READY_SEARCH_INDEX` semantic fields 생성 규칙 변경
  - `APP_READY_FACETS` 생성 규칙 변경
  - `runtime_payloads/*.json.gz` packaging 경로 수정
  - authoritative switch / rollback 실행 직후

## May Skip

- 아래는 생략 가능하다.
  - PM 문서만 수정한 턴
  - screenshot / guide / handoff 문구 수정만 있는 턴
  - runtime search/facets와 무관한 read-only 조사 턴

## Rollback Trigger

- `npm run diff:authoritative-runtime`가 `FAIL`
- `npm run build`가 authoritative boundary 변경 후 실패
- current learner-facing search/facet semantics mismatch가 확인될 때
- runtime boundary change가 user-facing regression으로 확인될 때

## Reopen Trigger

- `MM3-226A` canonical `chunk_id` mapping이 다시 필요해질 때
- detail/chunk routing drift가 actual issue로 관찰될 때
- broader runtime parity가 release acceptance에 다시 포함될 때

## PM Verdict

- `ACCEPT`
- `MAINTENANCE_PROTOCOL_LOCKED`

## Revision History

- `R1` / `2026-03-26 13:03 KST` / `Codex PM` / runtime boundary maintenance protocol과 gate/rollback/reopen rule을 최초 고정
