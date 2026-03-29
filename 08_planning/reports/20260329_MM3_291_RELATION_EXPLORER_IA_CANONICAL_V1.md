# 20260329_MM3_291_RELATION_EXPLORER_IA_CANONICAL_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-29 13:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- separate `관계 탐색 앱`의 current IA canonical을 고정한다.
- `MM3` current screen composition을 theme baseline으로 계승하는 rule을 고정한다.
- separate relation explorer app의 direct opening structure, tree navigator first/second layer, relation study scenario, mindmap connection rule을 잠근다.

## Inputs

- `08_planning/RELATION_EXPLORER_APP_FOUNDATION_V1.md`
- `08_planning/reports/20260329_MM3_290_PHASE1_CLOSEOUT_AND_PHASE2_RELATION_EXPLORER_KICKOFF_V1.md`
- `08_planning/reports/20260329_MM3_281_RELATION_EXPRESSION_DEEP_RESEARCH_AND_APPLICATION_PLAN_V1.md`
- `08_planning/reports/20260329_MM3_282_PROJECT_DB_BASELINE_AND_RELATION_EXPRESSION_STRENGTHENING_V1.md`
- `08_planning/reports/20260326_MM3_236_MM3_UI_REFINEMENT_ROADMAP_V1.md`
- user-directed planning note in this thread

## Starting Basis

- current `09_app/`은 `Phase 1` frozen baseline이다.
- relation surface coverage는 `31,210` entries다.
- expression surface coverage는 `1,150` entries다.
- separate app의 first opening은 expression-first보다 relation-first가 맞다.

## Goal

- separate `관계 탐색 앱`을 `단어 찾기`보다 `관계 공부`에 맞는 app으로 시작한다.
- default study unit은 single word가 아니라 `관계 학습 단위`로 본다.

## Canonical IA

### Theme Inheritance Rule

- `Phase 2 관계 탐색 앱`은 `MM3` current screen composition을 theme baseline으로 계승한다.
- inherited baseline:
  - top navigation rhythm
  - left tree navigator position
  - main content panel 구조
  - card/list/detail reading cadence
  - optional mindmap mode placement
- `MM3-291`에서는 새 visual system을 열지 않는다.
- 이번 단계의 변화는 theme replacement가 아니라 primary entry rule과 study unit 교체다.

### Direct Opening Rule

- separate app 자체가 `관계 탐색` app이므로, `관계 탐색`을 app inside first layer로 다시 두지 않는다.
- app open 시 first selectable layer는 relation family다.
- `의미 범주`, `주제 및 상황`은 same-level app entry가 아니라 relation study를 정리하는 companion lens로 재배치한다.

### First Layer Criteria

- first selectable layer는 learner가 app에 들어오자마자 바로 고를 수 있는 relation question이어야 한다.
- first selectable layer는 search 보조가 아니라 study flow를 여는 문이어야 한다.
- first selectable layer는 inherited `MM3` shell 안에서 한눈에 읽혀야 한다.
- first selectable layer는 downstream subgroup/result surface를 자연스럽게 이어야 한다.

### Tree Navigator 1st Layer

- tree navigator 1st layer는 relation family 대분류로 고정한다.
  1. `비슷한말`
  2. `반대말`
  3. `참고어`
  4. `높임말·낮춤말`
  5. `큰말·작은말`
  6. `센말·여린말`
  7. `준말·본말`
  8. `파생어·관련형`

### Tree Navigator 1st Layer Criteria

- 대분류는 learner가 바로 이해할 수 있는 relation question이어야 한다.
- 대분류는 separate study template를 가질 만큼 충분히 두꺼워야 한다.
- 성격이 같은 pair branch는 묶어서 열고, thin variant를 따로 분리하지 않는다.
- compare 중심 branch와 family-expansion 중심 branch를 같은 화면 grammar 안에서 읽을 수 있어야 한다.

### Tree Navigator 2nd Layer

- tree navigator 2nd layer는 current `의미 범주`와 `주제 및 상황`의 익숙한 하위 vocabulary를 relation study용으로 다시 정리한 소분류로 고정한다.
- 2nd layer는 raw source label 전체를 그대로 복제하지 않는다.
- learner가 어색하게 읽는 label은 normalize한 relation-study subgroup으로 바꾼다.
- current usable examples:
  - `감정`
  - `상태`
  - `일상 행위`
  - `움직임`
  - `사회생활`
  - `학교생활`
  - `인간관계`
  - `직장 생활`

### Tree Navigator 2nd Layer Criteria

- 소분류는 `단어 하나`가 아니라 `관계 학습 카드 여러 개`를 안정적으로 모을 수 있어야 한다.
- 소분류 이름은 learner에게 직관적이어야 한다.
- compare/usage choice를 돕지 못하는 raw 분류는 그대로 노출하지 않는다.
- compare-heavy branch는 `의미 범주` 쪽 소분류를 우선 쓴다.
- context-heavy branch는 `주제 및 상황` 쪽 소분류를 보조 축으로 쓴다.

## Result Surface Rule

- 2nd layer 다음 기본 결과는 single word list가 아니라 `관계 학습 카드 목록`이다.
- 카드 최소 단위는 다음을 가진다.
  - relation family
  - 대표 단어쌍 또는 relation cluster
  - 한 줄 차이 설명 또는 쓰임 메모
  - 예문 1개
  - 필요 시 난이도/상황/격식 신호
- card click의 기본 도착지는 word detail이 아니라 `비교 학습 화면`이다.
- individual word detail은 보조 진입으로 남긴다.

## Canonical Scenario

1. app에 들어오면 relation family가 첫 선택으로 열린다.
2. left tree navigator에서 relation family를 고른다.
3. 2nd layer relation-study subgroup을 고른다.
4. main panel에서 `관계 학습 카드 목록`을 본다.
5. 카드 선택 후 `비교 학습 화면`으로 들어간다.
6. 필요할 때만 individual word detail로 이동한다.
7. 더 넓은 연결을 보고 싶을 때만 `관계도 보기`로 확장한다.

## Mindmap Connection Rule

- mindmap은 default first result가 아니다.
- mindmap은 card list 또는 compare view에서 여는 secondary expansion mode다.
- center는 selected relation study unit이다.
- ring 1은 pair/cluster words다.
- ring 2는 adjacent variants, next relation path, nearby comparison candidates다.
- learner의 first action은 `길 찾기`보다 `비교 읽기`가 되도록 유지한다.

## Non-Goals

- current category tree raw copy
- search-first app reopen
- single word list를 primary result로 두는 설계
- `MM3-291`에서의 full visual redesign
- `MM3-292` data contract까지 선반영
- `MM3-293` deploy topology까지 선반영

## Downstream Order

1. `MM3-292`
   - relation study card minimum field
   - relation subgroup derivation rule
   - compare view input contract
2. `MM3-293`
   - same repo / separate app / separate deploy boundary lock
3. `MM3-294`
   - `10_relation_app/` shell opening with inherited `MM3` theme

## Exit Condition

- theme inheritance rule이 고정됐다.
- direct opening rule이 고정됐다.
- tree navigator 1st/2nd layer criteria가 고정됐다.
- result surface와 scenario가 고정됐다.
- mindmap connection rule이 고정됐다.
- next task boundary가 `MM3-292`로 좁혀졌다.

## PM Verdict

- `ACCEPT`
- `IA_CANONICAL_LOCKED`
- `MM3-291_DONE`

## Revision History

- `R1` / `2026-03-29 13:04 KST` / `Codex PM` / separate relation explorer app IA canonical, MM3 theme inheritance, first/second/third layer rule, relation study scenario, mindmap connection rule을 고정
- `R2` / `2026-03-29 13:10 KST` / `Codex PM` / separate app 자체가 relation explorer라는 사용자 지시를 반영해 `관계 탐색` app-inside first layer를 제거하고 relation family direct opening 구조로 canonical IA를 수정
