# 20260329_MM3_289_IN_APP_DEDICATED_ROUTE_READINESS_GATE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-29 11:15 KST`

## Last Updated By

- `Codex PM`

## Scope

- same-app dedicated route readiness only
- no separate app split

## Bundle Review

- same-turn bundle candidate:
  - 없음
- reason:
  - Workflow C is a single gate
  - no adjacent implementation packet is unlocked until this verdict exists

## Readiness Criteria

1. dedicated route should solve a distinct learner job that the current detail-first flow cannot solve well
2. dedicated route should have its own stable data input, not just re-labeled current tabs
3. entry / return path should be clear enough not to fragment the current `word-first` flow
4. added route should not create validation and maintenance cost disproportionate to current learner benefit

## Evidence

### Criterion 1. distinct learner job

- current relation compare and idiom/proverb support just became clearer inside the existing detail flow
- there is not yet evidence that users need a separate compare-only or expression-only session immediately

### Criterion 2. stable dedicated input

- `MM3-282` confirmed:
  - current expression layer is idiom/proverb-heavy support data
  - `APP_READY_EXPRESSIONS_TREE.json = 0`
- current route-specific payload does not exist

### Criterion 3. entry / return path clarity

- current accepted structure is still:
  - `word-first`
  - `sense core`
  - relation/expression as downstream detail surfaces
- a dedicated route now would add another entry path before the current one is saturated

### Criterion 4. maintenance cost

- current runtime/search/facet/chunk boundary is validated and stable
- a dedicated route would add:
  - route-specific copy
  - route-specific tests
  - route-specific handoff/control-plane maintenance
- current benefit is not strong enough yet to justify that overhead

## Verdict

- `NOT_READY_YET`
- current recommendation:
  - keep the integrated flow
  - keep monitoring whether compare-only or expression-only intent becomes strong
  - reopen only when new route-specific evidence exists

## Reopen Triggers

- repeated learner demand for compare-only sessions
- repeated learner demand for idiom/proverb-only sessions
- non-empty curated route-level payload
- stronger route-level data such as sentence pattern / register / speech-act notes

## PM Verdict

- `ACCEPT`
- `IN_APP_DEDICATED_ROUTE_NOT_READY`
- `WORKFLOW_C_CLOSED`

## Next State

- current active execution package: `none`
- next active work:
  - wait for next directive or new route-readiness evidence

## Revision History

- `R1` / `2026-03-29 11:15 KST` / `Codex PM` / same-app dedicated route readiness gate를 evidence 기준으로 평가하고 current hold verdict를 고정
