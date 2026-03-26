# 20260326_MM3_216_TOPIK_STATS_LINKAGE_POLICY_DECISION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 07:54 KST`

## Last Updated By

- `Codex PM`

## Scope

- `PARK-001 TOPIK stats linkage policy`

## Plain-Language Decision

- TOPIK stats는 외부 reference에서 온 learner signal로 계속 사용한다.
- 다만 learner-facing 뜻과 설명은 항상 MM3 사전 값을 기준으로 사용한다.
- `confidence`는 내부 linkage 참고값일 뿐, learner-facing 노출/제외 기준으로 직접 쓰지 않는다.
- `level`은 MM3 learner-facing 지표에서 폐기한다.
- `band`는 learner-facing 지표로 유지하되 숫자만이 아니라 의미 라벨 중심으로 해석한다.
- `미산출`은 learner-facing main filter에서 제거한다.

## Why

### 1. `low-confidence`라도 실제로는 같은 단어인 사례가 존재한다.

- reviewed examples 기준 `가계`, `갈망`, `감상`, `개별`, `펭귄`은 모두 실제로는 같은 단어다.
- 현재 `low`는 “다른 단어”라기보다 definition 문장 형태 차이 때문에 score가 낮아진 경우를 포함한다.

### 2. Learner-facing truth는 MM3 사전이 맡아야 한다.

- MM3는 현재 프로젝트의 dictionary SSOT다.
- 따라서 definition, wording, sense 설명은 MM3 값을 기준으로 통일하는 것이 맞다.

### 3. `level`은 현재 MM3에서 중복 지표다.

- MM3에는 이미 `난이도` 항목이 있다.
- MM2에서 온 `level`을 learner-facing 핵심 지표로 계속 유지할 이유가 약하다.

### 4. `미산출`은 현재 learner-facing main filter로서 의미가 약하다.

- positive learning category가 아니고,
- current payload semantics와 UI 표현도 혼동 소지가 있다.

## Operational Rule

### Use

- `band`
- `frequency`
- `rank`
- `round_count`

### Do Not Use Learner-Facing

- `level`
- `confidence`
- `match_method`

### Definition / Copy Rule

- search result, detail panel, examples, sense text 등 learner-facing wording은 MM3 사전 값을 기준으로 유지한다.
- TOPIK side는 stats source일 뿐 definition source가 아니다.

### Filter Rule

- main filter에서는 `Band 1~5` 숫자만 단독 노출하지 않는다.
- 의미 라벨을 함께 쓰는 방향으로 정리한다.
- `미산출`은 learner-facing main filter에서 제거한다.

## What This Does Not Mean

- TOPIK stats를 synthetic하게 새로 생성한다는 뜻이 아니다.
- source에 없는 coverage를 억지로 만든다는 뜻이 아니다.
- internal audit에서 `confidence`를 버린다는 뜻도 아니다.

## PM Verdict

- `APPROVED`

## Next Step

- current active work는 계속 `MM3-213`이다.
- shell adaptation을 다시 열 때, 이 policy를 filter/metadata wording의 고정 규칙으로 사용한다.

