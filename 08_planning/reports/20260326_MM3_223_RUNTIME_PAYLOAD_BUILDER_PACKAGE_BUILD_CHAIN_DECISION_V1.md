# 20260326_MM3_223_RUNTIME_PAYLOAD_BUILDER_PACKAGE_BUILD_CHAIN_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 11:32 KST`

## Last Updated By

- `Codex PM`

## Scope

- PM decision on whether the current learner-facing `search + facets only` builder surface should be promoted into `package/build-chain`

## Facts

- `MM3-218`~`MM3-221` validation / review / hardening / revalidation loop is closed.
- command:
  - `npm run validate:source-alignment`
- result:
  - `PASS`
- command:
  - `npm run probe:runtime-surface-recovery`
- result:
  - search matched `53,480 / 53,480`
  - facet exact match `true`
- command:
  - `npm run build:runtime-surface-recovery`
- result:
  - sidecar artifacts generated at `tmp_reports/runtime_surface_recovery`
- current builder output writes only to `tmp_reports/runtime_surface_recovery` and does not mutate `09_app/public/data/live` or `09_app/public/data/internal/runtime_payloads`.
- current deploy/runtime truth remains `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build`.
- current search recovery still depends on `APP_READY_DETAIL_MAP.json`, and full authoritative rebuild readiness is not yet proven for tree/detail/chunk surfaces.

## PM Decision

- current learner-facing `search + facets only` builder surface is promoted into `package/build-chain` as a **non-authoritative sidecar** validation/build step.
- current local builder output remains **comparison / validation only**.
- current authoritative runtime truth remains `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build`.
- `MM3-217C` remains the active continuous-improvement track until explicit authoritative promotion criteria are closed.

## Why

- exact-match evidence is strong enough for narrow `search + facets` sidecar gating.
- same-chain validation lowers drift risk without changing the current runtime source of truth.
- switching the authoritative output surface now would overread the available evidence because tree/detail/chunk full rebuild readiness is still open.

## Chain Wiring

- `package:live` now runs `prepackage:live -> check:runtime-surface-sidecar`.
- `build` now runs `prebuild -> prepare:live -> verify:live -> check:runtime-surface-sidecar -> vite build`.
- `check:runtime-surface-sidecar` is fixed as:
  - `validate:source-alignment`
  - `build:runtime-surface-recovery`
  - `probe:runtime-surface-recovery`

## Verification

- command:
  - `npm run prepackage:live`
- result:
  - `PASS`
- command:
  - `npm run build`
- result:
  - `PASS`

## PM Verdict

- `ACCEPT`
- `SIDECAR_PROMOTION_ACCEPTED`
- `AUTHORITATIVE_PROMOTION_DEFERRED`

## Next Active Work

- `MM3-217 Runtime Payload Builder Activation`
- active subtrack:
  - `MM3-217C authoritative output promotion hardening`

## Revision History

- `R1` / `2026-03-26 11:32 KST` / `Codex PM` / package/build-chain sidecar promotion verdict, chain wiring, verification을 최초 고정
