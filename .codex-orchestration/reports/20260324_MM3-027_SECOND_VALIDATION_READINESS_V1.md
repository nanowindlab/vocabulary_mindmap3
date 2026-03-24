# 20260324_MM3-027_SECOND_VALIDATION_READINESS_V1

## Revision Meta

- 실행일시: `2026-03-24`
- 실행자: `SECOND_READINESS_AGENT`
- 입력 문서: `MM3-024`, `MM3-025`, `MM3-026`, `MM3-020`, `MM3-011`, `WORK_ORCHESTRATION_HUB_V1`
- 목적: `MM3-026` 두 번째 제한 검증 패킷을 실제로 실행하기 전에 갖춰야 할 준비 상태만 판정한다.

## 1. 실행 전 확인 항목

- `MM3-024`의 예외군 정의가 먼저 기준으로 고정되어 있어야 한다.
- `MM3-025`의 재집계 기준이 `categories`, `translations`, `pos`, helper 필드에 대해 분리된 상태여야 한다.
- `MM3-026`의 대상 범위가 `home categories`, `result translations`, `home pos`, `sense_count / has_subwords / has_related_forms`로만 잠겨 있어야 한다.
- `MM3-020`에서 관측된 누락 항목이 실제 실행 입력으로 재사용 가능해야 한다.
- canonical count `53,480`은 기준축으로만 유지되고, 이번 패킷의 성공 여부를 대신하지 않아야 한다.
- helper 필드는 저장형 결함이 아니라 계산 경로와 반영 경로 확인 대상으로만 다뤄져야 한다.

## 2. 필요한 실제 입력/경로

### 2.1 문서 입력

- `.codex-orchestration/reports/20260324_MM3-026_SECOND_LIMITED_VALIDATION_PACKET_V1.md`
- `.codex-orchestration/reports/20260324_MM3-025_REVALIDATION_CRITERIA_RESET_V1.md`
- `.codex-orchestration/reports/20260324_MM3-024_VALIDATION_MODEL_REFRAME_V1.md`
- `.codex-orchestration/reports/MM3-020_FIRST_LIMITED_VALIDATION_REPORT_V1.md`
- `.codex-orchestration/reports/MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1.md`

### 2.2 실제 증빙 경로

- `vocab_dictionary/output/unified_live/kcenter_merge_report.json`
- `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- `vocab_dictionary/output/unified_live/kcenter_link_integrity.json`

### 2.3 실행 시 실제로 읽어야 하는 관측값

- 홈 `categories` 누락 관측치
- 결과 `translations` 누락 관측치
- 홈 `pos` 누락 관측치
- `sense_count`, `has_subwords`, `has_related_forms`의 계산 경로 및 반영 경로
- canonical count `53,480`

## 3. 누락되면 실행하면 안 되는 것

- `MM3-024` 없이 `MM3-026`를 바로 결함 집계하는 것
- `MM3-025` 없이 예외 제외 후 잔여 결함을 재집계하는 것
- `MM3-020`의 실제 관측값 없이 추정치로 실행하는 것
- `vocab_dictionary/output/unified_live/`의 세 증빙 파일 중 하나라도 없는 상태에서 실행하는 것
- `categories`와 `translations`를 thin projection 누락만으로 일괄 결함 처리하는 것
- helper 필드를 저장형 누락처럼 다시 세는 것
- `MM3-026` 범위를 벗어나 `detail/expression/filter` 전 화면으로 확장하는 것

## 4. 실행 가능 / 보류 기준

### 실행 가능

- 예외 선분류 기준이 문서상 고정되어 있다.
- 실제 증빙 경로 3종이 모두 접근 가능하다.
- `MM3-020`의 누락 항목을 대상으로 `categories`, `translations`, `pos`, helper 필드가 분리된 상태다.
- helper 필드가 계산형으로만 취급된다는 점이 문서상 명확하다.
- canonical count가 기준축으로 유지된다.

### 보류

- 예외군과 결함군이 아직 문서상 분리되지 않았다.
- 실제 증빙 파일이 하나라도 없거나 오래된 상태다.
- `categories`와 `translations`가 source-native 예외 후보인지 아직 확인되지 않았다.
- helper 필드를 저장형 결함으로 볼 가능성이 남아 있다.
- 범위가 홈/결과/상세/표현층/필터 바 전체로 다시 넓어졌다.

## 5. Reflection

- 이번 readiness의 핵심은 새 검증을 `할 수 있는가`가 아니라 `지금 해도 되는가`를 가르는 데 있다.
- `MM3-026`은 결함을 다시 넓게 찾는 패킷이 아니라, 예외를 먼저 빼고 남는 잔여 결함만 세는 패킷이므로 입력이 조금이라도 불완전하면 결과가 쉽게 과잉 실패로 기운다.
- 특히 `categories`와 `translations`는 source-native 부재, source-native 대체, projection 비대상 중 어디에 속하는지 먼저 고정돼야 하며, 그 전에는 실행하지 않는 것이 맞다.
- helper 필드는 저장형 결함 집계에 넣는 순간 새 검증 모델의 의도가 무너진다.
