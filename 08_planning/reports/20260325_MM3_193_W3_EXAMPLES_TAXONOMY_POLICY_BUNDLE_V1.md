# 20260325_MM3_193_W3_EXAMPLES_TAXONOMY_POLICY_BUNDLE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 17:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-187G` W3 examples / taxonomy policy bundle

## Inputs

- `08_planning/reports/20260325_MM3_171_RUNTIME_PERFORMANCE_PAYLOAD_SPLIT_AUDIT_NOTE_V1.md`
- `08_planning/reports/20260324_MM3_172_TOPIC_SITUATION_UNCLASSIFIED_TERMINOLOGY_BASELINE_DRAFT_V1.md`
- `08_planning/reports/20260325_MM3_192_SECOND_PILOT_FEEDBACK_FULL_COVERAGE_REAUDIT_V1.md`
- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- `09_app/public/data/live/APP_READY_DETAIL_MAP.json`
- `vocab_dictionary/scripts/`
- `README.md`

## Runtime Evidence

### 1. Fallback surface 규모

- current live search index counts:
  - `의미 범주`: `33,619`
  - `주제 및 상황 범주`: `11,355`
  - `미분류`: `8,506`
- `미분류` 내부 구성:
  - functional POS: `1,080`
  - content-side remainder: `7,426`

## 2. Situation-none 규모

- current live `주제 및 상황 범주 > 없음`: `4,956`

### 3. Dictionary example coverage

- current live detail entries with examples: `51,326`
- entries with at least one `문장` example: `13,421`
- current example type counts:
  - `구`: `306,415`
  - `문장`: `35,959`
  - `대화`: `14,151`

### 4. Example chunk payload availability

- `09_app/public/data/live/APP_READY_CHUNK_EXAMPLES_*`: `0 files`
- `09_app/public/data/internal/runtime_payloads/APP_READY_CHUNK_EXAMPLES_*`: `0 files`

### 5. Builder-path reality

- current MM3-side scripts:
  - `build_kcenter_dataset.py`
  - `link_vm2_topik_stats.py`
  - `repair_runtime_translation_payloads.py`
- current MM3 repo 안에는 `APP_READY_CHUNK_EXAMPLES_*`를 생성하는 dedicated builder가 없다.

## Policy Decisions

### A. `분류 밖 항목`은 유지한다.

- decision:
  - learner-facing fallback surface로 유지
  - top-level equal taxonomy처럼 승격하지 않는다.
- why:
  - current live 기준 `8,506`건이 이 surface를 사용한다.
  - 제거 또는 독립 콘텐츠 split은 link/path 영향 검토 없이 바로 실행할 수 있는 수준이 아니다.

### B. `주제 및 상황 > 상황 미지정`과 `분류 밖 항목`은 계속 다른 문제로 다룬다.

- decision:
  - `상황 미지정`은 general-vocabulary interpretation 유지
  - `분류 밖 항목`은 fallback interpretation 유지
- why:
  - current live counts와 구조가 이미 두 cohort를 다르게 설명한다.

### C. `TOPIK` example visible priority는 source restore 전까지 `PARTIAL`로 유지한다.

- decision:
  - current UI guard만 유지
  - fully reflected로 보고하지 않는다.
- why:
  - current runtime-facing example chunk payload가 실제로 없다.

### D. MM2 example sentence는 현재 정책으로 가져오지 않는다.

- decision:
  - `vocabulary_mindmap2` import boundary는 그대로 유지
- why:
  - current README policy는 MM2 import를 `TOPIK stats`로 제한한다.
  - example sentence backfill까지 열면 current source governance decision이 바뀐다.

### E. Current example variety는 dictionary examples 범위 안에서만 판단한다.

- decision:
  - 현재 visible variety 개선은 existing detail-map examples 범위 안에서만 다룬다.
- why:
  - current runtime은 already `문장` / `대화` example를 일부 포함하지만, term-by-term density 차이는 source coverage 문제다.

## PM Verdict

- `W3_POLICY_LOCKED`

## Next Active Work

- `MM3-187H Example Source Restore Feasibility / Builder Path`

## Revision History

- `R1` / `2026-03-25 17:05 KST` / `Codex PM` / W3 examples / taxonomy policy를 runtime count와 source boundary 기준으로 고정
