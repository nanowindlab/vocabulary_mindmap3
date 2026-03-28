# 20260327_MM3_256_USER_REVIEW_WAVE_01_INTAKE_AND_PRACTICAL_FIX_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-27 09:58 KST`

## Last Updated By

- `Codex PM`

## Scope

- user review wave 01 intake
- immediately-fixable practical issues 반영

## Accepted Review Points

- 상단 shell이 실용성 대비 너무 많은 화면 높이를 점유한다.
- search result row에서 keyword보다 badge 정보가 먼저 공간을 먹는다.
- `기본 항목` meaning이 learner-facing으로 불명확하다.
- meaning tree의 하위 분류 count 노출은 더 내려가야 할 가치가 있다.
- situation tree의 repeated child label 패턴은 separate study가 필요하다.

## Immediate Fix Applied

- top shell / detail top-of-fold padding과 density를 한 단계 더 줄였다.
- search input width를 넓혔다.
- search result row를 `word first + badge second line`으로 바꿨다.
- default `기본 항목` badge는 row에서 제거하고 helper 설명으로만 남겼다.

## Clarification

- `기본 항목`은 current app에서 `detail panel로 바로 들어가는 기본 표제어`를 뜻한다.
- default route라서 row badge로는 noisy하다고 판단해 de-emphasize했다.

## Study Tasks Added

- `MM3-257A` meaning tree 하위 분류 count exposure study
- `MM3-258A` situation tree repeated child label redundancy study

## Current Answer

- meaning/situation/unclassified tree 자체는 `filteredList` 기준으로 rebuild되므로, 현재 표시되는 tree node count는 필터에 따라 동적으로 바뀌는 구조다.
- 다만 현재 count 노출은 scene-level 위주라 category-level count는 추가 검토가 필요하다.

## Revision History

- `R1` / `2026-03-27 09:58 KST` / `Codex PM` / user review wave 01을 intake하고 immediate practical fix와 follow-up study task를 같이 고정
