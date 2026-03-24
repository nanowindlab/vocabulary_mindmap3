# 20260324_MM3_099_RUNTIME_SYNC_BUG_REPRO_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 10:32 KST`

## Last Updated By

- `Codex PM`

## 목적

- pilot에서 확인된 `검색 -> 마인드맵 동기화` 계열 이슈를 재현하고 분해할 계획을 고정한다.

## Repro Targets

1. 검색 결과 클릭 후 계층탐색만 바뀌고 마인드맵이 멈추는 경우
2. refresh 후 동일 증상 재현
3. 새 탭에서 `http://localhost:4173/` 재접속 후 동일 증상 재현
4. `x 닫기` 후 마인드맵 위치 이상
5. 검색 `엔터` 미동작

## Primary Files

- `09_app/src/App.jsx`
- `09_app/src/components/MindmapCanvas.jsx`
- `09_app/src/components/SidebarTree.jsx`
- `09_app/tests/`

## PM 판단

- 다음 tranche는 설계보다 먼저 `재현과 분해`가 맞다.

## Next Active Work

- `MM3-100 Runtime Sync Bug Repro Execution`

## Revision History

- `R1` / `2026-03-24 10:32 KST` / `Codex PM` / runtime sync bug repro plan을 최초 기록
