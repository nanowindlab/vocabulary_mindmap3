# 20260329_MM3_276_PROJECTION_CONSOLIDATION_CLOSEOUT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 01:50 KST`

## Last Updated By

- `Codex PM`

## Scope

- consolidate duplicated projection logic between app runtime and canonical rebuild path

## Applied

- shared pure projection module added:
  - `09_app/src/utils/tabProjection.js`
- app runtime now uses shared projection builder:
  - `09_app/src/App.jsx`
- canonical rebuild now uses same shared projection builder:
  - `09_app/scripts/rebuild-canonical-runtime.mjs`

## Result

- `meaning / situation / unclassified` projection rule now has one shared implementation
- UI projection and rebuild projection drift risk is reduced for the current boundary

## Verification

- `npm run test:contracts`
  - `2 passed`
- `npm run build`
  - `PASS`
- `npx playwright test tests/residual.spec.js -g "unclassified surface uses learner-facing label consistently|unclassified search route defaults to list view|unclassified helper splits grammatical items from uncategorized vocabulary"`
  - `3 passed`

## PM Verdict

- `ACCEPT`
- `PROJECTION_LOGIC_CONSOLIDATED_FOR_CURRENT_BOUNDARY`

## Next State

- current active execution package: `none`
- next planned tranche:
  - `MM3-277 Boundary Cleanup`

## Revision History

- `R1` / `2026-03-29 01:50 KST` / `Codex PM` / app runtime와 canonical rebuild의 duplicated projection rule을 shared module로 통합하고 closeout
