# MM3-023_REPAIR_EXECUTION_READINESS_V1

## Revision Meta

- Current Revision: `R1`
- Last Updated: `2026-03-23`
- Last Updated By: `REPAIR_READINESS_AGENT`
- 기준 문서: `MM3-022_REPAIR_PACKET_V1`, `MM3-020_FIRST_LIMITED_VALIDATION_REPORT_V1`, `MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1`, `WORK_ORCHESTRATION_HUB_V1`
- 목적: `MM3-022` repair packet 실행 전에 필요한 준비 상태만 판정

## 1. 실행 전 확인 항목

- `MM3-022`의 수리 범위가 문서 보정 2건과 데이터 보정 3종으로만 제한되어 있는지 확인한다.
- `MM3-020`의 실패 근거가 현재도 유효한지 확인한다.
- `MM3-011`의 acceptance 기준 중 `required field`와 `runtime reflection` 해석이 `MM3-022`와 충돌하지 않는지 확인한다.
- `helper field` 해석이 저장형이 아니라 thin projection 계산형이라는 문서 전제가 유지되는지 확인한다.
- 작업 전후 비교에 사용할 실제 증빙 경로가 존재하는지 확인한다.

## 2. 필요한 실제 입력 / 경로

- 문서 입력
  - `.codex-orchestration/reports/MM3-022_REPAIR_PACKET_V1.md`
  - `.codex-orchestration/reports/MM3-020_FIRST_LIMITED_VALIDATION_REPORT_V1.md`
  - `.codex-orchestration/reports/MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1.md`
  - `.codex-orchestration/WORK_ORCHESTRATION_HUB_V1.md`
- 실행 전 검증용 실제 증빙 경로
  - `vocab_dictionary/output/unified_live/kcenter_merge_report.json`
  - `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
  - `vocab_dictionary/output/unified_live/kcenter_link_integrity.json`
- 문서 보정 대상 경로
  - `MM3-010_RUNTIME_CONTRACT_PACKAGE_V1.md`
  - `MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1.md`

## 3. 누락되면 실행하면 안 되는 것

- 현재 live 증빙이 `53,480` canonical count를 다시 확인하지 못하면 실행하지 않는다.
- `categories`, `translations`, `pos` 누락 수치가 `MM3-022`의 전제와 맞지 않으면 실행하지 않는다.
- `translation`과 `translations`처럼 용어가 섞인 상태에서 해석 합의가 없으면 실행하지 않는다.
- 실제 경로가 없거나 읽을 수 없어서 전후 비교가 불가능하면 실행하지 않는다.
- 문서 보정 범위를 넘어 구조 재편, 필드 추가, 스키마 확장을 포함하려고 하면 실행하지 않는다.
- write scope 밖의 파일 수정이 필요하면 실행하지 않는다.

## 4. 실행 가능 / 보류 기준

### 실행 가능

- 위의 실제 입력과 증빙 경로가 모두 접근 가능하다.
- `MM3-020`의 관측치와 `MM3-022`의 패킷 전제가 같은 축으로 정렬되어 있다.
- 문서 해석이 `MM3-011`과 충돌하지 않고, helper field와 translation 관련 용어가 정리되어 있다.
- 보정 범위가 여전히 최소 수정으로 유지된다.

### 보류

- 증빙 경로 중 하나라도 비어 있거나 최신 상태가 확실하지 않다.
- canonical count 또는 누락 수치가 패킷 전제와 다르다.
- 문서 간 용어가 서로 다르게 읽혀서 실행 기준이 갈린다.
- 누가 보더라도 실행 결과를 같은 기준으로 검증할 수 없을 만큼 입력이 부족하다.

## 5. Reflection

- 이 readiness 문서의 핵심은 `MM3-022`를 빨리 실행하는 것이 아니라, 실행해도 되는 상태인지 먼저 닫는 데 있다.
- 현재 가장 큰 리스크는 구현 난이도가 아니라, 문서 전제와 실제 증빙 사이의 불일치다.
- 따라서 준비 상태는 "수정 방법을 아는가"가 아니라 "같은 기준으로 전후를 증명할 수 있는가"로 판단해야 한다.
