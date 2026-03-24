# 20260324_MM3_097_HUMAN_PILOT_FEEDBACK_TRIAGE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 10:15 KST`

## Last Updated By

- `Codex PM`

## 목적

- `human pilot test.md`와 첨부 스크린샷을 정규화하고, 실제 작업 후보를 triage한다.

## Input

- `08_planning/pilot_feedback/human pilot test.md`
- `08_planning/pilot_feedback/screenshots/번역ON.png`
- `08_planning/pilot_feedback/screenshots/번역OFF.png`
- `08_planning/pilot_feedback/screenshots/미분류_다대다연결.png`
- normalized note:
  - `08_planning/pilot_feedback/20260324_pilot_session_01.md`

## Triage

### T1. 즉시 재현/버그 조사 후보

- 검색 -> 마인드맵 비동기 연동 끊김
- 검색 `엔터` 미동작
- `x 닫기` 후 마인드맵 위치 이상
- `의미 관계어` / `관련형` 중복 표기
- 동일 표면형 검색 결과 중복

### T2. 즉시 설계/정책 검토 후보

- `정의 & 연관` 탭 재설계
- `레벨별` vs `난이도` 필터 역할 정리
- `미분류` 시나리오 재설계
- `표현층` learner-facing 설명 강화
- `카드 학습`은 별도 학습 앱 분리 후보로 검토

### T3. 설명/문구 정리 후보

- 예문 source / ordering 설명
- `미리보기 전용` 문구 의미
- `교차 연결 장면` 유지 여부

## Clarified Facts

- participant / facilitator는 `사용자`로 기록
- 마인드맵 연동 끊김은 refresh 또는 새 탭 재접속 후에도 재현
- `카드 학습` 코멘트는 기술 난이도보다 제품 정책 고민에 가깝다

## PM 판단

- 이 파일럿 피드백은 유효하다.
- 가장 먼저 다뤄야 할 것은 `검색 -> 마인드맵 동기화` 계열 버그다.
- 그 다음 tranche는 `runtime sync bug repro / clustering`가 맞다.

## Next Active Work

- `MM3-098 Pilot Feedback Issue Clustering`

## Revision History

- `R1` / `2026-03-24 10:15 KST` / `Codex PM` / human pilot feedback를 정규화하고 triage 분류
