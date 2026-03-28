# 20260324_MM3_174_RESIDUAL_FEEDBACK_PIPELINE_PLAN_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 23:47 KST`

## Last Updated By

- `Codex PM`

## Scope

- additional human feedback residual pipeline plan

## Goal

- `MM3-168`~`MM3-173`를 낱개 pending task가 아니라, 입력과 출력이 연결된 하나의 파이프라인으로 운영한다.
- 각 workflow 안에서도 step 의존성을 먼저 고정해, 앞 단계 산출물이 다음 단계 spec을 흔들지 않게 한다.

## Why This Order

- `MM3-172` tree semantics / terminology가 먼저 잡혀야 detail copy와 guide wording이 다시 흔들리지 않는다.
- `MM3-170`, `MM3-171` audit 결과가 늦게 나오면 translation UI와 performance constraint를 모른 채 `MM3-168`, `MM3-169`를 고정하게 된다.
- `MM3-173` guide를 너무 빨리 올리면 screenshot, 용어, user path가 모두 다시 바뀔 수 있다.
- 현재 active work는 `MM3-096`이므로, residual pipeline은 즉시 구현이 아니라 queue-controlled workflow로 유지해야 한다.

## Pipeline

### P0. Queue Lock

- 목적:
  - 추가 human feedback를 literal record와 coverage audit로 고정한다.
- current state:
  - `MM3-167A`, `MM3-167B` `DONE`
- output:
  - raw wording preserved
  - residual queue fixed

### W1. Semantics Baseline

- task:
  - `MM3-172A`
- 목적:
  - `주제 및 상황`, `미분류`, terminology를 먼저 정리한다.
- steps:
  1. duplicated parent / isolated node / tangled structure 사례를 묶는다.
  2. learner-facing terminology 후보를 하나로 줄인다.
  3. tree/search/detail에서 같은 용어를 쓰는 contract를 적는다.
  4. review checkpoint `R1`로 copy drift 여부를 검토한다.
- output:
  - tree semantics note
  - terminology baseline

### W2. Runtime Reality Audit

- task:
  - `MM3-170A`
  - `MM3-171A`
- 목적:
  - translation coverage reality와 performance constraint를 실제 runtime 기준으로 고정한다.
- steps:
  1. `MM3-170A`에서 selected language residual과 connected language coverage를 확인한다.
  2. `MM3-171A`에서 loading delay, mindmap delay, payload split candidate를 확인한다.
  3. 두 audit를 합쳐 UI가 가정할 수 있는 constraint를 적는다.
  4. review checkpoint `R2`로 audit 누락과 sequencing risk를 검토한다.
- parallel rule:
  - `MM3-170A`, `MM3-171A`는 병렬 가능하다.
- output:
  - translation coverage matrix
  - performance constraint note

### W3. Surface Contract

- task:
  - `MM3-168A`
  - `MM3-169A`
- 목적:
  - W1/W2 결과를 입력으로 detail / relation / expression surface contract를 고정한다.
- steps:
  1. `MM3-168A`에서 header / close / core copy density를 정리한다.
  2. `MM3-169A`에서 relation / expression discoverability와 copy residual을 정리한다.
  3. translation/performance/tree terminology constraint를 surface spec에 반영한다.
  4. review checkpoint `R3`로 논리 충돌, stale wording, duplicated affordance를 검토한다.
- dependency:
  - `W1`, `W2` 선행
- output:
  - detail surface spec
  - relation / expression discoverability spec

### W4. Enablement Closeout

- task:
  - `MM3-173A`
- 목적:
  - guide는 구현 전에 쓰지 않고, 표면과 terminology가 안정된 뒤 outline만 잡는다.
- steps:
  1. final terminology / screenshot target path를 고정한다.
  2. in-app guide outline과 screenshot checklist를 작성한다.
  3. release 전용 review checkpoint `R4`에서 stale screenshot risk를 검토한다.
- dependency:
  - `W3` 안정화 이후
- output:
  - guide plan
  - screenshot checklist

## Multi-Agent Use Rule

- 이 파이프라인에서는 handoff cost가 낮고 병렬 가치가 큰 구간에만 에이전트를 쓴다.
- 추천:
  - `W2`의 `MM3-170A`, `MM3-171A`는 병렬 audit lane으로 처리 가능
  - `R1`~`R4`는 review lane 적극 사용
- 비권장:
  - `W1`, `W3`는 의미 정합성과 copy contract를 한 번에 묶어야 하므로, 과한 멀티에이전트가 오히려 drift를 만든다.

## Active Work Separation

- `MM3-096 Human Pilot Scheduling / Execution`이 현재 active work다.
- `MM3-168`~`MM3-173`는 queue-controlled pipeline로 유지한다.
- 예외:
  - audit 결과가 `MM3-096` 자체를 막는 blocker로 판정되면 그때만 active work와 직접 연결한다.

## PM Verdict

- residual queue는 `W1 -> W2 -> W3 -> W4` 파이프라인으로 다루는 것이 가장 안전하다.
- 특히 `translation/performance audit`을 surface spec보다 늦게 두면 재작업 가능성이 높다.
- `guide`는 가장 마지막 closeout으로 두는 것이 맞다.

## Next Active Work

- `MM3-096 Human Pilot Scheduling / Execution`

## Revision History

- `R1` / `2026-03-24 23:47 KST` / `Codex PM` / additional human feedback residual을 linked workflow pipeline으로 재정의
