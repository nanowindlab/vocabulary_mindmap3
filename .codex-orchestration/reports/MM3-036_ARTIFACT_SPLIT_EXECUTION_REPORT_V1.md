# MM3-036_ARTIFACT_SPLIT_EXECUTION_REPORT_V1

## Revision Meta

- 실행일시: `2026-03-24`
- 실행자: `ARTIFACT_SPLIT_AGENT`
- 기준 문서: `20260324_MM3_034_THIN_FACET_TARGET_CONTRACT_V1.md`, `20260324_MM3_035_RUNTIME_REFLECTION_RETRY_PLAN_V1.md`, `MM3-010_RUNTIME_CONTRACT_PACKAGE_V1.md`, `MM3-009_IA_PACKAGE_V1.md`
- 입력 데이터: `vocab_dictionary/output/unified_live/kcenter_base.json.gz`, `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`, `vocab_dictionary/output/topik_stats_linkage/entry_topik_stats.json.gz`

## 1. 실행 개요

- `thin index`와 `facet payload`를 실제 산출물로 분리 생성했다.
- 범위는 `vocab_dictionary/output/unified_live/` 하위의 새 파일 생성에만 한정했다.
- `detail payload`와 `expression payload`는 생성하지 않았다.

## 2. 생성/수정한 산출물 목록

- 생성: [kcenter_thin_index.json.gz](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_thin_index.json.gz)
- 생성: [kcenter_facet_payload.json.gz](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_facet_payload.json.gz)
- 수정: 없음

## 3. 생성 규칙

- `thin index`는 entry 단위 최소 projection만 담았다.
- `entry`에는 `id`, `word`, `pos`, `word_grade`, `categories`만 남겼다.
- `sense_count`, `has_subwords`, `has_related_forms`는 계산형 helper로 넣었다.
- 대표 sense는 `sense_order` 기준 첫 번째 sense를 사용했다.
- 대표 sense의 번역은 상위 3개만 `translation_summary`로 남기고, `examples`, `related_terms`, `related_forms`, `subwords`, 전체 `translations`는 제외했다.
- 빈 `pos` 4건은 thin projection에서 `품사 없음`으로 흡수했다.
- `facet payload`는 `학습난이도`, `TOPIK`, `품사`, `외국어 종류` 4개 facet만 담았다.
- 각 facet의 `selected` 상태는 초기 빈 상태로 유지했다.
- `TOPIK`은 linked stats의 `level`과 `band`만 사용했고, `band`가 비어 있는 1,384건은 `미기재`로 흡수했다.
- `detail payload`, `expression payload`, dictionary 본문 확장은 하지 않았다.

## 4. count / required field 영향

| 항목 | 영향 |
|---|---|
| canonical `entry_count` | `53,480` 유지 |
| `thin index` record 수 | `53,480` |
| `facet payload` record 수 | `53,480` |
| `thin index` required field | `entry.id`, `entry.word`, `entry.pos`, `entry.word_grade`, `entry.categories`, `sense_count`, `has_subwords`, `has_related_forms`, `representative_sense.id`, `representative_sense.definition`, `representative_sense.translation_summary`를 모두 포함 |
| `pos` 영향 | source-native 빈값 4건을 `품사 없음`으로 projection normalization |
| `categories` 영향 | source-native 빈 리스트는 그대로 유지, 추가 보정 없음 |
| `word_grade` 영향 | `초급 2,535`, `중급 9,019`, `고급 36,945`, `없음 4,981`로 유지 |
| `품사` facet 영향 | 빈 `pos` 4건을 포함해 총합 `53,480`으로 닫힘 |
| `외국어 종류` facet 영향 | 빈 `original_language.type` 17,516건을 `안 밝힘`으로 흡수해 총합 `53,480`으로 닫힘 |
| `TOPIK` facet 영향 | `match_count 8,698`, `level` 합계 `8,698`, `band` 합계 `8,698`으로 닫힘 |
| structure expansion | `detail payload`, `expression payload` 확장 없음 |

## 5. 재검증 준비 상태

- artifact-level 재검증은 준비 완료다.
- 다음 확인 지점은 `thin index` 존재 확인, `facet payload` 존재 확인, 홈/결과의 `thin index` 사용 가능성, 필터 바의 `facet payload` 사용 가능성이다.
- 현재 실행은 payload 분리까지만 수행했으므로, consumer loader wiring 검증은 별도 단계가 필요하다.

## 6. 검증 결과

- `thin index` 샘플 첫 레코드에서 `entry` 최소 필드와 `representative_sense.translation_summary`가 정상 생성됨을 확인했다.
- `facet payload`의 4개 facet이 모두 생성됐고, 각 option count가 기대 합계와 일치함을 확인했다.
- `TOPIK` band는 `1/2/3/4/5/미기재` 6개 옵션으로 닫혔다.
- `canonical count 53,480`은 변경되지 않았다.

## 7. Reflection

- 이번 분리의 핵심은 payload를 더 많이 만드는 것이 아니라, 홈/결과용 얇은 표면과 필터용 상태 표면을 서로 섞지 않는 데 있었다.
- `pos`와 `TOPIK band`의 빈값은 projection에서 sentinel로 흡수하지 않으면 count가 닫히지 않았기 때문에, 최소한의 normalization만 허용했다.
- `detail payload`와 `expression payload`를 이번에 열지 않은 것은 의도된 보류이며, 다음 재검증이 성공한 뒤에만 확장 대상이 된다.
- 다음 단계는 이 두 산출물이 실제 consumer 경로에서 읽히는지 별도 검증하는 것이다.
