# 20260328_MM3_268_FEEDBACK_INTAKE_AND_EXECUTION_PLAN_V1

- Packet name: `20260328_MM3_268_FEEDBACK_INTAKE_AND_EXECUTION_PLAN_V1`
- Packet role: `plan`
- Task ID: `MM3-268`
- Parent pipeline or workflow: `M1 Runtime Wiring / Core Explorer / 2026-03-28 Feedback Wave`
- Status: `DONE`
- Current Revision: `R7`
- Last Updated: `2026-03-28 22:41 KST`
- Last Updated By: `Codex PM`

## Purpose

- Why this packet exists:
  - 2026-03-28 사용자 피드백을 원문 의미를 바꾸지 않고 task 단위로 고정하고 execution order를 잠근다.
- What it decides, verifies, or locks:
  - direct instruction과 review-needed item을 분리하고, feedback item별 tracking 기준을 만든다.

## Instruction Coverage

- Explicit user instructions reflected here:
  - 아래 피드백 내용을 태스크로 정리
  - 실행 계획을 세워 진행
  - 임의로 내용을 축약해 의미가 변하지 않도록 주의
  - 피드백 하나마다 어떻게 진행되었는지 트래킹
- Requested exclusions or non-goals:
  - 원문 의미를 바꾸는 재해석 금지
- Formatting or reporting constraints:
  - 보고와 보고서 작성은 한국어
- Any blocked instruction and reason:
  - 없음

## Source Of Truth

- Authoritative tasklist row:
  - `08_planning/TASKLIST_V1.md`
- Dashboard pointer:
  - `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`
- Handoff pointer:
  - `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`
- Related workboard or review queue item:
  - `.codex-orchestration/PM_REVIEW_QUEUE_V1.md`

## Feedback-To-Task Tracking

### `MM3-268A` 예문 종류 우선순위 결정 검토

- Original feedback:
  - `예문의 종류에 무엇이 있는지? 구, 문장, 대화, TOPIK, ?? --> 우선 순위 결정 필요. 무엇이 learner에게 효율적일지 검토 태스크 진행후 결정할 것.`
- Type:
  - `review-required`
- Status:
  - `DONE`
- Current handling:
  - runtime examples payload 기준 source type inventory를 뽑았다.
  - inventory review 후 learner-facing priority draft를 `문장 -> 대화 -> 구 -> TOPIK`으로 고정했다.
- Planned output:
  - example type inventory + learner priority decision packet

### `MM3-268B` 분류 밖 항목 floating 소분류 상황 분석

- Original feedback:
  - `분류 밖 항목 '/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 1.51.26.png' 마인드맵에 연결되어 있지 않은 소분류가 떠다니고 있음. 상황 분석`
- Type:
  - `analysis-required`
- Status:
  - `DONE`
- Current handling:
  - screenshot, display hierarchy logic, runtime payload bucket counts를 기준으로 root cause를 분석했다.
  - current issue는 data loss보다 repeated grade label duplication issue로 정리됐다.
- Planned output:
  - isolated unclassified node root-cause analysis packet

### `MM3-268C` detail load 후 node preview 잔류 버그 확인

- Original feedback:
  - `vercel 테스트 (60a879c~) '/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 1.32.43.png' 단어를 클릭할 때 자세한 정보를 로딩하는 동안 node preview가 나타나는 것 같은데, 바로 사라지지 않고 모든 내용이 다 로딩된 후에도 계속 남아 있음. 확인할 것.`
- Type:
  - `direct-bug`
- Status:
  - `DONE`
- Current handling:
  - `MindmapCanvas`에서 term/category/background click과 `selectedTermId` 변경 시 tooltip clear를 넣었다.
  - `tests/residual.spec.js`에 `node preview clears after term detail selection` regression을 추가했고 통과했다.
- Planned output:
  - node preview persistence bug repro + fix packet

### `MM3-268D` Quick Entry Overlay 폐기

- Original feedback:
  - `Quick Entry Overlay 실제 사용에 별다른 도움이 되지 않음. 공간만 비효율적로 차지. 프리징 버그도 많음. '주제 및 상황'의 분류를 정리할 때 A방법 위주의 E방법 오버레이를 진행했음. 확인해 볼것. --> E 방법 오버레이 폐기`
- Type:
  - `product-decision + implementation`
- Status:
  - `DONE`
- Current handling:
  - `App.jsx`에서 `Quick Entry Overlay(E 방법)` block과 전용 state/filter path를 제거했다.
  - `build PASS`, `smoke/scenario PASS` 기준으로 current local runtime에는 반영됐다.
- Planned output:
  - overlay retirement decision + removal implementation packet

### `MM3-268E` 검색창 결과 리스트 / 동형어 선택 복구

- Original feedback:
  - `MM3-261B batch 03 - 검색창: 단어를 입력하면 동형어를 포함한 검색단어와 관계 단어리스트로 보이고, 선택할 수 있었는데, 지금은 아무 것도 안 나타남. 입력한 단어만 보는 목적에는 부합하겠지만, 동형어를 선택할 방법이 없음. 검색창에 리스트가 나타나도록 할 것.`
- Type:
  - `direct-fix`
- Status:
  - `DONE`
- Current handling:
  - local repro spec 기준 `보다` 입력 시 search dropdown과 result row가 정상 표시되는 것을 확인했다.
  - current local baseline에서는 `동형어/관련 단어 선택 경로`가 막혀 있지 않은 상태다.
- Planned output:
  - search dropdown / homonym selection restore packet

### `MM3-268F` tab count 1줄 유지 검토

- Original feedback:
  - `'보다'로 검색 ... '핵심, 의미관계, 활용표현, 예문' 탭 에서 '예문 10'은 한 줄에, '의미관계 2'는 두 줄에 나뉘어 있음. (최소 크기로 화면 가로 해상도 1280 일때.). 이 화면 크기에서도 한 줄에 표시되도록 조절 가능한지? 지시가 아닌, 검토 권고 사항.`
- Type:
  - `review-recommendation`
- Status:
  - `DONE`
- Current handling:
  - 1280 기준 tab wrapping review 후, tab compression 구현까지 반영했다.
- Planned output:
  - tab count wrapping feasibility note

### `MM3-268G` 핵심 뜻 카드 재설계 검토

- Original feedback:
  - `'/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 2.13.30.png', 핵심 뜻--> 폰크 크기가 너무 작음, 박스 안에 박스 안에 내용으로 공간 낭비만 크고 내용 전달 약함.--> 박스를 '/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 2.12.57.png' 처럼 사용하면 더 좋을 듯. 검토 태스크를 거친 후 결정할 것.`
- Type:
  - `review-required`
- Status:
  - `DONE`
- Current handling:
  - nested translation box를 flatter rail로 낮추는 방향이 맞다고 판단했고, current detail surface에 반영했다.
- Planned output:
  - core meaning card redesign review packet

### `MM3-268H` tree navigation ↔ mindmap 분류 양방향 동기화

- Original feedback:
  - `tree navigation에서 분류 (의미범주>인간, 혹은 의미범주>인간>신체부위) 를 선택하면 마이드맵에 연동되고 있음. 반대로 마인드맵에서 다른 분류를 클릭할 때도 마인드맵의 중심이 클릭한 분류로 이동하고, tree navigation도 동기화 되도록 할 것.`
- Type:
  - `direct-fix`
- Status:
  - `DONE`
- Current handling:
  - `mindmap scene/category click -> App state -> SidebarTree` 경로를 연결했다.
  - `rootId/sceneId` 메타데이터를 tree node에 보강했고, `selectedTreeNode`를 sidebar 비-term highlight에도 반영했다.
  - regression test `tests/tree-sync.spec.js`를 추가해 category click 후 sidebar selection/expansion sync를 확인했다.
- Planned output:
  - tree navigation / mindmap bidirectional sync implementation packet

## Execution Order

1. `MM3-268E` 검색창 결과 리스트 / 동형어 선택 복구
2. `MM3-268C` node preview persistence bug repro/fix
3. `MM3-268D` Quick Entry Overlay 폐기
4. `MM3-268B` 분류 밖 항목 floating node 상황 분석
5. `MM3-268A` 예문 종류 learner priority review
6. `MM3-268F` tab count wrapping feasibility review
7. `MM3-268G` 핵심 뜻 카드 redesign review
8. `MM3-268H` tree navigation ↔ mindmap 분류 양방향 동기화

## Why This Order

- `MM3-268E`는 현재 탐색 가능성을 직접 막는 bug라서 가장 먼저 처리한다.
- `MM3-268C`는 detail interaction 중 잔류 UI bug라서 그 다음이다.
- `MM3-268D`는 user directive가 이미 `폐기`까지 포함하므로 early decision 대상이다.
- `MM3-268B`, `MM3-268A`, `MM3-268F`, `MM3-268G`는 analysis/review를 선행해야 한다.

## Next Unlock Or Blocker

- Next unlock condition:
  - closeout packet과 다음 active work 결정이 분리 기록된다.
- Immediate next action:
  - `MM3-268`을 closeout 상태로 전환한다.
- Open blocker if any:
  - 현재 없음

## Linked Artifacts

- PM-owned packet links:
  - `08_planning/reports/20260328_MM3_261B_THEME_CONTINUITY_POLISH_BATCH_03_IMPLEMENTATION_V1.md`
- Agent report links:
  - 없음
- Runtime or data artifact links:
  - `/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 1.51.26.png`
  - `/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 1.32.43.png`
  - `/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 2.06.00.png`
  - `/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 2.13.30.png`
  - `/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 2.12.57.png`

## Revision History

- `R1` / `2026-03-28 13:52 KST` / `Codex PM` / 2026-03-28 feedback를 task 단위로 분해하고 execution order를 고정
- `R2` / `2026-03-28 19:55 KST` / `Codex PM` / `MM3-268E` local pass, `MM3-268D` removal 완료, `MM3-268C` fix 반영 후 stable repro refinement 상태를 반영
- `R3` / `2026-03-28 20:02 KST` / `Codex PM` / `MM3-268H` tree navigation ↔ mindmap 양방향 sync 구현과 regression test 결과를 반영
- `R4` / `2026-03-28 20:12 KST` / `Codex PM` / `MM3-268C` closeout, `MM3-268B` 분석, `MM3-268A` inventory review 진행 상황을 반영
- `R5` / `2026-03-28 20:18 KST` / `Codex PM` / `MM3-268A` learner-facing example priority decision draft를 반영
- `R6` / `2026-03-28 21:17 KST` / `Codex PM` / `MM3-268F`, `MM3-268G` review와 detail surface 적용 결과를 반영
- `R7` / `2026-03-28 22:41 KST` / `Codex PM` / `MM3-268` feedback wave 전체 closeout 상태를 반영
