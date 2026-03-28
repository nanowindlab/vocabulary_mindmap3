# 20260327_MM3_266_DATA_STRUCTURE_OPTIMIZATION_OPENING_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 16:45 KST`

## Last Updated By

- `Codex PM`

## Scope

- open `MM3-266` data structure optimization study/design task

## Why This Task Exists

- current payloads are operationally usable but structurally heavy.
- current large artifacts are compressed, yet data layout itself is not fully optimized for storage/versioning/update efficiency.
- next task is to design how to split, deduplicate, shard, or re-encode the data more efficiently.

## Required Study Questions

1. Which current artifacts are too large because of unavoidable content volume, and which are large because of layout duplication?
2. Should canonical source be sharded by entry block/chunk/domain?
3. Should translations/examples/relations/detail payloads be split more aggressively?
4. Is `JSON.gz` still the right final format, or should some layers move to:
   - smaller normalized snapshots
   - sqlite/db file
   - key-value chunk store
   - delta/patch model
5. Which format is best for:
   - local dev
   - git/versioning
   - app runtime delivery
   - reproducible rebuilds

## Expected Output

- current payload weight breakdown
- duplication hotspot analysis
- 2-3 structural redesign options
- recommended target architecture
- phased migration plan

## Suggested Work Breakdown

- `MM3-266A` payload weight and duplication audit
- `MM3-266B` alternative storage/layout options study
- `MM3-266C` recommended optimization architecture and migration plan

## Inputs

- `09_app/public/data/internal/runtime_payloads/`
- `vocab_dictionary/output/unified_live/`
- `09_app/scripts/package-live-payloads.mjs`
- `09_app/scripts/prepare-live-payloads.mjs`
- `09_app/scripts/runtime-search-recovery-core.mjs`
- recent git push warnings around large files

## Initial Constraint

- optimization study must preserve rebuild reproducibility and learner-facing runtime parity.
- current runtime behavior should not regress just to reduce bytes.

## Revision History

- `R1` / `2026-03-27 16:45 KST` / `Codex PM` / data structure optimization task opening과 study 범위를 고정
