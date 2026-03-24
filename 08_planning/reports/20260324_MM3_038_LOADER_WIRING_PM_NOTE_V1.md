# 20260324_MM3_038_LOADER_WIRING_PM_NOTE_V1

## Scope

- `MM3-038 Consumer Loader Wiring Verification`

## PM Summary

- `thin index`와 `facet payload`는 생성되었지만 현재 consumer는 아직 기존 `APP_READY_*` 표면만 읽는다.
- 따라서 현재 상태는 `artifact ready, consumer not wired`다.

## PM Verdict

- `ACCEPT`

## PM Interpretation

- 다음 단계는 즉시 wiring 구현보다 `consumer target contract`를 먼저 고정하는 것이 더 안전하다.
- 이유:
  - 현재 앱 shell은 MM2 기반 3축/기존 search index 관성을 강하게 가진다.
  - 새 payload는 `thin index + facet payload` 중심이다.
  - 두 구조를 바로 잇기보다, 어느 화면이 어떤 payload를 소비할지 먼저 정리해야 구현 범위가 불필요하게 커지지 않는다.

## Next Active Work

- `MM3-039 Consumer Target Contract`
