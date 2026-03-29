# 20260329_MM3_282_PROJECT_DB_BASELINE_AND_RELATION_EXPRESSION_STRENGTHENING_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-29 04:02 KST`

## Last Updated By

- `Codex PM`

## Scope

- current MM3 project status를 control-plane 기준으로 다시 정리한다.
- actual DB artifacts의 구조, 양, runtime-facing split, validation basis를 확인한다.
- `MM3-281` relation/expression proposal을 현재 MM3 데이터 현실에 맞게 더 구체적인 실행안으로 보강한다.

## Inputs

- control-plane:
  - `08_planning/TASKLIST_V1.md`
  - `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
  - `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
- prior proposal:
  - `08_planning/reports/20260329_MM3_281_RELATION_EXPRESSION_DEEP_RESEARCH_AND_APPLICATION_PLAN_V1.md`
- artifact zones:
  - `vocab_dictionary/output/unified_live/*`
  - `09_app/public/data/live/*`
  - `09_app/public/data/internal/runtime_payloads/*`
  - `09_app/src/components/TermDetail.jsx`

## Current Project Status

- phase:
  - `M1 Runtime Wiring / Core Explorer`
- gate:
  - overall `PARTIAL_OPEN`
- active execution state:
  - this packet was opened for review, but the project had no pre-existing blocker
- current runtime operating rule:
  - default deploy path uses committed compressed payloads
  - canonical regenerate exists, but explicit/manual path로만 유지된다
- current learner-facing relation/expression contract:
  - `의미 관계` 탭:
    - `연관 어휘`
    - `의미 관계어`
    - `관련형`
    - `교차 연결 장면`
    - `다른 뜻 보기`
  - `활용 표현` 탭:
    - `subwords` 기반 표현 카드
    - jumpable item과 preview-only item을 분리
    - detail 내부의 보조 레이어로 유지
- current product constraint:
  - source-ambiguous `related_forms`는 `text-only`다
  - source에 없는 target은 추론해 연결하지 않는다
  - normal runtime은 `DETAIL_MAP` silent fallback을 쓰지 않는다

## Actual DB Structure

### 1. Source Master Zone

- path:
  - `vocab_dictionary/output/unified_live/`
- current major artifacts:
  - `kcenter_base.json.gz`
  - `kcenter_translations.json.gz`
  - `kcenter_thin_index.json.gz`
  - `kcenter_facet_payload.json.gz`
  - `kcenter_chunk_id_mapping.json.gz`
  - `kcenter_merge_report.json`
  - `kcenter_link_integrity.json`
- role:
  - source master + source-side sidecar + validation metadata

### 2. App Live Zone

- path:
  - `09_app/public/data/live/`
- current structure:
  - search/facet layer:
    - `APP_READY_SEARCH_INDEX.json`
    - `APP_READY_FACETS.json`
  - tree layer:
    - `APP_READY_MEANING_TREE.json`
    - `APP_READY_SITUATION_TREE.json`
    - `APP_READY_UNCLASSIFIED_TREE.json`
  - detail layer:
    - `APP_READY_DETAIL_MAP.json`
  - chunk layer:
    - `CHUNK_MANIFEST_V1.json`
    - `APP_READY_CHUNK_RICH_*` `107 files`
    - `APP_READY_CHUNK_EXAMPLES_*` `107 files`
  - parked/empty auxiliary trees:
    - `APP_READY_BASICS_TREE.json`
    - `APP_READY_EXPRESSIONS_TREE.json`
    - `APP_READY_SITUATIONS_TREE.json`

### 3. Compressed Deploy Zone

- path:
  - `09_app/public/data/internal/runtime_payloads/`
- current structure:
  - compressed search/facet/tree payloads
  - compressed chunk manifest
  - compressed rich/example chunks
- current exclusion:
  - `APP_READY_DETAIL_MAP.json.gz`는 없다
  - current deploy boundary는 `DETAIL_MAP` 없이도 동작하는 방향으로 정리돼 있다

## Quantity Snapshot

### Zone Size

- `unified_live`:
  - `1,452,344,196` bytes
- `09_app/public/data/live`:
  - `1,329,837,841` bytes
- `runtime_payloads`:
  - `158,584,411` bytes

### Source Counts

- `kcenter_base.json.gz`
  - top-level keys:
    - `schema_version`, `generated_at`, `entry_count`, `api_xml_merged`, `entries`
  - actual current values:
    - `entry_count = 53,012`
    - `api_xml_merged = 53,480`
    - `entries length = 53,012`
- `kcenter_thin_index.json.gz`
  - `entry_count = 53,012`
  - `entries length = 53,012`
- `kcenter_facet_payload.json.gz`
  - `entry_count = 53,012`
- `kcenter_merge_report.json`
  - `merge.entry_count = 53,480`
  - `api_entries_created = 41`
- interpretation:
  - `53,480`은 current learner-facing entry count가 아니라 merged source total/history 쪽 수치다
  - current live base/runtime count는 `53,012`다

### App Live Counts

- `APP_READY_SEARCH_INDEX.json`
  - rows: `53,012`
  - with `chunk_id`: `53,012`
  - with `translation_summary`: `51,281`
  - with `has_related_forms`: `18,676`
  - with `has_subwords`: `1,150`
  - with `의미 범주`: `44,410`
  - with `주제 및 상황 범주`: `6,399`
- tree rows:
  - `APP_READY_MEANING_TREE.json`: `44,410`
  - `APP_READY_SITUATION_TREE.json`: `6,399`
  - `APP_READY_UNCLASSIFIED_TREE.json`: `8,506`
  - `APP_READY_BASICS_TREE.json`: `0`
  - `APP_READY_EXPRESSIONS_TREE.json`: `0`
  - `APP_READY_SITUATIONS_TREE.json`: `0`
- `APP_READY_DETAIL_MAP.json`
  - `entry_count = 53,012`
  - `entries length = 53,012`
- `CHUNK_MANIFEST_V1.json`
  - `chunk_count = 107`
  - `chunk_size = 500`
  - every chunk has `chunk_id`, `entry_count`, `entry_ids`
- chunk files:
  - `APP_READY_CHUNK_RICH_*`: `107`
  - `APP_READY_CHUNK_EXAMPLES_*`: `107`

### Field Distribution Relevant To Proposal

- relation surface coverage:
  - entries with any relation surface (`related_forms` or `sense.related_terms`): `31,210`
- expression surface coverage:
  - entries with `subwords`: `1,150`
- overlap:
  - entries with both relation and expression surface: `580`
- detail totals:
  - total senses: `72,650`
  - total `related_terms`: `33,400`
  - total `related_forms`: `34,749`
  - total `subwords`: `2,864`
- `related_terms` top types:
  - `유의어`: `14,593`
  - `참고어`: `10,509`
  - `반대말`: `2,824`
  - `작은말`: `1,368`
  - `큰말`: `1,265`
  - `여린말`: `766`
  - `준말`: `700`
  - `본말`: `649`
  - `센말`: `606`
  - `높임말`: `103`
- `related_forms` top types:
  - `파생어`: `24,888`
  - `☞(가 보라)`: `9,861`
- subword composition:
  - `관용구`: `2,213`
  - `속담`: `651`

### Jumpability Reality

- entries with `subwords`: `1,150`
- entries with any jumpable subword: `1`
- entries with preview-only subword: `1,150`
- total jumpable subword items: `1`
- total preview-only subword items: `2,863`
- interpretation:
  - current `활용 표현`은 navigation-heavy layer가 아니다
  - actual DB shape상 almost all expression items are preview-first idiom/proverb references

## Validation Snapshot

### Direct Checks Performed

- `npm --prefix 09_app run validate:chunk-contract`
  - result:
    - `PASS`
    - `mapping_entry_count = 53,012`
    - `mapping_chunk_count = 107`
    - `runtime_row_count = 53,012`
    - `manifest_chunk_count = 107`
- `npm --prefix 09_app run probe:runtime-surface-recovery`
  - result:
    - search `runtime_rows = 53,012`
    - search `matched = 53,012`
    - search `mismatched = 0`
    - facets `runtime_entry_count = 53,012`
    - facets `exact_match = true`
- `npm --prefix 09_app run test:contracts`
  - result:
    - `2 passed`

### Existing Validation Evidence Reused

- `MM3-275`:
  - chunk contract validation and node contract tests already accepted
- `MM3-279`:
  - default deploy path uses committed runtime payloads
- `MM3-266F`:
  - `DETAIL_MAP` fallback is debug-only
- `MM3-271`:
  - canonical generator closeout recorded `search_rows = 53,012`, `facet_entry_count = 53,012`
- `MM3-263`:
  - subject-none policy reduced current learner-facing count `53,480 -> 53,012`

## Validation Classification

### Verified

- current live/runtime entry count is `53,012`
- source base current `entry_count` is `53,012`
- current merge-total / history count is `53,480`
- current search/facet/chunk boundary is coherent
- relation surface is broad enough to justify product investment now
- expression surface exists, but is narrow and mostly preview-based
- current deployed compressed boundary does not include `APP_READY_DETAIL_MAP.json.gz`

### Contradicted

- `53,480`을 current artifact truth로 두는 문구
- `subword`를 general jump/navigation surface처럼 해석하는 기대
- `활용 표현`을 이미 broad expression coach 데이터로 볼 수 있다는 전제

### Unverified

- relation card에 style/collocation/pragmatic note를 자동으로 충분히 붙일 수 있다는 가정
- expression layer를 top-level browse axis로 확장해도 좋은지에 대한 learner acceptance

## Strengthened Proposal

### 1. `의미 관계`는 바로 키울 수 있다

- 이유:
  - relation surface가 `31,210` entries에 걸쳐 있다
  - `유의어`, `참고어`, `반대말`만 합쳐도 already thick하다
  - current validation boundary 안에서 source-faithful guardrail도 명확하다
- 실제로 무엇을 할 것인가:
  - relation tab 맨 앞에 `빠른 비교` 영역을 둔다
  - 여기서 먼저 보여 줄 것은:
    - `비슷한말`
    - `반대말`
    - `참고어`
  - 사용자는 단어를 눌렀을 때
    - 비슷한 다른 말
    - 반대로 쓰는 말
    - 같이 알아두면 좋은 주변 말
    를 바로 비교하게 된다
- 다음 묶음은 따로 둔다:
  - `큰말/작은말`
  - `센말/여린말`
  - `본말/준말`
  - `높임말`
  - `파생어`
- 왜 나눠야 하는가:
  - 이 묶음은 `뜻 비교`라기보다 `형태/문체/표현 변이`에 가깝다
  - learner가 가장 먼저 보고 싶은 정보와 한 화면에 섞으면 읽기 순서가 흐려진다
- current MM3 rule 유지:
  - source에 target이 없으면 clickable로 만들지 않는다
  - unresolved related form은 text-only로 둔다

### 2. `활용 표현`은 지금 데이터 현실에 맞게 다시 정의해야 한다

- 이유:
  - entries with `subwords`는 `1,150`뿐이다
  - total subword `2,864` 중 jumpable item은 `1`뿐이다
  - unit 분포도 `관용구 2,213`, `속담 651`로 almost entirely idiom/proverb다
- 결론:
  - current DB 기준 `활용 표현`은 general expression network가 아니다
  - 당장은 `관용구·속담 중심의 활용 참고 패널`로 보는 것이 정확하다
- 실제로 무엇을 할 것인가:
  - same tab 안을 두 section으로 나눈다
    - `관용구`
    - `속담`
  - 각 카드에는 최소한:
    - 표현 자체
    - 뜻
    - 실제 쓰인 문장
    - 언제 쓰는 표현인지 짧은 안내
    를 붙인다
  - 현재처럼 jump를 전면에 두지 말고
    - `이 표현을 어떻게 이해하고 쓰는가`
    중심으로 보여 준다
- 즉:
  - 지금 단계의 `활용 표현`은 `말을 더 찾아가는 지도`가 아니라
  - `이미 있는 관용구/속담을 학습자가 바로 이해하는 참고 카드 묶음`이어야 한다

### 3. `활용 정보`와 `표현 정보`는 나중에 분리하는 것이 맞다

- `MM3-281`에서는 이 둘을 나누자는 방향이 맞았다
- but current DB reality를 보면 immediate split implementation까지 가기엔 아직 빠르다
- 왜냐하면:
  - top-level `APP_READY_EXPRESSIONS_TREE.json`가 비어 있다
  - current expression layer가 mostly idiom/proverb이고
  - sentence pattern / politeness / register data는 아직 구조적으로 충분하지 않다
- therefore current better plan:
  - now:
    - `활용 표현` 내부를 `관용구/속담` 중심으로 정리
  - later:
    - actual sentence pattern, 활용형, 공손도 note가 추가되면
    - 그때 `활용 정보` / `표현 정보`를 분리

### 4. 사용자에게는 이렇게 보이게 만드는 것이 맞다

- 단어를 눌렀을 때 먼저:
  - `이 말과 비슷한 말은 무엇인지`
  - `반대말은 무엇인지`
  - `헷갈리기 쉬운 주변 말은 무엇인지`
  를 빠르게 본다
- 그 다음:
  - `파생어`나 `큰말/작은말` 같은 변이 관계를 본다
- 마지막으로:
  - 이 단어가 들어간 `관용구/속담`을 본다
  - 여기서는 이동보다 이해와 쓰임 안내가 중심이 된다

### 5. 실행 우선순위도 바뀌어야 한다

- previous generic plan보다 sharper current order:
  1. `의미 관계` compare surface 강화
  2. `관용구/속담` 중심 `활용 표현` 재정렬
  3. expression writing/speaking coach 확장은 데이터가 더 준비된 뒤
- 이유:
  - relation은 지금 당장 넓고 깊은 데이터가 있다
  - expression은 지금 당장 넓지 않고, 대부분 preview 중심이다

## Recommended Next Tranche

### T1. Current Truth Cleanup

- control-plane 문구에서 `53,480` current artifact truth 표기를 정리한다
- `53,012 current entry_count`와 `53,480 historical merged total`을 분리해서 쓴다

### T2. Relation Compare Design

- `비슷한말 / 반대말 / 참고어` quick-compare layout 설계
- `형태/문체 변이` second section 설계
- text-only unresolved rule을 UI copy에 명시

### T3. Expression Card Redesign

- `활용 표현` 탭을 `관용구 / 속담` 중심으로 재정렬
- jump 유도보다 뜻/쓰임/예문 중심 카드로 재설계

### T4. Future Data Expansion

- sentence pattern
- politeness / register
- speech-act note
- truly jumpable expression targets
- 이 데이터가 들어온 뒤에만 `활용 정보` / `표현 정보` full split을 다시 연다

## Exit Condition

- current project status summary is aligned with control-plane truth
- actual DB structure and quantity claims are evidenced from local artifacts
- strengthened proposal is grounded in actual MM3 data shape, not generic dictionary theory
- validation labels each core claim as verified / unverified / contradicted

## PM Verdict

- `ACCEPT`
- `PROPOSAL_STRENGTHENED_AGAINST_ACTUAL_DB`
- `COUNT_CLARIFICATION_REQUIRED_ON_CONTROL_PLANE`

## Revision History

- `R1` / `2026-03-29 03:36 KST` / `Codex PM` / project/db baseline review and proposal strengthening package opening
- `R2` / `2026-03-29 04:02 KST` / `Codex PM` / local DB artifact inspection, validation rerun, strengthened proposal, count clarification을 반영
