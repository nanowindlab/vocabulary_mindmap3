# 20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1

## Current Revision

- `R5`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

## 목적

- performance optimization 작업 중 runtime/search/translation 동작이 깨질 수 있는 지점을 정리하고 rollback 기준을 고정한다.

## Risk 1. language overlay load failure

- 상황:
  - base payload는 영어만 있고, selected language overlay fetch가 실패한다.
- 영향:
  - non-English translation 노출이 빠질 수 있다.
  - non-English search recall이 감소할 수 있다.
- 대응:
  - overlay fetch 실패 시 영어 base만 유지한다.
  - app 전체 failure로 승격하지 않는다.

## Risk 2. search ranking drift after payload split

- 상황:
  - translation summary가 줄어들면서 search behavior가 달라질 수 있다.
- 영향:
  - 특정 foreign-language query 결과 순서가 바뀔 수 있다.
- 대응:
  - search 결과 regression sample을 남긴다.
  - `요리하다`, `보다`, `가게` 같은 기준 항목을 유지 확인한다.

## Risk 3. package/runtime manifest omission

- 상황:
  - translation overlay 파일이 runtime manifest에서 누락된다.
- 영향:
  - deploy-target에서 lazy translation load가 동작하지 않는다.
- 대응:
  - package manifest에 translation entries가 포함됐는지 확인한다.

## Risk 4. local / deploy-target contract confusion

- 상황:
  - local preview는 동작하지만 deploy-target runtime bundle에는 overlay가 반영되지 않을 수 있다.
- 영향:
  - local과 deployed behavior가 달라진다.
- 대응:
  - local verification과 deploy-target verification을 분리 기록한다.
  - `R2` republish 전까지는 local-only optimization으로 분류한다.

## Risk 5. thin/full search payload drift

- 상황:
  - thin payload와 full payload가 서로 다른 row set 또는 ranking 결과를 내놓을 수 있다.
- 영향:
  - search dropdown top result와 search-select jump가 local/full 기준과 달라질 수 있다.
- 대응:
  - thin/full row count를 같이 측정한다.
  - `measure-search-thin-payload.mjs`로 sample query top-1 parity를 남긴다.
  - thin payload가 없으면 full live search payload로 fallback한다.

## Risk 6. tree shell / full tree drift

- 상황:
  - first-screen shell tree와 full meaning tree의 scene/category/count가 어긋날 수 있다.
- 영향:
  - first screen에서 보인 branch와 full payload 로드 후 branch가 달라질 수 있다.
- 대응:
  - shell payload는 full meaning tree projection에서 같은 턴에 생성한다.
  - shell smoke와 mindmap navigation regression을 Playwright로 묶는다.
  - full payload가 준비되면 shell 대신 full tree를 authoritative runtime으로 사용한다.

## Risk 7. manifest / hashed object drift

- 상황:
  - stable manifest는 최신인데, 특정 hashed object upload가 누락되거나 gateway fetch가 어긋날 수 있다.
- 영향:
  - remote restore build가 일부 payload에서만 실패할 수 있다.
  - direct logical URL로 spot-check하면 최신 contract와 어긋난 관찰이 나올 수 있다.
- 대응:
  - canonical verification은 direct logical payload URL이 아니라 manifest + remote restore build로 묶는다.
  - manifest entry마다 `sha256`, `remote_path`, `cache_control`을 남긴다.
  - `runtime-bundle-manifest.json`만 stable pointer로 유지한다.

## Risk 8. virtualization window regression

- 상황:
  - list virtualization이 selected term scroll, row click, 또는 empty state 처리를 깨뜨릴 수 있다.
- 영향:
  - list view에서 항목이 사라져 보이거나 selection jump가 어긋날 수 있다.
- 대응:
  - virtualization window의 rendered count를 bounded metric으로 노출한다.
  - first-screen / mindmap / list virtualization regression을 Playwright로 함께 묶는다.
  - selected term이 viewport 밖에 있을 때 auto-scroll로 다시 맞춘다.

## Rollback Principle

- rollback은 big-bang revert보다 payload contract를 이전 상태로 되돌리는 방식이 안전하다.
- 최소 rollback 단위:
  - base payload에 multi-language `translation_summary`를 복원
  - overlay loader 경로를 비활성화
  - translation manifest / overlay 파일 package를 중단
  - thin search loader 경로를 비활성화하고 full live search payload로 고정

## Rollback Trigger

- non-English language switch가 base English view까지 깨뜨릴 때
- search 결과 회귀가 다수 발생할 때
- runtime bundle package에서 translation overlay 파일 누락이 반복될 때
- thin/full payload top-1 parity가 반복적으로 어긋날 때
- shell/full tree branch mismatch가 반복될 때
- remote restore build가 hashed `remote_path` fetch에서 반복 실패할 때
- list virtualization에서 selected term visibility나 row click regression이 반복될 때

## Immediate Checkpoints

- base search payload에 영어만 남아 있는가
- selected language lazy load가 동작하는가
- package manifest에 translation overlay가 포함되는가
- local preview에서 non-English search가 유지되는가
- thin/full search payload row count와 sample query top-1이 일치하는가
- shell tree가 first screen에서 empty state 없이 보이는가
- remote restore build가 새 shell/thin manifest 기준으로 통과하는가
- public manifest가 `v2` naming/caching contract를 반환하는가
- virtualization list row count가 bounded 상태로 유지되는가

## Revision History

- `R5` / `2026-04-01 KST` / `MM_09_APP_PM` / `P5` virtualization regression risk와 checkpoint 추가
- `R4` / `2026-04-01 KST` / `MM_09_APP_PM` / `P4` manifest/hash drift risk와 canonical verification rule 추가
- `R3` / `2026-04-01 KST` / `MM_09_APP_PM` / `P3` shell/full tree drift risk와 deploy-target checkpoint 추가
- `R2` / `2026-04-01 KST` / `MM_09_APP_PM` / `T2` thin/full search payload drift risk와 rollback checkpoint 추가
- `R1` / `2026-04-01 KST` / `MM_09_APP_PM` / initial risk and rollback note 생성
