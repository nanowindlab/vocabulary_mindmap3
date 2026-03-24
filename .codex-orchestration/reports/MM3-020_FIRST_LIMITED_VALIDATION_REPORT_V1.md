# MM3-020_FIRST_LIMITED_VALIDATION_REPORT_V1

## Revision Meta

- 실행일시: `2026-03-23`
- 실행자: `FIRST_VALIDATION_AGENT`
- 입력 문서: `MM3-017`, `MM3-018`, `MM3-011`, `MM3-010`, `MM3-009`
- 증빙 경로: `vocab_dictionary/output/unified_live/kcenter_merge_report.json`, `vocab_dictionary/output/unified_live/kcenter_base.json.gz`, `vocab_dictionary/output/unified_live/kcenter_link_integrity.json`
- 패킷 ID: `MM3-020`

## 1. 실행 범위

- `홈/결과`의 `thin projection`
- `canonical count`
- `required field`

## 2. 검증 결과

| 항목 | 기준 | 관측 | 판정 | 비고 |
|---|---|---|---|---|
| canonical count | `53,480` | `53,480` | PASS | `kcenter_merge_report.json`의 `merge.entry_count` 및 `api_entries_processed/api_entries_merged`가 모두 일치 |
| 홈 required field | `entry.id`, `entry.word`, `entry.pos`, `entry.word_grade`, `entry.categories` 요약 | `id/word/word_grade`는 확인됐으나 `categories` 누락 8,506건, `pos` 누락 4건 확인 | FAIL | `kcenter_base.json.gz` 전수 기준 |
| 결과 required field | `entry` 요약 + `sense` 요약 + thin projection helper field | `definition`/`translations`를 가진 sense는 많았으나 `translations` 누락 1,762건, `sense_count`/`has_subwords`/`has_related_forms` 저장본 미확인 | FAIL | `kcenter_base.json.gz` 전수 기준 |

## 3. 상세 관측

- `kcenter_merge_report.json`에서 `merge.entry_count`는 `53,480`이며 `api_entries_processed`와 `api_entries_merged`도 동일했다.
- `kcenter_base.json.gz` 전수에서 홈 필수 필드 중 `categories`는 `8,506`개 entry에서 비어 있었고, `pos`는 `4`개 entry에서 비어 있었다.
- 같은 원자료 전수에서 결과 sense 필드 중 `translations`는 `1,762`개 sense에서 비어 있었다.
- `sense_count`, `has_subwords`, `has_related_forms`는 `kcenter_base.json.gz`의 샘플과 전수 검색에서 저장 필드로 확인되지 않았다.

## 4. 판정

- `FAIL`
- 다음 패킷 진행은 `NO`

## 5. 증빙 경로

- `vocab_dictionary/output/unified_live/kcenter_merge_report.json`
- `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- `vocab_dictionary/output/unified_live/kcenter_link_integrity.json`

## 6. Reflection

- canonical count는 문서 기준과 실제 live 산출물에서 닫혔지만, 홈 required field의 `categories` 누락이 다수라 thin projection 계약은 아직 닫히지 않았다.
- 결과 required field도 `translations` 누락이 확인되어, 최소 요약 수준조차 전수 기준으로는 불안정했다.
- 이번 패킷은 범위를 넓히지 않았고, `홈/결과`, `count`, `required field` 안에서만 실제 산출물을 확인했다.
