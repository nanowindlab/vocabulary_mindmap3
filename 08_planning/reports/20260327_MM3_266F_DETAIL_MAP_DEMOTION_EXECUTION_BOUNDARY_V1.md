# 20260327_MM3_266F_DETAIL_MAP_DEMOTION_EXECUTION_BOUNDARY_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 21:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- define the actual execution boundary for `DETAIL_MAP` demotion

## What Is Already True

- learner-facing normal runtime no longer silently falls back to `DETAIL_MAP`
- chunk generation no longer depends on `DETAIL_MAP`
- runtime recovery/probe no longer depends on `DETAIL_MAP`

## What Is Not Yet Safe To Do

- remove `APP_READY_DETAIL_MAP.json` from all local live artifacts
- remove repair scripts that still patch `DETAIL_MAP`
- assume every non-learner/debug workflow is ready for chunk-only detail

## Boundary Decision

### In Scope For Next Tranche

- stop treating `DETAIL_MAP` as a required packaged runtime payload
- keep it as:
  - debug artifact
  - repair target
  - local/offline inspection artifact

### Out Of Scope For The Same Tranche

- repair script migration away from `DETAIL_MAP`
- full deletion of `DETAIL_MAP` from the repo/workspace
- translation/related-form/detail-fidelity repair target rewrite

## Operational Meaning

- production learner runtime:
  - `DETAIL_MAP` is no longer part of the primary runtime truth
- local tool/repair lane:
  - `DETAIL_MAP` may still exist until repair targets are migrated

## PM Verdict

- this is the safe execution boundary for demotion right now

## Next Step

- if continued, the next work should focus on migrating repair targets off `DETAIL_MAP`

## Revision History

- `R1` / `2026-03-27 21:42 KST` / `Codex PM` / `DETAIL_MAP` demotion의 safe execution boundary를 고정
