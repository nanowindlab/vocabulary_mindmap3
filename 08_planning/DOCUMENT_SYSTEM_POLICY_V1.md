# DOCUMENT_SYSTEM_POLICY_V1

## Purpose

- `mindmap3`의 PM 운영 문서가 서로 다른 상태를 가리키지 않도록 authoritative ownership을 고정한다.

## Authoritative Roles

- `08_planning/TASKLIST_V1.md`
  - authoritative todo
  - active work / parked backlog 구분
- `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
  - current milestone
  - active work label
  - current risk
- `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
  - next-thread first read
  - carry-forward context
- `08_planning/PROJECT_DECISION_LOG_V1.md`
  - durable policy and scope changes
- `README.md`
  - external-facing entry point
- `PROJECT_DOCUMENT_MAP.md`
  - navigation map only

## Current Doc Hierarchy

1. Dashboard decides current phase label.
2. Tasklist decides active rows.
3. Decision log records durable scope/policy.
4. Handoff summarizes what the next PM must do first.
5. README and document map only point to the current canonicals.

## Update Order

1. change authoritative source first
2. sync dashboard/tasklist/handoff
3. sync README / document map
4. verify all files point to the same phase and active work

## Report Revision Rule

- 같은 파일명을 유지하면서 보고서를 갱신할 수 있다.
- 단, 아래 정보는 빠지면 안 된다.
  - 현재 revision 상태
  - 마지막 갱신 시각
  - 마지막 갱신 주체
  - 이번 갱신의 핵심 변경 요약
- 재작업이나 보정이 한 번이라도 있었으면 문서 내부에 `Revision History`를 둔다.
- 최소 형식:
  - `Current Revision`
  - `Last Updated`
  - `Last Updated By`
  - `Revision History`

## Report Location Rule

- `08_planning/reports/`
  - PM 단독 작성 보고서
  - PM acceptance / PM decision / PM policy / PM note
- `.codex-orchestration/reports/`
  - agent working report
  - agent 초안 / 검토 / 검증 / 실행 결과
- 같은 주제라도
  - agent가 만든 원본/초안은 `.codex-orchestration/reports/`
  - PM가 최종 판단한 문서는 `08_planning/reports/`
  로 둔다.

## Revision History Minimum

- revision label
- date/time
- editor or agent
- one-line change summary

## Strict Mode Addendum

- source review 전에는 scenario를 final canonical로 올리지 않는다.
- scenario 전에는 implementation gate를 열지 않는다.
- phase 전환 문구는 dashboard와 tasklist가 먼저 바뀌어야 한다.

## Do Not

- 두 개의 authoritative tasklist를 만들지 않는다
- handoff만 최신으로 만들고 dashboard를 남겨두지 않는다
- parked backlog를 active task처럼 서술하지 않는다
- implementation note를 phase state보다 앞세우지 않는다
- 같은 파일명을 유지하면서 revision 맥락을 지우지 않는다

## Current Phase-Specific Rule

- `09_app/`, `scripts/`, generated output은 current phase의 supporting context일 뿐 authoritative control-plane 문서가 아니다.
- 다음 단계 전환은 문서상 phase gate가 먼저 열려야 한다.
- 현재 다음 단계 순서는 `source schema/data review`이며, scenario writing은 그 다음이다.
