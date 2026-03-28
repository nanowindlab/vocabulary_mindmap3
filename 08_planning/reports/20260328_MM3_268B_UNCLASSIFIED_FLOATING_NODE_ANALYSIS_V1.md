# 20260328_MM3_268B_UNCLASSIFIED_FLOATING_NODE_ANALYSIS_V1

- Packet name: `20260328_MM3_268B_UNCLASSIFIED_FLOATING_NODE_ANALYSIS_V1`
- Packet role: `note`
- Task ID: `MM3-268B`
- Parent pipeline or workflow: `M1 Runtime Wiring / Core Explorer / 2026-03-28 Feedback Wave`
- Status: `DONE`
- Current Revision: `R1`
- Last Updated: `2026-03-28 20:12 KST`
- Last Updated By: `Codex PM`

## Purpose

- Why this packet exists:
  - `분류 밖 항목` 화면에서 마인드맵에 연결되지 않은 것처럼 보이는 소분류가 왜 생기는지 상황 분석을 고정한다.
- What it decides, verifies, or locks:
  - current runtime 구조에서 floating처럼 보이는 원인이 data loss가 아니라 display hierarchy 설계에 있음을 정리한다.

## Source Of Truth

- Screenshot:
  - `/Users/nanowind/Desktop/스크린샷 2026-03-28 오후 1.51.26.png`
- Runtime logic:
  - `09_app/src/App.jsx`
  - `09_app/src/utils/hierarchyDisplay.js`
- Runtime payload:
  - `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`

## Findings

- `분류 밖 항목`은 raw `미분류` bucket을 learner-facing으로 재표현한 surface다.
- current unclassified projection은
  - `scene = word_grade`
  - `category = pos`
  로 들어오지만,
  learner-facing display 단계에서
  - `displayScene = 품사`
  - `displayCategory = 학습난이도`
  로 뒤집어 보여 준다.
- 그래서 마인드맵 색 기준으로는
  - green scene node = `품사`
  - purple category node = `학습난이도`
  가 된다.
- screenshot에서 반복적으로 보이는 purple `학습난이도 미기재` 노드는
  하나의 공통 node가 떠다니는 것이 아니라,
  각 품사(scene) 아래에 별도 category로 반복 생성된 것이다.
- 실제 runtime payload 기준 `분류 밖 항목` entry는 `8,506`개다.
- 이 중 `word_grade = 없음` bucket은 여러 품사에 반복되며, 예시는 다음과 같다.
  - `품사 없음 || 없음`: `2,530`
  - `어미 || 없음`: `505`
  - `명사 || 없음`: `480`
  - `조사 || 없음`: `155`
  - `동사 || 없음`: `121`
- `word_grade = 없음`이 붙는 distinct 품사 bucket만 `13`개라서,
  learner는 같은 `학습난이도 미기재` label이 화면에 여러 개 떠 있는 것처럼 읽게 된다.

## Conclusion

- current issue는 연결 끊김이나 데이터 누락보다는
  `분류 밖 항목`에서 `품사 > 학습난이도` 2단 구조를 그대로 시각화하면서
  동일한 `학습난이도 미기재` category label이 품사별로 반복 노출되는 데서 생긴다.
- 즉, screenshot의 문제는 runtime bug보다
  display hierarchy/label duplication issue로 보는 것이 맞다.

## Recommended Next Decision

- 후보 1:
  - `분류 밖 항목`에서는 `학습난이도` layer를 접고 `품사` 중심 1단 탐색으로 줄인다.
- 후보 2:
  - `학습난이도 미기재`만 special-case로 collapse해서 공통 badge/helper로 내린다.
- 후보 3:
  - 현 구조를 유지하되 repeated grade label을 시각적으로 demote한다.

## Revision History

- `R1` / `2026-03-28 20:12 KST` / `Codex PM` / `분류 밖 항목` floating node 현상이 display hierarchy duplication issue임을 정리
