# 20260326_MM3_210_DETAIL_SENSE_EXAMPLE_RELATION_FOLLOWUP_IMPLEMENTATION_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-26 07:54 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-210` user feedback follow-up for detail `sense` / `examples` / `related forms`

## User Feedback In Scope

- `기분`에서 `의미 선택`에 따라 예문도 같이 바뀌어야 한다.
- `의미 선택` 번호는 단어별 sense 개수에 맞춰 동적으로 보여야 한다.
- `의미 관계` 탭의 related form `기분적` click이 실제 jump로 이어지지 않는 이유를 확인해야 한다.

## Findings

### 1. Sense-specific examples are already present in runtime detail data.

- `기분` (`20192`) rich chunk에는 `20192#sense-001`, `20192#sense-002` 예문이 각각 따로 들어 있다.
- 문제는 UI가 `currentSense.examples`에 generic `examples_bundle` fallback을 같이 섞어 보여 주는 구조였다.

### 2. Current runtime does not need fixed 3-digit sense numbering.

- live rich chunks 기준 최대 sense 개수는 `가다`의 `33`개였다.
- 현재 runtime에서는 `기분`처럼 `2개`면 `1, 2`, `가다`처럼 `33개`면 `01..33` 정도면 충분하다.

### 3. `기분적` jump failure is a runtime target gap, not just a click bug.

- `기분` related form payload에서 `기분적`은 `target_code: null`, `link_status: unresolved_no_target_code`다.
- live search index에는 `기분적` entry가 없다.
- 따라서 기존 UI는 click affordance를 줬지만 실제 이동할 target이 없었다.

## Implemented

### 1. Sense-linked examples for non-representative meanings

- multi-sense term에서는 selected sense가 `representative sense`일 때만 generic fallback examples를 섞는다.
- 다른 sense로 전환하면 해당 sense에 연결된 예문만 보여 준다.
- 결과적으로 `기분`의 `002`를 고르면 `연말 기분`, `잔치 기분` 같은 해당 의미 예문만 남는다.

### 2. Dynamic sense numbering

- sense id suffix를 그대로 노출하지 않고, 현재 term의 total sense count 기준으로 자리수를 계산해 표시한다.
- example:
  - `기분` `2 senses` -> `1`, `2`
  - `가다` `33 senses` -> `01`..`33`

### 3. Unresolved related forms are no longer misleadingly clickable

- related form card는 실제 runtime jump target이 있을 때만 clickable하다.
- unresolved entry는 `현재 runtime에 연결 대상이 없습니다.` 문구를 보여 준다.
- `기분적`은 현재 이 상태로 표시된다.

### 4. Regression coverage

- `기분` sense switch가 examples와 numbering에 반영되는 Playwright case를 추가했다.
- unresolved related form이 non-jumpable note를 보이는 case도 추가했다.

## Verification

- command:
  - `npm run build`
- result:
  - `passed`
- command:
  - `npx playwright test tests/residual.spec.js -g "examples prioritize TOPIK source when chunk examples are available|sense selection drives examples and uses dynamic numbering|unresolved related form stays non-jumpable and shows unavailable note"`
- result:
  - `3 passed`
- command:
  - `npx playwright test`
- result:
  - `39 passed`

## PM Verdict

- `IMPLEMENTED_PENDING_USER_CHECK`

## Remaining Open Point

- `기분적` actual jump support는 아직 live data target 부재 상태다.
- 이번 scope에서는 broken click affordance를 제거하고 runtime truth를 드러내는 수준까지 처리했다.
- 실제 target 연결을 만들려면 data-side follow-up이 별도 scope로 필요하다.

## Next Step

- user가 `기분` examples / numbering / unresolved note를 확인한다.
- actual `기분적` jump 복구가 필요하면 data-side follow-up scope를 새로 연다.

