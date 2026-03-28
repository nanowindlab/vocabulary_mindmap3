# 20260325_MM3_181_PILOT_EXECUTION_ENVIRONMENT_SPEC_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 00:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- pilot execution environment spec

## Recommended Environment

- machine:
  - current local desktop environment
- workspace:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3`
- runtime data source:
  - `09_app/public/data/internal/runtime_payloads/*.json.gz`
- restored runtime target:
  - `09_app/public/data/live/*.json`
- expected build/runtime truth:
  - `runtime_payloads/*.json.gz -> prepare:live -> verify:live -> build`

## Execution Rule

1. pilot 직전 최신 runtime payload를 기준으로만 연다.
2. pilot 세션 중에는 payload regeneration이나 policy 변경을 하지 않는다.
3. 세션 중 confusion은 제품 반응으로 기록하고, 현장에서 고치지 않는다.

## Environment Checklist

- `runtime_payloads/*.json.gz` 존재
- `live/*.json` 복원 완료
- app가 current runtime payload를 읽는 상태
- screenshot save path 접근 가능

## Preferred Session Mode

- local guided session
- participant 화면 공유 또는 같은 화면 옆 관찰
- facilitator는 별도 기록 담당

## Do Not

- pilot 중에 build chain을 다시 돌리며 버전을 바꾸지 않는다.
- participant에게 experimental/stale UI를 보여주지 않는다.

## Next Active Work

- `MM3-096C session slot / execution handoff 정리`

## Revision History

- `R1` / `2026-03-25 00:42 KST` / `Codex PM` / refreshed pilot 기본 execution environment spec을 최초 작성
