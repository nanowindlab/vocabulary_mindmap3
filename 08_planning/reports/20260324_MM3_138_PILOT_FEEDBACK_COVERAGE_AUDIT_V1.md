# 20260324_MM3_138_PILOT_FEEDBACK_COVERAGE_AUDIT_V1

## Current Revision

- `R5`

## Last Updated

- `2026-03-24 20:45 KST`

## Last Updated By

- `Codex PM`

## 목적

- `human pilot test.md`의 raw feedback를 항목별로 직접 쪼개고, 어떤 `MM3-###` 작업에서 대응되었는지 매핑한다.

## Source

- raw feedback:
  - `08_planning/pilot_feedback/human pilot test.md`
- normalized note:
  - `08_planning/pilot_feedback/20260324_pilot_session_01.md`

## Coverage Audit

| ID | Raw Feedback | Status | 대응 MM3 | Notes |
|---|---|---|---|---|
| F-001 | 외국어가 몽골어로 고정됨, 영어로 설정 | `반영` | `MM3-083`, `MM3-084`, `MM3-085` | 영어 우선, 없으면 source-first fallback 정책 적용 |
| F-002 | 예문은 어디서 가져오고 순서는? | `반영` | `MM3-122`, `MM3-123`, `MM3-161` | 예문 탭에 `현재 의미 -> 대표 예문 fallback -> source label -> 최대 8개` helper를 명시 |
| F-003 | `레벨별`과 `난이도` 유사 | `반영` | `MM3-106`, `MM3-107`, `MM3-108`, `MM3-109` | `레벨별` 제거, source-native `난이도` 유지 |
| F-004 | 대표 번역도 몽골어, 영어로 | `반영` | `MM3-083`, `MM3-084`, `MM3-085` | 영어가 있으면 영어 우선, 없으면 fallback |
| F-005 | 단어가 많으면 마인드맵이 빠르게 움직여 보기 어려움 | `반영` | `MM3-140`~`MM3-143`, `MM3-159`, `MM3-163` | stabilization tranche, quantitative probe, human eye re-check까지 모두 통과 |
| F-006 | 카드학습을 같은 앱에 둘지 의문 | `반영` | `MM3-110`, `MM3-111`, `MM3-112`, `MM3-114` | main app에서는 비노출, separate learning app candidate로 분리 |
| F-007 | `미분류`가 N:N으로 얽혀 보임 | `반영` | `MM3-113`, `MM3-114`, `MM3-115`, `MM3-116`, `MM3-154`, `MM3-156` | `분류 밖 항목` 재해석과 path/helper 정리로 learner-facing 구조 혼란을 낮춤 |
| F-008 | 검색 진입 시 마인드맵 연동 끊김 | `반영` | `MM3-099`, `MM3-100` | sync bug repro/fix 완료 |
| F-009 | `정의&연관`/`예문` 2탭 구조 과밀, learner journey 재설계 필요 | `반영` | `MM3-102`, `MM3-103`, `MM3-104`, `MM3-105` | `핵심/관계/표현/예문`으로 재구성 |
| F-010 | 번역 ON/OFF 자체는 유지 | `반영` | `MM3-074`, `MM3-076`, `MM3-077` | toggle는 유지 |
| F-011 | 번역 ON/OFF와 `외국어` 필터 연동 | `반영` | `MM3-074`~`MM3-085`, `MM3-145`, `MM3-146` | result filter가 아니라 display selector 연동으로 재정의해 반영 |
| F-012 | `번역(5)` 아래 박스 번역은 중복, 제거 검토 | `반영` | `MM3-074`~`MM3-077`, `MM3-104`, `MM3-105`, `MM3-145`, `MM3-146` | 대표 번역 중심으로 축소하고 중복 surface를 제거 |
| F-013 | `전체 번역 ~` 제거 | `반영` | `MM3-145`, `MM3-146` | `전체 번역 보기` 제거 완료 |
| F-014 | `가게` 검색 시 계층탐색만 연동, 마인드맵 변화 없음 | `반영` | `MM3-099`, `MM3-100` | sync fix |
| F-015 | `가게` 검색 후 Enter 미동작 | `반영` | `MM3-099`, `MM3-100` | Enter 지원 추가 |
| F-016 | `가게` 전체 번역은 영어 없이 몽골어 기본 | `정책반영` | `MM3-083`, `MM3-084`, `MM3-085`, `MM3-087` | 영어 데이터가 없으면 fallback 유지로 정리 |
| F-017 | `교차 연결 장면` 유지 필요? | `반영` | `MM3-124`, `MM3-125`, `MM3-126`, `MM3-127` | 실제 연결 없으면 section 비노출 |
| F-018 | `물가`도 검색 연동 동일 이슈 | `반영` | `MM3-099`, `MM3-100` | sync fix |
| F-019 | `물가` 의미관계어는 어떻게 연결? | `반영` | `MM3-057`, `MM3-104`, `MM3-105` | 관계 탭에서 클릭 이동 가능 |
| F-020 | `물가`의 `참고어:가격` 중복 | `반영` | `MM3-132`, `MM3-133`, `MM3-134` | unresolved duplicate relation collapse |
| F-021 | `x 닫기` 후 마인드맵 위치/연동 이상 | `반영` | `MM3-099`, `MM3-100` | selectedTermId 분리로 sync 유지 |
| F-022 | `가다`의 반대말 `오다` 관계 확인 | `반영` | `MM3-057`, `MM3-104`, `MM3-105` | 관계 탭에서 유지 |
| F-023 | `가다`의 `의미선택` 33개 과밀 | `반영` | `MM3-102`, `MM3-103`, `MM3-104`, `MM3-105` | 기본 8개 + 전체 보기 |
| F-024 | `미리보기전용` 의미 불명확 | `반영` | `MM3-122`, `MM3-123` | `상세 연결 없음`으로 변경 |
| F-025 | `가다` 검색 결과 동사/보조동사 2개 | `반영` | `MM3-118`, `MM3-119` | 제거가 아니라 display disambiguation |
| F-026 | `보이다` 동일 동사 2개 중복 | `반영` | `MM3-118`, `MM3-119` | 제거가 아니라 path/품사/동형어 표시로 구분 |
| F-027 | `표현층` 활용 시나리오 필요 | `반영` | `MM3-157`, `MM3-158` | `signal -> core helper -> expression tab -> jumpable/preview-only branch` 파이프라인으로 재정의 |
| F-028 | `보이다` 관련형 `(가 보라):보다`와 `파생어:보다`가 같은 단어로 연결, 왜 두가지인가 | `정책유지` | `MM3-118`, `MM3-119`, `MM3-128`, `MM3-129` | source semantic difference 유지. exact duplicate가 아니므로 병합하지 않음 |
| F-029 | `보다`로 이동하면 `파생어:보이다`가 두 번 중복 | `반영` | `MM3-118`, `MM3-119`, `MM3-128`, `MM3-129`, `MM3-147`, `MM3-150` | 같은 label / 다른 target 관계를 뜻 구분자로 learner-facing 분리 |
| F-030 | `보다`가 `주제 및 상황 > 없음`, 실제로 `없음>없음` 구조 존재 | `반영` | `MM3-154`, `MM3-156` | learner-facing path를 `주제 및 상황 > 상황 미지정 > 일반 어휘`로 재정의 |
| F-031 | 보조동사 `버리다`가 `미분류`, 시나리오 필요 | `반영` | `MM3-154`, `MM3-156` | `미분류`를 `분류 밖 항목`으로 재해석하고 helper를 문법형/기타로 분기 |
| F-032 | `미분류`에서 기준이 품사로 바뀐 것처럼 보임 | `반영` | `MM3-113`~`MM3-116` | `학습난이도/품사 보조 정렬`로 명시 |
| F-033 | `쌀가게` 검색 시 계층탐색/마인드맵 모두 연동 안 됨 | `반영` | `MM3-099`, `MM3-100` | sync fix 및 회귀 테스트 추가 |

## Summary

- `반영`: 30
- `부분반영`: 0
- `미반영`: 0
- `정책유지/정책반영`: 3

## Not Yet Fully Addressed

- 없음

## Revision History

- `R1` / `2026-03-24 14:20 KST` / `Codex PM` / raw pilot feedback를 항목별 coverage audit로 최초 정리
- `R2` / `2026-03-24 17:05 KST` / `Codex PM` / MM3-154, MM3-156 반영 후 `F-030`, `F-031` 상태를 `반영`으로 갱신
- `R3` / `2026-03-24 17:00 KST` / `Codex PM` / translation/relation/expression latest canonicals 기준으로 audit 상태를 현재 반영 상태에 맞게 동기화
- `R4` / `2026-03-24 20:25 KST` / `Codex PM` / MM3-159, MM3-160, MM3-161 기준으로 `F-002`, `F-005` 상태를 갱신
- `R5` / `2026-03-24 20:45 KST` / `Codex PM` / motion human eye re-check 완료 후 `F-005`를 반영 완료 상태로 갱신
