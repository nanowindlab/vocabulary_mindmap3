# 20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TERMINOLOGY_BASELINE_DRAFT_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 23:53 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-172C` terminology baseline draft

## Goal

- `주제 및 상황`, `미분류` residual을 다룰 때 tree/search/detail/guide가 공통으로 사용할 learner-facing wording baseline을 draft로 고정한다.
- downstream `MM3-168`, `MM3-169`, `MM3-173`이 같은 용어를 입력으로 받게 만든다.

## Source-Of-Truth Status

- `MM3-168`, `MM3-169` 입력용:
  - `usable now`
- `MM3-173` guide source-of-truth:
  - `provisional until MM3-172D R1`

원칙:
- 현재 draft는 surface contract 입력으로는 사용할 수 있다.
- guide wording의 최종 source-of-truth 승격은 `R1` review 이후에만 허용한다.

## Current Accepted Terms

- `주제 및 상황 > 없음 > 없음`
  - learner-facing path:
    - `주제 및 상황 > 상황 미지정 > 일반 어휘`
- `미분류`
  - learner-facing root:
    - `분류 밖 항목`
- `미분류` detail helper
  - grammar-like:
    - `문법/형태 항목`
  - content-like:
    - `분류 미기재 어휘`

## Term Classes

### A. System/Internal Terms

- `주제 및 상황 범주`
- `미분류`
- `scene`
- `category`
- `path_ko`

원칙:
- 내부 문서와 payload 설명에는 유지 가능
- learner-facing UI 기본 카피로는 직접 노출하지 않는다

### B. Learner-Facing Structural Terms

- `주제 및 상황`
- `상황 미지정`
- `일반 어휘`
- `분류 밖 항목`

원칙:
- tree/search/detail/guide에서 공용으로 재사용
- 같은 문제를 다른 화면에서 다른 표현으로 바꾸지 않는다

### C. Learner-Facing Explanation Terms

- `문법/형태 항목`
- `분류 미기재 어휘`

원칙:
- `분류 밖 항목` 하위 helper에서만 사용
- `주제 및 상황` helper에는 재사용하지 않는다

## Surface-By-Surface Wording Map Draft

| Surface | `주제 및 상황` baseline | `미분류` baseline | Do Not |
|---|---|---|---|
| tree | `주제 및 상황` | `분류 밖 항목` | raw `없음 > 없음`, raw `미분류 > 미분류` |
| search result path | `주제 및 상황 > 상황 미지정 > 일반 어휘` | `분류 밖 항목 > [ordering slot 1] > [ordering slot 2]` | screen마다 다른 root label |
| detail path/helper | `특정 장면보다 일반 의미로 익히는 편이 적절한 어휘` | `문법/형태 항목` or `분류 미기재 어휘` | `없음 문제`로 한데 묶는 설명 |
| mindmap/canvas | node label은 짧게 유지, helper 의미는 tree/detail에서 담당 | root/helper 성격 설명은 tree/detail에서 담당 | canvas node에 `역사 > 역사`식 path 문구 직접 투입 |
| guide | `상황이 비어 있어도 일반 어휘 학습은 가능` | `정식 의미/상황 taxonomy 바깥의 fallback 확인 surface` | `제3의 정식 taxonomy`처럼 설명 |

## Draft Wording Rules

1. `주제 및 상황` residual은 `scene missing`이 아니라 `scene-fixed learning이 아닌 general-use vocabulary`라는 방향으로 설명한다.
2. `미분류` residual은 `taxonomy outside fallback`이라는 방향으로 설명한다.
3. `주제 및 상황`과 `미분류`를 같은 `없음` 계열 문제로 묶지 않는다.
4. `문법/형태 항목`은 `미분류` 하위 helper에서만 쓴다.
5. `분류 미기재 어휘`는 content-like unclassified helper에서만 쓴다.

## Open Draft Points For `R1`

- duplicated label이 있을 때 learner-facing path를 단순 압축할지, 상위/하위 역할명을 다시 붙일지
- `분류 밖 항목 > 학습난이도 > 품사`와 `분류 밖 항목 > 품사 > 학습난이도` 중 어느 ordering이 baseline에 맞는지
- tree에서 `주제 및 상황 범주`를 아예 `주제 및 상황`으로 통일할지, 일부 internal 표면에서는 남길지
- `mindmap/canvas`에서 helper 의미를 노드 라벨이 아니라 별도 surface가 담당하도록 완전히 분리할지

## Downstream Inputs

- `MM3-168`
  - detail helper wording guardrail
- `MM3-169`
  - relation / expression discoverability copy guardrail
- `MM3-173`
  - provisional guide terminology input

## PM Verdict

- `draft acceptable`
- final accept는 `MM3-172D` review checkpoint `R1` 이후로 둔다.

## Next Step

- `MM3-172D` review checkpoint `R1`

## Revision History

- `R1` / `2026-03-24 23:53 KST` / `Codex PM` / W1 terminology baseline draft와 surface-by-surface wording map을 최초 작성
