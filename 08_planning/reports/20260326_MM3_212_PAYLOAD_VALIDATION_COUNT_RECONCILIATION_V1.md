# 20260326_MM3_212_PAYLOAD_VALIDATION_COUNT_RECONCILIATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 07:54 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-212` parked backlog execution for `PARK-004 payload validation and count reconciliation`

## Why This Was Chosen

- `PARK-004`는 product approval 없이 바로 진행 가능한 technical validation이다.
- `PARK-005` generator recovery 전에도 source/runtime drift를 증거로 먼저 고정할 수 있다.
- 현재 runtime payload truth와 canonical source truth가 실제로 aligned인지 자동 검증 루프를 남기는 것이 재현성과 handoff 양쪽에 유리하다.

## Implemented

### 1. Runtime/source alignment validator

- script:
  - `09_app/scripts/validate-runtime-source-alignment.mjs`
- package script:
  - `npm run validate:source-alignment`

### 2. Validation coverage

- runtime search row count vs canonical thin index entry count
- runtime search id uniqueness
- runtime search id set vs canonical thin index id set
- tree payload union id set vs runtime search id set
- runtime facets payload vs canonical facet payload deep equality
- runtime stats-populated row counts vs canonical TOPIK facet counts

## Verification Result

- command:
  - `npm run validate:source-alignment`
- result:
  - `PASS`
- key evidence:
  - runtime search rows: `53,480`
  - canonical thin entries: `53,480`
  - canonical facet entry count: `53,480`
  - thin missing from runtime: `0`
  - runtime extra from thin: `0`
  - runtime missing from trees: `0`
  - tree extra from runtime: `0`
  - runtime band-populated rows: `7,314`
  - runtime rated-level rows: `5,045`

## Important Observation

- source link integrity summary는 아래 unresolved inventory를 계속 가진다.
  - `dangling_related_terms`: `811`
  - `dangling_related_forms`: `1085`
- 이는 count reconciliation failure가 아니라 source/runtime truth의 current known condition이다.

## PM Verdict

- `VALIDATION_PASS`

## Next Step

- 이 validator를 future generator recovery와 source refresh 전후 비교에 재사용한다.
- 다음 active technical backlog는 `PARK-005 canonical thin-index generator recovery / documentation`이다.

