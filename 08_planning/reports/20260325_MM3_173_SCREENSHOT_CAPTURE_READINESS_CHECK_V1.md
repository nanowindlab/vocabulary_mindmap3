# 20260325_MM3_173_SCREENSHOT_CAPTURE_READINESS_CHECK_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-25 00:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-173C` screenshot capture readiness check

## Rule

- screenshot은 현재 구현과 contract가 모두 안정된 surface만 `ready`로 본다.
- contract는 있으나 구현 반영이 아직 없는 surface는 `pending capture`로 둔다.

## Readiness Matrix

| Surface | Intended Guide Use | Readiness | Why |
|---|---|---|---|
| main explorer 첫 진입 | 탐색 시작 화면 | `ready` | current main explorer baseline은 안정적 |
| search result -> detail 진입 | 기본 탐색 흐름 | `ready` | current search/detail flow는 이미 검증됨 |
| detail `핵심` current baseline | 현재 구조 설명 | `ready with caution` | current 구현은 안정적이지만 `MM3-168` 반영 전 최종 source는 아님 |
| detail header after `MM3-168` | 표제어/발음/header 개선 설명 | `pending capture` | contract만 있고 구현 반영 전 |
| detail `관계` after `MM3-169` | relation discoverability 설명 | `pending capture` | contract만 있고 구현 반영 전 |
| detail `표현` after `MM3-169` | expression branch / copy 설명 | `pending capture` | contract만 있고 구현 반영 전 |
| detail `예문` | 예문 탭 사용법 | `ready` | current examples helper와 tab flow는 이미 안정적 |
| translation language selector | 번역 언어 사용법 | `ready` | selector 자체는 current runtime 기준 설명 가능 |
| expression/subword selected language | 표현 카드 번역 설명 | `pending capture` | residual fix scope만 있고 current UI는 known mismatch |
| `주제 및 상황 > 상황 미지정 > 일반 어휘` | semantics 안내 | `ready with caution` | wording baseline은 안정적이나 final guide tone은 W4에서 더 다듬어야 함 |
| `분류 밖 항목` | semantics 안내 | `ready with caution` | wording baseline은 안정적이나 ordering/readability는 후속 구현 여지 있음 |

## Capture Order Draft

1. `ready` surface 먼저 확보
2. `ready with caution` surface는 guide planning용 reference capture만 허용
3. `pending capture` surface는 구현 반영 후 final capture

## Pending Capture Blockers

- `MM3-168` header / close / helper density 구현 미반영
- `MM3-169` relation discoverability / expression card copy 구현 미반영
- expression/subword selected language residual fix 미반영

## PM Interpretation

- 현재 시점에서 screenshot-inclusive guide를 확정 문서로 만들면 stale risk가 높다.
- guide는 지금 `plan + readiness`까지만 닫는 것이 맞다.

## Next Step

- `MM3-173D` review checkpoint `R4`

## Revision History

- `R1` / `2026-03-25 00:10 KST` / `Codex PM` / screenshot capture readiness를 `ready / ready with caution / pending capture` 기준으로 최초 정리
- `R2` / `2026-03-25 00:10 KST` / `Codex PM` / review finding에 따라 `예문` 탭 capture readiness를 추가하고 stale guide risk를 다시 조정
