# 20260329_MM3_292_RELATION_NAVIGATOR_DATA_CONTRACT_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-29 21:50 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-291` relation explorer IA를 actual navigator/data contract로 닫는다.
- subgroup split trigger, card minimum field set, compare input contract를 current schema 기준으로 고정한다.
- `활용 표현`은 later roadmap item으로 유지한다.

## Inputs

- `08_planning/reports/20260329_MM3_291_RELATION_EXPLORER_IA_CANONICAL_V1.md`
- `08_planning/reports/20260329_MM3_282_PROJECT_DB_BASELINE_AND_RELATION_EXPRESSION_STRENGTHENING_V1.md`
- `08_planning/RELATION_EXPLORER_APP_FOUNDATION_V1.md`
- `vocab_dictionary/output/unified_live/kcenter_base.json.gz`
- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- user-approved planning notes in this thread

## Planning

### Contract Goal

- relation navigator는 current dictionary schema를 직접 쓰거나 최소 적응만 해서 파생한다.
- first opening은 relation study를 빠르게 여는 구조여야 한다.
- long scroll이 생기면 same schema 안의 narrower hierarchy를 추가로 쓰되, navigator를 위해 totally new DB schema는 만들지 않는다.

### Canonical Source Rule

- relation family source:
  - `entries[].entry.senses[].related_terms[].type`
  - `entries[].entry.related_forms[].type`
- subgroup source:
  - `entries[].entry.categories[]`
  - `APP_READY_SEARCH_INDEX[].categories`
  - `APP_READY_SEARCH_INDEX[].hierarchy`
- compare/detail jump source:
  - `APP_READY_SEARCH_INDEX[].id`
  - `APP_READY_SEARCH_INDEX[].chunk_id`
  - `APP_READY_SEARCH_INDEX[].representative_sense_id`
  - `APP_READY_SEARCH_INDEX[].routing`

### First Opening Rule

- relation family는 first selectable layer다.
- subgroup은 second layer다.
- result unit은 `관계 학습 카드`다.
- default depth는 `relation family -> subgroup -> 관계 학습 카드`다.
- heavy branch에서만 selective 4th layer를 허용한다.

### Scroll Budget Rule

- comfortable initial card load:
  - `8~12`
- caution range:
  - `13~20`
- split-required signal:
  - `30+`

### Preliminary Family Classification

- heavy:
  - `비슷한말`
  - `참고어`
  - `파생어·관련형`
- medium:
  - `반대말`
- lean:
  - `높임말·낮춤말`
  - `큰말·작은말`
  - `센말·여린말`
  - `준말·본말`

## Validation

### Artifact Check

- `kcenter_base.json.gz` sample 확인 결과:
  - top-level은 `entries[]`
  - actual lexical body는 `entries[].entry`
  - sample entry `요리하다`는 `entry.categories`, `entry.senses`, `entry.related_forms`를 가진다
  - sample sense는 `related_terms`를 가진다
- sample relation evidence:
  - `요리하다` sense에서 `유의어 -> 조리하다`
  - same entry `related_forms`에서 `파생어 -> 요리`
- `APP_READY_SEARCH_INDEX.json` sample 확인 결과:
  - row keys include `id`, `word`, `pos`, `hierarchy`, `routing`, `stats`, `chunk_id`, `representative_sense_id`, `categories`

### Fit Check

- relation type은 current source field에서 directly derivable하다.
- subgroup 후보도 current category/hierarchy projection에서 directly derivable하다.
- compare/detail jump input도 current search projection에서 directly derivable하다.
- therefore first opening에 필요한 navigator contract는 existing schema로 충분하다.

## 3인의 전문가 검토

### Expert 1. Lexicography / Data Lens

- strong point:
  - source field를 버리지 않는 방향이 맞다.
  - relation family를 `related_terms.type`과 `related_forms.type`에서 바로 뽑는 것은 source-faithful하다.
- critique:
  - `파생어·관련형` 안에 reference-only marker까지 같이 넣으면 learner-facing family가 흐려질 수 있다.
- required improvement:
  - first opening family는 jumpable/source-explicit relation 위주로 제한한다.
  - reference-only marker는 family root가 아니라 secondary note로 내린다.

### Expert 2. Learner Experience Lens

- strong point:
  - `관계 학습 카드`를 result unit으로 둔 것은 맞다.
  - `30+` split-required signal은 scroll control에 유용하다.
- critique:
  - compare 화면에 term이 너무 많아지면 다시 읽기 cost가 커진다.
  - subgroup도 raw label을 그대로 쓰면 relation study intent가 흐려질 수 있다.
- required improvement:
  - compare input은 `2~4` terms를 기본으로 제한한다.
  - subgroup label은 current category vocabulary 기반 normalize만 허용한다.

### Expert 3. Product / Operating Lens

- strong point:
  - search projection을 compare/detail jump input으로 재사용하면 Phase 1/Phase 2 boundary가 깔끔하다.
- critique:
  - navigator contract 단계에서 new schema를 열면 `MM3-294` shell opening과 deploy topology까지 연쇄로 불안정해진다.
- required improvement:
  - current schema direct use/adapt boundary를 packet verdict로 잠근다.
  - later `활용 표현`은 별도 roadmap item으로 유지한다.

## Improvement

### Family Boundary Improvement

- first opening family는 아래 source-explicit group으로 고정한다.
  - `비슷한말`
  - `반대말`
  - `참고어`
  - `높임말·낮춤말`
  - `큰말·작은말`
  - `센말·여린말`
  - `준말·본말`
  - `파생어·관련형`
- `파생어·관련형`에서는 source-explicit relation만 first opening 대상으로 본다.
- reference-only marker는 first opening family root로 올리지 않는다.

### Subgroup Split Trigger

1. first pass:
   - existing subgroup from `categories` / `hierarchy`
2. second pass:
   - 예상 카드 수가 `30+`면 same schema 안의 narrower hierarchy phrase를 추가 사용
3. adapted grouping:
   - raw label이 relation study intent에 어색할 때만 current vocabulary 기반 normalize
4. forbidden:
   - navigator 전용 totally new DB schema

### Card Minimum Field Set

- required:
  - relation family
  - subgroup label
  - representative terms `2~4`
  - 대표 뜻 한 줄
  - example `1`
  - compare jump target
- optional when available:
  - `pos`
  - `word_grade`
  - `translation_summary`
  - `routing`

### Compare Input Contract

- per study card compare input:
  - `family`
  - `subgroup`
  - `term_ids`
  - `term_words`
  - `representative_sense_ids`
  - `chunk_ids`
  - `def_ko`
  - optional `translation_summary`
  - optional `pos`
  - optional `word_grade`
  - optional `routing`
- compare 기본 term count:
  - `2~4`
- more-than-4 cluster는 compare root가 아니라 카드 안의 expansion candidate로 둔다.

## Revalidation

- subgroup split trigger는 current schema path만으로 닫혔다.
- card minimum field set은 current source/search projection만으로 채울 수 있다.
- compare input contract도 current search projection key로 충족된다.
- navigator를 위해 totally new DB schema를 열 필요가 없다.
- `활용 표현` later roadmap registration은 유지된다.

## Final Contract

- navigator branch 기준은 current schema direct use 또는 adapted grouping only다.
- subgroup split trigger는 `30+` card risk다.
- card minimum field set은 `family / subgroup / representative terms 2~4 / 대표 뜻 한 줄 / example 1 / compare jump target`이다.
- compare input contract는 current search projection key 재사용 기준으로 닫는다.
- first opening scope는 relation-first에 한정하고 `활용 표현`은 `MM3-295`로 보낸다.

## Exit Condition

- subgroup split trigger fixed
- card minimum field set fixed
- compare input contract fixed
- schema reuse/adapt boundary fixed
- later expression roadmap registration retained

## PM Verdict

- `ACCEPT`
- `CONTRACT_LOCKED`
- `MM3-292_DONE`
- `BUNDLED_WITH_MM3-293`

## Revision History

- `R1` / `2026-03-29 21:50 KST` / `Codex PM` / relation navigator data contract opening, schema reuse rule, scroll budget, later expression roadmap registration
- `R2` / `2026-03-29 21:50 KST` / `Codex PM` / planning, validation, 3-expert review, improvement, revalidation을 거쳐 subgroup split trigger, card minimum field set, compare input contract를 고정
