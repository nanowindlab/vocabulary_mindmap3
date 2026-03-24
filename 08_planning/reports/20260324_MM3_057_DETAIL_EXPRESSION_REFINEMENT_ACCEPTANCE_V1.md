# 20260324_MM3_057_DETAIL_EXPRESSION_REFINEMENT_ACCEPTANCE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 09:11 KST`

## Last Updated By

- `Codex PM`

## Scope

- `detail / expression refinement`

## PM Acceptance Summary

- `의미 관계어`, `관련형`이 detail panel에서 클릭 가능한 탐색 경로로 연결됐다.
- `subword` 카드는 독립 표제어가 있는 경우 jump 가능, 없는 경우 `미리보기 전용` 상태를 명시한다.
- `detail-word`, `detail-definition` test id를 추가해 browser smoke를 안정화했다.
- build 통과
- Playwright smoke 통과

## PM Verdict

- `ACCEPT`

## Residual Risk

- 표현층은 여전히 독립 top-level surface가 아니다.
- `subword` 중 다수는 source-native로 독립 표제어가 없으므로 preview 중심 UX가 계속 필요하다.

## Next Active Work

- `MM3-058 Post-Refinement Gate Recheck`

## Revision History

- `R1` / `2026-03-24 09:11 KST` / `Codex PM` / refinement 구현과 build/smoke 검증 결과를 acceptance로 기록
