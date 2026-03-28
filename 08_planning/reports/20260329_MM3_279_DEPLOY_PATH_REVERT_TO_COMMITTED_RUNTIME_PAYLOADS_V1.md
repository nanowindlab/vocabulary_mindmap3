# 20260329_MM3_279_DEPLOY_PATH_REVERT_TO_COMMITTED_RUNTIME_PAYLOADS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 03:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- revert default deploy/build path to committed runtime payload usage

## Problem

- default build path had been changed to run `rebuild:canonical-runtime` before app build
- that path pulls `TOPIK` example sentence provenance from external local corpus inputs
- clean/Vercel environment does not have that external corpus path

## Applied

- `09_app/package.json`
  - `prebuild` changed back to:
    - `prepare:live -> verify:live -> check:runtime-surface-sidecar`

## Decision

- default deploy path uses already committed `runtime_payloads/*.json.gz`
- canonical rebuild remains available as explicit/manual command
- default deploy path does not regenerate runtime payloads

## Why

- current payload content is treated as stable enough to deploy as committed artifact
- deploy path must not depend on sibling repo or local-only corpus files

## Verification

- `npm run build`
  - `PASS`

## PM Verdict

- `ACCEPT`
- `DEFAULT_DEPLOY_PATH_USES_COMMITTED_RUNTIME_PAYLOADS`

## Revision History

- `R1` / `2026-03-29 03:10 KST` / `Codex PM` / default deploy path를 committed runtime payload usage로 되돌리고 closeout
