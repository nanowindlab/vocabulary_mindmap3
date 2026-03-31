# 20260331_MM3_09_APP_HANDOFF_PACKET_V1

## Current Revision

- `R5`

## Last Updated

- `2026-03-31 KST`

## Last Updated By

- `MM_09_APP_PM`

## Surface

- `09_app`

## Parent Coordination

- `Parent coordination id`: `MM3-COORD-20260331A`
- `Local child task id`: `MM3-COORD-20260331A-09`

## 목적

- current `09_app` runtime/deploy lane 기준으로 next PM이 바로 이어받을 수 있는 handoff packet을 남긴다.

## Current Truth

- active lane은 `09_app`
- default `GitHub -> Vercel` build target은 `09_app`
- current runtime bundle source는 `Cloudflare R2` bucket `vocabulary-mindmap3-runtime`
- current runtime restore gateway는 `https://mm3-runtime-gateway.nanowind.workers.dev`
- current build command는 `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`

## What Changed This Turn

- `dict_download_json` + `api_xml_live` 입력이 workspace에 복구됐다.
- `build_kcenter_dataset.py seed`와 `merge`를 다시 실행했다.
- `link_vm2_topik_stats.py`를 다시 실행했다.
- `apply_subject_none_policy.py`를 다시 실행했다.
- `09_app` canonical runtime payload를 다시 생성했다.
- `09_app` full runtime bundle `220` files를 `Cloudflare R2`에 다시 업로드했다.
- `09_app` actual app source / runtime restore flow를 현재 workspace 기준으로 복원했다.
- public gateway `runtime-bundle-manifest.json` / `app-runtime.json` / selected payload를 spot-check했다.
- selected core payload parity는 확인됐지만 `APP_READY_FACETS.json` stale mismatch가 확인됐다.
- current `09_app` local change set의 commit/push boundary를 audited 했다.
- `09_app/scripts/rebuild-canonical-facets.mjs`를 추가해 canonical/live facets를 current `53012` baseline 기준으로 재생성했다.
- `npm --prefix 09_app run publish:r2-runtime`로 full runtime bundle `220` files를 다시 publish했다.
- `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`가 `PASS`했다.

## Verified Evidence

- local seed rebuild:
  - `python3 vocab_dictionary/scripts/build_kcenter_dataset.py seed --json-dir vocab_dictionary/dict_download_json --output-dir vocab_dictionary/output/unified_live`
- local merge rebuild:
  - `python3 vocab_dictionary/scripts/build_kcenter_dataset.py merge --output-dir vocab_dictionary/output/unified_live --api-xml-dir vocab_dictionary/output/api_xml_live`
- local topik linkage:
  - `python3 vocab_dictionary/scripts/link_vm2_topik_stats.py`
- subject-none policy:
  - `python3 vocab_dictionary/scripts/apply_subject_none_policy.py`
- runtime payload rebuild:
  - `npm --prefix 09_app run rebuild:canonical-runtime`
- runtime bundle verification:
  - `npm --prefix 09_app run verify:live`
- `R2` restore build verification:
  - `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`
- public manifest:
  - `curl -sS https://mm3-runtime-gateway.nanowind.workers.dev/runtime-bundle-manifest.json`
- public runtime metadata:
  - `curl -sS https://mm3-runtime-gateway.nanowind.workers.dev/app-runtime.json`
- public facets payload:
  - `curl -sS https://mm3-runtime-gateway.nanowind.workers.dev/APP_READY_FACETS.json`
- local selected payload hash/byte check:
  - `shasum -a 256 09_app/dist/data/live/APP_READY_SEARCH_INDEX.json 09_app/dist/data/live/APP_READY_MEANING_TREE.json 09_app/dist/data/live/APP_READY_FACETS.json 09_app/dist/data/live/CHUNK_MANIFEST_V1.json`
  - `shasum -a 256 09_app/dist/data/live/APP_READY_SITUATION_TREE.json 09_app/dist/data/live/APP_READY_UNCLASSIFIED_TREE.json`
  - `wc -c 09_app/dist/data/live/APP_READY_SEARCH_INDEX.json 09_app/dist/data/live/APP_READY_MEANING_TREE.json 09_app/dist/data/live/APP_READY_FACETS.json 09_app/dist/data/live/CHUNK_MANIFEST_V1.json`
- local change boundary audit:
  - `git diff --summary`
  - `git diff -- 09_app/package.json README.md`
  - `git status --short 09_app README.md .codex-orchestration`
- canonical/live facet rebuild:
  - `node 09_app/scripts/rebuild-canonical-facets.mjs`
- post-fix runtime validation:
  - `node 09_app/scripts/validate-runtime-source-alignment.mjs`
  - `node 09_app/scripts/audit-authoritative-promotion-readiness.mjs`
- R2 republish:
  - `npm --prefix 09_app run publish:r2-runtime`
- remote restore build:
  - `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`

## Current Output Snapshot

- rebuilt runtime rows:
  - `search_rows`: `53012`
  - `meaning_rows`: `44410`
  - `situation_rows`: `6399`
  - `unclassified_rows`: `8506`
  - `facet_entry_count`: `53012`
- runtime bundle count:
  - `220 files`
- current public manifest endpoint:
  - `https://mm3-runtime-gateway.nanowind.workers.dev/runtime-bundle-manifest.json`
- current public runtime metadata:
  - `entryCount`: `53012`
  - `payloadCount`: `220`
- current public facets payload:
  - `entry_count`: `53012`
  - rebuilt baseline과 일치
- current public manifest metadata:
  - `generated_at`: `2026-03-31T12:05:19.921Z`

## Current Commit/Push Boundary

- minimal `09_app` commit candidate:
  - `09_app/package.json`
- separate pending mode-only changes:
  - `09_app/scripts/**` `22` files `100644 -> 100755`
  - `09_app/vite.config.js` `100644 -> 100755`
- current untracked candidate requiring explicit decision:
  - `09_app/scripts/prune-dist-runtime-files.mjs`
  - `09_app/scripts/rebuild-canonical-facets.mjs`
- exclude from current `09_app` commit boundary:
  - `README.md`
  - `.codex-orchestration/**`
  - non-active app lane files
  - bulk untracked project dirs such as `03_PRD/`, `05_sources/`, `06_data/`, `07_runtime/`, `08_planning/`, `docs/`, `tmp_reports/`, `vocab_dictionary/`
- push boundary:
  - runtime acceptance gate는 cleared
  - remaining decision은 git commit/push boundary 분리다

## Ownership And Attribution

- `10_relation_app PM`의 `09_app` 관찰은 first sanity check 목적의 read-only advisory로만 취급한다.
- `09_app` authoritative packet / blocker / acceptance / commit-push 판단은 `09_app PM` 또는 `Main PM`이 확정한다.
- branch `codex-09-app-runtime-boundary`에는 shared/control-plane doc-only commit/push가 이미 존재한다.
- 위 doc-only push는 `09_app` runtime acceptance push가 아니며, 현재 app-local push boundary를 열지 않는다.
- `09_app PM`의 `git` command 사용 범위는 `09_app/**`와 `09_app` lane packet/state docs로 제한한다.
- `09_app PM`은 `10_relation_app/**` 대상 `git` command와 상대 lane commit/push 판단용 `git` inspection을 수행하지 않는다.
- shared/root git action이 필요하면 `Main PM`으로 escalation한다.

## Build And Regeneration Policy

- daily app build는 `R2 restore`만으로 닫는다.
- `vocab_dictionary/`는 exceptional regeneration / repair 때만 수동으로 사용한다.
- `R2` regeneration은 app daily build와 분리된 별도 manual process다.

## Current Blocker

- `없음`

## Next Unlock Condition

- `09_app/package.json` content change와 mode-only / untracked change를 분리해 actual commit candidate를 고정

## Immediate Next Action

1. `09_app/package.json` content change를 mode-only / untracked change와 분리해 commit boundary를 고정한다.
2. `09_app/scripts/rebuild-canonical-facets.mjs`를 lane-local repair script로 유지할지 결정한다.
3. `10_relation_app` reopen lane은 현 시점에서는 열지 않고, cross-app shared 영향이 생길 때만 shared surface에서 재개한다.

## Read Tier

- `Tier 1`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/SHARED_CURRENT_STATE_V1.md`
- `Tier 2`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
- `Tier 3`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1.md`

## Revision History

- `R5` / `2026-03-31 KST` / `MM_09_APP_PM` / canonical/live facets rebuild, R2 full republish, remote restore build pass로 runtime parity blocker 해제
- `R4` / `2026-03-31 KST` / `MM_09_APP_PM` / concrete updater label 정규화와 `09_app` lane git boundary 규칙 추가
- `R3` / `2026-03-31 KST` / `Codex PM` / cross-lane advisory status와 shared doc-only push 분리 규칙 추가
- `R2` / `2026-03-31 KST` / `Codex PM` / public gateway spot-check 결과 `APP_READY_FACETS.json` stale mismatch와 current `09_app` commit/push boundary audit 반영
- `R1` / `2026-03-31 KST` / `Codex PM` / initial handoff packet 작성
