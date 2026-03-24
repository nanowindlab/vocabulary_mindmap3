# 20260324_MM3_158_EXPRESSION_SCENARIO_WORKFLOW_ACCEPTANCE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 17:00 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-158 Expression Scenario Workflow Acceptance`

## Applied

- search result와 list badge를 `다음: 표현층`으로 조정해 discovery surface와 다음 step의 연결을 더 분명히 했다.
- core tab에 `표현 활용 워크플로우` helper와 CTA를 추가했다.
- expression tab 상단에 `표현 학습 파이프라인` 설명을 추가했다.
- subword 카드를 두 branch로 분리했다.
  - `바로 탐색 가능한 표현`
  - `부모 어휘 맥락에서 보는 표현`
- 기존 원칙은 유지했다.
  - 표현층은 여전히 상세 내부의 2차 보조 레이어다.
  - 별도 top-level surface나 auto-open 기본값은 열지 않았다.
- regression test를 추가했다.
  - core helper -> expression 진입
  - jumpable / preview-only 분리

## Verification

- `npm run build` 통과
- `npx playwright test` `18 passed`

## PM Verdict

- `ACCEPT`

## Coverage Effect

- raw feedback 기준:
  - `F-027` `부분반영 -> 반영`

## Next Active Work

- `MM3-159 Motion / Mindmap Human Re-check`

## Revision History

- `R1` / `2026-03-24 17:00 KST` / `Codex PM` / expression scenario workflow refinement 구현과 검증 결과를 최초 기록
