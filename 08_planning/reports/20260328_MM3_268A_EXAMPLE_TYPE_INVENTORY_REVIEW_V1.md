# 20260328_MM3_268A_EXAMPLE_TYPE_INVENTORY_REVIEW_V1

- Packet name: `20260328_MM3_268A_EXAMPLE_TYPE_INVENTORY_REVIEW_V1`
- Packet role: `note`
- Task ID: `MM3-268A`
- Parent pipeline or workflow: `M1 Runtime Wiring / Core Explorer / 2026-03-28 Feedback Wave`
- Status: `IN_PROGRESS`
- Current Revision: `R1`
- Last Updated: `2026-03-28 20:12 KST`
- Last Updated By: `Codex PM`

## Purpose

- Why this packet exists:
  - learner 효율 관점에서 예문 종류 우선순위를 정하기 전에 current inventory를 먼저 고정한다.
- What it decides, verifies, or locks:
  - current runtime examples payload에서 learner-facing source type이 무엇으로 존재하는지 정리한다.

## Source Of Truth

- Runtime payload:
  - `09_app/public/data/internal/runtime_payloads/APP_READY_CHUNK_EXAMPLES_*.json.gz`
- Sample entry shape:
  - `attested_sentences[].source_label`
  - `attested_sentences[].round`

## Inventory Findings

- current runtime examples 총량은 `735,696`개다.
- 주요 source label 분포:
  - `구`: `353,033`
  - `문장`: `160,782`
  - `대화`: `121,932`
  - `TOPIK*`: 합계 `99,949`
- runtime에서 learner가 바로 구분 가능한 예문 계열은 크게 네 묶음이다.
  - `구`
  - `문장`
  - `대화`
  - `TOPIK 기출`
- `TOPIK 기출`은 source label이 round/영역별로 세분되어 있다.
  - 예: `TOPIK기출_32nd_II_Reading`, `TOPIK기출_33rd_II_Listening`, `TOPIK기출_96th_II_Writing`
- `round` 값이 실제로 채워진 TOPIK 예문은 `99,949`개다.

## Review Implications

- current payload 기준 절대량만 보면 `구`가 가장 많다.
- 하지만 learner efficiency 관점에서는
  - 짧은 결합 패턴을 빠르게 보여 주는 `구`
  - 실제 쓰임과 문맥을 보여 주는 `문장`
  - 화용/상황을 보여 주는 `대화`
  - 시험 실전성과 검색 가치가 있는 `TOPIK`
  를 같은 축으로 바로 섞으면 목적이 흐려질 수 있다.
- 따라서 다음 decision은 단순 빈도순이 아니라
  - 첫 노출에서 무엇을 우선 보여 줄지
  - 탭/필터로 분리할지
  - `TOPIK`을 별도 학습 목적 surface로 둘지
  기준으로 내려야 한다.

## Next Decision Questions

- learner 첫 노출 priority를 `구 -> 문장 -> 대화 -> TOPIK`처럼 둘 것인지
- `TOPIK`을 일반 예문과 섞지 않고 별도 provenance lane으로 둘 것인지
- `구`와 `문장`을 같은 surface에서 길이/형태 badge로 구분할지

## Revision History

- `R1` / `2026-03-28 20:12 KST` / `Codex PM` / runtime examples payload 기준 source type inventory와 review 질문을 고정
