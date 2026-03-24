# 20260323_MM3_006_STALE_SUMMARY_POLICY_V1

## 결론

- `53,439`와 `53,480`의 차이는 단순 오타가 아니다.
- `53,439`는 `seed 단계` 기준 수치다.
- `53,480`는 `merge 단계`에서 API-only entry `41`개가 추가된 최종 산출물 기준 수치다.

## 확인 근거

- `vocab_dictionary/output/unified_live/kcenter_base.seed.json`
  - `entry_count = 53,439`
- `vocab_dictionary/output/unified_live/kcenter_base.json`
  - `entry_count = 53,480`
  - `api_xml_merged = 53,480`
- `vocab_dictionary/output/unified_live/kcenter_merge_report.json`
  - `api_entries_created = 41`
  - `entry_count = 53,480`
- `vocab_dictionary/scripts/build_kcenter_dataset.py`
  - `merge_api_xml_into_records()`가 seed에 없는 API entry를 `make_empty_entry_record()`로 추가 생성함

## 원인 설명

- seed build는 로컬 JSON에서 그룹핑된 entry만 대상으로 한다.
- merge build는 API XML을 읽으면서 seed에 없는 `entry_id`가 나오면 새 record를 만든다.
- 따라서 최종 merged artifact는 seed보다 `41`개 많아졌다.

## PM 판단

- 현재 canonical count는 `53,480`로 본다.
- `53,439`는 historical seed-stage count로 취급한다.
- 따라서 `krdict_final_summary.md`와 동일 내용의 한국어 summary 문서는 현재 merged artifact 기준 summary가 아니라 `historical summary`로 명시한다.

## 처리 정책

1. 현재 artifact truth는 `kcenter_base.json(.gz)`와 `kcenter_merge_report.json`을 우선한다.
2. `krdict_final_summary.md`, `한국어 기초사전_최종정리.md`는 stale note를 문서 상단에 명시한다.
3. 추후 필요하면 merged-artifact 기준으로 새 summary를 별도 revision으로 다시 만든다.
4. 그 전까지는 old summary 수치를 current truth로 인용하지 않는다.

## PM Verdict

- `ACCEPT`

## Next Active Work

- `MM3-007 Implementation Gate Definition`
