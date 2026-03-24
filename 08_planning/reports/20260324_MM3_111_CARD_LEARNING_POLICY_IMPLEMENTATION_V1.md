# 20260324_MM3_111_CARD_LEARNING_POLICY_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 12:12 KST`

## Last Updated By

- `Codex PM`

## Scope

- card learning policy implementation

## Applied

- main explorer 상단의 `카드 학습` CTA 제거
- detail panel 내 `카드 학습` CTA 제거
- `FlipcardDeck` modal 진입 경로 제거
- card learning은 current main app scope 밖으로 내림

## Verification

- `npm run build` 통과
- `npx playwright test` `11 passed`

## Next Active Work

- `MM3-112 Card Learning Policy Acceptance`

## Revision History

- `R1` / `2026-03-24 12:12 KST` / `Codex PM` / card learning policy 구현과 검증 결과를 최초 기록
