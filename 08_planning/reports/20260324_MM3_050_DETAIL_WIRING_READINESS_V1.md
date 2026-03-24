# 20260324_MM3_050_DETAIL_WIRING_READINESS_V1

## 목적

- detail wiring을 실제로 시작하기 전에 필요한 준비 상태를 정리한다.

## 실행 전 확인 항목

- `entry-id`를 기준으로 상세 원본을 안정적으로 찾을 수 있어야 한다.
- `kcenter_base.json` 또는 동등한 detail source를 consumer가 읽을 수 있어야 한다.
- 현재 `TermDetail`가 요구하는 필드와 MM3 detail source 간 차이를 정리해야 한다.
- `chunk_id = null` 상태를 전제로 기존 chunk loader에 의존하지 않는다는 점이 문서상 명확해야 한다.

## 필요한 입력

- `MM3-049_DETAIL_WIRING_PLAN_V1.md`
- `MM3-010_RUNTIME_CONTRACT_PACKAGE_V1.md`
- `09_app/src/components/TermDetail.jsx`
- `09_app/src/App.jsx`
- `09_app/src/data/loaderAdapter.js`
- `vocab_dictionary/output/unified_live/kcenter_base.json`

## 실행 가능 기준

- `entry-id` 기반 로더 방향이 문서상 확정되어 있다.
- detail source와 UI 요구 필드 차이가 파악되어 있다.
- 범위를 detail panel에만 한정할 수 있다.

## 보류 기준

- tree/search/facet까지 같이 건드려야 하는 전제가 생기면 보류
- expression 전용 화면까지 같이 열려야 하면 보류
- detail source 선택이 불명확하면 보류

## 다음 Active Work

- `MM3-051 Detail Wiring Implementation`
