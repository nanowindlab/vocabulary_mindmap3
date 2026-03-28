[Scanned Files]
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/package.json` | 분류: changed, config, entrypoint | 선택 이유: build/rebuild 명령 추가 | 리뷰 내 역할: 상위 orchestration
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/src/App.jsx` | 분류: changed, caller, entrypoint | 선택 이유: `unclassified` 탭 제거와 search route 유지 | 리뷰 내 역할: UI 상태 진입점
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/src/components/SearchBox.jsx` | 분류: caller | 선택 이유: search 결과가 hidden `unclassified` route로 들어감 | 리뷰 내 역할: 입력 진입점
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/src/data/loaderAdapter.js` | 분류: callee, state | 선택 이유: `chunk_id`/detail fallback의 실제 소비 경로 | 리뷰 내 역할: 런타임 로더
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/rebuild-canonical-runtime.mjs` | 분류: changed, entrypoint | 선택 이유: canonical generator 신규 엔트리포인트 | 리뷰 내 역할: canonical rebuild orchestration
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/build-canonical-chunk-mapping.mjs` | 분류: changed, entrypoint | 선택 이유: `MM3-226A` 신규 명령 | 리뷰 내 역할: mapping artifact 생성 진입점
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/canonical-chunk-mapping-core.mjs` | 분류: changed, shared | 선택 이유: 새 `chunk_id` source contract | 리뷰 내 역할: shared schema/IO
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/runtime-search-recovery-core.mjs` | 분류: changed, shared | 선택 이유: recovered search rows가 mapping artifact를 읽음 | 리뷰 내 역할: source -> runtime 변환 핵심
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/package-live-payloads.mjs` | 분류: changed, callee | 선택 이유: packaged payload/chunk manifest 생성 | 리뷰 내 역할: deploy artifact 생성
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/audit-authoritative-promotion-readiness.mjs` | 분류: changed, callee | 선택 이유: `226A` 후 audit semantics 변경 | 리뷰 내 역할: 승인 기준 검증
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/prepare-live-payloads.mjs` | 분류: callee | 선택 이유: build preflight restore 경로 | 리뷰 내 역할: build-side 상태 복원
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/verify-runtime-payloads.mjs` | 분류: callee | 선택 이유: packaged/live consistency gate | 리뷰 내 역할: output 검증
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/runtime-detail-projection.mjs` | 분류: callee, shared | 선택 이유: canonical detail id/source load | 리뷰 내 역할: chunk source adapter
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/example-chunk-sources.mjs` | 분류: callee, external | 선택 이유: chunk examples build dependency | 리뷰 내 역할: external linkage/derived data
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/tests/residual.spec.js` | 분류: changed, test | 선택 이유: `unclassified` route regression coverage 변경 | 리뷰 내 역할: UI 회귀 검증
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/scripts/build_kcenter_dataset.py` | 분류: shared, source-builder | 선택 이유: canonical entry order 안정성 확인 | 리뷰 내 역할: upstream source ordering
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/vocab_dictionary/output/unified_live/kcenter_chunk_id_mapping.json.gz` | 분류: changed, shared artifact | 선택 이유: 신규 source-backed mapping artifact | 리뷰 내 역할: mapping schema contract
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/public/data/internal/runtime_payloads/MANIFEST.json` | 분류: changed, config artifact | 선택 이유: packaged payload set contract | 리뷰 내 역할: deploy output contract
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/TASKLIST_V1.md` | 분류: changed, config/state | 선택 이유: authoritative backlog truth | 리뷰 내 역할: intended scope 확인
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/ORCHESTRATION_DASHBOARD.md` | 분류: changed, config/state | 선택 이유: current gate/risk truth | 리뷰 내 역할: deployment context
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md` | 분류: changed, config/state | 선택 이유: next-thread dependency tracking 확인 | 리뷰 내 역할: carry-forward boundary
- 파일 경로: `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/reports/20260329_MM3_226A_CANONICAL_CHUNK_ID_MAPPING_CLOSEOUT_V1.md` | 분류: changed, config/state | 선택 이유: intended acceptance/verification 확인 | 리뷰 내 역할: claimed outcome contract

[Dependency / Flow Map]
- 주요 호출 흐름: `package.json` -> `build:canonical-chunk-mapping` / `rebuild:canonical-runtime` / `build` -> `canonical-chunk-mapping-core` -> `runtime-search-recovery-core` / `package-live-payloads` -> `prepare-live-payloads` / `verify-runtime-payloads`
- 데이터 흐름: `kcenter_base.json.gz` + `kcenter_thin_index.json.gz` + `kcenter_facet_payload.json.gz` + `kcenter_translations.json.gz` + `entry_topik_stats.json.gz` -> recovered search rows / facet payload / chunk mapping -> live payloads -> compressed runtime payloads + `MANIFEST.json`
- 상태 변경 흐름: search 선택 -> `App.handleSearchSelect` -> `activeTab` / `viewMode` / `selectedTermDetail` 변경 -> `loaderAdapter.loadTermDetailChunk` or `loadEntryDetail`
- 출력/응답 흐름: `runtime_payloads/*.json.gz` -> `prepare-live-payloads` -> `live/*.json` -> app fetch
- 테스트 흐름: `residual.spec.js`는 hidden `unclassified` search route를 검증한다. canonical chunk mapping / rebuild contract 자체는 명시적 자동 테스트가 없다

=== PASS 1: 문제 탐지 ===

[PASS 1 Findings]

1. Critical Issues
치명적 문제 없음.

2. Design / Architecture Issues
1. 문제: 분류/투영 로직이 UI와 generator에 중복돼 있다.
근거: `09_app/src/App.jsx:25`, `09_app/src/App.jsx:1072`, `09_app/scripts/rebuild-canonical-runtime.mjs:23`, `09_app/scripts/rebuild-canonical-runtime.mjs:82`
영향: UI 분류 규칙이 바뀌면 generated tree payload가 조용히 드리프트할 수 있다.
확실성: 높음
비고: 현재는 PASS다. 미래 변경 내성이 약하다.

2. 문제: `chunk_size` 계약이 두 군데에 중복돼 있다.
근거: `09_app/scripts/canonical-chunk-mapping-core.mjs:12`, `09_app/scripts/canonical-chunk-mapping-core.mjs:33`, `09_app/scripts/package-live-payloads.mjs:27`, `09_app/scripts/package-live-payloads.mjs:125`
영향: 추후 chunk size 변경 시 mapping artifact와 runtime manifest가 서로 다른 계약을 말할 수 있다.
확실성: 높음
비고: 지금 값은 동일하다. future drift risk다.

3. 문제: app-side script가 source artifact zone을 직접 갱신한다.
근거: `09_app/scripts/canonical-chunk-mapping-core.mjs:13`, `09_app/scripts/rebuild-canonical-runtime.mjs:115`
영향: `09_app` build tooling과 `vocab_dictionary/output/unified_live` source zone 결합이 커진다.
확실성: 중간
비고: 현재는 의도된 동작이다. boundary 관리가 약해질 수 있다.

3. Bug Risks
1. 문제: `audit:authoritative-promotion`가 mapping artifact 존재 여부만으로 chunk gap을 닫는다.
근거: `09_app/scripts/audit-authoritative-promotion-readiness.mjs:41`, `09_app/scripts/audit-authoritative-promotion-readiness.mjs:67`
영향: mapping artifact 존재만으로는 manifest/runtime chunk alignment 자체를 직접 증명하지 않는다.
확실성: 중간
비고: 가설 수준이다. full comparison과 build 검증이 함께 있어 false positive 가능성이 있다.

2. 문제: order-based mapping이 upstream entry order에 민감할 수 있다.
근거: `09_app/scripts/canonical-chunk-mapping-core.mjs:38`
영향: upstream ordering이 흔들리면 chunk_id churn이 커질 수 있다.
확실성: 낮음
비고: 가설이다. PASS 2에서 upstream builder를 다시 확인해야 한다.

4. Performance Issues
1. 문제: `npm run build`가 모든 chunk payload를 매번 inflate한다.
근거: `09_app/package.json:31`, `09_app/scripts/prepare-live-payloads.mjs:43`
영향: CI/Vercel/local build 시간이 payload 수에 비례해 증가한다.
확실성: 높음
비고: correctness 문제는 아니다. 운영 비용 문제다.

2. 문제: 한 rebuild 안에서 mapping artifact를 두 번 강제 재생성한다.
근거: `09_app/scripts/rebuild-canonical-runtime.mjs:115`, `09_app/scripts/package-live-payloads.mjs:122`
영향: 불필요한 source artifact write와 I/O가 생긴다.
확실성: 높음
비고: 현재는 내용이 deterministic해서 git diff는 줄었지만, 작업 자체는 중복이다.

5. Missing Tests
1. 문제: `build:canonical-chunk-mapping` coverage test가 없다.
근거: `09_app/package.json:10`, `09_app/scripts/canonical-chunk-mapping-core.mjs:33`
영향: 모든 entry가 정확히 1회 매핑되는지 자동 회귀 검증이 없다.
확실성: 높음

2. 문제: generator projection과 UI projection parity test가 없다.
근거: `09_app/src/App.jsx:25`, `09_app/scripts/rebuild-canonical-runtime.mjs:23`
영향: 같은 category 입력이 UI와 generator에서 다르게 해석돼도 자동으로 잡히지 않는다.
확실성: 높음

3. 문제: `rebuild:canonical-runtime` end-to-end integration test가 없다.
근거: `09_app/package.json:20`, `09_app/scripts/verify-runtime-payloads.mjs`
영향: 현재는 수동 명령 조합으로만 계약을 확인한다.
확실성: 높음

=== PASS 2: 재검증 및 정제 ===

[Final Review]

1. Immediate Fix Required
치명적 문제 없음.

2. Important but Not Urgent
1. 문제: UI 분류 로직과 generator 분류 로직이 중복돼 있다.
이유: `09_app/src/App.jsx:25`와 `09_app/scripts/rebuild-canonical-runtime.mjs:23`가 같은 분기 로직을 각각 가진다.
영향: future taxonomy/display rule 변경 시 live tree payload와 앱 런타임이 서로 다른 분류를 가질 수 있다.
권장 조치: projection rule을 shared module 하나로 모아 UI와 generator가 같은 구현을 쓰게 한다.

2. 문제: chunk contract 메타데이터가 단일 source of truth가 아니다.
이유: `09_app/scripts/canonical-chunk-mapping-core.mjs:12`와 `09_app/scripts/package-live-payloads.mjs:27`가 각각 `chunk_size`를 들고 있고, manifest는 local constant를 쓴다.
영향: future chunk size 변경 시 mapping artifact와 packaged manifest가 조용히 분리될 수 있다.
권장 조치: packaged manifest가 mapping payload의 `chunk_size`와 `chunk_count`를 직접 참조하게 한다.

3. 문제: build/rebuild가 여전히 전체 payload inflate/package에 크게 의존한다.
이유: `09_app/package.json:31`, `09_app/scripts/prepare-live-payloads.mjs:43`
영향: Vercel/CI/local build time과 I/O 비용이 chunk 수에 비례해 커진다.
권장 조치: normal build path에서 full inflate가 정말 필요한지 재검토하고, no-op path와 cached path를 분리한다.

3. Refactoring Suggestions
대상: `09_app/scripts/rebuild-canonical-runtime.mjs`, `09_app/src/App.jsx`
개선 이유: 같은 tab/tree projection이 두 군데 있다.
기대 효과: generator-runtime drift 감소.

대상: `09_app/scripts/canonical-chunk-mapping-core.mjs`, `09_app/scripts/package-live-payloads.mjs`
개선 이유: chunk metadata source가 분산돼 있다.
기대 효과: chunk contract drift 방지.

대상: `09_app/package.json`, `09_app/scripts/prepare-live-payloads.mjs`
개선 이유: build path가 전체 payload inflate에 묶여 있다.
기대 효과: build latency와 artifact churn 감소.

4. Missing Tests
테스트 이름: `canonical chunk mapping covers all canonical ids exactly once`
검증 대상: `09_app/scripts/canonical-chunk-mapping-core.mjs`
이유: `53,012` entry가 누락 없이 1회만 매핑되는지 자동 보장이 필요하다.

테스트 이름: `package-live uses canonical chunk mapping artifact`
검증 대상: `09_app/scripts/package-live-payloads.mjs`
이유: 검색 row `chunk_id`, chunk manifest, chunk payload grouping이 같은 source contract를 따르는지 자동 검증이 필요하다.

테스트 이름: `rebuild canonical runtime matches app projection`
검증 대상: `09_app/scripts/rebuild-canonical-runtime.mjs`, `09_app/src/App.jsx`
이유: UI projection rule과 generator projection rule drift를 자동으로 잡아야 한다.

테스트 이름: `rebuild canonical runtime end-to-end`
검증 대상: `build:canonical-chunk-mapping` -> `rebuild:canonical-runtime` -> `audit:authoritative-promotion` -> `build`
이유: 지금은 수동 명령 조합으로만 검증한다.

5. System-Level Risks
- `09_app` script가 `vocab_dictionary/output/unified_live/kcenter_chunk_id_mapping.json.gz`를 직접 갱신한다. source zone과 app tooling의 경계가 얇다.
- `09_app/public/data/internal/runtime_payloads/MANIFEST.json` 기준 tracked deploy payload가 `220`개다. generator 개선 후에도 artifact churn surface는 크다.
- build chain은 runtime fetch subset보다 훨씬 넓은 payload 집합을 계속 복원/검증한다. 운영 안정성은 높지만 비용도 계속 높다.

6. Final Risk Summary
- 전체 위험도: MEDIUM
- 가장 위험한 지점 (Top 3):
  1. UI projection과 generator projection의 중복 구현
  2. chunk metadata contract의 이중 source
  3. 전체 payload inflate/package에 묶인 build path
- 배포 전 필수 점검 항목:
  - `npm run build:canonical-chunk-mapping`
  - `npm run audit:authoritative-promotion`
  - `npm run rebuild:canonical-runtime`
  - `npm run build`
  - `kcenter_chunk_id_mapping.json.gz`와 regenerated `runtime_payloads`가 함께 관리되는지 확인

7. Remaining Uncertainty
- 추가 확인이 필요한 파일:
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/diff-authoritative-runtime-candidate.mjs`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/promote-authoritative-runtime-candidate.mjs`
  - `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/09_app/scripts/probe-runtime-search-recovery.mjs`
- 불확실한 판단 영역:
  - changed `.json.gz` payload 전부를 개별 내용까지 열어 보진 않았다.
  - artifact set은 `09_app/public/data/internal/runtime_payloads/MANIFEST.json`과 build/audit 결과 기준으로 재검증했다.
  - PASS 1의 “order-based mapping churn” 우려는 `vocab_dictionary/scripts/build_kcenter_dataset.py:1452`에서 merged record가 `entry.id` 기준 정렬되는 것을 확인하고 최종 결론에서 제외했다.
