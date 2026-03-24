# 20260324_MM3-028_SECOND_LIMITED_VALIDATION_REPORT_V1

## Revision Meta

- 실행일시: `2026-03-24`
- 실행자: `SECOND_VALIDATION_AGENT`
- 기준 패킷: `MM3-026`
- 기준 문서: `MM3-025`, `MM3-020`, `MM3-011`
- 실행 범위: `categories`, `translations`, `pos`, helper field 해석

## 1. 실행 개요

- 두 번째 제한 검증 패킷을 실제 산출물 기준으로 재수행했다.
- 범위는 `홈 categories`, `결과 translations`, `홈 pos`, helper field 해석에만 한정했다.
- `상세`, `표현층`, `필터 바 확장`, `taxonomy 재설계`, `learner flow 재구성`은 보지 않았다.

## 2. 예외군 선분류 결과

| 항목 | 관측 | 예외 분류 | 근거 |
|---|---:|---|---|
| 홈 `categories` 누락 | `8,506`건 | `source-native 부재` | `api_xml_live`에서 해당 8,506건 모두 `category_info` 블록이 없었다. 예시: [view_13963.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_13963.xml), [view_14178.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_14178.xml), [view_602018.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_602018.xml) |
| 결과 `translations` 누락 | `1,762`건 | `source-native 부재` | `kcenter_translations.json.gz`의 `records`를 `sense_id`로 대조했을 때, 누락 1,762건 모두 sidecar 레코드 자체가 없었다. 예시: `14849#sense-001`, `15583#sense-001`, `16762#sense-001` |
| 홈 `pos` 누락 | `4`건 | `source-native 부재` | 4건 모두 source XML에서 `pos`가 빈 값이었다. 예시: [view_14849.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_14849.xml), [view_72594.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_72594.xml), [view_600643.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_600643.xml), [view_602018.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_602018.xml) |
| helper field `sense_count` / `has_subwords` / `has_related_forms` | 저장본 미확인 | `computed helper` | `kcenter_base.json.gz` 전수에서 해당 필드 키가 entry/sense 어느 쪽에도 존재하지 않았다. |

## 3. 잔여 결함 재집계 결과

| 항목 | 기존 관측 | 예외 제외 수 | 잔여 결함 수 |
|---|---:|---:|---:|
| 홈 `categories` | `8,506` | `8,506` | `0` |
| 결과 `translations` | `1,762` | `1,762` | `0` |
| 홈 `pos` | `4` | `4` | `0` |
| helper field | `미확인` | `미적용` | `0` |

- 재집계 후 남은 residual defect는 `0`건이다.
- 따라서 이번 제한 검증 패킷에서 저장형 결함은 더 이상 남지 않는다.

## 4. 판정

- `PASS`
- `FAIL`: 해당 없음
- `STOPPED`: 해당 없음

## 5. 증빙 경로

- [kcenter_merge_report.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_merge_report.json)
- [kcenter_base.json.gz](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_base.json.gz)
- [kcenter_translations.json.gz](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_translations.json.gz)
- [kcenter_link_integrity.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_link_integrity.json)
- [view_13963.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_13963.xml)
- [view_14849.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_14849.xml)
- [view_600643.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_600643.xml)
- [view_602018.xml](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/api_xml_live/view_602018.xml)

## 6. Reflection

- 이번 패킷은 누락 수를 그대로 결함으로 고정하지 않고, 먼저 source-native 부재를 분리하는 방식이 맞았다.
- `categories`는 source XML에서 category block 자체가 없어서 thin projection 누락이 아니라 원천 부재로 분류할 수 있었다.
- `translations`는 sidecar `kcenter_translations.json.gz`에 대응 레코드가 없는 1,762건만 남았고, residual defect로는 0건이다.
- `pos` 4건도 source XML에서 빈 값인 `구` 계열 항목이어서 별도 defect로 남기지 않았다.
- helper field는 저장형 누락 검증의 대상이 아니라 계산형 확인 대상이므로, 이번 재집계에서 결함 수에 포함하지 않았다.
