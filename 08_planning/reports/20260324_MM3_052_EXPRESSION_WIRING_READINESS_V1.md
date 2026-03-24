# 20260324_MM3_052_EXPRESSION_WIRING_READINESS_V1

## 목적

- `expression wiring`을 실제로 시작하기 전에 범위와 전제를 고정한다.

## 현재 사실

- 현재 앱에는 독립 `expression` 탭이 없다.
- 현재 상세 패널은 이미 `subwords`를 최소 수준으로 표시할 수 있다.
- `APP_READY_DETAIL_MAP.json`에는 `subwords`와 `related_forms`가 들어 있다.
- search index에는 `has_subwords`가 이미 들어 있다.

## PM 판단

- 다음 expression wiring은 `독립 전체 화면`이 아니라 `보조 진입 + 상세 확장`으로 시작하는 것이 맞다.

## 1차 구현 범위

- search/result에서 `has_subwords`가 있는 항목을 표현층 진입 가능 대상으로 표시
- 상세 패널에서 `subwords`를 단순 chip 수준이 아니라 목록/미리보기 수준으로 확장
- parent entry와 linked sense 관계를 상세 안에서 보여줌

## 이번 단계에서 하지 않을 것

- expression 전용 독립 top-level 화면
- expression 전용 별도 payload 분리
- expression 중심 검색 구조 재편

## 결론

- 실행 가능
- 다음 active work는 `MM3-053 Expression Wiring Implementation`
