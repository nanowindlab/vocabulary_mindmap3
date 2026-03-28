# 20260325_MM3_189_W2_SURFACE_CONTRACT_STUDY_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 16:35 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-187F` W2 surface contract study

## Studied Surfaces

- relation tab `원어 정보`
- detail tab naming / subtitle policy
  - `관계 (비교/연결 보기)`
  - `표현 (활용 표현 보기)`

## Evidence

- second pilot raw feedback:
  - `08_planning/pilot_feedback/human pilot test_2차 피드백.md`
- normalized note:
  - `08_planning/pilot_feedback/20260325_pilot_session_02.md`
- current code:
  - `09_app/src/components/TermDetail.jsx`
- existing contract:
  - `08_planning/reports/20260325_MM3_169_RELATION_EXPRESSION_DISCOVERABILITY_CONTRACT_V1.md`

## Finding 1. `원어 정보`

- current use:
  - relation tab 하단에만 별도 section으로 노출
- positive evidence:
  - current pilot checklist / protocol / contract 어디에도 learner task로 등장하지 않는다.
  - current tests에도 required surface로 잡혀 있지 않았다.
  - second pilot에서 `돈`, `요리하다` 모두 제거 의견이 반복됐다.
- PM judgement:
  - current learner flow 기준 유지 이유가 없다.
  - relation surface의 primary 목적은 `의미 관계어`, `관련형`, `교차 연결` 탐색이며 `원어 정보`는 이 흐름을 돕지 않는다.

## Decision

- `원어 정보` section 제거

## Finding 2. Tab naming / subtitle policy

- current state:
  - `핵심`, `예문`은 1줄
  - `관계`, `표현`만 2줄 subtitle이 붙는다.
- benefit of current subtitle:
  - `MM3-169` contract 기준 discoverability 보강 의도는 있었다.
- problem:
  - detail tab row 안에서 only two tabs만 2-line treatment을 받아 visual consistency가 깨진다.
  - user는 `관계`, `표현`이 아니라 subtitle까지 label처럼 읽어야 해서 naming hierarchy가 흐려진다.

## Options

### Option A

- keep current
  - `관계` + `비교/연결 보기`
  - `표현` + `활용 표현 보기`

### Option B

- single-line rename
  - `관계` -> `의미 관계`
  - `표현` -> `활용 표현`
  - subtitle 제거

### Option C

- single-line keep short label
  - `관계`
  - `표현`
  - subtitle 제거

## Recommendation

- `Option B`

## Why

- discoverability는 유지하면서 2-line asymmetry를 없앨 수 있다.
- `의미 관계`, `활용 표현`은 현재 tab 목적을 더 직접적으로 말한다.
- `MM3-169` contract의 의도였던 cue를 single-line label로 흡수할 수 있다.
- `관계`, `표현`보다 learner-facing action 의미가 명확하다.

## Decision Needed

- yes
- scope:
  - tab label rename approval

## PM Verdict

- `ORIGINAL_LANGUAGE_REMOVED`
- `TAB_NAMING_DECISION_PENDING`

## Next Active Work

- `MM3-187F2 Tab Naming Decision`

## Revision History

- `R1` / `2026-03-25 16:35 KST` / `Codex PM` / W2 surface contract study 결과와 tab naming recommendation을 고정
