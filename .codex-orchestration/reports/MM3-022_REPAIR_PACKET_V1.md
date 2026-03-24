# MM3-022_REPAIR_PACKET_V1

## Revision Meta

- Current Revision: `R1`
- Last Updated: `2026-03-23`
- Last Updated By: `REPAIR_AGENT`
- 입력 문서: `MM3-021`, `MM3-020`, `MM3-011`, `MM3-010`
- 목적: `MM3-021` triage를 바탕으로 최소 수정 패킷만 정의

## 1. 판단 요약

- 실패의 핵심은 구조 붕괴가 아니라 `categories`, `translations`, `pos` 누락이라는 데이터 결함이다.
- `sense_count / has_subwords / has_related_forms`는 저장형 필드로 보지 말고, thin projection에서 계산형으로 확인하는 문서 기준을 먼저 고정해야 한다.
- 따라서 수리 범위는 문서 1회 보정과 데이터 3종 보정으로 제한한다.

## 2. 문서 수정 패킷

- 대상: `MM3-010_RUNTIME_CONTRACT_PACKAGE_V1.md`
- 수정 범위: `5.1 entry` 또는 `9. implementation acceptance 초안`에 helper 필드가 계산형 thin projection이라는 점과 확인 경로가 runtime thin projection output임을 한 문장으로 명시
- 대상: `MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1.md`
- 수정 범위: `5.1 entry`의 `has_subwords / sense_count / has_related_forms` 항목을 저장형 필드로 읽지 않도록 동일한 해석 문장을 1회 반영
- 원칙: 문장 추가 수준만 허용하고, 필드 정의 확대나 구조 재편은 하지 않음

## 3. 데이터 수정 패킷

- 홈 `categories` 누락 보정: `8,506`건의 비어 있는 `entry.categories` 요약만 보정
- 결과 `translations` 누락 보정: `1,762`건의 비어 있는 `sense.translations` 요약만 보정
- `pos` 누락 보정: `4`개 레코드만 개별 보정
- 원칙: 누락 외의 필드나 전체 스키마는 건드리지 않음

## 4. 수정 순서

1. 문서 기준을 먼저 고정해 helper 필드 해석 흔들림을 제거한다.
2. 홈용 `categories` 누락을 우선 보정한다.
3. 결과용 `translations` 누락을 보정한다.
4. 마지막으로 `pos` 누락 4건을 마감한다.
5. 같은 기준으로 재검증을 진입한다.

## 5. 성공 기준

- `categories` 누락이 `0`건이다.
- `translations` 누락이 `0`건이다.
- `pos` 누락이 `0`건이다.
- canonical count `53,480`이 그대로 유지된다.
- `sense_count / has_subwords / has_related_forms`의 확인 경로가 문서상 계산형 thin projection으로 명확하다.
- 수정 범위가 triage에서 지정한 최소 범위를 넘지 않는다.

## 6. 재검증 진입 조건

- 문서 수정 패킷이 반영되어 helper 필드 해석이 저장형/계산형 혼선을 남기지 않아야 한다.
- `categories`, `translations`, `pos` 누락이 모두 `0`이어야 한다.
- canonical count `53,480`과 다른 값이 재노출되지 않아야 한다.
- 새로 생긴 누락이나 추가 구조 변경이 없어야 한다.

## 7. Reflection

- 이번 패킷은 문제를 넓게 고치지 않고, 실패 원인을 문서 해석 문제와 실제 데이터 누락으로 정확히 분리하는 데 집중했다.
- helper 필드에 대해 저장형 필드를 추가하는 방향은 최소 수정 원칙에 어긋나므로 배제했다.
- 다음 단계는 구현 확장이 아니라, 보정된 누락이 실제로 0건이 되었는지와 문서 해석이 더 이상 흔들리지 않는지 확인하는 재검증이다.
