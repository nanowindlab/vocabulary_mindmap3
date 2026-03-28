# 20260329_MM3_271_CANONICAL_RUNTIME_GENERATOR_CLOSEOUT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 00:35 KST`

## Last Updated By

- `Codex PM`

## Scope

- current deploy boundary canonical runtime generator closeout
- deterministic packaging hardening
- control-plane sync for reproducibility state

## Problem

- current deploy/runtime truth는 `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build` 체인으로 운영되고 있었지만,
- source에서 current deploy payload set을 한 번에 재생성하는 공식 entrypoint가 분산돼 있었다.
- `package-live`도 gzip timestamp와 manifest timestamp 때문에 unchanged input에서도 large binary churn을 만들었다.

## Applied

- official canonical rebuild command added:
  - `npm run rebuild:canonical-runtime`
- script added:
  - `09_app/scripts/rebuild-canonical-runtime.mjs`
- package wiring added:
  - `09_app/package.json`
- deterministic packaging hardening:
  - `09_app/scripts/package-live-payloads.mjs`
  - gzip `mtime` fixed to `0`
  - runtime `MANIFEST.json` and `CHUNK_MANIFEST_V1.json` timestamp fields removed

## Current Generator Coverage

- source inputs:
  - `kcenter_base.json.gz`
  - `kcenter_thin_index.json.gz`
  - `kcenter_facet_payload.json.gz`
  - `kcenter_translations.json.gz`
  - `entry_topik_stats.json.gz`
- generated live payloads:
  - `APP_READY_SEARCH_INDEX.json`
  - `APP_READY_MEANING_TREE.json`
  - `APP_READY_SITUATION_TREE.json`
  - `APP_READY_UNCLASSIFIED_TREE.json`
  - `APP_READY_FACETS.json`
- packaged deploy payloads:
  - `runtime_payloads/*.json.gz`
  - `MANIFEST.json`
  - `CHUNK_MANIFEST_V1.json.gz`
  - `APP_READY_CHUNK_RICH_*`
  - `APP_READY_CHUNK_EXAMPLES_*`

## Explicit Boundary

- this closes current deploy boundary reproducibility.
- this does **not** claim full runtime parity.
- remaining outside scope:
  - canonical `chunk_id` mapping backlog `MM3-226A`
  - broader runtime parity outside `search semantic fields + facets`
  - source-level provenance completion for fields such as `related_vocab`, `refs.cross_links`, `roman`

## Forward Tracking Rule

- if broader runtime parity or future generator boundary expansion reopens, update `rebuild:canonical-runtime` and its verification set in the same tranche.
- do not treat future parity/chunk/provenance work as complete while the canonical generator contract stays on the older boundary.

## Verification

- `npm run rebuild:canonical-runtime`
  - `PASS`
- `npm run build`
  - `PASS`
- generated counts:
  - `search_rows: 53,012`
  - `meaning_rows: 44,410`
  - `situation_rows: 6,399`
  - `unclassified_rows: 8,506`
  - `facet_entry_count: 53,012`
- repeated `npm run rebuild:canonical-runtime` after deterministic packaging hardening:
  - representative hashes unchanged for:
    - `APP_READY_MEANING_TREE.json.gz`
    - `APP_READY_CHUNK_RICH_chunk-0001.json.gz`
    - `APP_READY_CHUNK_EXAMPLES_chunk-0001.json.gz`
    - `CHUNK_MANIFEST_V1.json.gz`
    - `MANIFEST.json`

## PM Verdict

- `ACCEPT`
- `CURRENT_DEPLOY_BOUNDARY_CANONICAL_GENERATOR_RECOVERED`
- `DETERMINISTIC_PACKAGING_HARDENED`
- `BROADER_PARITY_STILL_SEPARATE`

## Next State

- current active execution package: `none`
- next directive arrives:
  - open a new task id

## Revision History

- `R1` / `2026-03-29 00:35 KST` / `Codex PM` / current deploy boundary canonical runtime generator를 공식 command로 묶고 deterministic packaging까지 반영해 closeout
