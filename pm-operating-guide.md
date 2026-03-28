# PM Operating Guide

## Canonical Stack

- global base guide:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/vault_nanowind/pm-operating-guide.md`
- project control-plane entry:
  - `08_planning/TASKLIST_V1.md`
  - `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
  - `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
  - `08_planning/DOCUMENT_SYSTEM_POLICY_V1.md`

## Local Defaults

- user-facing language는 한국어를 기본으로 사용한다.
- `code`, `path`, `command`, `tool`, `skill`, `model`, `pipeline`, `workflow`, `step` 같은 technical token은 English 유지 가능하다.
- active work와 decision은 chat가 아니라 control-plane 문서에 먼저 고정한다.
- authoritative doc를 먼저 업데이트하고 dependent doc를 같은 턴에 sync한다.
- 사용자 승인 없이 가능한 단계는 계속 진행한다.
- launch readiness보다 learner-facing 완성도 개선을 우선한다.
- raw feedback는 interpreted summary보다 canonical raw note와 coverage audit를 우선 신뢰한다.

## Runtime Truth

- current deploy/runtime chain:
  - `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build`
- primary dictionary SSOT:
  - `vocab_dictionary/output/unified_live/kcenter_base.json.gz`

## New PM First Read

1. `08_planning/TASKLIST_V1.md`
2. `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
3. `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
4. `08_planning/DOCUMENT_SYSTEM_POLICY_V1.md`
