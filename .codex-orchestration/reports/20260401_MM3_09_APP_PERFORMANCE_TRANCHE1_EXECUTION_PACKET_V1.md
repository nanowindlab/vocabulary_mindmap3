# 20260401_MM3_09_APP_PERFORMANCE_TRANCHE1_EXECUTION_PACKET_V1

## Current Revision

- `R1`

## Last Updated

- `2026-04-01 KST`

## Last Updated By

- `MM_09_APP_PM`

## Tranche

- `T1`

## 목적

- 초기 payload에서 translation footprint를 줄여 first-screen / search / list의 공통 비용을 낮춘다.

## 범위

- base search payload는 `영어` translation만 기본 포함
- 비영어 translation은 language overlay로 분리
- runtime loader는 선택 language만 lazy load
- package/runtime bundle은 overlay payload를 함께 포함

## 제외

- search payload prefix split
- hashed payload naming
- worker parse
- list virtualization
- tree virtualization

## 영향 파일

- `09_app/scripts/runtime-search-recovery-core.mjs`
- `09_app/scripts/rebuild-canonical-runtime.mjs`
- `09_app/scripts/runtime-bundle-core.mjs`
- `09_app/scripts/package-live-payloads.mjs`
- `09_app/scripts/build-runtime-translation-overlays.mjs`
- `09_app/src/data/loaderAdapter.js`
- `09_app/src/App.jsx`
- `09_app/src/utils/translationPayloads.js`

## 구현 요약

- search/list base row는 `영어` translation만 기본 포함
- 비영어 translation은 `APP_READY_TRANSLATIONS_<lang>.json` 파일로 분리
- `APP_READY_TRANSLATION_LANGUAGES.json` manifest 추가
- selected language 변경 시 해당 overlay만 lazy fetch
- runtime payload manifest에 translation overlay 파일 포함

## 완료 기준

- base search payload translation이 영어만 남는다
- non-English language switch에서 lazy overlay가 실제로 로드된다
- local preview에서 non-English search가 유지된다
- package/runtime payload manifest에 translation overlay 파일이 포함된다

## Local Verification

- base payload 확인:
  - `요리하다(9471)`의 `translation_summary`가 영어 1개만 포함
- non-English lazy overlay 확인:
  - `일본어` 선택 후 `りょうりする` 검색 시 `요리하다` 결과 노출
- package manifest 확인:
  - translation manifest + overlay `11` entries 포함

## Before / After

- `APP_READY_SEARCH_INDEX.json`
  - before: `181,733,528 bytes`
  - after: `69,740,763 bytes`
- search payload 내부 translation 비중
  - before: 약 `63.42%`
  - after: 약 `14.45%`

## 결과 판단

- `T1` 목표 범위는 달성됐다.
- 다음 tranche는 translation split이 아니라 search payload repartition 쪽이 더 직접적이다.

## Next Unlock

- search 전용 thin payload 또는 prefix split 설계 확정

## Reference

- tasklist:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_OPTIMIZATION_TASKLIST_V1.md`
- risk note:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/reports/20260401_MM3_09_APP_PERFORMANCE_RISK_AND_ROLLBACK_NOTE_V1.md`

## Revision History

- `R1` / `2026-04-01 KST` / `MM_09_APP_PM` / tranche 1 execution packet 생성
