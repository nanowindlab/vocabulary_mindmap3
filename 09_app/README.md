# 09_app Guide

> Scope: `mindmap3` learner-facing React + Vite frontend shell

## App Role

- `09_app/`는 현재 `vocabulary_mindmap2/09_app`를 기준으로 이식한 baseline frontend다.
- 목표는 layout과 interaction rhythm은 유지하면서, `mindmap3`의 richer dictionary payload를 소화하도록 runtime과 detail panel을 확장하는 것이다.

## Current Runtime State

- canonical runtime target: `09_app/public/data/live/`
- 현재 `APP_READY_SEARCH_INDEX.json`은 MM3 `thin index` 기반으로 생성된다.
- 현재 `APP_READY_FACETS.json`은 MM3 facet payload 기반으로 생성된다.
- git/Vercel 연동에서는 `live/*.json` 대신 `public/data/internal/runtime_payloads/*.json.gz`를 추적하고, build 전에 `npm run prepare:live`로 복원한다.
- repo root Vercel 연동에서는 `vercel.json`이 `09_app` install/build/output을 직접 지정한다.
- packaging pipeline:
  - `npm run package:live` (`prepackage:live`에서 `repair:runtime-detail-fidelity` + non-authoritative `search + facets` sidecar gate 실행)
  - `npm run prepare:live`
  - `npm run verify:live`
  - `npm run build` (`prebuild`에서 restore/verify + same sidecar gate 실행)
- `package:live`는 압축 payload와 `MANIFEST.json`까지 같이 갱신한다.
- 현재 tree는 MM3 축 스위처 기준으로 분리된다.
  - `APP_READY_MEANING_TREE.json`
  - `APP_READY_SITUATION_TREE.json`
  - `APP_READY_UNCLASSIFIED_TREE.json`
- detail payload / expression payload의 full wiring은 아직 후속 단계다.

## First Read

1. `README.md`
2. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
3. `08_planning/DATA_ARCHITECTURE_V1.md`
4. `08_planning/PRODUCT_SCENARIO_SPEC_V1.md`
5. `09_app/public/data/README.md`

## Runtime Canonical Target

- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- `09_app/public/data/live/APP_READY_FACETS.json`
- `09_app/public/data/live/APP_READY_MEANING_TREE.json`
- `09_app/public/data/live/APP_READY_SITUATION_TREE.json`
- `09_app/public/data/live/APP_READY_UNCLASSIFIED_TREE.json`
- `09_app/public/data/live/CHUNK_MANIFEST_V1.json`

## Notes

- 현재 `src/` 구조는 `mindmap2`와 거의 동일하다.
- 현재 1차 wiring은 `search + facet`까지만 연결했다.
- tree는 1차로 `의미 범주 / 주제 및 상황 범주 / 미분류` 축 스위처에 맞춰 연결했다.
- detail / expression payload의 full wiring은 후속 단계다.
- `validate:source-alignment`는 runtime search/facets/trees가 canonical thin/facet source와 current truth 기준으로 aligned인지 검증한다.
- `audit:authoritative-promotion`는 `search + facets` semantic authority candidate readiness와 `chunk_id` evidence gap을 점검한다.
- `check:runtime-surface-sidecar`는 `validate:source-alignment -> build:runtime-surface-recovery -> probe:runtime-surface-recovery`를 묶어 package/build-chain의 non-authoritative sidecar gate로 사용한다.
- `repair:runtime-detail-fidelity`는 `kcenter_base` canonical entry를 기준으로 `APP_READY_DETAIL_MAP`을 재동기화해 XML-derived detail examples/relations가 app runtime까지 유지되도록 한다.
- `plan:authoritative-runtime`는 authoritative switch 없이 write path dry-run을 생성한다.
- `diff:authoritative-runtime`는 current live runtime과 authority candidate를 dual-run 방식으로 비교한다.
- `check:authoritative-runtime-boundary`는 `prepackage:live -> diff:authoritative-runtime -> build`를 한 번에 묶어 current authoritative boundary recurring gate로 사용한다.
- `promote:authoritative-runtime:execute`와 `rollback:authoritative-runtime:execute`는 actual runtime truth를 바꾸는 명령이므로 explicit promotion verdict 이후에만 사용한다.
- `probe:search-recovery`는 current runtime search index에서 recoverable subset이 exact 재구성 가능한지 확인한다.
- `build:runtime-surface-recovery`는 current learner-facing `search + facets` surface를 local canonical non-authoritative sidecar artifact로 출력한다.
- `probe:runtime-surface-recovery`는 current learner-facing `search + facets` surface가 runtime과 exact match인지 확인한다.
- current exact `APP_READY_SEARCH_INDEX` generator는 thin/facet source만으로 완전히 복구되지 않았다. runtime-only field provenance mapping이 별도 필요하다.
