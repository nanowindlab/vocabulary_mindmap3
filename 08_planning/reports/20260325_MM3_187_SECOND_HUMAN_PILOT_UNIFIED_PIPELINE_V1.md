# 20260325_MM3_187_SECOND_HUMAN_PILOT_UNIFIED_PIPELINE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 15:33 KST`

## Last Updated By

- `Codex PM`

## Scope

- second human pilot feedback accuracy recheck and unified residual pipeline lock

## Inputs

- `08_planning/reports/20260324_MM3_138_PILOT_FEEDBACK_COVERAGE_AUDIT_V1.md`
- `08_planning/pilot_feedback/human pilot test_2차 피드백.md`
- `08_planning/pilot_feedback/20260325_pilot_session_02.md`
- `08_planning/reports/20260325_MM3_170_TRANSLATION_SURFACE_COMPLETENESS_REAUDIT_NOTE_V1.md`
- `08_planning/reports/20260325_MM3_185_DETAIL_RELATION_EXPRESSION_FEEDBACK_IMPLEMENTATION_V1.md`
- `09_app/src/components/SearchBox.jsx`
- `09_app/src/components/TermDetail.jsx`
- `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
- `09_app/public/data/live/APP_READY_DETAIL_MAP.json`

## Accuracy Recheck Verdict

- `MM3_138`는 전체적으로 usable하지만, 일부 row는 raw meaning 또는 current runtime state를 과장하고 있었다.
- 이번 턴에 아래 row를 정밀 보정했다:
  - `F-001`
  - `F-015`
  - `F-029`
  - `F-043`
  - `F-046`

## Verified Findings

### 1. `F-001`은 global foreign-language failure가 아니었다.

- user clarification 기준 실제 의미:
  - 전체 외국어 surface가 아니라 `상세 > 표현 > 대표번역` 쪽 complaint였다.
- runtime evidence:
  - main search/detail은 selected language -> 영어 -> first fallback 경로를 사용한다.
  - `돈` 표현 카드 번역은 current live payload 기준 `몽골어/아랍어/중국어`만 보유한다.
- implication:
  - `영어 selector 자체 고정 실패`가 아니라 `expression translation coverage + fallback perception` 문제다.

### 2. `F-015`는 fully reflected로 닫기 어렵다.

- code evidence:
  - `SearchBox` Enter path는 존재한다.
  - composition/IME guard는 없다.
- second pilot raw feedback:
  - `버리다` 입력 후 Enter에서 `다`가 선택된다고 보고됐다.
- implication:
  - `Enter 지원 추가`는 사실이지만, learner-facing bug closeout으로는 과장이다.

### 3. `F-029`는 current runtime에서 reopen이 맞다.

- live detail payload:
  - `보다` 동사 entry `61190`에 `파생어: 보이다`가 target code `62091`, `59531` 두 건으로 남아 있다.
- implication:
  - relation disambiguation tranche가 있었더라도, learner-facing duplicate complaint는 현재도 재현 가능하다.

### 4. second pilot는 old F-ID만으로는 다 설명되지 않는다.

- existing-F reopen:
  - translation residual nuance
  - search Enter residual
  - duplicate relation residual
  - terminology/helper residual
- new holdout:
  - `관계` 탭 `원어 정보` 제거 검토
  - search result ordering explanation
  - `코어` label meaning
  - `예문` TOPIK priority / variety
  - 표현 카드 repeated meta (`부모 표제어`, `연결 의미 N개`)

## Second Pilot Mapping

| Bucket | Item | Mapping | Current Judgement |
|---|---|---|---|
| `R1` | 표현 대표번역이 몽골어로 보임 | `F-001`, `F-043`, `F-044` | `부분반영, 의미 재정의 필요` |
| `R2` | `버리다` Enter 검색 이상 | `F-015` | `reopen` |
| `R3` | `보다` 관계 duplicate | `F-029` | `reopen` |
| `R4` | `분류 밖 항목` vs `미분류` terminology drift | `F-046` | `부분반영` |
| `R5` | `상세 연결 없음` / 표현 helper 제거 검토 | `F-041` | `부분반영` |
| `R6` | `원어 정보` 제거 검토 | `new` | `new holdout` |
| `R7` | search ordering / `코어` label 설명 | `new` | `new holdout` |
| `R8` | `예문` TOPIK priority / variety | `new` | `new holdout` |
| `R9` | tab subtitle naming (`관계`, `표현`) | `new` | `new holdout` |
| `R10` | 표현 카드 repeated meta | `new` | `new holdout` |

## Unified Pipeline

### W1. Reopened Regressions

- target:
  - `F-015` search Enter residual
  - `F-029` duplicate relation residual
  - `F-001/F-043` expression translation residual reclassification
- output:
  - exact repro note
  - fix scope decision
  - acceptance boundary

### W2. Surface Contract Cleanup

- target:
  - tab subtitle naming
  - `원어 정보` section keep/remove
  - `상세 연결 없음` + `표현 학습 파이프라인`
  - expression repeated meta
  - search result `코어` label copy
- output:
  - one contract bundle for detail/search copy surfaces

### W3. Examples / Taxonomy Policy

- target:
  - `예문` TOPIK priority
  - example variety / display density
  - `분류 밖 항목` / `미분류` terminology and scenario
- output:
  - policy decision bundle
  - if needed, follow-up implementation queue

## PM Verdict

- `PIPELINE_LOCKED`

## Next Active Work

- `MM3-187 Unified Second Human Pilot Residual Pipeline`

## Revision History

- `R1` / `2026-03-25 15:33 KST` / `Codex PM` / `MM3_138` 정확도 재점검 결과와 second human pilot unified residual pipeline을 한 문서로 고정
