# 20260324_MM3_128_PAYLOAD_LEVEL_DEDUP_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 13:28 KST`

## Last Updated By

- `Codex PM`

## 목적

- display-level dedup을 넘어서 payload/builder level dedup까지 갈지 판단한다.

## Current Facts

- `물가`, `보이다`, `보다`, `가다`는 실제 동형어/품사 차이라 제거 대상이 아님
- `물가`의 `가격` 참고어 중복처럼 unresolved metadata duplication은 존재
- 현재 main app에서는 display-level disambiguation과 exact duplicate collapse로 혼란을 줄였다

## PM 판단

- 다음 tranche는 `payload-level dedup decision`이 적절하다.

## Next Active Work

- `MM3-129 Payload-Level Dedup Readiness`

## Revision History

- `R1` / `2026-03-24 13:28 KST` / `Codex PM` / payload-level dedup decision tranche를 다음 작업으로 지정
