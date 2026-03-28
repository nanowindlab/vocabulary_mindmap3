# 20260325_MM3_175_REFRESHED_INTERNAL_PILOT_CHECKLIST_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 00:42 KST`

## Last Updated By

- `Codex PM`

## Scope

- refreshed internal pilot checklist

## 목적

- refreshed runtime 기준에서 internal pilot가 실제로 확인해야 할 핵심 흐름과 관찰 포인트를 다시 정리한다.

## Checklist

1. 검색으로 단어 진입 후 detail `핵심` 확인
2. detail header에서 표제어/발음/path 읽기 흐름 확인
3. `관계` 탭에서 의미 관계어 / 관련형 점프 확인
4. `표현` 탭에서 jumpable / preview-only branch 이해 여부 확인
5. 번역 언어 selector 변경 후 main detail 반영 확인
6. `예문` 탭 source/order helper 이해 여부 확인
7. `주제 및 상황 > 상황 미지정 > 일반 어휘` 해석이 자연스러운지 확인
8. `분류 밖 항목` 해석과 ordering 가독성 확인
9. 큰 category expansion 시 local delay 체감 여부 확인

## Recommended Sample Terms

- `돈`
  - header / core / expression branch
- `요리하다`
  - translation selector / examples
- `보다`
  - `주제 및 상황 > 상황 미지정 > 일반 어휘`
- `버리다`
  - `분류 밖 항목`

## Performance Anchor Path

- anchor 1:
  - app first load -> first stable explorer render
- anchor 2:
  - `주제 및 상황` 탭 -> `역사` 계열 진입/확장 -> `5초` 관찰
- anchor 3:
  - `분류 밖 항목` 탭 진입 -> initial cluster 관찰

## Observe

- learner가 `핵심 -> 관계/표현 -> 예문` 순서를 자연스럽게 읽는지
- `상세 연결 없음`과 `독립 항목 연결` 차이를 이해하는지
- main detail translation과 expression card translation이 다르게 보일 때 confusion이 생기는지
- `주제 및 상황`과 `분류 밖 항목`을 같은 문제로 오해하지 않는지
- category expansion에서 느려짐이 initial load 문제인지 interaction 문제인지 분리해서 말하는지

## Exclude

- final in-app guide 품질 판정
- broader public launch readiness
- generator recovery

## Next Active Work

- `MM3-096D scheduled pilot execution / intake capture`

## Revision History

- `R1` / `2026-03-25 00:42 KST` / `Codex PM` / current runtime baseline 기준 refreshed internal pilot checklist를 최초 작성
