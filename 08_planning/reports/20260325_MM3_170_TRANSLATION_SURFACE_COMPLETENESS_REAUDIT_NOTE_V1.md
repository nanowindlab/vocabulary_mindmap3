# 20260325_MM3_170_TRANSLATION_SURFACE_COMPLETENESS_REAUDIT_NOTE_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-25 00:10 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-170A` translation surface completeness re-audit

## Evidence

- selector option source:
  - `09_app/src/App.jsx:608`
- search result translation pick:
  - `09_app/src/components/SearchBox.jsx:4`
- detail translation pick:
  - `09_app/src/components/TermDetail.jsx:29`
- subword card translation pick:
  - `09_app/src/components/TermDetail.jsx:155`
- runtime repair whitelist:
  - `vocab_dictionary/scripts/repair_runtime_translation_payloads.py:21`
- existing residual test:
  - `09_app/tests/residual.spec.js:97`

## Findings

### 1. runtime selector는 현재 `6개` 언어만 노출 가능하다.

- runtime search index 기준:
  - `영어`
  - `몽골어`
  - `아랍어`
  - `중국어`
  - `베트남어`
  - `타이어`
- selector는 source translation store가 아니라 `searchIndex.translation_summary`를 순회해 옵션을 만든다.

### 2. source translation store는 현재 `11개` 언어를 보유한다.

- source languages:
  - `러시아어`
  - `몽골어`
  - `베트남어`
  - `스페인어`
  - `아랍어`
  - `영어`
  - `인도네시아어`
  - `일본어`
  - `중국어`
  - `타이어`
  - `프랑스어`

### 3. runtime `6개`는 repair script whitelist와 일치한다.

- repair script `TARGET_LANGUAGES`:
  - `영어`, `몽골어`, `아랍어`, `중국어`, `베트남어`, `타이어`
- 즉 source `11`개를 runtime이 그대로 노출하지 않고, whitelist된 `6`개만 유지한다.

### 4. main search/detail surface는 selected language를 현재 반영한다.

- `SearchBox`
  - preferred language -> 영어 -> 첫 항목 fallback
- `TermDetail`
  - preferred language -> 영어 -> 첫 항목 fallback
- current residual test도 베트남어 main detail case를 검증한다.

### 5. expression/subword 카드는 selected language를 아직 반영하지 않는다.

- subword card는 `firstSense.translations[0]`을 그대로 쓴다.
- live detail payload 기준, 번역이 있는 subword `2,637개`의 첫 언어는 전부 `몽골어`다.
- sample:
  - `신 -> 신이 내리다 -> 몽골어`
  - `신경 -> 신경(을) 쓰다 -> 몽골어`
  - `신경 -> 신경(을) 끊다 -> 몽골어`

## PM Interpretation

- current runtime는 `source 11개 언어` 전체를 노출하는 제품이 아니다.
- main search/detail은 selected language를 반영하지만, expression/subword는 아직 first translation 고정에 가깝다.
- 따라서 `번역 언어는 5가지만?`과 `표현 카드에서는 몽골어만 보임`은 서로 다른 residual로 다뤄야 한다.

## W2 Output

- `runtime language coverage note`
  - source `11`
  - runtime `6`
  - selector source = `searchIndex.translation_summary`
- `expression/subword residual note`
  - selected language non-reflecting
  - subword first translation fixed to Mongolian in current payload
- `test gap note`
  - main detail Vietnamese case는 있음
  - expression/subword selected language regression은 별도 없음

## Next For `R2`

- source `11` vs runtime `6`을 제품 정책으로 accept할지 결정 필요
- expression/subword 카드도 selected language를 따르도록 scope 정의 필요

## Revision History

- `R1` / `2026-03-25 00:10 KST` / `Codex PM` / translation completeness re-audit 결과를 source/runtime/subword residual 기준으로 정리
