# 20260326_MM3_236_MM3_UI_REFINEMENT_ROADMAP_V1

## Current Revision

- `R5`

## Last Updated

- `2026-03-26 22:50 KST`

## Last Updated By

- `Codex PM`

## Scope

- open and start `MM3 UI refinement roadmap`

## Roadmap Intent

- current learner-facing canonical surface를 source-faithful semantics 위에서 refinement한다.
- full redesign이 아니라 current surface의 hierarchy, copy, card grammar, guidance를 더 잘 읽히게 만드는 tranche다.

## Design Direction

- primary:
  - `Utility & Function`
- secondary:
  - `Warmth & Approachability`

## Non-Goals

- full visual redesign
- taxonomy 재설계
- source semantics 변경
- authoritative runtime boundary 확장

## Tranche Order

### `MM3-236B` Relation Tab Information Hierarchy

- status:
  - `DONE`
- scope:
  - `의미 관계어`
  - `관련형`
  - `교차 연결 장면`
- target:
  - relation tab hierarchy를 더 분명히 한다
  - source-faithful related-form rule을 learner-facing으로 더 잘 보이게 한다

### `MM3-236C` Detail Top-Of-Fold Density

- status:
  - `DONE`
- header / close / meta chip / helper density refinement
- initial implementation:
  - header definition preview
  - compact translation preview chip
  - text-only close chrome
  - compact meta chip spacing
  - compact context helper row

### `MM3-236D` Expression / Example Legibility

- status:
  - `DONE`
- expression card readability
- example metadata rhythm
- translation selector / representative translation readability polish

### `MM3-236E` Fallback Surface Guidance

- status:
  - `DONE`
- `상황 미지정` / `분류 밖 항목` helper wording
- onboarding / guide alignment

## Why `MM3-236B` First

- user가 relation 정보 위계 개선을 바로 다음 UI step으로 지목했다.
- current data semantics를 더 바꾸지 않고도 learner-facing clarity를 가장 빠르게 높일 수 있다.
- recently fixed related-form rule이 relation tab 안에서 직접 보이므로, information hierarchy refinement 효과가 가장 즉각적이다.

## PM Verdict

- `DONE`
- `ROADMAP_CLOSED`

## Next Active Work

- `MM3-229 Runtime Boundary Maintenance`

## Revision History

- `R1` / `2026-03-26 16:00 KST` / `Codex PM` / MM3 UI refinement roadmap를 최초 개설하고 first slice를 relation hierarchy로 고정
- `R2` / `2026-03-26 22:07 KST` / `Codex PM` / `MM3-236B`를 close하고 `MM3-236C`를 current slice로 올림
- `R3` / `2026-03-26 22:14 KST` / `Codex PM` / `MM3-236C`를 close하고 `MM3-236D`를 current slice로 올림
- `R4` / `2026-03-26 22:44 KST` / `Codex PM` / `MM3-236D`를 close하고 `MM3-236E`를 current slice로 올림
- `R5` / `2026-03-26 22:50 KST` / `Codex PM` / `MM3-236E`를 close하고 roadmap 전체를 closeout함
