# 20260324_MM3_167_ADDITIONAL_HUMAN_TEST_FEEDBACK_COVERAGE_CHECK_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-24 23:47 KST`

## Last Updated By

- `Codex PM`

## Scope

- additional human test feedback coverage check

## Source

- current user message in PM thread
- screenshot references:
  - `/Users/nanowind/Desktop/스크린샷 2026-03-24 오후 9.36.15.png`
  - `/Users/nanowind/Desktop/스크린샷 2026-03-24 오후 9.53.36.png`

## Literal Feedback Record

아래는 current PM thread에서 받은 추가 human test feedback를 의미 축약 없이 구조를 유지해 기록한 원문형 레코드다.

1. 상세보기의 UI 와 어떤 내용을 보여줄 것인지 기획을 개선할 것.
- 핵심, 관계, 표현, 예문
- (`보다`로 확인)

2. 상세보기에서 `닫기` 버튼

3. 상세보기에서 같은 내용의 `번역`이 이 두 곳에 중복되어 나옴
- 캡처 화면 참고: `/Users/nanowind/Desktop/스크린샷 2026-03-24 오후 9.36.15.png`
- 아래쪽의 내용(단어가 포함된) 을 위쪽에 연동하고, 아래쪽은 제거
- 남은 하나는 번역 ON/OFF버튼과 연동

4. 상세보기 `표제어` 가 나오는 부분 공간 활용 검토
- 발음 표시 `[돈ː]`는 표제어 오른쪽으로
- 스피커 기호는 제거
- 공간을 효율적으로 사용

5. 상세보기 `핵심`에 아래와 같이 긴 지시문을 보이는 것이 효율적일지?

6. 상세보기 `표현`의 `반의어,유의어, 관용구, 속담`등등 항목들을 너무 깊은 레이어가 아니라 앞쪽으로 가져오는 것은 어떤지?
- 필터는 아닌데, 마치 필터처럼
- 방법을 기획해 볼것
- 초급 사용자라면, 유의어, 반의어, 속담 사전등으로 이용가능

7. 상세보기 `관계`의 단어 표시 UI 개선
- 다른 탭에서는 폰트크기, 배치, 색 등이 적용되어 있으나, 여기는 아님

8. 상세보기 `표현`의 예시임. 표제어는 `돈`
- 여기에서 `상세 연결 없음`은 학습자나 사용자에게 어떤 의미? 필요?
- `의미2개` --> ???
- 외국어가 여전히 `몽골어`만 나오고 있음. 필터에서 선택한 언어가 나와야 함.
- `예: 삼촌은~` 에서 `예`는 `예문`을 의미. 용어 통일.

예시 블록:

```text
돈을 굴리다
관용구
상세 연결 없음
부모 표제어 · 돈
의미 2개
돈을 빌려주고 이자를 받아 이익을 늘리다.
몽골어: мөнгө эргүүлэх
예: 김 씨는 이리저리 돈을 굴려 거기서 나오는 이자로만 먹고산다.
```

9. 번역 언어는 5가지만?
- 다른 언어도 연결은 되어 있지 않은지?

10. 로딩 속도와 마인드맵 구현 속도 확인하고 개선방안 고민할 필요 있음.
- 로컬에서 실행함에도 자주 지연이 있음.
- 자료를 여러개로 분할?
- 자주 쓰지 않는 내용을 분할?

11. `의미범주`에서는 마인드맵이 정상적인 연결구조로 보임.
- `주제 및 상황`: 구분이 `역사>역사>시대적` 처럼 대분류(녹색)와 중분류(분홍색)가 중복
- 중분류는 다단어와 연결되어 있으나, 대분류는 붕 떠서 isolated
- 캡처 화면 참고: `/Users/nanowind/Desktop/스크린샷 2026-03-24 오후 9.53.36.png`
- `미분류`: 마인드맵이 다대다 연결로 얽혀있음. 기획에서 검토할 필요 있음.
- 예시: `난이도>품사` 대신 `품사>난이도` 구조
- 용어를 통일하고 직관적으로 정립할 필요 있음.
- 정식 배포시에는 화면 캡처를 포함한 `인앱가이드` 작성.

## Coverage Check

| User Item | Current Coverage | Verdict | Task / History |
|---|---|---|---|
| 1. 상세 구조를 `핵심 / 관계 / 표현 / 예문`으로 재구성 | 기존 detail IA redesign에서 반영됨 | `이미 반영` | `MM3-102`~`MM3-105` |
| 2. 상세 `닫기` 버튼 자체의 affordance 검토 | close 이후 sync fix는 있었지만 버튼 UI 자체 task는 없었음 | `신규 task 추가` | `MM3-168A` |
| 3. 상세 번역 중복 제거, 하나만 남기고 ON/OFF 연동 | 기존 translation follow-up에서 반영됨 | `이미 반영` | `MM3-074`~`MM3-077`, `MM3-145`, `MM3-146`, `MM3-160` |
| 4. 표제어/발음 header 공간 재구성, speaker 제거 | 기존 task에 직접 없음 | `신규 task 추가` | `MM3-168A` |
| 5. `핵심` 장문 지시문 밀도 재검토 | 기존 task에 직접 없음 | `신규 task 추가` | `MM3-168A` |
| 6. 표현 항목을 더 앞쪽에서 진입시키는 fast-entry 검토 | 표현 workflow는 반영됐지만 여전히 2차 레이어 유지 | `부분반영, follow-up 추가` | `MM3-157`, `MM3-158`, `MM3-169A` |
| 7. `관계` 탭 단어 표시 UI 개선 | general micro-polish는 있었지만 관계 탭 전용 task는 없었음 | `부분반영, follow-up 추가` | `MM3-081`, `MM3-082`, `MM3-169A` |
| 8. 표현 카드 copy/selector residual (`상세 연결 없음`, `의미 2개`, selected language, `예:`) | 일부는 기존 copy/translation tranche에 반영됐지만 residual이 남음 | `부분반영, follow-up 추가` | `MM3-122`, `MM3-123`, `MM3-160`, `MM3-169A`, `MM3-170A` |
| 9. 번역 언어 5개 제한 여부와 전체 연결 언어 audit | 기존 task에 직접 없음 | `신규 task 추가` | `MM3-170A` |
| 10. 로딩 속도 / 마인드맵 속도 / payload 분할 follow-up | motion stabilization과 packaging은 있었지만 성능 follow-up task는 없었음 | `부분반영, follow-up 추가` | `MM3-159`, `MM3-164`, `MM3-171A` |
| 11. `주제 및 상황` / `미분류` tree semantics, 용어 통일, 인앱가이드 | 일부 구조 혼란은 반영됐지만 duplicated parent / guide는 task가 없었음 | `부분반영, follow-up 추가` | `MM3-113`~`MM3-116`, `MM3-154`, `MM3-156`, `MM3-172A`, `MM3-173A` |

## Added To Tasklist

- `MM3-168A` detail header / close / copy density follow-up scope 정의
- `MM3-169A` relation / expression surface discoverability follow-up scope 정의
- `MM3-170A` translation surface completeness re-audit
- `MM3-171A` runtime performance / payload split follow-up scope 정의
- `MM3-172A` topic-situation / unclassified tree semantics follow-up scope 정의
- `MM3-173A` terminology / in-app guide planning note

## PM Verdict

- existing feedback 중 핵심 구조/번역/미분류 일부는 이미 MM3에 반영돼 있었다.
- 다만 residual UI/copy/performance/tree semantics/guide 항목은 tasklist에 직접 없어서 이번 턴에 follow-up task로 추가했다.

## Next Active Work

- `MM3-096 Human Pilot Scheduling / Execution`

## Revision History

- `R1` / `2026-03-24 23:44 KST` / `Codex PM` / 추가 human test feedback의 기존 매핑 여부를 점검하고 missing follow-up task를 tasklist에 반영
- `R2` / `2026-03-24 23:47 KST` / `Codex PM` / 사용자 요청에 따라 추가 human test feedback의 실제 문장을 구조와 예시까지 보존한 literal record를 문서에 추가
