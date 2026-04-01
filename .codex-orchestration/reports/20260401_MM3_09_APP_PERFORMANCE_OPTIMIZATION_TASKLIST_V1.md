# 20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1

## Current Revision

- `R5`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

## 목적

- `09_app`의 초기 로딩, 검색, view 전환, tree/list/mindmap 동기화에서 체감 성능을 개선한다.
- 큰 변경을 한 번에 밀어 넣지 않고 `tranche` 단위로 닫는다.
- 각 `tranche`마다 구현, local 확인, regression 확인, 문서 갱신까지 같은 턴에 닫는다.

## 적용 원칙

- 먼저 control-plane 문서에 active optimization work를 고정한다.
- 각 단계마다 `완료 기준`, `영향 파일`, `검증 방법`, `rollback` 가능성을 명시한다.
- `local`과 `deploy-target`의 기준을 섞지 않는다.
- `daily build`와 `manual regeneration`을 섞지 않는다.

## 현재 기준

- current `09_app` runtime bundle source는 `Cloudflare R2`다.
- `local` 개발/테스트 기본은 `local build / local server`다.
- `deploy-target build`는 `R2 restore` 기준으로 닫는다.
- base runtime translation은 `영어`만 기본 포함하고, 비영어 translation은 lazy overlay로 전환됐다.
- local search path는 `APP_READY_SEARCH_THIN_INDEX.json` 우선, full live search payload fallback 기준이다.
- first-screen eager path는 `APP_READY_MEANING_TREE_SHELL.json` 기준이다.
- current public runtime manifest는 `v2`, `fileCount=233`, `generated_at=2026-04-01T01:03:51.183Z`다.
- canonical deploy-target restore path는 stable manifest -> hashed `remote_path` indirection이다.

## 우선순위

### Priority 1

- search payload 추가 분할
- first-screen payload 축소
- `immutable` cache를 전제로 한 hashed runtime payload 전략 정리

### Priority 2

- search 전용 thin index 별도 운영
- payload prefetch / parallel fetch 구조 정리
- detail 진입 시 section별 lazy load 강화

### Priority 3

- 큰 JSON parse의 `Web Worker` 이동
- list virtualization
- tree incremental render 또는 virtualization

## Tasklist

### `P0` 문서 기준 정리

- Goal:
  - optimization work를 control-plane 문서 기준으로 추적 가능하게 만든다.
- Output:
  - this tasklist
  - tranche execution packet
  - risk / rollback note
- Done when:
  - 3개 문서가 생성되고 handoff/current state에서 참조 가능하다.
- Status:
  - `DONE`

### `P1` translation payload split closeout

- Goal:
  - base payload의 translation footprint를 줄이고 비영어 language를 lazy overlay로 분리한다.
- Scope:
  - search/list initial load
  - translation language switch
  - runtime bundle packaging
- Done when:
  - base search payload가 영어만 기본 포함
  - non-English overlay lazy load 동작
  - local preview 검증 완료
- Status:
  - `DONE`
- Reference:
  - `20260401_MM3_09_APP_PERFORMANCE_TRANCHE1_EXECUTION_PACKET_V1.md`

### `P2` search payload repartition

- Goal:
  - search 입력 시 전체 대용량 row를 직접 스캔하지 않도록 search 전용 payload를 더 얇게 만든다.
- Candidate outputs:
  - search-only thin payload
  - thin payload measurement script
- Done when:
  - first search interaction path에서 current search payload footprint가 추가로 감소
  - search latency 전/후 비교가 남아 있다.
- Status:
  - `DONE`
- Reference:
  - `20260401_MM3_09_APP_PERFORMANCE_TRANCHE2_EXECUTION_PACKET_V1.md`

### `P3` first-screen payload reduction

- Goal:
  - 초기 진입에서 필요한 최소 payload만 먼저 로드한다.
- Candidate outputs:
  - active tab minimal payload
  - first-screen shell payload
- Done when:
  - first stable render에 필요한 eager payload 수와 total bytes가 감소
  - local/deploy-target 기준 측정값이 남아 있다.
- Status:
  - `DONE`
- Reference:
  - `20260401_MM3_09_APP_PERFORMANCE_TRANCHE3_EXECUTION_PACKET_V1.md`

### `P4` runtime cache and naming strategy

- Goal:
  - Vercel/CDN cache hit를 높이는 payload naming / cache policy를 확정한다.
- Candidate outputs:
  - hashed payload naming
  - immutable caching policy
  - manifest indirection rule
- Done when:
  - runtime payload naming and cache invalidation contract가 문서화되고 implementation 범위가 확정된다.
- Status:
  - `DONE`
- Reference:
  - `20260401_MM3_09_APP_PERFORMANCE_TRANCHE4_EXECUTION_PACKET_V1.md`

### `P5` interaction cost reduction

- Goal:
  - view 전환과 large list rendering cost를 줄인다.
- Candidate outputs:
  - list virtualization
  - tree incremental render
  - worker parse
- Done when:
  - 주요 interaction path의 blocking time이 감소하고 regression 없이 유지된다.
- Status:
  - `DONE`
- Reference:
  - `20260401_MM3_09_APP_PERFORMANCE_TRANCHE5_EXECUTION_PACKET_V1.md`

## 순서

1. `P0` 문서 기준 정리
2. `P1` translation payload split closeout
3. `P2` search payload repartition
4. `P3` first-screen payload reduction
5. `P4` runtime cache and naming strategy
6. `P5` interaction cost reduction

## 주의사항

- search/list/mindmap 동기화 작업과 payload split 작업을 같은 tranche에 섞지 않는다.
- `deploy-target build`용 payload 계약과 `local` 실험 payload를 같은 소스로 취급하지 않는다.
- `R2 regenerate`는 여전히 manual process다.
- runtime payload naming strategy를 바꾸기 전에는 cache invalidation 경로를 먼저 문서화한다.

## Verification Rule

- 각 tranche마다 아래 4개를 남긴다.
  - changed files
  - before / after payload size 또는 interaction metric
  - local preview 확인
  - rollback path

## Next Read

- `Tier 1`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/09_APP_ACTIVE_LOCAL_STATE_V1.md`
- `Tier 2`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_TRANCHE5_EXECUTION_PACKET_V1.md`
- `Tier 3`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`

## Revision History

- `R5` / `2026-04-01 KST` / `MM_09_APP_PM` / `P5` list virtualization tranche closeout과 next read를 `T5` packet 기준으로 갱신
- `R4` / `2026-04-01 KST` / `MM_09_APP_PM` / `P4` hashed remote path + manifest indirection closeout과 next read를 `T4` packet 기준으로 갱신
- `R3` / `2026-04-01 KST` / `MM_09_APP_PM` / `P3` first-screen shell tranche closeout과 next read를 `T3` packet 기준으로 갱신
- `R2` / `2026-04-01 KST` / `MM_09_APP_PM` / `P2` thin search payload tranche closeout과 next read를 `T2` packet 기준으로 갱신
- `R1` / `2026-04-01 KST` / `MM_09_APP_PM` / initial optimization tasklist 생성
