# 20260325_MM3_185_DETAIL_RELATION_EXPRESSION_FEEDBACK_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 01:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- repeated human feedback implementation for detail / relation / expression surfaces

## Implemented This Turn

### Fully Reflected

- `2` detail `닫기` 버튼
  - detail header 우측으로 통합
- `3` duplicate `번역`
  - core tab 안의 번역 surface 하나로 통합
  - 별도 `번역` 섹션 제거
- `4` 표제어 / 발음 영역
  - 발음 inline
  - speaker icon 제거
- `7` 관계 탭 UI
  - sectioned card + chip hybrid
  - helper copy 추가
- `8` 표현 카드 residual
  - `연결 의미 N개`
  - `예문`
  - preview-only supporting copy
  - expression/subword selected language fallback chain 반영

### Partially Reflected

- `5` 핵심 장문 지시문
  - full 3-step list 제거까지는 반영
  - 더 공격적인 축소/재배치 여부는 추가 조정 여지 있음
- `6` 표현 항목을 더 앞쪽으로 가져오기
  - top-of-fold long helper는 줄였지만
  - 별도 stronger entry cue는 추가 구현 전

### Not Fully Reflected

- `9`
  - source `11` vs runtime `6` audit 완료
  - runtime language set 확대는 정책/데이터 변경 이슈라 이번 턴 구현 제외
- `10`
  - performance audit 완료
  - lazy load / split / render optimization은 별도 구현 tranche 필요
- `11`
  - semantics / guide planning은 완료
  - actual guide 작성과 일부 tree UI 구현은 아직 전

## Verification

- command:
  - `npx playwright test tests/residual.spec.js tests/pilot-rehearsal.spec.js`
- result:
  - `21 passed`

## PM Verdict

- `IMPLEMENTED_WITH_VERIFIED_REGRESSION`

## Next Active Work

- `MM3-096C session slot / execution handoff 정리`

## Revision History

- `R1` / `2026-03-25 01:05 KST` / `Codex PM` / 2,3,4,7,8 구현과 5,6,9,10,11의 current status를 현재 코드 기준으로 정리
