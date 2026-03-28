# 20260326_MM3_225_AUTHORITATIVE_RUNTIME_WRITE_PATH_ROLLBACK_DUAL_RUN_PROTOCOL_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 11:55 KST`

## Last Updated By

- `Codex PM`

## Scope

- define authoritative runtime write path
- define rollback path
- define dual-run diff gate
- verify dry-run without switching authoritative runtime truth

## Decision

- defining write/rollback/diff protocol itself does **not** require separate user approval.
- actual authoritative switch execution does require an explicit promotion verdict because it changes runtime truth.

## Added Commands

- `npm run plan:authoritative-runtime`
  - dry-run promotion plan
- `npm run diff:authoritative-runtime`
  - dual-run diff gate
- `npm run promote:authoritative-runtime:execute`
  - actual promotion command
- `npm run rollback:authoritative-runtime`
  - dry-run rollback check
- `npm run rollback:authoritative-runtime:execute`
  - actual rollback command

## Added Scripts

- `09_app/scripts/authoritative-runtime-promotion-core.mjs`
- `09_app/scripts/diff-authoritative-runtime-candidate.mjs`
- `09_app/scripts/promote-authoritative-runtime-candidate.mjs`
- `09_app/scripts/rollback-authoritative-runtime-candidate.mjs`

## Protocol

- write path:
  - build candidate from current local builder
  - write candidate into `tmp_reports/authoritative_runtime_promotions/<timestamp>/candidate`
  - on execute, back up current live search/facets and compressed search/facets metadata
  - on execute, write candidate into live search/facets
  - re-run package/verify
- rollback path:
  - restore backed up live search/facets
  - re-run package/verify
- dual-run diff:
  - compare current live runtime vs candidate
  - treat `search semantic fields + facets` as authority scope
  - keep `chunk_id` outside initial semantic authority gate

## Verification

- command:
  - `npm run plan:authoritative-runtime`
- result:
  - `PLAN_READY`
  - `dual_run_ready = true`
- command:
  - `npm run diff:authoritative-runtime`
- result:
  - `PASS`
- command:
  - `npm run rollback:authoritative-runtime`
- result:
  - `NO_ROLLBACK_FOUND`
  - no promotion has been executed yet
- command:
  - `npm run build`
- result:
  - `PASS`

## PM Verdict

- `ACCEPT`
- `WRITE_PATH_DEFINED`
- `ROLLBACK_DEFINED`
- `DUAL_RUN_DIFF_DEFINED`
- `NO_AUTHORITATIVE_SWITCH_EXECUTED`

## Next Active Work

- `MM3-217 Runtime Payload Builder Activation`
- active subtrack:
  - `MM3-217C authoritative output promotion hardening`
- next unblock:
  - decide `chunk_id` policy
  - decide whether to execute authoritative promotion using the defined protocol

## Revision History

- `R1` / `2026-03-26 11:55 KST` / `Codex PM` / authoritative runtime write path, rollback, dual-run diff protocol과 dry-run verification을 최초 고정
