# 한국어 기초사전 집대성본 최종 정리

---
date: 2026-03-23
schema_version: v2.3
source_scope: 로컬 JSON 11개 파일 + Open API(view) 전체 반영
script: /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/scripts/build_kcenter_dataset.py
output_dir: /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live
---

## 1. 최종 결과 요약

- 최종 집대성본은 **JSON seed + Open API(view) 풍부화 병합본**이다.
- 전체 API XML 반영 수: **53,439 / 53,439**
- 최종 `review_queue`: **0**
- 최종 `unmatched_api_subwords`: **0**
- 남은 무결성 이슈:
  - `dangling related_terms`: **811**
  - `dangling related_forms`: **1085**

### 원천 규모

| 항목 | 수량 |
|---|---:|
| JSON 원천 row 수 | 56,322 |
| unique `target_code` 수 | 53,439 |
| grouped row 묶음 수 | 1,160 |
| grouped `관용구/속담` row 수 | 2,883 |
| 최종 번역 레코드 수 | 71,683 |

## 2. 최종 스키마

상세 문서는 [한국어 기초사전_통합스키마_v2.md](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/한국어%20기초사전_통합스키마_v2.md)를 기준으로 하고, 실제 구현 기준 핵심만 아래에 요약한다.

### 2-1. 식별자 규칙

- 최상위 엔트리 PK: `entry.id = target_code`
- sense PK: `senses[].id = {entry.id}#sense-{NNN}`
- JSON `Sense[@val]`은 `senses[].source_ids.json`에 보존
- API sense는 명시적 sense id가 없으므로 `senses[].source_ids.api = "{target_code}:sense:{NNN}"` 형태로 보존

### 2-2. 최상위 구조

```json
{
  "meta": {
    "schema_version": "v2.3",
    "source_status": {
      "json_present": true,
      "api_view_fetched": true
    }
  },
  "entry": {
    "id": "target_code",
    "word": "표제어",
    "homonym_no": 0,
    "word_unit": "단어|구|관용구|속담|문법·표현",
    "word_type": "고유어|한자어|외래어|혼종어|null",
    "pos": [],
    "word_grade": "초급|중급|고급|null",
    "annotation": null,
    "pronunciation": [],
    "original_language": {
      "type": null,
      "form": null
    },
    "conjugations": [],
    "categories": [],
    "senses": [],
    "subwords": [],
    "related_forms": []
  }
}
```

### 2-3. 핵심 서브 구조

#### `senses[]`

- `definition`
- `reference`
- `annotation`
- `syntactic_annotation`
- `syntactic_patterns[]`
- `examples[]`
  - `type`
  - `texts[]`
- `translations[]`
- `related_terms[]`
  - `type`
  - `word`
  - `target_code`
  - `link_type`
  - `is_dangling`
- `multimedia[]`
- `match_method`
- `match_confidence`

#### `subwords[]`

- `text`
- `unit`
- `source_type`
  - `json_grouped`
  - `api_view`
- `link_target_code`
- `link_confidence`
- `senses[]`
  - `definition`
  - `reference`
  - `syntactic_patterns[]`
  - `examples[]`
  - `translations[]`
  - `source_ids`

#### `related_forms[]`

- `type`
- `word`
- `target_code`
- `link_type`
- `link_status`
- `is_dangling`

## 3. 추출 방법

### 3-1. 핵심 원칙

- JSON은 **시드**다.
- API(view)는 **풍부화 소스**다.
- 같은 정보가 양쪽에 있을 때도, API가 더 구조적이거나 더 풍부하면 **덮어쓰기보다 흡수/합집합 병합**을 한다.

### 3-2. 실제 추출 절차

#### Step 1. JSON seed 생성

명령:

```bash
python3 vocab_dictionary/scripts/build_kcenter_dataset.py seed \
  --output-dir vocab_dictionary/output/unified_live
```

동작:

- `dict_download_json/*.json` 11개 파일을 읽음
- `LexicalEntry[@val]` 기준으로 row를 그룹핑
- `단어` row를 부모 엔트리로 사용
- 같은 `val`을 공유하는 `관용구/속담` row는 `entry.subwords[]`로 접음
- 결과:
  - `56,322 row -> 53,439 entry`

#### Step 2. API XML 수집

명령:

```bash
python3 vocab_dictionary/scripts/build_kcenter_dataset.py fetch-api \
  --output-dir vocab_dictionary/output/unified_live \
  --api-xml-dir vocab_dictionary/output/api_xml_live \
  --limit 53439 \
  --jitter-seconds 0.15 \
  --max-retries 3 \
  --timeout-seconds 20 \
  --resume
```

동작:

- `kcenter_base.seed.json`의 entry 목록을 기준으로 `view?method=target_code&q={target_code}` 호출
- 기본 딜레이: `0.10초`
- 기본 지터: `0.10초`
- 운영 시에는 `--jitter-seconds 0.15`로 사용
- 기존 XML이 있으면 `resume`으로 재사용
- `010 Daily API Limit Exceeded`, `020`, `021` 같은 fatal error는 감지 후 중단

#### Step 3. API 풍부화 병합

명령:

```bash
python3 vocab_dictionary/scripts/build_kcenter_dataset.py merge \
  --output-dir vocab_dictionary/output/unified_live \
  --api-xml-dir vocab_dictionary/output/api_xml_live
```

동작:

- seed 엔트리에 API `word_info`를 병합
- 병합 대상:
  - `definition`
  - `reference`
  - `pattern`
  - `examples`
  - `related_terms`
  - `related_forms`
  - `categories`
  - `word_type`
  - `conjugations`
  - `subwords`

### 3-3. sense 매칭 방식

우선순위:

1. `definition_exact`
2. `manual_override_match`
3. `definition_fuzzy_relaxed`
4. `definition_fuzzy`
5. `pattern_exact`
6. `example_signature`
7. `order_fallback`
8. `manual_override_append`

최종 통계:

| match_method | 건수 |
|---|---:|
| `definition_exact` | 73,057 |
| `manual_override_match` | 32 |
| `definition_fuzzy_relaxed` | 54 |
| `definition_fuzzy` | 22 |
| `pattern_exact` | 24 |
| `example_signature` | 19 |
| `order_fallback` | 176 |
| `manual_override_append` | 9 |

## 4. 오류 사항과 개선책

### 4-1. JSON `LexicalEntry[@val]`을 row PK로 오인

문제:

- 초기에는 `LexicalEntry[@val] == 독립 엔트리 PK`로 가정했음
- 실제로는 `단어 + 관용구/속담`을 묶는 group ID처럼 동작하는 경우가 많았음

증상:

- 중복 `target_code`
- seed entry 수가 56,322로 부풀어짐
- merge 시 entry 수가 갑자기 줄어드는 현상 발생

개선:

- `56,322 row -> 53,439 grouped entry` 구조로 전환
- grouped `관용구/속담` row는 `subwords[]`로 접음

### 4-2. API 일일 호출 한도 초과

문제:

- 실제 전체 수집 도중 `010 Daily API Limit Exceeded` 발생

개선:

- `resume` 기반 재개 구조 사용
- fatal error XML 감지 로직 추가
- 인증키 교체 후 같은 명령으로 이어받음

### 4-3. sense 자동 매칭 실패

문제:

- 의미는 사실상 같지만 조사, 문체, 어휘 차이 때문에 exact match 실패
- 다의어 동사 등은 문형까지 동일해서 collision 발생

개선:

- `definition_fuzzy_relaxed` 규칙 추가
  - `top >= 0.90`
  - `top - next >= 0.15`
- `manual_override` 테이블 추가
- 최종 `review_queue = 0`

### 4-4. API subword 연결 실패

문제:

- API `subword_info`에는 target_code가 없음
- `그 나물에 그 밥` 1건이 마지막까지 unresolved였음

개선:

- grouped JSON subword까지 역검색 대상으로 확장
- 최종 `unmatched_api_subwords = 0`

### 4-5. dangling link

현황:

- `related_terms`: 811
- `related_forms`: 1085

의미:

- 현재 코어 DB 내부에 없는 target_code를 가리키는 관계
- 데이터 오류라기보다 범위 밖 참조이거나 link metadata가 불완전한 경우가 포함됨

세부 원인:

- `related_terms`의 대부분은 **sense-level 관련어**인데, 남은 811건 중 **779건이 `target_code=0`** 이다.
- `related_forms`의 대부분은 **entry-level 파생/참고형**인데, 남은 1085건 중 **1084건이 `target_code=0`** 이다.
- 즉 dangling의 본체는 실제 엔트리 누락보다 **원천 링크값이 비어 있는 것과 같은 0 값**이다.
- non-zero dangling은 후속 API 확인 결과 대부분 실제 엔트리가 존재했고, 이 중 41건은 보조 수집으로 편입 완료했다.

앱 처리 기준:

- `link_status='resolved_internal'`
  - 내부 상세 이동 허용
- `link_status='unresolved_zero_code'`
  - 원천이 `target_code=0`을 준 관계
  - 텍스트 노출만 하고 navigation 금지
- `link_status='unresolved_missing_entry'`
  - non-zero `target_code`가 있으나 현재 코어 DB에 없음
  - 후속 수집 또는 보조 사전 연결 후보
- `link_status='unresolved_no_target_code'`
  - target_code 자체가 비어 있음
  - 외부/미해결 텍스트 참조로 취급

개선책:

- 앱에서는 텍스트는 보여 주되 직접 navigation은 막음
- `is_dangling=true`를 UI 가드 조건으로 사용
- 추후 외부 범위까지 확장 수집 시 재해소 가능

## 5. 최종 산출물 설명

### 5-1. `kcenter_base.seed.json`

경로:

- [kcenter_base.seed.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_base.seed.json)

설명:

- JSON 원천만 반영한 seed
- grouped row 정리가 끝난 상태
- API 풍부화 전 기준본

용량:

- 약 `423MB`

### 5-2. `kcenter_translations.seed.json`

경로:

- [kcenter_translations.seed.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_translations.seed.json)

설명:

- JSON 원천 번역만 분리한 seed lookup
- `sense_id` 기준으로 연결

용량:

- 약 `174MB`

### 5-3. `kcenter_base.json`

경로:

- [kcenter_base.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_base.json)

설명:

- 최종 한국어 본체
- JSON seed + API view 풍부화 병합 완료본
- 실제 앱/DB 적재 시 메인 데이터셋으로 사용

용량:

- 약 `441MB`

### 5-4. `kcenter_translations.json`

경로:

- [kcenter_translations.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_translations.json)

설명:

- 최종 번역 룩업 데이터
- `sense_id` 기준 역참조

용량:

- 약 `174MB`

### 5-5. `kcenter_merge_report.json`

경로:

- [kcenter_merge_report.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_merge_report.json)

설명:

- seed 통계
- API 처리 개수
- sense match 방식별 통계
- review queue 현황
- subword link 현황
- dangling link 수치

용도:

- QA
- 배치 검증
- 다음 수집/재병합 시 기준 비교

### 5-6. `kcenter_link_integrity.json`

경로:

- [kcenter_link_integrity.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_link_integrity.json)

설명:

- dangling link 요약
- unresolved link sample
- 정책 문구
- unmatched API subword 목록

용도:

- 앱에서 navigation guard 구현
- dangling link 후처리 작업

### 5-7. `kcenter_review_queue.json`

경로:

- [kcenter_review_queue.json](/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_review_queue.json)

설명:

- 최종 수동 검토가 필요한 sense 목록

현재 상태:

- **비어 있음 (`0건`)**

## 6. 산출물 이용 방법

### 6-1. 앱/DB 적재 기준

- 메인 사전: `kcenter_base.json`
- 번역 조회: `kcenter_translations.json`
- 링크 방어: `kcenter_link_integrity.json`

### 6-2. 기본 로딩 순서

1. `kcenter_base.json` 로드
2. entry 검색 시 `entry.id`, `word`, `word_grade`, `pos`, `categories` 사용
3. 상세 화면에서 `senses[]`, `subwords[]`, `related_forms[]` 사용
4. 번역이 필요할 때 `sense_id`로 `kcenter_translations.json` 조회
5. 링크 이동 전 `is_dangling` 또는 integrity 정보 확인

### 6-3. 검색/탐색 구현 권장

- 표제어 검색: `entry.word`
- 의미 검색: `senses[].definition`
- 예문 검색: `senses[].examples[].texts[]`
- 관용구/속담 탐색:
  - `entry.subwords[]`
  - 또는 `word_unit in ('관용구', '속담')`인 entry 직접 탐색

### 6-4. 앱에서 주의할 점

- `related_terms.target_code`가 있어도 `is_dangling=true`면 클릭 이동 금지
- `subwords.link_target_code`가 없는 경우는 텍스트만 노출
- `word_type`은 API 직접값이 더 신뢰도 높음
- `examples[].texts[]`는 대화 발화 경계를 유지하므로 문자열 1개로 평탄화하지 않는 것이 좋음

### 6-5. 재생성/재수집 시 권장 명령

```bash
# 1. seed
python3 vocab_dictionary/scripts/build_kcenter_dataset.py seed \
  --output-dir vocab_dictionary/output/unified_live

# 2. API fetch
python3 vocab_dictionary/scripts/build_kcenter_dataset.py fetch-api \
  --output-dir vocab_dictionary/output/unified_live \
  --api-xml-dir vocab_dictionary/output/api_xml_live \
  --limit 53439 \
  --jitter-seconds 0.15 \
  --max-retries 3 \
  --timeout-seconds 20 \
  --resume

# 3. merge
python3 vocab_dictionary/scripts/build_kcenter_dataset.py merge \
  --output-dir vocab_dictionary/output/unified_live \
  --api-xml-dir vocab_dictionary/output/api_xml_live
```

## 7. 결론

- 최종 집대성본은 **53,439 entry 기준으로 완성**
- 자동 병합이 막히던 `review_queue`는 **0건으로 정리 완료**
- `unmatched subword`도 **0건으로 정리 완료**
- 실무적으로 남은 것은 **dangling link를 앱에서 어떻게 처리할지**뿐이다
