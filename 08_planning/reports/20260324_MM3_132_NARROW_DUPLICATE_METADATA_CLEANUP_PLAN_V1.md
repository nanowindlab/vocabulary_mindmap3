# 20260324_MM3_132_NARROW_DUPLICATE_METADATA_CLEANUP_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 14:00 KST`

## Last Updated By

- `Codex PM`

## 목적

- `정말 명백한 duplicate metadata`만 좁게 정리한다.

## Scope

- exact duplicate search row collapse
- unresolved relation duplicate collapse

## Out Of Scope

- actual homograph 제거
- payload/builder mass dedup
- 관련형의 type 차이를 무시한 병합

## Evidence

- exact duplicate search row: `1`
  - `가중되다`
- exact related term duplicate by exact key: `0`
- user-facing unresolved relation duplicate sample:
  - `물가 -> 참고어: 가격` 2건

## Next Active Work

- `MM3-133 Narrow Duplicate Metadata Cleanup Implementation`

## Revision History

- `R1` / `2026-03-24 14:00 KST` / `Codex PM` / narrow duplicate metadata cleanup 범위를 최초 고정
