# 20260326_MM3_217_RUNTIME_PAYLOAD_BUILDER_ACTIVATION_NOTE_V1

## Current Revision

- `R3`

## Last Updated

- `2026-03-26 10:43 KST`

## Last Updated By

- `Codex PM`

## Scope

- `PARK-002 runtime payload builder` activation after `MM3-213` search generator recovery closeout

## Current Truth

- current learner-facing runtime search row는 project-local recovery path로 exact 재생성 가능하다.
- scripts added:
  - `npm run probe:search-recovery`
  - `npm run build:search-recovery`
- surface scripts added:
  - `npm run probe:runtime-surface-recovery`
  - `npm run build:runtime-surface-recovery`
- generated artifact:
  - `tmp_reports/recovered_APP_READY_SEARCH_INDEX.json`
  - `tmp_reports/runtime_surface_recovery/APP_READY_SEARCH_INDEX.json`
  - `tmp_reports/runtime_surface_recovery/APP_READY_FACETS.json`

## Approved Guardrails

- current local builder output is **not** authoritative output yet.
- current sidecar output is fixed as **comparison / validation only**.
- PM은 authoritative output으로 완전히 승격할 수 있도록 지속적으로 개선한다.
- 이 지속적 개선 의무는 `TASKLIST_V1.md`에 남겨 놓고, carry-forward 문서에서도 빠지지 않게 유지한다.

## What Is Already Proven

- `APP_READY_SEARCH_INDEX.json` current learner-facing field set은 project-local script로 `53,480 / 53,480` exact match다.
- `APP_READY_FACETS.json`는 source-alignment validator로 canonical facet payload와 일치함이 확인됐다.
- `search + facets`를 묶은 runtime surface도 local canonical builder로 exact recovery 가능하다.
- deploy parity for example chunks is fixed.

## Why A New Active Work Is Needed

- `MM3-213`은 search generator recovery / documentation scope였고, current learner-facing boundary에서는 목적을 달성했다.
- next technical backlog는 “이 recovered pieces를 runtime payload builder 형태로 조직화할 것인가”다.

## First Builder Targets

1. search index builder를 project-local canonical builder로 승격
2. facet payload builder를 같은 control surface로 연결
3. builder inputs / outputs / non-goals를 문서화

## Verification

- command:
  - `npm run build:runtime-surface-recovery`
- result:
  - `search_rows = 53,480`
  - `facet_entry_count = 53,480`
- command:
  - `npm run probe:runtime-surface-recovery`
- result:
  - search matched `53,480 / 53,480`
  - facet exact match `true`

## Explicit Non-Goals

- detail map full rebuild
- tree payload full rebuild
- source policy 변경

## PM Verdict

- `ACTIVATE`
- `SEARCH_FACET_BUILDER_SURFACE_CONFIRMED`

## Next Step

- current builder scope는 learner-facing `search + facets`로 고정한다.
- 다음 결정은 이 surface를 package/build chain에 승격할지 여부다.
- 승격 전까지는 sidecar comparison / validation 용도로만 사용한다.
- PM은 authoritative output 승격이 가능해질 때까지 지속적으로 개선한다.

## Revision History

- `R1` / `2026-03-26 10:08 KST` / `Codex PM` / runtime payload builder activation note를 최초 작성
- `R2` / `2026-03-26 10:09 KST` / `Codex PM` / `search + facets` local builder surface와 exact probe 결과를 반영
- `R3` / `2026-03-26 10:43 KST` / `Codex PM` / authoritative/sidecar guardrail과 지속적 개선 의무를 명시
