# 09_APP_ACTIVE_LOCAL_STATE_V1

## Current Revision

- `R14`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

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

## Cross-Lane Review Rule

- `10_relation_app PM`은 `09_app` lane에 대해 first sanity check 또는 drift detection 목적의 read-only spot-check만 수행할 수 있다.
- non-owner PM의 finding은 advisory이며, `09_app PM` 또는 `Main PM`이 받아들일 때만 current truth가 된다.
- non-owner PM은 이 문서와 `09_app` handoff packet을 authoritative truth로 직접 확정하지 않는다.

## Commit/Push Ownership

- `09_app` lane commit/push는 `09_app PM` 또는 `Main PM`만 수행한다.
- shared/control-plane doc-only push는 별도 boundary다.
- shared/control-plane doc-only push가 존재하더라도 `09_app` runtime acceptance push로 간주하지 않는다.

## Git Command Boundary

- `09_app PM`의 `git` command 사용 범위는 자기 lane/project boundary로 제한한다.
- allowed:
  - `09_app/**`
  - `09_app` lane packet/state docs
- disallowed:
  - `10_relation_app/**`를 대상으로 한 모든 `git` command
  - 상대 lane commit/push 여부 판단을 위한 `git` inspection
  - shared/root git action 선행 실행
- shared/root git action이 필요하면 `Main PM`으로 escalation한다.
- 다음 `09_app PM`도 이 규칙을 기본값으로 따른다.

## Metadata Note

- 이 lane의 authoritative metadata는 concrete updater label을 사용한다.
- `Last Updated By`는 generic `Codex PM` 대신 `MM_09_APP_PM`으로 유지한다.

## Current Blocker

- `없음`

## Verification Command

- app-local verify:
  - `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`
- local compile smoke:
  - `cd 09_app && ./node_modules/.bin/vite build`
- local search payload measure:
  - `node 09_app/scripts/measure-search-thin-payload.mjs`
- first-screen payload measure:
  - `node 09_app/scripts/measure-first-screen-payload.mjs`
- Playwright regression:
  - `npx playwright test tests/first-screen-shell.spec.js tests/mindmap-navigation.spec.js --reporter=line`
- list virtualization regression:
  - `npx playwright test tests/list-virtualization.spec.js --reporter=line`
- special manual regeneration only:
  - `npm --prefix 09_app run repair:facets`
  - `npm --prefix 09_app run publish:r2-runtime`
- shared prerequisite when exceptional source regeneration is explicitly part of the lane:
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
- current active package는 `09_app git boundary cleanup`과 commit grouping decision이다
- daily app build는 `R2 restore`만으로 닫는다.
- local 개발/테스트 기본은 local build / local server 기준으로 진행한다.
- `Vercel` 배포 기준 build는 `R2 restore` 기준으로 닫는다.
- base runtime payload의 번역은 `영어`만 기본 포함한다.
- 비영어 번역은 언어별 overlay payload를 lazy load한다.
- local search runtime path는 `APP_READY_SEARCH_THIN_INDEX.json` 우선, full live search payload fallback 기준이다.
- first-screen eager runtime path는 `APP_READY_MEANING_TREE_SHELL.json` 기준이다.
- deploy-target canonical restore path는 stable manifest -> hashed `remote_path` indirection 기준이다.
- performance optimization control-plane docs:
  - tasklist: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
  - tranche packet: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_TRANCHE4_EXECUTION_PACKET_V1.md`
  - risk note: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`
- `vocab_dictionary/`는 exceptional repair / regeneration 때만 수동으로 사용한다.
- local live runtime bundle verify는 `PASS` 상태다.
  - `fileCount=233`
- public gateway `R2` runtime bundle은 `T2 + T3 + T4`까지 반영된 상태다.
  - performance optimization runtime payload contract는 complete 상태다.
  - manifest `version=v2`
  - manifest `generated_at=2026-04-01T01:03:51.183Z`
  - remote restore build `PASS`
- remaining open items are:
  - `09_app` git boundary cleanup

## Handoff Priority

- `Tier 1 09_app authoritative`
  - this document
  - `20260331_MM3_09_APP_HANDOFF_PACKET_V1.md`
- `Tier 2 09_app optimization active docs`
  - `20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
  - `20260401_MM3_09_APP_PERFORMANCE_TRANCHE5_EXECUTION_PACKET_V1.md`
  - `20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`
- `Tier 3 boundary reference only`
  - `SHARED_CURRENT_STATE_V1.md`
  - split baseline

## Do Not Read Or Touch By Default During 09_App Handoff

- `10_relation_app/**`
- `10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md`
- other workspace project surfaces under `03_PRD/`, `05_sources/`, `06_data/`, `07_runtime/`, `08_planning/`, `docs/`, `tmp_reports/`, `vocab_dictionary/`
- shared docs other than `SHARED_CURRENT_STATE_V1.md` when no boundary issue exists

## Revision History

- `R14` / `2026-04-01 KST` / `MM_09_APP_PM` / `P5` list virtualization closeout 후 next active package를 `git boundary cleanup`으로 전환
- `R13` / `2026-04-01 KST` / `MM_09_APP_PM` / `P4` hashed remote path contract closeout, public manifest `v2`, next active package를 `P5` 기준으로 갱신
- `R12` / `2026-04-01 KST` / `MM_09_APP_PM` / `P3` shell eager path closeout, `R2` republish+remote build pass, next active package를 `P4` 기준으로 갱신
- `R11` / `2026-04-01 KST` / `MM_09_APP_PM` / `T2` thin search payload closeout, `P3` next tranche 준비, local/public runtime truth 분리 반영
- `R10` / `2026-04-01 KST` / `MM_09_APP_PM` / current active package를 performance optimization next tranche 기준으로 갱신하고 09_app-only handoff priority / no-go scope 추가
- `R9` / `2026-04-01 KST` / `MM_09_APP_PM` / performance optimization tasklist, tranche packet, risk note 포인터 추가
- `R8` / `2026-04-01 KST` / `MM_09_APP_PM` / 영어 기본 + 언어별 lazy translation overlay 구조 반영
- `R7` / `2026-04-01 KST` / `MM_09_APP_PM` / local 개발/테스트는 local build, 배포 기준 build는 `R2 restore` 원칙 추가
- `R6` / `2026-03-31 KST` / `MM_09_APP_PM` / canonical/live facets rebuild, R2 republish, remote restore build pass 반영 후 runtime parity blocker 해제
- `R5` / `2026-03-31 KST` / `MM_09_APP_PM` / `git` command를 자기 lane/project boundary로 제한하는 규칙과 concrete updater metadata note 추가
- `R4` / `2026-03-31 KST` / `Codex PM` / non-owner read-only spot-check 범위와 `09_app` lane commit/push ownership 규칙 추가
- `R3` / `2026-03-31 KST` / `Codex PM` / public gateway payload spot-check 결과 `APP_READY_FACETS.json` stale mismatch와 partial parity 상태 반영
- `R2` / `2026-03-31 KST` / `Codex PM` / verification command를 `app-local verify`와 `shared prerequisite`로 분리
- `R1` / `2026-03-31 KST` / `Codex PM` / initial local state surface 생성
