# MM3-021_VALIDATION_FAILURE_TRIAGE_V1

## Revision Meta

- 실행일시: `2026-03-23`
- 실행자: `TRIAGE_AGENT`
- 입력 문서: `MM3-020`, `MM3-011`, `MM3-010`, `MM3-009`
- 대상: `MM3-020` 첫 제한 검증 실패

## 1. 한줄 결론

- `MM3-020`의 실패는 대부분 실제 live 산출물의 필드 누락 문제이며, `sense_count / has_subwords / has_related_forms`는 저장형 필드가 아니라 계산형 thin projection으로 읽어야 하는지 먼저 문서 해석을 고정해야 한다.

## 2. 실패 항목별 원인 분해

| 실패 항목 | 관측 | 원인 | 문서/데이터 구분 | 우선순위 | 최소 수정 범위 |
|---|---:|---|---|---:|---|
| 홈 `categories` 누락 | `8,506`건 | 홈 thin projection의 핵심 요약 필드가 대량 누락됨 | 데이터 문제 | 1 | 홈용 `entry.categories` 요약이 비는 레코드만 보정 |
| 홈 `pos` 누락 | `4`건 | 표제어의 기본 식별 필드가 일부 레코드에서 비어 있음 | 데이터 문제 | 3 | 누락된 4개 레코드만 직접 보정 |
| 결과 `translations` 누락 | `1,762`건 | sense sidecar가 결과 요약에 안정적으로 반영되지 않음 | 데이터 문제 | 2 | 결과용 sense translation 요약이 비는 항목만 보정 |
| `sense_count / has_subwords / has_related_forms` 저장본 미확인 | 확인 불가 | 검증이 저장형 필드를 전제로 읽었는지, 계산형 thin projection을 전제로 읽어야 하는지 문서 기준이 흔들림 | 문서 문제 | 0 | 계산 위치와 확인 경로를 문서에서 먼저 고정 |

## 3. 우선 수리 순서

1. `sense_count / has_subwords / has_related_forms`의 계약 해석을 먼저 고정한다.
2. 홈 `categories` 누락을 우선 보정한다.
3. 결과 `translations` 누락을 보정한다.
4. 홈 `pos` 누락 4건을 마감한다.

### 우선순위 이유

- `categories`는 누락 규모가 가장 커서 홈 thin projection의 안정성에 직접 영향을 준다.
- `translations`는 결과 카드의 의미 판별을 흔들므로 다음 우선순위다.
- `pos`는 수량은 작지만 기본 필드이므로 마지막에 정리해도 된다.
- helper 필드는 실제 결함보다 계약 해석 문제에 가깝기 때문에, 데이터 수리 전에 문서 기준을 먼저 고정해야 재검증이 흔들리지 않는다.

## 4. 최소 수정 범위

- 문서 측 최소 범위
  - `MM3-010` / `MM3-011`에서 helper 필드가 저장형인지 계산형인지, 그리고 어떤 산출물에서 확인해야 하는지를 한 문장으로 명시한다.
- 데이터 측 최소 범위
  - 홈에서 비는 `categories` 요약만 보정한다.
  - 결과에서 비는 `translations`만 보정한다.
  - `pos`가 비는 4개 레코드만 개별 보정한다.

## 5. 다음 검증 재실행 조건

- `categories` 누락이 0건이어야 한다.
- `translations` 누락이 0건이어야 한다.
- `pos` 누락이 0건이어야 한다.
- `sense_count / has_subwords / has_related_forms`의 확인 경로가 문서상 명확해야 한다.
- canonical count `53,480`이 그대로 유지되어야 한다.

## 6. Reflection

- 이번 실패는 구조 자체의 붕괴가 아니라, thin projection 계약과 실제 live 필드 상태가 맞물리지 않은 문제였다.
- 대량 누락은 데이터 문제로, helper 필드의 미확인은 문서/검증 해석 문제로 나누는 편이 가장 보수적이고 재현 가능하다.
- 다음 재검증은 “무엇이 필수인지”와 “어디서 확인하는지”를 먼저 고정한 뒤, 실제 누락 수를 0으로 만드는 순서로 가야 한다.
