# MM3-018_FIRST_VALIDATION_RUNBOOK_V1

## Revision Meta

- Current Revision: `R1`
- Last Updated: `2026-03-23`
- Last Updated By: `RUNBOOK_AGENT`

## 1. 목적

- 본 문서는 `MM3-017`의 첫 제한 검증 패킷을 실제로 수행하기 위한 runbook이다.
- 첫 패킷의 목적은 `홈`과 `결과`의 `thin projection`이 문서 계약 안에서 닫히는지, 그리고 `canonical count`와 `required field`가 함께 통과하는지 확인하는 것이다.
- 이 문서는 구현 지시서가 아니며, `상세`, `표현층`, `필터 바`로 범위를 넓히는 절차를 포함하지 않는다.

## 2. 검증 대상

- 대상 화면은 `홈`과 `결과`만이다.
- 대상 축은 `canonical count`와 `required field`만이다.
- 비교 기준은 `MM3-017_LIMITED_EXECUTION_PACKET_V1`, `MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1`, `MM3-010_RUNTIME_CONTRACT_PACKAGE_V1`, `MM3-009_IA_PACKAGE_V1`이다.
- 허용 범위는 `thin projection`의 최소 정합성 확인까지다.
- 금지 범위는 `상세`, `표현층`, `필터 바`, `runtime contract 재설계`, `taxonomy 재설계`, `learner flow 재구성`이다.

## 3. 필요한 입력 경로

| 경로 | 용도 | 사용 시점 |
|---|---|---|
| `.codex-orchestration/reports/MM3-017_LIMITED_EXECUTION_PACKET_V1.md` | 첫 패킷의 범위, 성공 기준, 중단 조건 확인 | 시작 전 |
| `.codex-orchestration/reports/MM3-011_IMPLEMENTATION_ACCEPTANCE_CHECKLIST_V1.md` | `count`와 `required field`의 판정 축 확인 | 시작 전 |
| `.codex-orchestration/reports/MM3-010_RUNTIME_CONTRACT_PACKAGE_V1.md` | 홈/결과의 `thin projection` 계약 확인 | 시작 전 |
| `.codex-orchestration/reports/MM3-009_IA_PACKAGE_V1.md` | 화면 분리와 정보 구조의 기준 확인 | 시작 전 |
| `.codex-orchestration/reports/MM3-016_POST_GATE_NEXT_STEP_PLAN_V1.md` | 후속 단계로 넘어가는 조건의 맥락 확인 | 필요 시 참고 |
| `vocab_dictionary/output/unified_live/` | 실제 실행 시 비교할 live 증빙 위치 | 실행 시 |

## 4. 순서별 절차

### 4.1 범위 고정

- `MM3-017`을 읽고 첫 패킷이 `홈`과 `결과`에만 한정되는지 확인한다.
- `MM3-011`과 `MM3-010`을 대조해, 이번 패킷에서 봐야 할 항목이 `count`와 `required field`뿐인지 다시 고정한다.
- 입력 문서들 사이에 범위 충돌이 있으면 즉시 중단하고, 범위 재정렬 없이 다음 단계로 가지 않는다.

### 4.2 검증 축 1: canonical count

- live 증빙에서 현재 `entry count`를 먼저 확인한다.
- 기준값은 `53,480`이다.
- `53,439`가 기본값이나 요약값으로 다시 노출되면 즉시 실패로 처리한다.
- count 불일치의 이유를 해석하려고 범위를 넓히지 않는다.

### 4.3 검증 축 2: 홈 required field

- 홈이 `thin projection`만으로 닫히는지 확인한다.
- 홈에서 확인해야 할 최소 필드는 `entry.id`, `entry.word`, `entry.pos`, `entry.word_grade`, `entry.categories` 요약이다.
- 홈은 `entry`의 전체 상세가 아니라 빠른 lookup을 위한 얇은 카드로만 남아야 한다.
- 홈에서 `상세` 수준의 정보가 기본 노출되면 실패로 판정한다.

### 4.4 검증 축 3: 결과 required field

- 결과 카드가 `entry` 요약과 최소 1개 `sense` 요약으로 다의어를 구분할 수 있는지 확인한다.
- 결과에서 확인해야 할 최소 필드는 `entry.id`, `entry.word`, `entry.pos`, `entry.word_grade`, `entry.categories` 요약, `has_subwords`, `sense_count`다.
- 결과 카드에는 최소 1개 `sense`의 `definition`과 짧은 `translation`이 함께 보여야 한다.
- 결과가 `rich detail`로 흘러가거나 `sense` 요약이 빠지면 실패로 판정한다.

### 4.5 범위 이탈 점검

- 검증 도중 `상세`, `표현층`, `필터 바`를 열어야만 판단이 가능해지는 순간이 오면 중단한다.
- 문서 해석이 아니라 구현 보완이나 설계 변경으로 넘어가려는 흐름이 생기면 중단한다.
- 홈/결과의 판정이 끝나기 전에 다음 패킷의 `runtime reflection`을 미리 평가하지 않는다.

### 4.6 최종 판정

- `count`와 `required field`가 모두 통과하면 이번 패킷은 `PASS`로 기록한다.
- 하나라도 실패하면 이번 패킷은 `FAIL`로 기록한다.
- 중단 규칙이 발동하면 `STOPPED`로 기록하고, 실패 항목과 중단 사유를 분리해서 남긴다.
- 이번 패킷의 최종 결론은 `다음 패킷 진행 가능 / 진행 불가`의 이분법으로 적는다.

## 5. pass/fail 기준

### PASS 기준

- canonical count가 `53,480`과 일치한다.
- `53,439` stale summary가 재노출되지 않는다.
- 홈의 required field가 `thin projection` 수준에서 닫힌다.
- 결과의 required field가 `entry 요약 + sense 요약` 구조로 닫힌다.
- 검증이 `홈`과 `결과`를 벗어나지 않는다.

### FAIL 기준

- canonical count가 `53,480`과 다르다.
- `53,439`가 기본 요약이나 대표 값으로 다시 보인다.
- 홈 또는 결과의 required field가 문서 계약과 어긋난다.
- 결과가 `sense`를 기준으로 다의어를 구분하지 못한다.
- 검증 범위가 `상세`, `표현층`, `필터 바`로 확장된다.

## 6. 중단 규칙

- count 불일치가 확인되면 즉시 중단한다.
- required field 누락이 확인되면 해당 화면만 재검증하지 말고 패킷 전체를 중단한다.
- live 증빙이 없거나 경로가 불명확하면 실행을 시작하지 않는다.
- 검증이 설계 변경 요청으로 변질되면 즉시 중단한다.
- 다음 패킷의 `runtime reflection`까지 한 번에 처리하려는 유혹이 생기면 중단한다.

## 7. 결과 기록 형식

### 7.1 기록 메타

- 실행일시
- 실행자
- 입력 경로
- 증빙 경로
- 패킷 ID
- 최종 판정

### 7.2 체크 결과 표

| 항목 | 기준 | 관측 | 판정 | 비고 |
|---|---|---|---|---|
| canonical count | `53,480` |  | PASS/FAIL | `53,439` 노출 여부 포함 |
| 홈 required field | 문서 계약 충족 |  | PASS/FAIL | `thin projection` 여부 포함 |
| 결과 required field | 문서 계약 충족 |  | PASS/FAIL | `sense` 요약 포함 |
| 범위 준수 | 홈/결과 한정 |  | PASS/FAIL | 상세/표현층/필터 바 제외 |

### 7.3 한 줄 결론

- `PASS` 또는 `FAIL` 또는 `STOPPED` 중 하나로만 적는다.
- 결론 뒤에 다음 패킷 진행 가능 여부를 한 문장으로 붙인다.

## 8. Reflection

- 첫 제한 검증 패킷은 넓게 보는 작업이 아니라, 넓히지 않아도 되는 근거를 먼저 닫는 작업이다.
- `count`와 `required field`를 분리하지 않으면 문서 계약과 실제 증빙의 불일치를 빠르게 잡아내기 어렵다.
- `홈`과 `결과`만 닫혀도 다음 단계의 `runtime reflection` 검증으로 넘어갈 수 있지만, 그 전에는 범위를 넓히지 않는 것이 맞다.
- 이번 runbook의 역할은 결론을 미리 정하는 것이 아니라, 같은 기준으로 다시 실행할 수 있게 절차를 고정하는 데 있다.
