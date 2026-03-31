# 20260331_MM3_09_APP_HANDOFF_PACKET_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-31 KST`

## Last Updated By

- `Codex PM`

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

## Current Output Snapshot

- rebuilt runtime rows:
  - `search_rows`: `53012`
  - `meaning_rows`: `44410`
  - `situation_rows`: `6399`
  - `unclassified_rows`: `8506`
  - `facet_entry_count`: `52544`
- runtime bundle count:
  - `220 files`
- current public manifest endpoint:
  - `https://mm3-runtime-gateway.nanowind.workers.dev/runtime-bundle-manifest.json`

## Current Blocker

- `없음`

## Next Unlock Condition

- next PM이 current rebuilt runtime bundle을 acceptance 대상으로 볼지, 추가 payload parity 검증을 더 할지 결정

## Immediate Next Action

1. public gateway manifest and selected payloads를 spot-check한다.
2. `09_app` current local changes를 commit/push boundary로 정리한다.
3. 필요하면 `10_relation_app` reopen lane과의 shared boundary를 다시 확인한다.

## Read Tier

- `Tier 1`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/SHARED_CURRENT_STATE_V1.md`
- `Tier 2`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
- `Tier 3`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1.md`

