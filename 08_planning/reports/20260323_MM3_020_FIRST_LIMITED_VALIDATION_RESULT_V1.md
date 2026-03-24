# 20260323_MM3_020_FIRST_LIMITED_VALIDATION_RESULT_V1

## Scope

- `MM3-020 First Limited Validation Execution`

## PM Result Summary

- 판정: `FAIL`

## 핵심 결과

- canonical count는 `53,480`으로 통과
- 홈 required field:
  - `categories` 누락 `8,506`
  - `pos` 누락 `4`
- 결과 required field:
  - `translations` 누락 `1,762`
- `sense_count`, `has_subwords`, `has_related_forms`는 저장된 live 산출물에서 확인되지 않음

## 해석

- 문서 계약과 실제 산출물 사이에 차이가 있음
- 다음 단계는 원인 분해와 최소 수리 경로 정리다

## Next Active Work

- `MM3-021 Validation Failure Triage`
