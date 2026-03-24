# 20260324_MM3_087_COMPACT_TRANSLATION_SUMMARY_ENRICHMENT_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- compact surface translation summary를 enrich할지 결정한다.

## Evidence

- detail 기준 영어 translation이 존재하는 entry는 `2개`
- compact `translation_summary`에 영어가 빠진 entry도 `2개`
- 확인 표본:
  - `56884 반딧불`
  - `600361 로브스터`

## PM 판단

- `DEFER`

## 이유

- 영향 범위가 현재 기준 `2개`로 매우 작다.
- compact payload enrichment는 builder/summary 구조 조정이 필요하다.
- 현재 제품에서 더 큰 learner-facing 가치는 compact summary보다 전체 readiness 점검 쪽에 있다.

## 결론

- compact translation summary enrichment는 현재 block이 아니다.
- 영어 우선 정책은 detail/rich surface에서만 충분히 유지한다.

## Next Active Work

- `MM3-088 Pilot Readiness Checkpoint`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / compact translation summary enrichment를 defer로 결정
