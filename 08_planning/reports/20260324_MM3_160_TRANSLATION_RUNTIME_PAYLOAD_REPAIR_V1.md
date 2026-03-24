# 20260324_MM3_160_TRANSLATION_RUNTIME_PAYLOAD_REPAIR_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 17:35 KST`

## Last Updated By

- `Codex PM`

## Scope

- runtime translation payload repair

## Problem

- `번역 언어` selector에서 `영어`, `베트남어`를 선택해도 runtime surface에서 몽골어가 보이는 사례가 확인됐다.
- `APP_READY_SEARCH_INDEX.json` 기준:
  - `영어` `0`
  - `베트남어` `4`
  - `몽골어` `51,743`
- same runtime payload의 `def_en`도 영어가 아니라 몽골어 정의가 들어가 있었다.

## Evidence

- source translation store:
  - `vocab_dictionary/output/unified_live/kcenter_translations.json.gz`
  - `영어` `71,682`
  - `베트남어` `71,678`
- runtime before:
  - `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
  - `영어` `0`
  - `베트남어` `4`
- runtime after:
  - `영어` `51,746`
  - `베트남어` `51,745`
- 대표 sample after:
  - `요리하다`
    - 영어 `cook`
    - 베트남어 `nấu ăn, nấu nướng`
  - `역사학`
    - 영어 `history; historical studies`
    - 베트남어 `lịch sử học, ngành lịch sử`

## Applied

- source translation store를 기준으로 live runtime payload를 보정하는 repair script를 추가했다.
  - `vocab_dictionary/scripts/repair_runtime_translation_payloads.py`
- 아래 live payload를 repair했다.
  - `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`
  - `09_app/public/data/live/APP_READY_MEANING_TREE.json`
  - `09_app/public/data/live/APP_READY_SITUATION_TREE.json`
  - `09_app/public/data/live/APP_READY_UNCLASSIFIED_TREE.json`
  - `09_app/public/data/live/APP_READY_DETAIL_MAP.json`
- repair rule:
  - `translation_summary`는 source translations에서 `영어/몽골어/아랍어/중국어/베트남어/타이어`만 유지
  - `def_en`는 실제 영어 definition이 있을 때만 채움
  - 영어가 없을 때 몽골어 정의를 `def_en`에 넣지 않음
- 베트남어 selector regression test를 추가했다.

## Verification

- runtime payload counts after repair:
  - `영어` `51,746`
  - `베트남어` `51,745`
  - `몽골어` `51,743`
- `npx playwright test` `19 passed`

## PM Verdict

- `ACCEPT`

## Notes

- 앱 로직 자체보다 runtime thin payload가 source translations를 잘못 반영한 문제가 핵심이었다.
- 현재 repair는 live payload 직접 보정 방식이다.
- `APP_READY_SEARCH_INDEX`를 생성하는 canonical thin-index generator 경로는 repo 안에서 즉시 드러나지 않아, 이번 턴에서는 runtime repair를 우선 적용했다.

## Revision History

- `R1` / `2026-03-24 17:35 KST` / `Codex PM` / 영어/베트남어 translation runtime payload repair와 검증 결과를 최초 기록
