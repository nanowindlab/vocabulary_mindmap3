# 20260325_MM3_168_DETAIL_HEADER_CLOSE_COPY_DENSITY_CONTRACT_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-25 00:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-168A` detail header / close / copy density contract

## Inputs

- `08_planning/reports/20260325_MM3_168_DETAIL_HEADER_CLOSE_COPY_DENSITY_PLAN_V1.md`
- `08_planning/reports/20260325_MM3_170_TRANSLATION_SURFACE_COMPLETENESS_REAUDIT_NOTE_V1.md`
- `08_planning/reports/20260325_MM3_171_RUNTIME_PERFORMANCE_PAYLOAD_SPLIT_AUDIT_NOTE_V1.md`
- `08_planning/reports/20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TERMINOLOGY_BASELINE_DRAFT_V1.md`
- code:
  - `09_app/src/App.jsx`
  - `09_app/src/components/TermDetail.jsx`
- screenshot:
  - `/Users/nanowind/Desktop/스크린샷 2026-03-24 오후 9.36.15.png`

## Current Evidence

### A. `닫기`는 panel-level chrome에 있고 lexical header 안에는 없다.

- current close button:
  - `09_app/src/App.jsx:891`
- 현재는 detail panel 상단 bar 우측에 `X + 닫기` 버튼이 있다.
- 따라서 residual은 `버튼이 없는 문제`보다 `시인성/위계/간결성` 문제로 보는 편이 맞다.

### B. lexical header는 `표제어 + 발음 row`와 `Band chip`을 따로 쓴다.

- current header:
  - `09_app/src/components/TermDetail.jsx:399`
- 발음은 second row에 `Volume2 + [roman]`으로 들어간다.
- Band chip은 우측 상단 독립 배지다.

### C. top-of-fold 과밀은 `핵심` 탭 상단 helper stack에서 생긴다.

- 현재 core 상단 주요 블록:
  1. 정의 카드
  2. context helper
  3. `표현 활용 워크플로우` helper
  4. 번역 카드
  5. 의미 선택
- 특히 `표현 활용 워크플로우`는 3-step list + CTA까지 들어가 상단 밀도를 높인다.

### D. W2 constraint

- translation rule:
  - selected language semantics는 유지해야 한다.
- performance rule:
  - top-of-fold에 새 fetch나 무거운 runtime cost를 추가하면 안 된다.

## Decision Surface

### 1. Header Layout

#### Option A

- 현재 구조 유지
- 표제어 아래에 `Volume2 + [roman]`
- Band chip 우측 유지

#### Option B

- 발음을 표제어 오른쪽 inline meta로 이동
- `Volume2` 제거
- Band chip은 우측 유지

#### Recommendation

- `Option B`

#### Why

- 사용자 피드백과 직접 일치한다.
- 발음은 lexical identity metadata에 가깝고, 독립 audio action이 없는데 speaker 아이콘을 두는 건 affordance noise에 가깝다.
- top row 정보 밀도를 올리면서도 새 surface를 만들지 않는다.

### 2. Close Affordance

#### Option A

- current panel chrome 유지
- `X + 닫기` 유지

#### Option B

- panel chrome 유지
- 텍스트는 `닫기`만 두고 icon 제거

#### Option C

- lexical header 안으로 close를 이동

#### Recommendation

- `Option B`

#### Why

- close는 panel-level action이므로 lexical header 안으로 넣지 않는 편이 맞다.
- current `X + 닫기`는 기능 중복이다.
- panel chrome에 남기되, header hierarchy와 경쟁하지 않게 더 간결하게 두는 편이 좋다.

### 3. Core Helper Density

#### Option A

- `표현 활용 워크플로우` helper를 지금처럼 full card로 상시 노출

#### Option B

- helper를 compact teaser로 축소
- 핵심 카피 1~2문장 + CTA 1개만 남김
- 3-step list는 제거

#### Option C

- helper를 기본 숨김/펼침 패턴으로 전환

#### Recommendation

- `Option B`

#### Why

- 표현 discoverability는 유지해야 하지만, 현재 full card는 `핵심` top-of-fold를 과밀하게 만든다.
- `MM3-169`에서 relation / expression discoverability를 다룰 예정이므로, `MM3-168`에서는 helper를 사라지게 하기보다 가볍게 줄이는 편이 맞다.
- 접기 패턴까지 도입하면 interaction complexity가 늘어난다.

## Contract

### Header Contract

- top row:
  - 좌측: `표제어 + inline pronunciation`
  - 우측: `Band chip`
- pronunciation:
  - `[돈ː]`처럼 표제어 오른쪽 inline
  - speaker icon 제거
- meta chips:
  - 품사
  - normalized path

### Close Contract

- close는 panel chrome에 유지
- lexical header 안으로 이동하지 않음
- label은 `닫기`
- icon은 제거

### Close Behavior Guardrail

- close는 `panel-level action`으로 취급한다.
- close는 아래를 직접 바꾸지 않는다.
  - `selectedTermId`
  - `focusedRootId`
  - current canvas/root selection semantics
- close가 하는 일은 detail panel visibility를 내리는 것에 한정한다.
- 즉 `detail 닫기`는 `선택 해제`가 아니라 `panel close`다.
- 이전 close-related sync bug를 다시 열지 않기 위해, 구현 단계에서도 이 행동 불변식을 유지한다.

### Core Top-Of-Fold Contract

- order:
  1. 정의 카드
  2. 번역 카드
  3. context helper
  4. compact expression teaser
  5. 의미 선택
- compact expression teaser rule:
  - 핵심 카피 1~2문장
  - CTA 1개
  - 3-step list 제거

## Downstream Guardrail For `MM3-169`

- relation / expression discoverability는 `핵심` 상단에 다시 긴 workflow block을 추가하지 않는다.
- expression discoverability는 compact teaser 또는 tab-level signal 안에서 해결한다.
- `상세 연결 없음`, `의미 2개`, selected language residual 같은 card-level copy는 `MM3-169`에서 다루되, `MM3-168` top-of-fold contract를 깨지 않는다.

## Exit Criteria

- header / close / top-of-fold density에 대해 선택안이 하나씩 정리됐다.
- 선택안이 translation/performance constraint와 충돌하지 않는다.
- `MM3-169`가 reuse할 상단 guardrail이 생겼다.

## PM Verdict

- `draft acceptable`
- final accept는 review checkpoint 이후로 둔다.

## Next Step

- review checkpoint for `MM3-168A`
- `MM3-169A` relation / expression surface discoverability follow-up

## Revision History

- `R1` / `2026-03-25 00:10 KST` / `Codex PM` / current code/screenshot 기준으로 detail header/close/copy density contract를 최초 고정
- `R2` / `2026-03-25 00:10 KST` / `Codex PM` / review finding에 따라 close behavior guardrail을 contract에 추가
