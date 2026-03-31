# 09_APP_ACTIVE_LOCAL_STATE_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-31 KST`

## Last Updated By

- `Codex PM`

## App Owner

- `09_app PM`

## Parent Coordination

- `Parent coordination id`: `MM3-COORD-20260331A`
- `Local child task id`: `MM3-COORD-20260331A-09`

## Allowed Files

- `09_app/package.json`
- `09_app/package-lock.json`
- `09_app/scripts/**`
- `09_app/src/**`
- `09_app/public/data/**`
- `vercel.json` when `09_app` deploy/build chain changes
- `cf_runtime_gateway/**` when `09_app` runtime restore path changes

## Disallowed Files

- `10_relation_app/**`
- unrelated shared historical archive docs
- relation-app local state surfaces unless shared escalation explicitly opens cross-app coordination

## Write Boundary

- `09_app` runtime / deploy / restore / verification surface only
- shared truth 문서는 직접 소유하지 않고 reference만 한다

## Current Blocker

- `없음`

## Verification Command

- app-local verify:
  - `npm --prefix 09_app run rebuild:canonical-runtime`
  - `npm --prefix 09_app run publish:r2-runtime`
  - `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`
- shared prerequisite when shared data regeneration is explicitly part of the lane:
  - `python3 vocab_dictionary/scripts/build_kcenter_dataset.py seed --json-dir vocab_dictionary/dict_download_json --output-dir vocab_dictionary/output/unified_live`
  - `python3 vocab_dictionary/scripts/build_kcenter_dataset.py merge --output-dir vocab_dictionary/output/unified_live --api-xml-dir vocab_dictionary/output/api_xml_live`
  - `python3 vocab_dictionary/scripts/link_vm2_topik_stats.py`
  - `python3 vocab_dictionary/scripts/apply_subject_none_policy.py`

## Do Not Change Parent Coordination Id Locally

- local child task id만 갱신 가능
- `parent coordination id` 변경은 shared current state surface에서만 수행

## Current Execution Truth

- `09_app`는 current default build target이다
- runtime bundle full set은 `Cloudflare R2`에서 restore한다
- current deploy/runtime chain은 `GitHub -> Vercel -> 09_app build -> R2 restore`
- current active local concern은 `09_app` runtime/deploy verification and maintenance lane이다

## Revision History

- `R2` / `2026-03-31 KST` / `Codex PM` / verification command를 `app-local verify`와 `shared prerequisite`로 분리
- `R1` / `2026-03-31 KST` / `Codex PM` / initial local state surface 생성
