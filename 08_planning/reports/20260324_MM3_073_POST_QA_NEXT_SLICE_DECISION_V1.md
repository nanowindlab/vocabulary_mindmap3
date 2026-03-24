# 20260324_MM3_073_POST_QA_NEXT_SLICE_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## 목적

- runtime QA wave 이후 다음 구현/제품 슬라이스를 고른다.

## Shortlist

### A. translation surface policy

- 상세 패널에서 기본 번역 노출 언어를 1개로 좁히고, 나머지는 확장/전환으로 내린다.
- 제품 영향: 높음
- 구현 비용: 낮음

### B. situation tree precision path enhancement

- `주제 및 상황` 탭에서 category-first 정밀 path를 더 안정적으로 만든다.
- 제품 영향: 중간
- 구현 비용: 중간

### C. detail / expression micro-polish

- 표현층 카드, 관련형, 의미 관계어의 시각 우선순위를 더 다듬는다.
- 제품 영향: 중간
- 구현 비용: 낮음

## PM Recommendation

- `A. translation surface policy`

## 이유

- 이미 user direction 상 `외국어는 여러 개를 모두 볼 필요는 없고, 한 가지 기본 언어 중심이 더 적절하다`는 제품 힌트가 있었다.
- 현재는 모든 번역이 상세에 그대로 노출돼 있어 정보 밀도가 높다.
- 이 조정은 core 구조를 흔들지 않고 learner-facing 효율을 바로 높일 수 있다.

## Next Active Work

- `MM3-074 Translation Surface Policy`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / post-QA next slice shortlist와 추천안을 최초 기록
