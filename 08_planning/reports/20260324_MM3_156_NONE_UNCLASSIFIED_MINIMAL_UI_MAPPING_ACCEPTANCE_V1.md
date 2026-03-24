# 20260324_MM3_156_NONE_UNCLASSIFIED_MINIMAL_UI_MAPPING_ACCEPTANCE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 17:05 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-156 None / Unclassified Minimal UI Mapping`

## Applied

- hierarchy display를 공용 정규화로 묶어 tree / search result / detail path가 같은 learner-facing 문구를 쓰도록 정리했다.
- `주제 및 상황 > 없음 > 없음`은 learner-facing path에서 `주제 및 상황 > 상황 미지정 > 일반 어휘`로 고정했다.
- `미분류`는 learner-facing root를 `분류 밖 항목`으로 재해석했다.
- `미분류` search 진입 시 raw `미분류 > 미분류` 대신 실제 `학습난이도` / `품사` bucket으로 동기화되게 보정했다.
- detail helper를 동적으로 분기했다.
  - 문법형 POS: `문법/형태 항목`
  - 기타: `분류 미기재 어휘`
- regression test를 추가했다.
  - `보다`: situation none path reframe
  - `버리다`: unclassified helper split

## Verification

- `npm run build` 통과
- `npx playwright test` `16 passed`

## PM Verdict

- `ACCEPT`

## Coverage Effect

- raw feedback 기준:
  - `F-030` `부분반영 -> 반영`
  - `F-031` `부분반영 -> 반영`

## Next Active Work

- `MM3-157 Expression Scenario Follow-up Plan`

## Revision History

- `R1` / `2026-03-24 17:05 KST` / `Codex PM` / none/unclassified minimal UI mapping 구현과 검증 결과를 최초 기록
