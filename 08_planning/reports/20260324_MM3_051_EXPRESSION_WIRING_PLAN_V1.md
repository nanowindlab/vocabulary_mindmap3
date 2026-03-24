# 20260324_MM3_051_EXPRESSION_WIRING_PLAN_V1

## 목적

- 다음 구현 슬라이스로 `expression wiring` 범위와 우선순위를 정한다.

## 현재 판단

- search + facet: 닫힘
- tree shell: 1차 연결 완료
- detail panel: 1차 연결 완료
- 남은 큰 구조 슬라이스는 `expression wiring`

## 범위

포함:
- 표현층 독립 진입
- 표현층 목록/필터
- subword 중심 렌더
- parent entry / linked sense 연결

제외:
- 전체 앱 구조 재편
- 검색 구조 변경
- tree 재설계

## 우선순위

1. 표현층 진입 표면 정리
2. 표현층 전용 payload 필요성 판단
3. subword 중심 렌더와 parent/sense 연결

## Next Active Work

- `MM3-052 Expression Wiring Execution Readiness`
