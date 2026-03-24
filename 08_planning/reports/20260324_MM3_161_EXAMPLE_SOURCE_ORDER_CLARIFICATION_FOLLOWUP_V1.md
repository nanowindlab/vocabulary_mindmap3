# 20260324_MM3_161_EXAMPLE_SOURCE_ORDER_CLARIFICATION_FOLLOWUP_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 20:25 KST`

## Last Updated By

- `Codex PM`

## Scope

- example source / order clarification follow-up

## Problem

- raw feedback `F-002`는 `예문은 어디서 가져오고 순서는?`에 대한 설명이 아직 간단 수준이라는 점을 남겼다.
- 기존 helper는 `현재 의미 우선, 없으면 대표 예문`까지만 말하고, source label과 최대 노출 개수는 충분히 설명하지 않았다.

## Applied

- examples tab helper copy를 구체화했다.
  - 현재 선택 의미의 사전 예문 우선
  - 없으면 대표 예문 fallback
  - source label은 `구/문장` 같은 사전 예문 유형 또는 `TOPIK round`
  - 현재 최대 `8개` 노출
- regression test를 추가했다.
  - examples helper explains source and ordering

## Verification

- `npx playwright test` `21 passed`

## PM Verdict

- `ACCEPT`

## Coverage Effect

- raw feedback 기준:
  - `F-002` `부분반영 -> 반영`

## Next Active Work

- `MM3-159 Motion / Mindmap Human Re-check`

## Revision History

- `R1` / `2026-03-24 20:25 KST` / `Codex PM` / example source/order helper follow-up과 검증 결과를 최초 기록
