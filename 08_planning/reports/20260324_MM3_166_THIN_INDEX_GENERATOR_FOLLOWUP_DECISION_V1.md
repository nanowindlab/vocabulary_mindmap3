# 20260324_MM3_166_THIN_INDEX_GENERATOR_FOLLOWUP_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 23:38 KST`

## Last Updated By

- `Codex PM`

## Scope

- runtime thin-index generator follow-up decision

## Facts

- 현재 deploy/runtime 복원 경로는 아래로 동작한다.
  - tracked deploy payload:
    - `09_app/public/data/internal/runtime_payloads/*.json.gz`
  - restore script:
    - `09_app/scripts/prepare-live-payloads.mjs`
  - verification/build chain:
    - `prepare:live -> verify:live -> build`
- `MM3-160` 시점에도 `APP_READY_SEARCH_INDEX`를 source thin-index 기준으로 생성하는 canonical generator 경로는 repo 안에서 즉시 드러나지 않았다.
- 현재 repo 안에는 `live/*.json` restore/package/verify 흐름은 있지만, `kcenter_thin_index.json.gz` / `kcenter_facet_payload.json.gz` / `kcenter_base.json.gz`에서 `APP_READY_*`를 재생성하는 project-local canonical generator는 명시적으로 복구되지 않았다.

## PM Decision

- canonical thin-index generator recovery / documentation은 `MM3-096`의 blocker로 두지 않는다.
- 현재 active work는 그대로 `MM3-096 Human Pilot Scheduling / Execution`을 유지한다.
- generator recovery는 별도 parked follow-up으로 기록한다.
- 현재 runtime/deploy truth는 아래로 고정한다.
  - `runtime_payloads/*.json.gz`
  - `prepare:live`
  - `verify:live`
  - `build`

## Why

- refreshed runtime 기준 human pilot를 다시 여는 데 필요한 품질/배포 baseline은 이미 확보됐다.
- generator 경로 복구는 재현성 측면에서는 중요하지만, 지금 당장 human pilot scheduling을 다시 막아야 할 증거는 없다.
- launch readiness보다 완성도 개선 우선 원칙에서도, 현재는 사람 기준 pilot execution을 다시 여는 쪽이 우선순위가 더 높다.

## Reopen Trigger

- source refresh 이후 runtime 재생성이 반복적으로 수작업 repair/packaging에 의존할 때
- source-to-runtime 재현성이 acceptance gate로 다시 필요해질 때
- deploy payload와 canonical source 사이 drift가 다시 의심될 때

## PM Verdict

- `ACCEPT`

## Next Active Work

- `MM3-096 Human Pilot Scheduling / Execution`

## Revision History

- `R1` / `2026-03-24 23:38 KST` / `Codex PM` / runtime thin-index generator recovery를 parked follow-up으로 분리하고 현재 deploy/runtime truth를 고정
