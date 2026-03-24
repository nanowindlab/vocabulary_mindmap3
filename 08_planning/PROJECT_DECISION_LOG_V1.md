# PROJECT_DECISION_LOG_V1

## D-001

- Date: `2026-03-23`
- Decision: `vocab_dictionary/output/unified_live/kcenter_base.json.gz`를 `mindmap3`의 단일 사전 SSOT로 사용한다.
- Why: `mindmap2`는 learner-facing projection이며 source coverage가 낮고, `mindmap3`는 unified dictionary structure를 이미 확보했다.

## D-002

- Date: `2026-03-23`
- Decision: `vocabulary_mindmap2`와 `digital_grammer_dict`는 read-only reference로만 사용한다.
- Why: 사용자 제약과 source governance를 명확히 유지하기 위함이다.

## D-003

- Date: `2026-03-23`
- Decision: `mindmap2`에서 가져오는 데이터는 TOPIK stats 계층(`frequency`, `rank`, `round_count`, `band`, `level`)만으로 제한한다.
- Why: learner progression signal은 재사용하되, taxonomy와 dictionary payload는 `mindmap3` 기준으로 재설계해야 한다.

## D-004

- Date: `2026-03-23`
- Decision: 초기 frontend shell은 `mindmap2/09_app`를 기준으로 이식한다.
- Why: 사용자 요구가 “UI/layout 거의 동일”이므로 빠른 baseline 확보가 우선이다.

## D-005

- Date: `2026-03-23`
- Decision: `mindmap3` runtime은 `entry/sense/subword` richer structure를 잃지 않는 thin projection + chunk detail 구조로 설계한다.
- Why: `mindmap2`의 search index 중심 설계는 가볍지만 dictionary richness를 충분히 싣지 못한다.

## D-006

- Date: `2026-03-23`
- Decision: `entry_count` drift (`53,480` vs `53,439`)는 unresolved risk로 기록하고 runtime build 전 reconciliation task를 필수 게이트로 둔다.
- Why: summary 문서와 artifact가 불일치한 상태에서 downstream count를 고정하면 오류가 누적된다.

## D-007

- Date: `2026-03-23`
- Decision: 현재 phase의 active work는 `프로젝트 운영 체계`와 `문서 체계` 설정으로 제한한다.
- Why: 사용자 지시가 구현보다 PM 운영 기반 정리를 우선 요구하기 때문이다.

## D-008

- Date: `2026-03-23`
- Decision: 스크립트, runtime build, UI 수정은 `parked backlog`로 내리고 별도 승인 전까지 active execution으로 취급하지 않는다.
- Why: current scope를 문서/운영으로 명확히 제한해 drift를 방지하기 위함이다.

## D-009

- Date: `2026-03-23`
- Decision: 운영 강도는 `엄격`으로 고정한다.
- Why: 상태 문서와 구현 흔적이 뒤섞이면 다음 스레드에서 authority drift가 발생하기 쉽기 때문이다.

## D-010

- Date: `2026-03-23`
- Decision: planning 순서는 `문서 구조 기초 고정 -> source schema/data structure review -> scenario 작성`으로 고정한다.
- Why: source 구조를 보기 전에 scenario를 먼저 닫으면 taxonomy와 payload contract가 쉽게 다시 흔들린다.

## D-011

- Date: `2026-03-23`
- Decision: 서브 에이전트 운영은 사용자가 agent별 별도 채팅을 열지 않고, Main PM가 이 스레드에서 직접 dispatch / review / integrate 하는 방식으로 진행한다.
- Why: 사용자를 relay 역할에서 빼고, project-local orchestration 문서가 thread-independent 상태를 유지하게 하기 위함이다.

## D-012

- Date: `2026-03-23`
- Decision: `DATA_VALIDATION_AGENT`는 별도 planning agent가 아니라 `증거 검증 게이트` agent로 정의한다.
- Why: data validation은 count, schema completeness, artifact consistency를 검증하는 일이고, planning 결정을 지지하는 evidence layer이기 때문이다.

## D-013

- Date: `2026-03-23`
- Decision: 새 agent dispatch 전에는 Main PM가 사용자에게 먼저 요약 보고와 관련 workboard 링크를 제공하고 승인받는다. agent 보고가 올라오면 다음 단계 전에도 보고서 링크와 요약 보고 후 승인받는다.
- Why: 자율 오케스트레이션을 유지하되, 사용자 승인 게이트와 traceability를 함께 확보하기 위함이다.

## D-014

- Date: `2026-03-23`
- Decision: `MM3-002 source schema / data structure review package`는 accepted input package로 확정하고, 다음 active work를 `MM3-003 scenario authoring package`로 전환한다.
- Why: source review, review verdict, data validation verdict이 모두 artifact-backed로 수렴했기 때문이다.

## D-015

- Date: `2026-03-23`
- Decision: 에이전트 업무지시, workboard, 보고서는 한국어를 기본 언어로 사용한다.
- Why: PM 운영과 사용자 승인 흐름을 한국어 기준으로 일관되게 유지하기 위함이다.

## D-016

- Date: `2026-03-23`
- Decision: `mindmap2`의 `related_vocab`, `crosslink` 개념은 `mindmap3` taxonomy의 기본 구조로 재사용하지 않는다.
- Why: `mindmap3` taxonomy는 `mindmap3` SSOT 구조에서 다시 추출해야 하며, MM2 개념을 가져오면 source-driven 설계가 훼손될 수 있기 때문이다.

## D-017

- Date: `2026-03-23`
- Decision: taxonomy의 목적은 단순 단어장 분류가 아니라 학습자의 시선, 흐름, 경험을 이끄는 학습 구조를 만드는 것이다.
- Why: 제품 방향이 learner journey 중심이어야 하고, source 구조도 그 관점에서 재해석되어야 하기 때문이다.

## D-018

- Date: `2026-03-23`
- Decision: `3축` 여부는 선결정하지 않고, source 구조를 충분히 본 뒤 상위 구조를 판정한다.
- Why: 현재는 `3축`이 MM2 유산일 뿐이며, MM3 source가 실제로 어떤 상위 학습 구조를 지지하는지 먼저 검토해야 하기 때문이다.

## D-019

- Date: `2026-03-23`
- Decision: 모든 에이전트는 기본적으로 `작업 -> 검증 -> learner 포함 3인 전문가 비판 검토 -> 개선 -> 재검증` 프로세스를 따른다.
- Why: 초안 수준 결과를 그대로 채택하지 않고, learner experience와 correctness, product flow를 함께 검토하기 위함이다.

## D-020

- Date: `2026-03-23`
- Decision: Main PM는 단순 관리자 역할을 넘어서 프로젝트 방향에 대한 건설적 비판을 냉정하게 유지한다.
- Why: 보고서 정리만으로는 방향 오류를 막을 수 없고, PM가 적극적으로 약한 논리와 빈약한 근거를 걸러내야 하기 때문이다.

## D-021

- Date: `2026-03-23`
- Decision: raw 결정 질문을 다시 사용자에게 그대로 던지지 않고, PM가 구조 후보 비교안으로 압축해 제시한다.
- Why: 질문 나열보다 후보, 근거, tradeoff, 추천안을 함께 제시하는 편이 실제 의사결정에 유용하기 때문이다.

## D-022

- Date: `2026-03-23`
- Decision: 현재 provisional recommendation은 `word-first + dual category + sense core`다.
- Why: lookup 친화성, 공식 범주 구조 활용, sense 중심 의미 분해를 동시에 살릴 수 있기 때문이다.

## D-023

- Date: `2026-03-23`
- Decision: `MM3 source는 단일 트리보다 다중 진입점 + 다층 레이어 + orthogonal filter`에 가깝다는 해석을 현재 핵심 방향으로 둔다.
- Why: source 구조와 learner journey를 함께 설명하는 가장 강한 해석이기 때문이다.

## D-024

- Date: `2026-03-23`
- Decision: 다음 단계는 후보 A(`word-first + dual category + sense core`)를 실제 시나리오와 진입점/레이어 설계에 적용해보는 것이다.
- Why: 추상 비교를 넘어서 실제 구조안으로 검증해야 이후 재검토도 가능하기 때문이다.

## D-025

- Date: `2026-03-23`
- Decision: `MM3-005 scenario rewrite`는 accept하고, 다음 active work를 `MM3-006 stale historical summary handling policy`로 전환한다.
- Why: 구조 방향과 노출 강도 조정이 현재 phase 목적에 필요한 수준까지 정리되었기 때문이다.

## D-026

- Date: `2026-03-23`
- Decision: `53,439`는 historical seed-stage count로, current canonical count는 `53,480`로 본다. stale summary 문서는 deprecated note를 달아 유지한다.
- Why: drift 원인은 merge 단계에서 API-only entry `41`개가 추가 생성된 것이며, current artifact truth는 merged outputs에 있기 때문이다.

## D-027

- Date: `2026-03-23`
- Decision: implementation gate는 현재 `CLOSED`로 유지한다.
- Why: source truth, 구조 방향, scenario 구조안은 닫혔지만, 화면 단위 IA, runtime contract, acceptance surface가 아직 없기 때문이다.

## D-028

- Date: `2026-03-23`
- Decision: merged-artifact 기준 fresh summary rewrite는 현재 시점에는 defer한다.
- Why: stale note와 정책 문서만으로 현재 혼동을 통제할 수 있고, 지금은 IA와 runtime contract를 닫는 일이 더 우선이기 때문이다.

## D-029

- Date: `2026-03-23`
- Decision: `MM3-010 runtime contract package`는 accept하고, 다음 active work를 `MM3-011 implementation acceptance checklist`로 전환한다.
- Why: runtime contract는 usable 수준이며, 남은 보강 포인트는 acceptance checklist와 refinement note에서 다루는 편이 효율적이기 때문이다.

## D-030

- Date: `2026-03-23`
- Decision: 사용자가 별도 승인 없이 계속 진행하라고 명시한 범위에서는 PM가 다음 단계를 연속적으로 진행한다.
- Why: 반복 승인 요청으로 흐름이 끊기지 않게 하면서도, 중요한 범위 변경이나 고비용 작업에서만 다시 사용자 보고를 올리기 위함이다.

## D-031

- Date: `2026-03-23`
- Decision: 사용자 승인 없이 진행 가능한 단계는 PM 권한으로 바로 승인하고 다음 단계로 넘긴다. 다만 PM는 승인 필요 여부를 보수적으로 먼저 판단한다.
- Why: 흐름은 유지하되, 승인 게이트가 필요한 단계와 아닌 단계를 PM가 책임지고 구분해야 하기 때문이다.

## D-032

- Date: `2026-03-23`
- Decision: subagent notification이 오면 사용자의 별도 `보고서 확인` 메시지를 기다리지 않고 PM가 즉시 읽고 다음 단계로 연결한다.
- Why: 에이전트 오케스트레이션에서 불필요한 대기 시간을 줄이고 문서 기반 흐름을 유지하기 위함이다.

## D-033

- Date: `2026-03-23`
- Decision: 각 단계가 끝나면 PM가 먼저 보고서를 검토하고, 사용자 승인 불필요 범위면 PM 권한으로 다음 단계 진입 또는 재작업을 결정한다. 사용자 승인 필요 단계에서만 보고 후 대기한다.
- Why: 승인 게이트를 필요한 곳에만 남기고, 나머지 문서/검토/정리 단계는 PM가 끊김 없이 진행하기 위함이다.

## D-034

- Date: `2026-03-24`
- Decision: 다음 단계가 예측 가능하면 인접 단계를 하나의 workflow로 묶어 PM가 연속 진행한다.
- Why: 매 단계마다 흐름을 끊지 않고, 승인 필요 지점에서만 멈추는 편이 더 세심하면서도 효율적이기 때문이다.

## D-035

- Date: `2026-03-24`
- Decision: 앱 runtime payload와 내부 SSOT는 현재 JSON 유지로 간다. SQL은 내부 검증/운영 보조층으로만 검토한다.
- Why: 현재 구조와 산출물 체계가 JSON 중심으로 이미 정렬되어 있고, 앱 소비 표면도 분리 JSON payload로 가는 편이 운영과 구현 양쪽에서 가장 안정적이기 때문이다.

## D-036

- Date: `2026-03-24`
- Decision: search + facet wiring은 실제 앱 shell에 최소 범위로 먼저 연결하고, tree/detail/expression의 full wiring은 후속 단계로 미룬다.
- Why: 범위를 줄인 채 실제 소비 경로를 먼저 여는 것이 더 세심하면서도 효율적이기 때문이다.

## D-037

- Date: `2026-03-24`
- Decision: 현재 단계에서 consumer smoke는 닫고, browser smoke는 별도 하네스 또는 수동 QA 경로 판단 단계로 분리한다.
- Why: build와 data endpoint 수준의 smoke는 닫혔지만, 브라우저 런타임 전체 스모크는 현재 환경에서 자동으로 안정적으로 닫히지 않기 때문이다.

## D-029

- Date: `2026-03-23`
- Decision: `MM3-009 IA package`는 accept하고, 다음 active work를 `MM3-010 runtime contract package`로 전환한다.
- Why: 화면 단위 구조는 충분히 정리되었고, 다음 구현 gate 입력은 runtime contract이기 때문이다.

## D-029

- Date: `2026-03-23`
- Decision: 방향, 정책, 구조, gate를 바꾸는 중요한 단계는 review agent를 기본 경로로 한 번 더 거친다.
- Why: 제3의 시각을 통해 논리 빈틈과 과도한 단순화를 줄이되, low-risk housekeeping까지 모두 review로 느리게 만들 필요는 없기 때문이다.

## D-038

- Date: `2026-03-24`
- Decision: detail / expression refinement는 새 top-level surface를 추가하지 않고, 기존 detail panel에서 `의미 관계어`, `관련형`, `subword`를 탐색 가능한 관계 레이어로 다듬는 방식으로 진행한다.
- Why: 현재 단계에서 learner flow 마찰을 줄이는 가장 작은 변경은 relation click-through를 여는 것이며, 새 payload나 새 화면을 여는 것보다 효율적이기 때문이다.

## D-039

- Date: `2026-03-24`
- Decision: refinement 이후 core explorer slice는 `OPEN`, 전체 프로젝트 gate는 `PARTIAL_OPEN`으로 본다.
- Why: search, facet, tree, detail, expression 보조 진입과 relation jump까지 현재 core path는 닫혔지만, learner flow 전체 QA와 broader interaction coverage는 아직 남아 있기 때문이다.

## D-040

- Date: `2026-03-24`
- Decision: core learner flow QA는 `검색 -> 관계 점프`, `검색 -> 표현층`, `tree -> 상세`, `필터 반영` 순으로 좁은 경로부터 닫는다.
- Why: current runtime은 이미 core explorer 수준까지 열려 있으므로, 다음 단계는 넓은 회귀보다 실제 learner path를 반복 가능한 작은 경로 세트로 먼저 검증하는 편이 효율적이기 때문이다.

## D-041

- Date: `2026-03-24`
- Decision: core learner flow QA는 우선 browser harness 중심으로 실행하고, 자동화가 불안정한 흐름만 별도 수동 QA 후보로 분리한다.
- Why: 현재 Playwright harness가 이미 core smoke를 닫고 있으므로, 같은 기반에서 좁은 learner path를 추가 검증하는 것이 가장 효율적이기 때문이다.

## D-042

- Date: `2026-03-24`
- Decision: core learner flow QA가 닫힌 이후 다음 QA slice는 scenario-level breadth planning으로 옮긴다.
- Why: relation, expression preview, tree select, filter reflection의 core path는 automation으로 닫혔고, 이제는 더 넓은 learner scenario 묶음을 별도 계획으로 다루는 편이 맞기 때문이다.

## D-043

- Date: `2026-03-24`
- Decision: scenario-level automation은 `word-first`, `situation-first`, `expression-assist`, `filter-first` representative subset만 먼저 닫고, tree category-first 정밀 경로는 residual/manual candidate로 남긴다.
- Why: 현재 제품 구조에서 안정적으로 반복 가능한 automation 경로를 먼저 확보하는 편이 효율적이며, situation tree의 더 정밀한 category-first 경로는 별도 수동 후보로 분리하는 것이 맞기 때문이다.

## D-044

- Date: `2026-03-24`
- Decision: scenario-level QA 이후 다음 단계는 residual/manual candidate를 readiness 수준으로 내리는 것이다.
- Why: 현재 automated subset는 닫혔고, 남은 경로는 구조 변경보다 manual/semi-automated QA 준비의 문제이기 때문이다.

## D-045

- Date: `2026-03-24`
- Decision: runtime QA wave는 closeout하고, 다음 active work는 `situation tree category-first` 정밀 path를 보강할지 여부를 결정하는 것이다.
- Why: core, scenario, residual semi-automated QA가 모두 닫혔고, 남은 핵심 tail은 situation tree 정밀 path에 대한 UX/interaction decision으로 수렴했기 때문이다.

## D-046

- Date: `2026-03-24`
- Decision: `situation tree category-first precision path`는 현재 단계에서 defer하고, list-first situation flow를 supported path로 accept한다.
- Why: current product의 기본 진입은 search-first이며, situation flow도 list-first 경로로 QA가 닫혔다. 남은 정밀 path는 결함보다 향후 UX 고도화 성격이 강하기 때문이다.

## D-047

- Date: `2026-03-24`
- Decision: runtime QA wave 이후 다음 우선 슬라이스는 `translation surface policy`로 둔다.
- Why: 번역 정보는 현재 learner-facing 밀도가 높고, 기본 1개 언어 중심 노출로 줄이는 정책은 구조를 흔들지 않으면서 제품 효율을 크게 높일 수 있기 때문이다.

## D-048

- Date: `2026-03-24`
- Decision: translation surface tranche 이후 다음 슬라이스는 `detail / expression micro-polish`로 둔다.
- Why: translation 정보 밀도는 낮췄고, 남은 즉시 개선 여지는 detail panel과 expression card의 시각 위계/가독성 조정에 있기 때문이다.

## D-049

- Date: `2026-03-24`
- Decision: detail / expression micro-polish tranche 이후 다음 단계는 `learner locale / translation default`에 대한 사용자 결정을 받는 것이다.
- Why: current app은 source-first representative translation으로 안정화됐지만, 대표 번역 언어를 locale-aware로 바꿀지 여부는 제품 방향에 직접 영향이 있어 사용자 판단이 필요한 영역이기 때문이다.

## D-050

- Date: `2026-03-24`
- Decision: 사용자 결정에 따라 대표 번역 기본 언어는 `영어 우선, 없으면 source-first fallback`으로 둔다. locale-aware 시스템은 도입하지 않는다.
- Why: 영어를 기본으로 두되 동적 locale 체계까지는 열지 않고, 현재 구조와 데이터 현실 안에서 가장 단순하고 일관된 정책이기 때문이다.

## D-051

- Date: `2026-03-24`
- Decision: compact translation summary enrichment는 현재 `DEFER`한다.
- Why: detail 기준 영어 translation 존재 entry가 `2개`뿐이고 compact summary에서 누락된 것도 동일한 `2개`라서, builder 변경 비용 대비 가치가 낮기 때문이다.

## D-052

- Date: `2026-03-24`
- Decision: 현재 MM3 explorer는 `PILOT_READY_WITH_LIMITS`로 본다.
- Why: core, scenario, residual semi-automated QA가 닫혔고 browser harness `9 tests passed` 상태이지만, holdout 몇 개가 남아 있어 broader release보다는 internal pilot/demo 수준으로 보는 편이 맞기 때문이다.

## D-053

- Date: `2026-03-24`
- Decision: internal pilot checklist와 feedback intake protocol까지 PM 문서로 정리하고, 실제 human pilot session 여부는 사용자/운영 판단 경계로 둔다.
- Why: 여기서부터는 코드/문서 작업이 아니라 실제 사람을 대상으로 pilot를 실행할지의 운영 결정이기 때문이다.

## D-054

- Date: `2026-03-24`
- Decision: pilot feedback Cluster A는 `runtime sync / navigation bug` tranche로 먼저 닫는다.
- Why: 검색 -> 마인드맵 연동 끊김, 엔터 미동작, 닫기 후 sync 불안정은 learner journey 전체를 깨는 상위 우선순위 이슈이기 때문이다.

## D-055

- Date: `2026-03-24`
- Decision: Cluster A를 닫은 이후 다음 tranche는 `detail IA redesign`로 둔다.
- Why: pilot feedback의 다음 반복 pain point가 `정의 & 연관` 과밀, 많은 sense, 표현층 설명 부족으로 수렴했기 때문이다.

## D-056

- Date: `2026-03-24`
- Decision: detail IA redesign tranche 이후 다음 작업은 `filter role clarification`으로 둔다.
- Why: detail overload를 줄인 뒤, pilot feedback에서 반복된 다음 혼란은 `레벨별`과 `난이도` 필터의 역할 충돌이기 때문이다.

## D-057

- Date: `2026-03-24`
- Decision: source-native 우선 원칙에 따라 `난이도`는 유지하고, derived `level`은 제거한다.
- Why: `word_grade`는 사전 source-native 신호이고 `level`은 linkage projection이므로, 둘이 같이 보이면 learner에게 중복/혼란을 만든다.

## D-058

- Date: `2026-03-24`
- Decision: filter role clarification tranche 이후 다음 작업은 `card learning policy`로 둔다.
- Why: pilot feedback에서 카드 학습을 본앱에 둘지 별도 학습 앱으로 분리할지 정책 판단이 필요하다는 신호가 분명히 나왔기 때문이다.

## D-059

- Date: `2026-03-24`
- Decision: current main explorer에서는 `카드 학습`을 primary CTA로 비노출하고, separate learning app candidate로 둔다.
- Why: main explorer의 본체 가치가 우선이며, pilot feedback 기준 카드 학습은 separate app 후보로 다루는 편이 제품 정책상 더 적절하기 때문이다.

## D-060

- Date: `2026-03-24`
- Decision: card learning policy tranche 이후 다음 작업은 `misclassified / none scenario`로 둔다.
- Why: pilot feedback에서 남은 다음 큰 혼란은 `미분류`와 `주제 및 상황 > 없음` 구조에 대한 시나리오 부재이기 때문이다.

## D-061

- Date: `2026-03-24`
- Decision: `미분류`는 learner-facing으로 `학습난이도/품사 보조 정렬`, `주제 및 상황 > 없음`은 `상황 미지정`으로 설명한다.
- Why: payload를 바꾸지 않고도 현재 구조의 의미를 더 분명히 설명할 수 있고, pilot feedback의 혼란을 가장 작은 변경으로 줄일 수 있기 때문이다.

## D-062

- Date: `2026-03-24`
- Decision: misclassified/none scenario tranche 이후 다음 작업은 `data / dedup cleanup`으로 둔다.
- Why: 남은 pilot feedback에서 반복되는 다음 pain point는 의미 관계어/관련형/검색 결과의 중복과 정규화 문제이기 때문이다.

## D-063

- Date: `2026-03-24`
- Decision: data/dedup cleanup은 actual homograph 제거가 아니라 `display-level disambiguation + exact duplicate collapse`부터 적용한다.
- Why: `물가`, `보다`, `가다` 같은 사례는 실제로 다른 의미/품사 항목이어서 제거 대상이 아니며, 먼저 사용자 혼란을 줄이는 표시 정규화가 맞기 때문이다.

## D-064

- Date: `2026-03-24`
- Decision: explanation/copy clarification과 cross-link surface policy를 작은 follow-up tranche로 함께 닫는다.
- Why: pilot feedback의 남은 설명/노이즈 문제는 payload 변경 없이 문구와 노출 정책만으로 바로 줄일 수 있기 때문이다.

## D-065

- Date: `2026-03-24`
- Decision: 다음 tranche는 `payload-level dedup decision`으로 둔다.
- Why: display-level dedup은 닫혔고, 이제 unresolved duplicate metadata를 실제 payload/builder 단계까지 정리할지 판단해야 하기 때문이다.

## D-066

- Date: `2026-03-24`
- Decision: payload-level dedup은 현재 `DEFER`한다.
- Why: exact duplicate payload는 매우 적고, 대부분은 actual homograph/품사 차이이므로 대규모 payload dedup은 source fidelity를 훼손할 위험이 더 크기 때문이다.

## D-067

- Date: `2026-03-24`
- Decision: pilot feedback wave를 closeout하고 다음 작업은 `main explorer readiness recheck`로 둔다.
- Why: major pilot findings는 이미 반영됐고, 현재 상태를 다시 평가해 다음 상위 단계로 갈지 판단할 시점이기 때문이다.

## D-068

- Date: `2026-03-24`
- Decision: main explorer는 `internal use` 수준으로는 ready로 본다.
- Why: pilot feedback 기반 major UX/bug/policy cluster가 반영됐고 browser regression `13 passed` 기준으로 core explorer 품질이 충분히 안정화됐기 때문이다.

## D-069

- Date: `2026-03-24`
- Decision: 다음 작업은 `internal use / launch boundary` 정리로 둔다.
- Why: main explorer는 internal use 수준으로는 충분히 준비됐고, 이제 broader launch readiness와의 경계를 명확히 할 필요가 있기 때문이다.

## D-070

- Date: `2026-03-24`
- Decision: current main explorer는 `internal use`로 유지하고, broader launch readiness는 별도 tranche로 defer한다.
- Why: internal use 기준 품질은 충분하지만, broader launch는 운영/지원/외부 사용자 대응 기준을 별도로 더 갖춰야 하기 때문이다.

## D-071

- Date: `2026-03-24`
- Decision: translation surface follow-up에서 `외국어` 필터는 `번역 언어` display selector로 전환하고, `전체 번역 보기`는 제거한다.
- Why: 사용자는 동시에 여러 번역을 보는 것보다 하나의 대표 번역만 보길 원했고, result filtering보다 display control이 더 제품 의도에 맞기 때문이다.

## D-072

- Date: `2026-03-24`
- Decision: 다음 tranche는 `relation disambiguation`으로 둔다.
- Why: raw feedback audit에서 남은 핵심 confusion은 `(가 보라)`와 `파생어`처럼 같은 표면형으로 보이지만 의미가 다른 관계를 어떻게 learner에게 구분시킬지에 있기 때문이다.

## D-073

- Date: `2026-03-24`
- Decision: relation disambiguation은 관계 label에 target `품사 + 뜻 구분자`를 붙이는 방식으로 해결한다.
- Why: payload를 바꾸지 않고도 learner가 같은 표면형 target의 차이를 이해할 수 있게 만드는 가장 작은 변경이기 때문이다.

## D-074

- Date: `2026-03-24`
- Decision: 다음 active work는 raw feedback coverage에서 여전히 partial/open인 항목의 우선순위를 다시 잡는 것이다.
- Why: relation disambiguation까지 닫힌 뒤에는 남은 holdout을 다시 정렬해야 전체 완성도 개선 순서를 유지할 수 있기 때문이다.

## D-075

- Date: `2026-03-24`
- Decision: 현재 스레드는 handoff 시점으로 보고, 새 스레드 PM에게 넘길 packet과 copy-paste message를 canonical로 남긴다.
- Why: context window가 커졌고, 다음 PM가 문서만 읽고 바로 이어갈 수 있어야 하기 때문이다.

## D-076

- Date: `2026-03-24`
- Decision: `주제 및 상황 > 없음`은 learner-facing으로 `특정 장면에 묶이지 않는 일반 어휘`, `미분류`는 `main taxonomy 바깥 fallback 영역`으로 분리 해석한다.
- Why: runtime 기준 `주제 및 상황 > 없음 > 없음` `4,956건`은 대부분 의미 범주를 가진 일반 어휘이고, `미분류` `8,506건`은 문법/기능형과 기타 미기재 어휘가 함께 섞여 있어 같은 시나리오로 설명하면 오히려 혼란이 커지기 때문이다.

## D-077

- Date: `2026-03-24`
- Decision: `MM3-154` 이후 follow-up은 payload re-bucketing이 아니라 learner-facing path/copy/helper를 최소 UI 변경으로 연결하는 tranche로 둔다.
- Why: raw feedback의 핵심 pain point는 구조 해석 혼란이고, 현재 데이터는 그 차이를 설명할 근거가 충분하므로 먼저 copy/path를 고정하는 편이 완성도 개선 우선 원칙에 맞기 때문이다.

## D-078

- Date: `2026-03-24`
- Decision: `MM3-156`에서는 `주제 및 상황 > 없음 > 없음`을 `주제 및 상황 > 상황 미지정 > 일반 어휘`로, `미분류` root를 `분류 밖 항목`으로 learner-facing 재표현한다.
- Why: payload 재구성 없이도 raw feedback의 핵심 혼란을 줄일 수 있고, search/tree/detail이 같은 해석을 쓰도록 공용 display normalization으로 묶는 편이 drift를 줄이기 때문이다.

## D-079

- Date: `2026-03-24`
- Decision: `MM3-156` 이후 다음 active work는 `표현층 별도 활용 시나리오`로 둔다.
- Why: raw feedback holdout 중 `F-030`, `F-031`은 닫혔고, 남은 learner-facing 큰 구조 과제는 `F-027` 표현층 활용 시나리오이기 때문이다.

## D-080

- Date: `2026-03-24`
- Decision: `표현층` follow-up은 `search/list signal -> core helper -> expression tab -> jumpable/preview-only branch` 파이프라인으로 설계하고, 표현층은 여전히 `상세의 2차 보조 레이어`로 둔다.
- Why: raw feedback의 핵심은 표현층 부재가 아니라 표현층 사용 시나리오 부재이며, 별도 top-level surface를 여는 것보다 기존 detail flow 안에서 entry/branch를 명확히 하는 편이 더 작은 변경으로 learner 이해를 높이기 때문이다.

## D-081

- Date: `2026-03-24`
- Decision: `jumpable` 표현과 `preview-only` 표현은 서로 다른 학습 branch로 분리 노출한다.
- Why: 두 유형은 learner가 취해야 할 다음 행동이 다르므로, 같은 카드군으로 섞어 두면 오히려 `표현층을 어떻게 써야 하는지`가 다시 흐려지기 때문이다.

## D-082

- Date: `2026-03-24`
- Decision: `F-027`을 닫은 뒤 다음 active work는 `motion / mindmap human re-check`로 넘긴다.
- Why: 남은 큰 raw feedback holdout은 이제 `F-005`뿐이고, launch readiness보다 완성도 개선 우선 원칙상 마지막 시각 안정성 확인을 먼저 닫는 것이 맞기 때문이다.

## D-083

- Date: `2026-03-24`
- Decision: runtime translation surface에서 `def_en`는 실제 영어 definition일 때만 채우고, `translation_summary`는 selector에 노출할 언어 집합과 일치하도록 유지한다.
- Why: source translation store에는 영어/베트남어가 충분히 있는데 runtime thin payload에서만 빠지거나 `def_en`에 몽골어가 들어가면, selector가 맞아도 learner-facing 결과가 틀리게 보이기 때문이다.

## D-084

- Date: `2026-03-24`
- Decision: examples helper는 `현재 의미 -> 대표 예문 fallback -> source label -> 최대 노출 개수`까지 한 번에 설명한다.
- Why: raw feedback `F-002`는 단순히 현재 의미 우선 규칙만이 아니라, 예문이 어디서 오고 어떤 순서로 보이는지 전체 맥락 설명을 요구했기 때문이다.

## D-085

- Date: `2026-03-24`
- Decision: git/Vercel 연동에서는 `09_app/public/data/live/*.json`를 직접 추적하지 않고, `09_app/public/data/internal/runtime_payloads/*.json.gz`를 git에 두고 build 전에 복원한다.
- Why: live runtime JSON은 너무 커서 git push와 Vercel 연동에 부담이 크지만, 압축 payload 묶음은 추적 가능한 크기이며 현재 build chain에 안전하게 연결할 수 있기 때문이다.

## D-054

- Date: `2026-03-24`
- Decision: 사용자 승인에 따라 internal human pilot를 진행하고, session packet과 execution readiness를 PM 문서로 정리한 뒤 human scheduling pending 상태로 둔다.
- Why: 제품/문서 기준 준비는 끝났고, 다음 단계는 실제 사람 일정과 세션 실행이라는 운영 실행 문제이기 때문이다.

## D-053

- Date: `2026-03-24`
- Decision: internal pilot checklist와 feedback intake protocol까지 PM 문서로 정리하고, 실제 human pilot session 여부는 사용자/운영 판단 경계로 둔다.
- Why: 여기서부터는 코드/문서 작업이 아니라 실제 사람을 대상으로 pilot를 실행할지의 운영 결정이기 때문이다.
