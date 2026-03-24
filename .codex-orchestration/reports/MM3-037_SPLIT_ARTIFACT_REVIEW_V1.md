# MM3-037_SPLIT_ARTIFACT_REVIEW_V1

## 검토 개요

- 대상: `vocab_dictionary/output/unified_live/kcenter_thin_index.json.gz`
- 대상: `vocab_dictionary/output/unified_live/kcenter_facet_payload.json.gz`
- 기준: `08_planning/reports/20260324_MM3_034_THIN_FACET_TARGET_CONTRACT_V1.md`
- 범위: review-only

## 계약 적합성

- `thin index`와 `facet payload`가 모두 계약상 별도 표면으로 실제 존재한다.
- `thin index`는 홈/결과용 최소 projection 역할과 일치한다.
- `facet payload`는 필터 바용 독립 상태/옵션 표면과 일치한다.
- `detail payload`, `expression payload`는 이번 산출물에 포함되지 않았고, 계약의 후순위 범위와도 충돌하지 않는다.

## count 적합성

- `thin index` `entry_count`: `53,480`
- `thin index` 실제 `entries` 길이: `53,480`
- `facet payload` `entry_count`: `53,480`
- `facet payload`의 4개 facet 옵션 합계가 모두 `53,480` 또는 계약상 집계 기준값에 맞게 닫힌다.
- `TOPIK`은 `match_count 8,698`이며 `level` 합계 `8,698`, `band` 합계 `8,698`으로 일치한다.

## 필드 적합성

- `thin index` 상위 구조는 `schema_version`, `generated_at`, `entry_count`, `entries`로 계약 파생 표면에 적합하다.
- 각 `entry`는 `id`, `word`, `pos`, `word_grade`, `categories`를 포함한다.
- 각 레코드는 `sense_count`, `has_subwords`, `has_related_forms`, `representative_sense`를 포함한다.
- `representative_sense`는 `id`, `definition`, `translation_summary`만 유지하고, 전체 `examples`, `related_terms`, `related_forms`, `subwords`, `translations`는 제외되어 있다.
- 전체 레코드 검증 결과, 필수 필드 누락과 예기치 않은 추가 필드는 없었다.
- `facet payload`는 `학습난이도`, `TOPIK`, `품사`, `외국어 종류` 4개 facet만 포함하며, 각 facet의 `selected` 상태는 초기 빈 상태다.

## Residual Risk

- 이 검토는 artifact 자체만 확인했으며, 실제 consumer loader wiring은 검증하지 않았다.
- 허브에 남아 있는 canonical `entry_count` drift 경고는 이 review 범위에서 직접 해소하지 않았다. 현재 산출물은 `53,480`에 맞지만, 상위 파이프라인의 기준이 바뀌면 재검증이 필요하다.

## Verdict

- `ACCEPT`

## Reflection

- 이번 분리 산출물은 계약이 요구한 최소 표면을 정확히 지켰고, count도 닫혔다.
- 핵심은 payload를 확장하는 것이 아니라 홈/결과용 얇은 표면과 필터용 상태 표면을 섞지 않는 것이었는데, 그 원칙이 잘 반영됐다.
- 다음 단계가 있다면 artifact 생성이 아니라 consumer 경로 연결 여부를 별도 검증하는 쪽이 맞다.
