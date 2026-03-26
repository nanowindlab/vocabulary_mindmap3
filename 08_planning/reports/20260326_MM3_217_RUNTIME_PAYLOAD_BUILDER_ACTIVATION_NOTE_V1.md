# 20260326_MM3_217_RUNTIME_PAYLOAD_BUILDER_ACTIVATION_NOTE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 10:08 KST`

## Last Updated By

- `Codex PM`

## Scope

- `PARK-002 runtime payload builder` activation after `MM3-213` search generator recovery closeout

## Current Truth

- current learner-facing runtime search row는 project-local recovery path로 exact 재생성 가능하다.
- scripts added:
  - `npm run probe:search-recovery`
  - `npm run build:search-recovery`
- generated artifact:
  - `tmp_reports/recovered_APP_READY_SEARCH_INDEX.json`

## What Is Already Proven

- `APP_READY_SEARCH_INDEX.json` current learner-facing field set은 project-local script로 `53,480 / 53,480` exact match다.
- `APP_READY_FACETS.json`는 source-alignment validator로 canonical facet payload와 일치함이 확인됐다.
- deploy parity for example chunks is fixed.

## Why A New Active Work Is Needed

- `MM3-213`은 search generator recovery / documentation scope였고, current learner-facing boundary에서는 목적을 달성했다.
- next technical backlog는 “이 recovered pieces를 runtime payload builder 형태로 조직화할 것인가”다.

## First Builder Targets

1. search index builder를 project-local canonical builder로 승격
2. facet payload builder를 같은 control surface로 연결
3. builder inputs / outputs / non-goals를 문서화

## Explicit Non-Goals

- detail map full rebuild
- tree payload full rebuild
- source policy 변경

## PM Verdict

- `ACTIVATE`

