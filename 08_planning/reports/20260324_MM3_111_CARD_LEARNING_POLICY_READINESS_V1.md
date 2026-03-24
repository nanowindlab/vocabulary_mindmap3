# 20260324_MM3_111_CARD_LEARNING_POLICY_READINESS_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 12:00 KST`

## Last Updated By

- `Codex PM`

## 목적

- `카드 학습`을 본앱에서 내리고 separate app candidate로 돌리기 전 범위와 리스크를 정리한다.

## 현재 사실

- 현재 `카드 학습`은 main explorer 상단 CTA와 detail panel CTA로 노출된다.
- pilot feedback에서는 본체 기능 정리가 우선이라는 정책 우려가 나왔다.
- browser regression은 카드 기능에 의존하지 않는다.

## PM 판단

- 본앱에서 `카드 학습` entry는 내리고, separate app candidate로 문서화하는 방향이 적절하다.

## 실행 가능 기준

- `App.jsx`에서 CTA와 modal render만 제거하면 된다.
- `FlipcardDeck.jsx`는 보존하되, current main explorer에서는 비노출로 둔다.

## Next Active Work

- `MM3-112 Card Learning Policy Implementation`

## Revision History

- `R1` / `2026-03-24 12:00 KST` / `Codex PM` / card learning policy readiness를 최초 기록
