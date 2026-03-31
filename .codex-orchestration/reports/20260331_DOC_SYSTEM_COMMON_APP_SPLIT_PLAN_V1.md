# 20260331_DOC_SYSTEM_COMMON_APP_SPLIT_PLAN_V1

## Current Revision

- `R10`

## Last Updated

- `2026-03-31 KST`

## Last Updated By

- `Codex PM`

## Document Status

- `CURRENT EXECUTION BASELINE`
- `R1`~`R6` discussion and review trace remain below for history, but the executable baseline of this document is now the symmetric split agreement defined in this revision.

## 목적

- 같은 workspace를 유지하되 문서 authority drift를 줄인다.
- `shared truth`와 `app-local truth`를 분리한다.
- `09_app`와 `10_relation_app`가 서로의 active package를 침범하지 않도록 문서 경계를 명시한다.

## 현재 관찰

- current operating goal is not historical packet preservation but stable cross-app execution without side effects.
- `shared` control-plane must remain single.
- `09_app` and `10_relation_app` are now treated as independently active-capable app surfaces.
- `README.md` continues to define `09_app` as the default `GitHub -> Vercel` build target.
- `10_relation_app` may reopen immediately, so document structure must allow simultaneous activity without shared-state drift.
- handoff must be readable as `Tier 1 shared -> Tier 2 app-local -> Tier 3 on-demand`.

## 핵심 판단

- 문서를 프로젝트 단위로 완전 분리하면 안 된다.
- 이유:
  - shared DB/SSOT가 하나다.
  - control-plane도 하나여야 한다.
  - handoff root도 하나여야 한다.
- 대신 `shared 1 + app-local 2` 구조가 맞다.
  - `shared control-plane`
  - `09_app app-local execution truth`
  - `10_relation_app app-local execution truth`
- 기본안은 이제 비대칭안이 아니라 `parent shared id + app-local child id` 구조의 대칭 분리안이다.

## 목표 구조

### 1. Shared Control-Plane

- 계속 단일 유지
- shared가 소유하는 것:
  - `parent coordination id`
  - project truth
  - cross-app policy
  - deploy boundary
  - handoff root
- shared는 app-local execution state를 소유하지 않는다.
- current workspace 기준 최소 anchor 예시는 아래처럼 본다.
  - `README.md`
  - `vercel.json`
  - `.codex-orchestration/HANDOFF_MESSAGE_TO_NEW_PM_V1.md`
  - `.codex-orchestration/SHARED_CURRENT_STATE_V1.md`
  - `.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
  - `.codex-orchestration/10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md`
  - 본 문서

### 1A. Current File Anchors

- `shared` minimum anchors
  - root `README.md`
  - `vercel.json`
  - `.codex-orchestration/HANDOFF_MESSAGE_TO_NEW_PM_V1.md`
  - `.codex-orchestration/SHARED_CURRENT_STATE_V1.md`
  - this document
- `09_app` execution anchors
  - `.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
  - `09_app/package.json`
  - `09_app/scripts/**`
  - `09_app/src/**`
  - `09_app/public/data/**`
- `10_relation_app` execution anchors
  - `.codex-orchestration/10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md`
  - `10_relation_app/README.md`
  - reopen 이후 실제 code / packet / deploy file이 생기면 그때 anchor 확장

### 2. `09_app` Local Execution Zone

- `09_app`는 자체 `local child task id`를 소유한다.
- `09_app` local은 아래 execution truth를 소유한다.
  - runtime
  - deploy/build
  - `R2`
  - restore chain
  - `09_app` 전용 regression / acceptance / maintenance packet

### 3. `10_relation_app` Local Execution Zone

- `10_relation_app`도 자체 `local child task id`를 소유한다.
- `10_relation_app` local은 아래 execution truth를 소유한다.
  - IA
  - learner flow
  - UX/UI
  - relation data wiring
  - deploy planning

## 분리 기준

### `shared`로 남길 것

- `parent coordination id`
- shared DB/SSOT 정의
- project-wide decision
- repo topology
- shared deploy policy
- cross-app boundary rule
- handoff bootstrap/root
- cross-app task나 shared data/build tooling packet

### `09_app`로 내릴 것

- `09_app/package.json`, `09_app/scripts/**`, `09_app/public/data/**`, `09_app/src/**`에 직접 연결되는 계획/packet
- `R2`, `Vercel`, runtime bundle, restore, verification
- `09_app` 전용 regression/acceptance packet

### `10_relation_app`로 내릴 것

- `10_relation_app/src/**`, `10_relation_app/public/**`, `10_relation_app/scripts/**`에 직접 연결되는 계획/packet
- relation explorer IA
- learner journey
- compare/detail/mindmap UX
- future isolated deploy planning

## 실행 계획

### Step 1. Shared Canonical Replacement Set 고정

- shared control-plane에서 아래를 먼저 고정한다.
  - `parent coordination id`
  - project truth
  - cross-app policy
  - deploy boundary
  - handoff root
- app-local 분리는 shared replacement set이 고정된 뒤에만 진행한다.

### Step 2. App-Local Header 규칙 먼저 적용

- 각 app-local 문서에는 아래를 필수로 둔다.
  - `App owner`
  - `Parent coordination id`
  - `Local child task id`
  - `Allowed Files`
  - `Disallowed Files`
  - `Write Boundary`
  - `Current blocker`
  - `Verification Command`
  - `Do not change parent coordination id locally`

### Step 3. App-Local Surface 생성

- `09_app` local surface와 `10_relation_app` local surface를 모두 연다.
- 단, shared truth를 복제하거나 재소유하지 않는다.
- 동시에 active 가능하지만 cross-app state 수정은 금지한다.

### Step 4. Handoff Tier를 실행 규칙으로 승격

- handoff는 아래 tier로 고정한다.
  - `Tier 1`: shared
  - `Tier 2`: 해당 앱 local
  - `Tier 3`: on-demand
- 상대 앱 문서는 기본 handoff read 대상이 아니다.

### Step 5. Historical Review / Roadmap는 Archive로 처리

- old roadmap/review discussion은 archive/history로 유지한다.
- current execution baseline은 이 revision의 shared/app-local agreement만 소유한다.

## 우선순위

1. shared canonical replacement set 고정
2. app-local header 규칙 적용
3. `09_app` / `10_relation_app` local surface 생성
4. handoff tier 고정
5. historical discussion archive 처리

## 하지 말아야 할 것

- `09_app`용 tasklist와 `10_relation_app`용 tasklist를 따로 만들지 않기
- handoff를 앱별로 각각 authoritative 문서로 두지 않기
- shared SSOT 설명을 app-local 문서에 중복 복사하지 않기
- active package가 아닌 앱의 파일을 같은 task id에서 수정하지 않기
- app-local index가 shadow dashboard가 되지 않게 하기
- 상대 앱의 app-local state를 수정하거나 소유하지 않기

## 기대 효과

- 같은 workspace를 유지하면서도 cross-app accidental edit risk를 줄일 수 있다.
- shared truth와 app-local truth가 섞이지 않는다.
- 두 앱을 동시에 active로 둘 수 있다.
- next PM이 `shared -> 해당 앱 local` 순서로 읽을 수 있어 handoff가 안정화된다.

## 검증 포인트

- shared가 `parent coordination id`를 일관되게 소유하는가
- 각 앱 문서가 `local child task id`를 따로 소유하는가
- shared control-plane이 app-local 문서보다 먼저 갱신되는가
- `09_app` active task 중 `10_relation_app` write가 금지되는가
- `10_relation_app` active task 중 `09_app` write가 금지되는가
- handoff가 `Tier 1 shared -> Tier 2 해당 앱 local -> Tier 3 on-demand`를 따르는가

## PM 제안

- 승인안은 아래로 고정한다.
  - shared는 단일 control-plane 유지
  - shared는 `parent coordination id` 소유
  - `09_app`, `10_relation_app`은 각자 `local child task id` 소유
  - handoff는 `Tier 1 shared -> Tier 2 해당 앱 local -> Tier 3 on-demand`
  - 두 앱은 동시에 active 가능하지만 서로의 app-local state는 수정하거나 소유하지 않음
- 이 문서 하나만으로 actual execution state 전체를 대체하지는 않는다.
- 이 문서는 `운영 기준 문서`다.
- 실제 실행에는 아래 current surface 구분이 추가로 필요하다.
  - `policy / structure`
  - `shared current state`
  - `app-local current state`
- 즉, 현재 자료는 구분해서 관리해야 한다.
- current linked documents:
  - shared current state surface: `.codex-orchestration/SHARED_CURRENT_STATE_V1.md`
  - current active app local surface: `.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
  - `10_relation_app` local state surface: `.codex-orchestration/10_RELATION_APP_ACTIVE_LOCAL_STATE_V1.md`

## Same-Workspace Risk Matrix

### 목적

- 같은 workspace에서 두 앱을 동시에 운영할 때 발생 가능한 failure mode를 미리 식별한다.
- 각 failure mode마다 최소 대응책과 대안을 함께 고정한다.

### 1. Cross-App File Edit Risk

- 경우:
  - `09_app` 작업 중 `10_relation_app` 파일을 실수로 수정
  - `10_relation_app` 작업 중 `09_app` 파일을 실수로 수정
- 원인:
  - 같은 repo, 같은 editor, 같은 `git status`
- 기본 대응:
  - 모든 app-local 문서 header에 `Allowed Files`, `Disallowed Files`, `Write Boundary`를 강제
  - 작업 시작 전 현재 child task id와 write boundary를 먼저 확인
- 대안:
  - 앱별 branch prefix 사용
  - editor working set을 앱별로 분리

### 2. Shared Truth Drift Risk

- 경우:
  - app-local 문서가 shared truth를 복제한 뒤 stale 상태로 남음
  - shared 문서와 local 문서가 서로 다른 `parent coordination id` 해석을 가짐
- 원인:
  - local 문서에 상태 요약을 길게 복사
- 기본 대응:
  - shared는 `parent coordination id`, policy, deploy boundary, handoff root만 소유
  - app-local 문서는 자기 execution truth만 소유
- 대안:
  - app-local 문서에는 shared 항목을 본문 복사 대신 pointer만 둠

### 3. Child Task Drift Risk

- 경우:
  - app-local 문서의 `local child task id`가 shared coordination 상태와 어긋남
  - 두 앱이 동시에 active인데 child id 관계가 불명확해짐
- 원인:
  - shared 갱신 없이 local 문서만 먼저 수정
- 기본 대응:
  - shared 먼저 갱신
  - 그 다음 app-local child task id 반영
  - local 문서에 `Do not change parent coordination id locally` 고정
- 대안:
  - child task id 명명 규칙을 `PARENTID-09A`, `PARENTID-10A` 식으로 표준화

### 4. Handoff Overread Risk

- 경우:
  - 다음 PM이 상대 앱 문서까지 기본 읽기 대상으로 받아 과다한 읽기 비용 발생
  - handoff가 다시 flat reading list가 됨
- 원인:
  - read tier 미준수
- 기본 대응:
  - `Tier 1`: shared
  - `Tier 2`: 해당 앱 local
  - `Tier 3`: on-demand only
- 대안:
  - handoff 문서에 `Not required for this lane` 섹션을 명시해 상대 앱 문서를 제외

### 5. Deploy Boundary Leakage

- 경우:
  - `10_relation_app` 관련 변경이 `09_app` default deploy path에 섞임
  - `09_app` runtime/deploy 변경이 relation lane 작업에 불필요하게 섞임
- 원인:
  - root build/deploy assumption 혼동
- 기본 대응:
  - shared 문서에 deploy boundary를 명시
  - app-local 문서에 verification command를 넣어 자기 앱 기준으로만 검증
- 대안:
  - CI 또는 local check에서 app path별 changed-files gate 추가

### 6. Shared Data Mutation Risk

- 경우:
  - 한 앱 작업이 shared DB/SSOT 산출물을 사실상 재정의
  - app-local convenience fix가 shared lexical truth처럼 취급됨
- 원인:
  - generated output과 source truth 경계 혼동
- 기본 대응:
  - shared DB/SSOT 정의는 shared 문서에서만 소유
  - app-local 문서에는 source mutation 권한을 주지 않음
- 대안:
  - shared data/build tooling 변경은 반드시 shared packet으로 별도 개설

### 7. Verification Cross-Contamination

- 경우:
  - 한 앱 검증 명령이 다른 앱 산출물이나 캐시를 건드림
  - build 결과를 보고 어느 앱 검증인지 혼동
- 원인:
  - verification command가 app 경계를 명시하지 않음
- 기본 대응:
  - app-local 문서마다 `Verification Command` 필수
  - 검증 결과 기록도 app-local packet에만 남김
- 대안:
  - `npm --prefix 09_app ...`, `npm --prefix 10_relation_app ...` 형태를 강제

### 8. Review Ownership Confusion

- 경우:
  - shared issue를 local issue처럼 처리하거나 반대로 local issue를 shared escalation 없이 넘김
- 원인:
  - review 대상 surface가 불명확
- 기본 대응:
  - review 시작 시 `shared vs app-local` 먼저 판정
  - cross-app 영향이 있으면 shared review로 승격
- 대안:
  - review queue에 `Surface` 필드 추가

### 9. Git / PR Scope Pollution

- 경우:
  - 한 PR에 `09_app`, `10_relation_app`, shared 문서가 함께 과도하게 섞임
- 원인:
  - same workspace에서 여러 lane 작업을 연속 수행
- 기본 대응:
  - child task id 기준으로 commit/PR scope를 제한
  - unrelated app-local change는 다음 lane으로 넘김
- 대안:
  - PR title/description에 `Surface: shared|09_app|10_relation_app` 표시

### 10. Shadow Control-Plane Reappearance

- 경우:
  - app-local 문서가 다시 status, phase, milestone을 장문으로 소유
  - 사실상 두 번째 dashboard가 생김
- 원인:
  - local 문서를 편의상 종합 요약 문서로 사용
- 기본 대응:
  - app-local 문서는 execution truth만 소유
  - status, phase, milestone은 shared만 소유
- 대안:
  - local 문서 lint checklist에 `no phase ownership`, `no milestone ownership` 추가

## Risk Handling Principle

- 같은 workspace 사용의 핵심 리스크는 기술 문제가 아니라 ownership drift다.
- 따라서 우선순위는 아래 순서로 둔다.
  1. shared vs app-local ownership 고정
  2. write boundary 강제
  3. handoff read tier 제한
  4. verification command app-boundary 명시
  5. git/PR scope 오염 방지

## PM Recommendation

- 같은 workspace를 계속 쓰는 것은 허용 가능하다.
- 단, 안전성은 물리적 분리보다 문서 header, handoff tier, verification discipline에 달려 있다.
- 운영 중 문제가 반복되면 아래 순서로 escalation 한다.
  1. header/verification rule 강화
  2. changed-files gate 추가
  3. branch/PR scope 강제
  4. 필요 시 app별 작업 세션 분리

---

## Historical Review Trace

이 아래 섹션들은 `R1`~`R6` 과정에서 형성된 review trace다.

- 현재 execution baseline은 위 본문과 `합의 고정안`을 따른다.
- 아래 내용은 historical reasoning / negotiation trace로 보존한다.

### 09_app PM 통합 피드백

### Feedback Metadata

- Review Perspective: `09_app PM`
- Review Inputs:
  - `critical review-agent`
  - `meticulous review-agent`
- Review Scope:
  - current document validity
  - current workspace fit
  - `09_app` PM 운영 기준

### Verdict

- `PARTIAL_ACCEPT_WITH_REBASE_REQUIRED`
- 문서의 방향성 자체는 유지할 수 있다.
- 다만 현재 문서는 `pre-reset` control-plane과 packet topology를 전제로 쓰여 있어, 지금 workspace에 그대로 적용하면 오히려 reference drift를 다시 만든다.

### PM Feedback Summary

- 두 review-agent 모두 아래를 공통으로 지적했다.
  - `현재 관찰`이 stale 상태다.
  - canonical control-plane set이 실제 파일 시스템과 맞지 않는다.
  - `pointer-only first tranche`는 지금 시점에는 지나치게 보수적이다.
  - `10_relation_app` dedicated planning zone은 현재 상태 대비 과도하다.

### PM 판단

- 현재 workspace 기준 source of truth는 historical planning/doc stack이 아니다.
- 현재 실제 기준은 아래에 더 가깝다.
  - root `README.md`
  - `.codex-orchestration/HANDOFF_MESSAGE_TO_NEW_PM_V1.md`
  - 본 계획 문서
  - `09_app`의 `GitHub -> Vercel -> R2 restore` runtime/deploy chain
  - `10_relation_app` placeholder 상태
- 따라서 이 문서는 `문서 분리 실행안`이라기보다 `historical split proposal requiring re-baseline`으로 읽혀야 한다.

### 필수 수정 사항

1. 상태 배너 추가

- 이 문서는 `pre-reset MM3 control-plane`을 전제로 작성되었고, 실행 전 re-baseline이 필요하다고 명시해야 한다.

2. `현재 관찰` 전면 수정

- 삭제 또는 수정 필요:
  - `09_app` active work = `MM3-307`
  - `10_relation_app` recent tranche = `MM3-291` ~ `MM3-305`
  - `08_planning/*`와 `.codex-orchestration/*` canonical set이 현재 그대로 유지된다는 뉘앙스
- 추가 필요:
  - `09_app` is the only default GitHub -> Vercel build target
  - runtime bundle is restored from `Cloudflare R2`
  - `10_relation_app` is placeholder-only right now
  - old shared planning surfaces are partially absent

3. Step 1 재정의

- 현재 Step 1은 `restore / deprecate / reference correction`만 말하고 끝난다.
- 지금은 아래가 먼저다.
  - `minimal canonical replacement set` 정의
  - `historical file reuse` 여부 판정
  - `missing authority file를 새로 만들지 / 폐기할지 / README로 흡수할지` 결정

4. `pointer-only first tranche` 수정

- 현재 workspace에는 pointer를 걸 만한 app-local report corpus가 충분하지 않다.
- 따라서 first tranche는 아래가 맞다.
  - `pointer-only`가 아니라 `minimal new authority set + selective pointer`
  - empty index 생성 금지
  - 존재하지 않는 packet family를 전제로 한 split 금지

5. `10_relation_app` planning zone 보류

- `10_relation_app`은 현재 placeholder 상태라 full local planning zone을 여는 것은 과하다.
- `09_app` shared/runtime/deploy truth를 안정화한 뒤에만 `10_relation_app` 전용 zone을 다시 열어야 한다.

### 09_app PM 기준 권고안

- 지금 문서는 아래 순서로 바꿔야 한다.
  1. `historical proposal` 배너 추가
  2. 현재 실제 workspace 기준 관찰로 교체
  3. shared canonical minimum set을 새로 정의
  4. `09_app` 중심 asymmetric split으로 좁힘
  5. `10_relation_app` zone은 `placeholder until active work resumes`로 명시

### Suggested Insert

> 이 문서는 pre-reset MM3 control-plane을 전제로 작성된 split proposal이다. 현재 workspace에 그대로 실행하지 말고, 먼저 현재 canonical replacement set과 실제 active surfaces를 다시 고정한 뒤 수정 적용한다.

---

### Codex PM Counter Feedback

### Counter Feedback Metadata

- Review Perspective: `Codex PM`
- Review Scope:
  - `09_app PM` 통합 피드백에 대한 재판단
  - 현재 workspace 적용 가능성
  - 다음 revision 방향

### Counter Position

- `09_app PM` 피드백의 핵심 방향에 동의한다.
- 특히 아래 판단은 타당하다.
  - 현재 문서를 바로 실행안으로 보면 안 된다.
  - current workspace 기준 canonical replacement set을 먼저 다시 고정해야 한다.
  - `10_relation_app` full planning zone을 지금 여는 것은 과하다.
- 따라서 이 문서는 폐기보다 `rebase`가 맞다.

### Agreement Points

- `historical proposal` 배너 추가 필요
- `현재 관찰` 전면 재작성 필요
- Step 1을 `minimal canonical replacement set` 중심으로 재정의해야 함
- split 1차 tranche는 `09_app` 중심 비대칭 구조가 더 현실적임
- `10_relation_app`은 `placeholder until active work resumes`로 두는 것이 맞음

### Counter Clarification

- 기존 초안의 문제는 `분리 방향`보다 `적용 순서`에 있다.
- `shared / 09_app / 10_relation_app` 3층 모델 자체는 장기적으로 여전히 유효하다.
- 다만 현재 시점 first tranche는 아래처럼 좁혀야 한다.
  - `shared canonical minimum set`
  - `09_app active runtime/deploy planning surface`
  - `10_relation_app placeholder note only`

### Revised PM Position

- next revision은 `대칭 분리안`이 아니라 `09_app 중심 비대칭 분리안`으로 다시 써야 한다.
- 즉시 실행 단위는 아래가 맞다.
  1. current workspace 기준 active authority 재확정
  2. `09_app` 관련 shared/runtime/deploy truth 고정
  3. `10_relation_app`은 active reopen 전까지 placeholder 처리
  4. 그 다음에만 app-local split 확대 검토

### Codex PM Recommendation

- 이 문서의 다음 revision 목표를 `split execution plan`이 아니라 `re-baselined asymmetric split plan`으로 변경한다.
- `09_app PM` 피드백은 reject 대상이 아니라 next revision의 상위 입력으로 채택한다.

---

### 최종 수렴 의견

### 수렴 방향

- `09_app PM` 피드백과 `관계탐색 PM` counter feedback은 현재 기준으로 충돌하지 않는다.
- 두 의견은 아래 공통 방향으로 수렴할 수 있다.
  - 문서 분리 방향은 유지
  - 적용 순서는 재설계
  - first tranche는 `09_app` 중심 비대칭 구조
  - `10_relation_app`은 reopen 전까지 placeholder

### 최종 PM 입장

- 내가 보기에도 지금 우선순위는 `문서를 예쁘게 분리`하는 것이 아니라 `운영 side effect를 막는 것`이다.
- 따라서 성공 조건은 아래다.
  - `09_app`와 `10_relation_app`가 서로의 active surface를 건드리지 않음
  - handoff 시 다음 PM이 `shared -> active app local` 순서로 읽으면 바로 이어받을 수 있음
  - inactive app 문서는 state를 소유하지 않음
  - shared authoritative surface는 끝까지 하나만 유지

### 실행 원칙

1. shared authority를 먼저 고정

- current phase
- active `task id`
- shared data / deploy / policy truth
- cross-app write boundary

2. `09_app` local execution surface를 먼저 분리

- runtime
- deploy
- `R2`
- restore/build
- acceptance / regression packet

3. `10_relation_app`은 note-only로 유지

- active code / deploy / packet family가 다시 생기기 전에는 placeholder만 둔다
- full local planning zone은 reopen 이후에만 연다

4. handoff는 계층형으로 고정

- `Tier 1`: shared control-plane only
- `Tier 2`: current active app latest packet 1개
- `Tier 3`: on-demand

### 문서 적용 결론

- 이 문서는 `즉시 실행 split plan`이 아니라 `re-baselined asymmetric split plan draft`로 재해석하는 것이 맞다.
- 다음 revision에서는 아래를 명시적으로 바꾸는 것을 권고한다.
  - historical assumptions 제거
  - current canonical replacement set 반영
  - `09_app` first / `10_relation_app` later 구조 명시
  - handoff/read-tier/write-boundary를 실행 규칙으로 승격

### 한 줄 결론

> 단계적으로 진행하더라도 괜찮다. 다만 현재 시점의 목표는 대칭적 문서 분리가 아니라, `09_app`과 `10_relation_app`이 서로의 상태를 오염시키지 않고 handoff가 안정적으로 이어지는 비대칭 운영 구조를 먼저 고정하는 것이다.

---

### 합의 고정안

### 합의 상태

- 아래 기준을 현재 합의안으로 고정한다.
- 이후 review는 이 합의안과의 정합성 기준으로만 수행한다.

### 고정 기준

- `shared`는 단일 control-plane 유지
- `shared`는 `parent coordination id` 소유
- `09_app`, `10_relation_app`은 각자 `local child task id` 소유
- handoff는 아래 tier로 고정
  - `Tier 1`: shared
  - `Tier 2`: 해당 앱 local
  - `Tier 3`: on-demand
- app-local 문서는 아래 header 필드를 필수 포함
  - `App owner`
  - `Parent coordination id`
  - `Local child task id`
  - `Allowed Files`
  - `Disallowed Files`
  - `Write Boundary`
  - `Current blocker`
  - `Verification Command`
  - `Do not change parent coordination id locally`
- 두 앱은 동시에 active 가능
- 단, 서로의 app-local state는 수정하거나 소유하지 않음
- 기본안은 이제 비대칭안이 아니라 `parent shared id + app-local child id` 구조의 대칭 분리안

### 검토 규칙

- 이제부터 `09_app PM` draft가 올라오면 아래만 본다.
  - 이 합의안과 정합한가
  - shared와 app-local ownership이 섞이지 않는가
  - handoff/read tier가 이 기준을 따르는가
  - write boundary가 문서 수준에서 강제되는가

## Revision History

- `R10` / `2026-03-31 KST` / `Codex PM` / `10_relation_app` local state surface 문서 생성 및 current anchor/link 반영
- `R9` / `2026-03-31 KST` / `Codex PM` / `Local Planning`을 `Local Execution`으로 정정하고 current file anchor와 문서 역할 한계를 추가
- `R8` / `2026-03-31 KST` / `Codex PM` / 같은 workspace 운영 시 발생 가능한 리스크와 대안 섹션 추가
- `R7` / `2026-03-31 KST` / `Codex PM` / 본문 전체를 최종 합의안 기준으로 재베이스하고, 기존 review/counter/final/agreement 섹션을 `Historical Review Trace`로 강등
- `R6` / `2026-03-31 KST` / `Codex PM` / 관계탐색 PM 응답을 반영해 `합의 고정안` 섹션 추가, 이후 검토 기준을 해당 합의안 정합성으로 고정
- `R5` / `2026-03-31 KST` / `Codex PM` / `최종 수렴 의견` 섹션 추가: side effect 방지와 handoff 안정성을 기준으로 `09_app` 중심 비대칭 분리 원칙을 명시
- `R4` / `2026-03-31 KST` / `Codex PM` / `09_app PM` 통합 피드백 아래에 별도 `Codex PM Counter Feedback` 섹션 추가
- `R3` / `2026-03-31 KST` / `Codex PM` / 원문 유지 + 하단 `09_app PM 통합 피드백` 분리 섹션으로 재구성
- `R2` / `2026-03-31 KST` / `Codex PM` / review 반영: pointer-only first tranche, shared packet surface, non-authoritative app index, task-id lock, handoff tier 규칙 추가
- `R1` / `2026-03-31 KST` / `Codex PM` / shared control-plane 유지 + `09_app`/`10_relation_app` app-local planning 분리 계획 초안 작성
