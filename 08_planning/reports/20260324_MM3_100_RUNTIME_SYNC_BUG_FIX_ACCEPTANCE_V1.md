# 20260324_MM3_100_RUNTIME_SYNC_BUG_FIX_ACCEPTANCE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 10:48 KST`

## Last Updated By

- `Codex PM`

## Scope

- pilot feedback Cluster A `runtime sync / navigation bug`

## Root Cause

- search payload normalize 시 `hierarchy.system = MM3`가 `root_id`보다 먼저 잡혀 잘못된 root focus가 만들어졌다.
- selection state가 `selectedTermDetail`에만 묶여 있어 `닫기` 시 mindmap/sidebar sync가 같이 풀렸다.
- 검색창은 `Enter` key path를 처리하지 않았다.

## Applied Fix

- `normalizeItem()`에서 `path_ko` 기반 root/scene/category 파생 규칙으로 수정
- `selectedTermId`를 detail panel open state와 분리
- search input `Enter` 지원 추가
- mindmap node에 test/data selector 추가
- focused root mismatch 시 전체 root fallback 추가

## Verification

- `npm run build` 통과
- `npx playwright test` `11 passed`
- 신규 회귀 포함:
  - search enter triggers selection and mindmap sync
  - closing detail keeps selected term synced in mindmap

## PM Verdict

- `ACCEPT`

## Next Active Work

- `MM3-101 Post-Pilot Cluster Next Slice Decision`

## Revision History

- `R1` / `2026-03-24 10:48 KST` / `Codex PM` / runtime sync bug fix와 검증 결과를 acceptance로 기록
