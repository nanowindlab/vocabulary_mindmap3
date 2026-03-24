# 20260324_MM3_033_RUNTIME_ARTIFACT_SPLIT_PATH_V1

## 목적

- runtime reflection 실패 이후, 어떤 artifact split을 우선 목표로 삼아야 하는지 PM 기준으로 고정한다.

## PM 판단

우선순위:
1. `thin index`
2. `facet payload`
3. `detail payload`
4. `expression payload`

## 이유

- 현재 가장 직접적인 reflection 실패 원인은 `thin index`와 `facet payload` 부재다.
- `detail`과 `expression`은 중요하지만, 홈/결과와 필터 반영을 닫기 전까지 1차 우선순위는 아니다.

## 운영 결론

- 다음 단계는 `thin index / facet payload` target contract를 먼저 정의한다.
- `detail / expression`은 그 다음 reflection 재시도 이후로 미룬다.

## Next Active Work

- `MM3-034 Thin Index / Facet Target Contract`

