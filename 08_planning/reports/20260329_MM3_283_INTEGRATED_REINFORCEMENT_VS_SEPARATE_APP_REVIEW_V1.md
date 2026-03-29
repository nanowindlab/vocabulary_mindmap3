# 20260329_MM3_283_INTEGRATED_REINFORCEMENT_VS_SEPARATE_APP_REVIEW_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-29 04:12 KST`

## Last Updated By

- `Codex PM`

## Scope

- relation/expression 확장을 current MM3 안에서 통합 보강할지, 별도 앱으로 분리할지 비교 검토한다.
- current MM3 product structure, data reality, validation boundary를 근거로 option trade-off를 정리한다.
- 3인의 전문가 review 후 improved recommendation을 남긴다.

## Inputs

- prior baseline:
  - `08_planning/reports/20260329_MM3_282_PROJECT_DB_BASELINE_AND_RELATION_EXPRESSION_STRENGTHENING_V1.md`
- current app:
  - `09_app/src/App.jsx`
  - `09_app/src/components/TermDetail.jsx`
- current data:
  - `09_app/public/data/live/*`
- prior product decisions:
  - `08_planning/reports/20260323_MM3_004_PM_STRUCTURE_OPTIONS_V1.md`
  - `08_planning/reports/20260325_MM3_169_RELATION_EXPRESSION_DISCOVERABILITY_CONTRACT_V1.md`
  - `08_planning/reports/20260325_MM3_189_W2_SURFACE_CONTRACT_STUDY_V1.md`

## Current Evidence

### 1. Current App Entry Structure

- top navigation in `App.jsx` currently exposes only:
  - `의미 범주`
  - `주제 및 상황`
  - `분류 밖 항목`
- current app does not expose `활용 표현` as a top-level app axis.
- search result cue for expression is still secondary:
  - `다음: 표현층`
- meaning:
  - current IA assumes expression is downstream of word selection, not a first-screen primary product.

### 2. Current Product Decision History

- `MM3-004` already locked the high-level structure as:
  - `word-first`
  - `dual category`
  - `sense core`
  - expression as `별도 출발점 + 표현층 레이어`
- later implementation decisions kept the same direction:
  - expression is not a primary taxonomy axis
  - relation/expression discoverability is solved inside detail, not by elevating expression to first-class global nav
- `MM3-057` explicitly recorded:
  - expression layer is still not an independent top-level surface

### 3. Current Data Reality

- current live/base entry count:
  - `53,012`
- relation surface entries:
  - `31,210`
- expression surface entries:
  - `1,150`
- overlap:
  - relation + expression both present: `580`
- subword total:
  - `2,864`
- subword composition:
  - `관용구 2,213`
  - `속담 651`
- jumpability:
  - entries with any jumpable subword: `1`
  - total jumpable subword items: `1`
  - preview-only subword items: `2,863`
- top relation types:
  - `유의어 14,593`
  - `참고어 10,509`
  - `반대말 2,824`
- interpretation:
  - relation is already a broad compare layer
  - expression is currently a narrow idiom/proverb-heavy preview layer

### 4. Current Top-Level Expression Payload Readiness

- `APP_READY_EXPRESSIONS_TREE.json`:
  - `0`
- `APP_READY_BASICS_TREE.json`:
  - `0`
- `APP_READY_SITUATIONS_TREE.json`:
  - `0`
- meaning:
  - there is no current top-level expression browse payload strong enough to justify a separate standalone product flow

### 5. Current Validation / Ops Boundary

- current search/facet/chunk boundary is verified:
  - `validate:chunk-contract` `PASS`
  - `probe:runtime-surface-recovery` `53,012 / 53,012`
  - `test:contracts` `2 passed`
- default deploy path uses committed compressed runtime payloads
- current deploy boundary excludes `APP_READY_DETAIL_MAP.json.gz`
- implication:
  - splitting into a new app would not be free
  - it would create another app shell, another runtime contract, another validation/handoff surface to maintain

## Option Review

### Option A. Current MM3 내부 통합 보강

#### What It Means

- keep one app
- strengthen `의미 관계` inside current word/detail flow
- redesign `활용 표현` as current-data-fit idiom/proverb support layer

#### Strengths

- matches current `word-first + sense core` structure
- relation is context-dependent and already anchored to selected word/sense
- avoids forcing weak expression data into a fake standalone product
- reuses current verified search/facet/chunk boundary
- keeps user mental model simple:
  - search a word
  - compare related words
  - inspect idioms/proverbs tied to that word

#### Weaknesses

- detail panel can become crowded if hierarchy is not strict
- expression growth is partially constrained by current MM3 shell
- future speaking/writing coach ambitions may outgrow the current detail-first flow

#### PM Reading

- strongest current option
- especially right for the next tranche

### Option B. 별도 앱으로 분리

#### What It Means

- build a separate app for relation/expression exploration
- users would move from MM3 core explorer into another dedicated product

#### Potential Benefits

- cleaner thematic focus if the product later becomes:
  - comparison-first lexicon trainer
  - idiom/proverb trainer
  - speaking/writing coach
- independent IA, onboarding, and practice flow become easier later

#### Current Problems

- no current top-level expression payload:
  - `APP_READY_EXPRESSIONS_TREE.json = 0`
- expression data is too thin to support a standalone experience:
  - only `1,150` entries with subwords
  - only `1` jumpable subword item
- relation use is still deeply anchored to the currently selected word/sense
- split would duplicate:
  - search/discovery shell
  - runtime payload policy
  - validation path
  - handoff/control-plane complexity
- learner path would fragment:
  - search in one place
  - compare/use in another place

#### PM Reading

- not recommended now
- current data and IA do not justify a separate app

### Option C. Same App, Dedicated Mode / Route Later

#### What It Means

- do not split into a separate product now
- later add an in-app dedicated mode, route, or launcher for:
  - compare mode
  - idiom/proverb study mode
  - expression coach mode

#### Strengths

- preserves one runtime/control-plane/product truth
- lets the team test expression-only workflows without hard app split
- keeps reuse of search/detail/chunk validation surfaces

#### Weaknesses

- still needs stronger top-level expression data before it becomes useful
- if not carefully scoped, may create pseudo-separate-app complexity inside the same app

#### PM Reading

- best future-safe middle path
- not immediate, but much better than full split

## 3인의 전문가 Review

### Expert 1. Product IA Lens

- finding:
  - current MM3 is structurally a word-first explorer, not a dual-product bundle
  - a separate app right now would fight the accepted IA instead of extending it
- critique:
  - binary choice `integrated vs separate app` is too coarse
  - there should be a staged middle route
- recommendation:
  - integrate now
  - reserve in-app dedicated route as later option
  - reject separate app at current stage

### Expert 2. Learner Journey Lens

- finding:
  - learners currently approach relation/expression after selecting a word
  - relation is strongest when tied to the current sense
  - idiom/proverb usage is strongest when tied back to the anchor word
- critique:
  - if we split too early, users must reconstruct context in a second product
  - this increases friction and weakens comprehension
- recommendation:
  - keep relation and expression in the same app for now
  - separate-app thinking should be revisited only if users come primarily for expression-only practice

### Expert 3. Engineering / Operations Lens

- finding:
  - current verified boundary is already delicate but stable
  - another app would immediately multiply validation, payload, and handoff surfaces
- critique:
  - separate app cost is not just UI cost
  - it would create new runtime contracts before the data is mature enough
- recommendation:
  - keep one app boundary
  - if a distinct experience is needed, create a route within the same app first

## Improved Recommendation

### Final Position

- `now`:
  - keep everything inside current MM3
- `later if needed`:
  - add a dedicated route/mode inside MM3
- `not now`:
  - do not spin this into a separate app

### Why This Is Better Than The First Pass

- it matches the current validated data shape
- it respects accepted MM3 IA history
- it avoids forcing a weak top-level expression surface
- it preserves the currently verified deployment and validation boundary

## What To Do In Current MM3

### 1. Relation Work Stays In Core App

- make `의미 관계` a stronger compare surface
- keep it attached to the current word/sense context
- show:
  - `비슷한말`
  - `반대말`
  - `참고어`
  first
- show morphology/style variants second:
  - `큰말`
  - `작은말`
  - `센말`
  - `여린말`
  - `파생어`

### 2. Expression Work Also Stays In Core App

- do not present it as a new standalone world
- present it as:
  - `관용구`
  - `속담`
  tied to the selected word
- current task is not to maximize jumping
- current task is to maximize:
  - understanding
  - example reading
  - usage recognition

### 3. Keep The User In One Learning Loop

- search word
- understand meaning
- compare nearby words
- see idioms/proverbs connected to that word

- this is a coherent loop today
- split-app flow would break the loop before the data supports it

## When A Split Could Become Reasonable

- not while:
  - `APP_READY_EXPRESSIONS_TREE.json = 0`
  - jumpable subword items are effectively zero
  - relation still depends on selected word/sense context
- reconsider split only when all become true:
  - expression browse payload is non-empty and curated
  - expression data is no longer almost entirely preview-only
  - users show strong expression-only or practice-only intent
  - sentence pattern / register / speech-act support becomes first-class data

## Practical Recommendation For The Next Tranche

1. do not create a separate app
2. open a relation-first implementation tranche inside MM3
3. redesign `활용 표현` as idiom/proverb-first inside MM3
4. after that, evaluate whether an in-app dedicated route is justified

## Validation Classification

### Verified

- current app primary nav is not expression-first
- current accepted IA places expression below core structure
- relation data is broad enough for integrated growth
- expression data is too thin for standalone split
- current expression top-level payload is empty
- a separate app would create duplicated app/runtime/validation complexity

### Contradicted

- `별도 앱 분리`가 current data readiness상 바로 적절하다는 가정
- current `활용 표현`이 already standalone product-grade network라는 가정

### Unverified

- a future in-app dedicated route would improve learner outcome enough to justify itself
- users will want expression-only sessions at high frequency

## PM Verdict

- `ACCEPT`
- `INTEGRATED_REINFORCEMENT_NOW`
- `SEPARATE_APP_NOT_RECOMMENDED_NOW`
- `IN_APP_DEDICATED_ROUTE_LATER_IF_NEEDED`

## Revision History

- `R1` / `2026-03-29 04:02 KST` / `Codex PM` / integrated reinforcement vs separate app review package opening
- `R2` / `2026-03-29 04:12 KST` / `Codex PM` / option comparison, 3인의 전문가 review, improved recommendation 반영
