# 20260324_MM3-029_HELPER_PATH_VERIFICATION_V1

## Revision Meta

- 실행일시: `2026-03-24`
- 실행자: `HELPER_VERIFY_AGENT`
- 검증 대상: `sense_count`, `has_subwords`, `has_related_forms`
- 검증 초점: 계산 경로와 runtime reflection 가능성

## 1. 계산 경로 확인

세 helper field는 저장형 원천값이라기보다, runtime projection에서 파생되는 계산형 필드로 해석하는 것이 문서 정합성에 맞다.

- `sense_count`는 `entry`에 연결된 `sense` 집합의 개수에서 계산되는 카운트다.
- `has_subwords`는 해당 `entry`에 연결된 `subword` 존재 여부에서 계산되는 boolean이다.
- `has_related_forms`는 `entry.related_forms` 또는 그에 준하는 관련형 연결 존재 여부에서 계산되는 boolean이다.

이 판단은 이름 자체의 의미뿐 아니라, `MM3-010`이 이 3개 필드를 thin projection 허용 항목으로 명시하면서도 저장형 필드로 고정하지는 않았다는 점에 근거한다.

## 2. 어떤 산출물 / 계약에서 확인 가능한지

확인 가능한 근거는 다음 3종이다.

- `MM3-010 Runtime Contract Package`
  - 결과 화면 required fields에 `has_subwords`, `sense_count`가 포함되어 있다.
  - `entry` 세부 계약에서 `sense_count`, `has_subwords`, `has_related_forms`를 thin projection에 둘 수 있다고 적시한다.
  - thin projection 허용 필드에도 동일 항목이 들어 있다.
- `MM3-011 Implementation Acceptance Checklist`
  - `has_subwords`, `sense_count`, `has_related_forms`가 thin projection에서 일관되게 계산되어야 한다고 명시한다.
  - runtime reflection 검수 항목에서 thin projection / detail payload / expression payload / facet payload 분리를 요구한다.
- `20260324_MM3-028 Second Limited Validation Report`
  - `kcenter_base.json.gz` 전수에서 해당 필드 키가 entry/sense 어느 쪽에도 존재하지 않았다고 적시했다.
  - 따라서 이번 검증에서는 저장형 결함으로 보지 않고 `computed helper`로 분류했다.

즉, 계약 문서는 이 필드들을 노출 대상으로 다루고 있고, 제한 검증은 이들이 원천 저장 필드가 아님을 뒷받침한다.

## 3. Runtime Reflection 관점 판정

판정은 `가능`이다. 다만 전제는 명확하다.

- runtime payload split이 `thin index / detail payload / expression payload / facet payload`를 따를 것.
- helper field는 저장본을 그대로 노출하는 방식이 아니라, thin index 또는 projection layer에서 파생될 것.
- `sense_count`는 `sense` 집합의 집계 결과로, `has_subwords`는 subword 연결 여부로, `has_related_forms`는 related_forms 연결 여부로 계산될 것.

이 구조라면 runtime reflection에서 helper field는 화면 분리와 충돌하지 않는다. 오히려 thin projection의 요약성에 잘 맞는다.

## 4. 저장형이 아닌 계산형으로 유지해도 되는지

결론은 `예, 유지해도 된다`이다.

이유는 다음과 같다.

- 이 3개 값은 본질적으로 파생 지표라서 source-native canonical data를 늘릴 필요가 없다.
- `MM3-010`과 `MM3-011`은 이미 이를 thin projection 계층의 계산 결과로 취급하는 방향에 맞춰져 있다.
- `MM3-028`에서 저장 키 부재가 확인되었고, 그 공백을 결함으로 남기지 않았다.

따라서 helper field를 저장형으로 승격할 근거는 부족하고, 계산형으로 유지하는 편이 문서 계약과 runtime reflection 양쪽에 더 일관적이다.

## 5. Reflection

이번 검증의 핵심은 helper field를 “있어야 하는 데이터”로 볼지, “파생되어야 하는 표면”으로 볼지 분리하는 데 있었다.

- 저장 여부를 먼저 찾으면 불필요한 schema 확장을 유도한다.
- 계산 경로를 먼저 보면 `sense / subword / related_forms`의 원천 구조를 보존한 채 thin projection만 닫을 수 있다.
- 현재 문서 묶음은 후자의 해석과 맞는다.

따라서 `sense_count / has_subwords / has_related_forms`는 저장형이 아니라 계산형 helper field로 두는 것이 맞고, runtime reflection에서도 그 방식이 허용된다.
