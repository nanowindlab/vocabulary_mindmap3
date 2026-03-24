# 20260324_MM3_162_MOTION_HUMAN_CHECK_PACKET_V1

## Current Revision

- `R1`

## Last Updated

- `2026-03-24 20:35 KST`

## Last Updated By

- `Codex PM`

## 목적

- `MM3-159`의 optional human eye re-check를 실제로 바로 수행할 수 있게 최소 packet을 정리한다.

## Session Format

- 형태: `short guided visual check`
- 권장 인원: `1명`
- 권장 시간: `3~5분`
- 환경:
  - `http://127.0.0.1:5173/`
  - 최신 live payload 반영 상태

## Check Path

1. 앱 첫 진입 후 기본 `의미 범주` 화면에서 마인드맵이 초기 fit 이후 빠르게 계속 흔들리는지 본다.
2. canvas의 첫 category를 열어 term node가 확장된 뒤 `5초` 정도 본다.
3. 검색으로 `가게`를 찾고, 상세 진입 뒤 마인드맵 선택 상태가 안정적인지 본다.
4. 상세를 `닫기`한 뒤 마인드맵 위치와 선택감이 급격히 깨지지 않는지 본다.
5. 필요하면 `물가` 또는 `보다`도 같은 방식으로 한 번 더 본다.

## Observe

- node가 자리를 못 잡고 계속 빠르게 떨리는가
- category expansion 직후 `1~2초` 이후에도 큰 이동이 계속되는가
- search / detail / close 이후 마인드맵 위치가 갑자기 튀는가
- learner가 `지금 보기 어렵다`고 느낄 정도의 시각 피로가 있는가

## Record Format

- path
- observed issue
- severity
- blocking 여부
- screenshot 필요 여부

## PM Rule

- 이번 human check는 `layout taste`가 아니라 `보기가 어려운 수준의 지속 motion`만 본다.
- 단발성 작은 흔들림은 기록하되, `blocking` 판정과 분리한다.

## Next Decision

- `blocking 없음`:
  - `MM3-159` close
  - pilot scheduling / execution 재오픈 검토
- `blocking 있음`:
  - motion follow-up implementation tranche 재오픈

## Revision History

- `R1` / `2026-03-24 20:35 KST` / `Codex PM` / motion human check 전용 packet을 최초 작성
