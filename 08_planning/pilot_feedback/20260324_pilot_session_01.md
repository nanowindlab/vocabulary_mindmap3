# 20260324_pilot_session_01

## Session Meta

- Date: `2026-03-24`
- Session ID: `pilot_session_01`
- Facilitator: `사용자`
- Participant: `사용자`
- Build / URL: `local app / 09_app`

## Path

- Start path: `검색 중심 탐색`
- Completed path:
  - `검색 -> 상세`
  - `의미 관계어 / 관련형`
  - `표현층`
  - `주제 및 상황 / 미분류`
  - `번역 ON/OFF 비교`

## Normalized Findings

### A. 확인된 UX / 구조 이슈

1. `번역 ON/OFF`와 상세 번역 섹션이 중복적으로 보인다.
- evidence:
  - `screenshots/번역ON.png`
  - `screenshots/번역OFF.png`
- note:
  - ON/OFF 상태와 무관하게 상세 하단 번역 카드와 `전체 번역` 노출이 과하다고 느껴짐

2. `정의 & 연관` 탭에 정보가 과하게 몰려 있다.
- note:
  - learner journey 재설계 필요 의견

3. `레벨별`과 `난이도` 필터가 유사하게 느껴진다.

4. `미분류` 진입 시 구조가 N:N으로 얽혀 보인다.
- evidence:
  - `screenshots/미분류_다대다연결.png`

5. `가다` 같이 sense가 많은 표제어는 `의미 선택`이 화면을 지나치게 차지한다.

6. `표현층` 활용 시나리오가 아직 learner 입장에서 충분히 설명되지 않는다.

### B. 확인된 동작/연동 이슈

1. 검색으로 진입했을 때 `계층탐색`은 연동되지만 `마인드맵`이 멈추거나 연동되지 않는 경우가 있었다.
- examples:
  - `가게`
  - `물가`
  - `쌀가게`
  - 세션 후반 `보다`
- clarified:
  - refresh 후에도 재현
  - 탭을 닫고 `http://localhost:4173/`로 다시 접속해도 재현

2. 검색창에서 `엔터`만으로는 이동이 안 되고, 결과 목록 클릭이 필요했다.

3. `x 닫기` 후 마인드맵 위치가 어색해진다고 느꼈다.

4. `미분류`에 들어가면 계층탐색 기준이 품사/난이도처럼 바뀐 것처럼 보여 혼란이 있었다.

### C. 중복/정규화 이슈

1. `의미 관계어`가 중복되는 사례
- example:
  - `물가`에서 `참고어:가격` 중복

2. `관련형`이 서로 다른 label인데 같은 target으로 연결되는 사례
- example:
  - `보이다` -> `(가 보라):보다`
  - `보이다` -> `파생어:보다`

3. `관련형` 이동 후 target 쪽에서 다시 중복 표기되는 사례
- example:
  - `보다`에서 `파생어:보이다` 중복

4. 검색 결과에서 동일 표면형이 중복되어 보이는 사례
- examples:
  - `보이다`
  - `가다`

### D. 질문 / 설명 요청 성격 피드백

1. 예문은 어떤 source에서 오며, 많을 경우 어떤 순서로 보여주는지 궁금함
2. `미리보기 전용`의 의미가 직관적이지 않음
3. `교차 연결 장면`을 유지할 필요가 있는지 의문
4. `카드 학습`의 실제 가치/구현 가능성에 의문
- clarified:
  - 현재 앱이 본체 기능도 충분히 닫히지 않은 상태에서 카드 학습까지 같은 앱에 넣는 정책이 맞는지 의문
  - 별도 학습 앱으로 분리하는 방향이 더 적절할 수 있음

## Evidence

- Screenshot paths:
  - `08_planning/pilot_feedback/screenshots/번역ON.png`
  - `08_planning/pilot_feedback/screenshots/번역OFF.png`
  - `08_planning/pilot_feedback/screenshots/미분류_다대다연결.png`
- Raw note:
  - `08_planning/pilot_feedback/human pilot test.md`

## Open Questions

- 없음
