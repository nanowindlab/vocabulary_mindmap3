# 20260324_MM3_034_THIN_FACET_TARGET_CONTRACT_V1

## 목적

- `031`에서 실패한 runtime reflection을 다시 닫기 위해, 우선 필요한 runtime 표면을 최소한으로 고정한다.

## Target 1. Thin Index

### 역할

- 홈과 결과를 위한 최소 projection 표면

### 필수 필드

- `entry.id`
- `entry.word`
- `entry.pos`
- `entry.word_grade`
- `entry.categories` 요약
- `sense_count`
- `has_subwords`
- `has_related_forms`
- 대표 `sense.id`
- 대표 `sense.definition`
- 대표 `sense.translation` 요약

### 비포함

- 전체 `examples`
- 전체 `related_terms`
- 전체 `related_forms` 본문
- 전체 `subwords`
- 전체 `translations` 배열

## Target 2. Facet Payload

### 역할

- 필터 바를 위한 독립 상태/옵션 표면

### 필수 필드

- `학습난이도` 옵션 집합
- `TOPIK` 옵션 집합
- `품사` 옵션 집합
- `외국어 종류` 옵션 집합
- 각 facet의 현재 선택 상태
- 필요 시 집계값

### 원칙

- dictionary 본문 payload와 섞지 않는다.
- `filters`를 entry/sense 구조 안에 억지로 넣지 않는다.

## Reflection 재시도 최소 조건

1. `thin index`가 실제로 별도 표면으로 존재하는가
2. `facet payload`가 실제로 별도 표면으로 존재하는가
3. 홈/결과가 `thin index`만으로 닫히는가
4. 필터 바가 `facet payload`만으로 닫히는가

## 후순위

- `detail payload`
- `expression payload`

이 둘은 위 4개가 닫힌 뒤에만 본다.

