# 20260328_MM3_268A_EXAMPLE_TYPE_PRIORITY_DECISION_DRAFT_V1

- Packet name: `20260328_MM3_268A_EXAMPLE_TYPE_PRIORITY_DECISION_DRAFT_V1`
- Packet role: `decision`
- Task ID: `MM3-268A`
- Parent pipeline or workflow: `M1 Runtime Wiring / Core Explorer / 2026-03-28 Feedback Wave`
- Status: `DONE`
- Current Revision: `R1`
- Last Updated: `2026-03-28 20:18 KST`
- Last Updated By: `Codex PM`

## Purpose

- Why this packet exists:
  - `구 / 문장 / 대화 / TOPIK` 예문 계열 중 learner에게 무엇을 먼저 보여 주는 것이 효율적인지 decision draft를 고정한다.
- What it decides, verifies, or locks:
  - learner-facing 기본 노출 우선순위와 `TOPIK` 분리 원칙 초안을 잠근다.

## Inputs

- Inventory packet:
  - `08_planning/reports/20260328_MM3_268A_EXAMPLE_TYPE_INVENTORY_REVIEW_V1.md`
- Runtime rendering surface:
  - `09_app/src/components/TermDetail.jsx`

## Decision Draft

- 기본 learner-facing priority draft:
  - `문장 -> 대화 -> 구 -> TOPIK`
- reasoning:
  - `문장`은 의미와 통사 맥락을 가장 빠르게 전달한다.
  - `대화`는 화용/상황 이해에는 좋지만 길이와 문맥 의존도가 더 높다.
  - `구`는 결합 패턴 확인에는 유용하지만 의미 이해만 놓고 보면 self-contained 정보량이 낮다.
  - `TOPIK`은 provenance 가치가 높지만 난이도와 시험 맥락이 강하므로 기본 노출 lane보다는 별도 lane이 더 적합하다.

## Draft Rules

- 기본 첫 노출은 `문장` 중심으로 둔다.
- `대화`는 기본 예문 아래의 secondary lane으로 둔다.
- `구`는 collocation/결합 패턴 lane으로 분리해 보여 주는 쪽이 적합하다.
- `TOPIK`은 일반 예문과 섞지 않고 provenance가 보이는 별도 묶음으로 두는 초안을 유지한다.

## Non-Final Items

- 아직 잠기지 않은 것:
  - UI 상에서 실제 badge/grouping을 어떻게 표현할지
  - `구`를 항상 `문장` 뒤에 둘지, 특정 품사에서는 앞당길지
  - `TOPIK`을 탭으로 분리할지, accordion lane으로 둘지

## Next Suggested Step

- `MM3-268G` 핵심 뜻 카드 review와 묶어 example surface layout decision으로 이어간다.

## Revision History

- `R1` / `2026-03-28 20:18 KST` / `Codex PM` / learner-facing example type priority decision draft를 고정
