# 20260329 Principal Code Review MM3-226A / MM3-271 V2

- Review Mode: workspace-wide static review
- Constraint: code 수정 금지, 자동 수정 금지, build/test 실행 금지
- Review Standard: "이 코드가 지금 프로덕션에 배포되어도 안전한가"

## [Scanned Files]

- 파일 경로: `09_app/src/App.jsx`, `09_app/src/main.jsx`; 분류: changed, entrypoint; 선택 이유: `unclassified` search-driven route와 UI state entry 검토; 리뷰 내 역할: 입력 진입점, 상태 변화, 출력 surface 확인
- 파일 경로: `09_app/src/data/loaderAdapter.js`, `09_app/src/components/SearchBox.jsx`, `09_app/src/components/SidebarTree.jsx`, `09_app/src/components/TermDetail.jsx`; 분류: caller, callee; 선택 이유: search -> select -> detail loading 흐름 추적; 리뷰 내 역할: runtime data flow와 fallback 동작 점검
- 파일 경로: `09_app/package.json`, `vercel.json`; 분류: changed, config, entrypoint; 선택 이유: build/deploy graph 확인; 리뷰 내 역할: CI/Vercel 호환성 검토
- 파일 경로: `09_app/scripts/runtime-search-recovery-core.mjs`, `09_app/scripts/canonical-chunk-mapping-core.mjs`, `09_app/scripts/runtime-detail-projection.mjs`; 분류: changed, shared, callee; 선택 이유: `chunk_id` source-of-truth 도입부 확인; 리뷰 내 역할: shared contract 검토
- 파일 경로: `09_app/scripts/package-live-payloads.mjs`, `09_app/scripts/rebuild-canonical-runtime.mjs`, `09_app/scripts/build-canonical-chunk-mapping.mjs`; 분류: changed, entrypoint, callee; 선택 이유: canonical rebuild/package path 확인; 리뷰 내 역할: 핵심 처리와 artifact 생성 검토
- 파일 경로: `09_app/scripts/build-runtime-surface-recovery.mjs`, `09_app/scripts/build-runtime-search-index-recovery.mjs`, `09_app/scripts/probe-runtime-surface-recovery.mjs`, `09_app/scripts/probe-runtime-search-recovery.mjs`, `09_app/scripts/authoritative-runtime-promotion-core.mjs`, `09_app/scripts/audit-authoritative-promotion-readiness.mjs`; 분류: caller, changed, test; 선택 이유: mapping consumer 전역 영향 범위 확인; 리뷰 내 역할: caller 확장과 운영 검증 경로 검토
- 파일 경로: `09_app/scripts/verify-runtime-payloads.mjs`, `09_app/scripts/validate-runtime-source-alignment.mjs`, `09_app/scripts/build-example-chunks.mjs`, `09_app/scripts/example-chunk-sources.mjs`; 분류: test, callee; 선택 이유: validation gap과 chunk contract 중복 여부 확인; 리뷰 내 역할: 검증/테스트 표면 점검
- 파일 경로: `09_app/tests/residual.spec.js`, `09_app/tests/smoke.spec.js`, `09_app/tests/scenario.spec.js`, `09_app/tests/tree-sync.spec.js`, `09_app/tests/guide-capture.spec.js`, `09_app/tests/pilot-rehearsal.spec.js`; 분류: changed, test; 선택 이유: UI regression coverage 확인; 리뷰 내 역할: 관련 테스트 검토
- 파일 경로: `09_app/public/data/internal/runtime_payloads/MANIFEST.json`, `CHUNK_MANIFEST_V1.json.gz`, `APP_READY_MEANING_TREE.json.gz`, `APP_READY_SITUATION_TREE.json.gz`, `APP_READY_UNCLASSIFIED_TREE.json.gz`; 분류: changed, config; 선택 이유: packaged runtime contract 확인; 리뷰 내 역할: 출력 artifact shape 검토
- 파일 경로: changed compressed payload set `APP_READY_CHUNK_EXAMPLES_chunk-0006/0046/0053/0059.json.gz`, `APP_READY_CHUNK_RICH_chunk-0005/0010/0015/0017/0019/0021/0028/0030/0037/0039/0047/0053/0054/0066/0073/0074/0082/0088.json.gz`; 분류: changed; 선택 이유: changed chunk payload subset 확인; 리뷰 내 역할: detail/example packaged artifact evidence
- 파일 경로: `09_app/public/data/live/CHUNK_MANIFEST_V1.json`, `vocab_dictionary/output/unified_live/kcenter_chunk_id_mapping.json.gz`; 분류: changed, shared; 선택 이유: live manifest와 canonical mapping coherence 확인; 리뷰 내 역할: shared schema/data contract 검토
- 파일 경로: `README.md`, `08_planning/TASKLIST_V1.md`, `08_planning/PROJECT_DECISION_LOG_V1.md`, `08_planning/reports/20260329_MM3_226A_CANONICAL_CHUNK_ID_MAPPING_CLOSEOUT_V1.md`, `08_planning/reports/20260329_MM3_270_UNCLASSIFIED_TAB_REMOVAL_V1.md`, `08_planning/reports/20260329_MM3_271_CANONICAL_RUNTIME_GENERATOR_CLOSEOUT_V1.md`, `08_planning/reports/20260328_MM3_269_RELATED_FORM_SOURCE_AMBIGUITY_POLICY_CLOSEOUT_V1.md`; 분류: changed; 선택 이유: change intent와 claimed verification 확인; 리뷰 내 역할: 문서 주장과 실제 build graph 교차검증
- 파일 경로: `.codex-orchestration/ORCHESTRATION_DASHBOARD.md`, `.codex-orchestration/NEXT_MAIN_PM_HANDOFF_V1.md`, `.codex-orchestration/HANDOFF_MESSAGE_TO_NEW_PM_V1.md`, `.codex-orchestration/PM_REVIEW_QUEUE_V1.md`; 분류: changed; 선택 이유: current control-plane의 runtime/build truth 기술 확인; 리뷰 내 역할: release claim consistency 검토
- 파일 경로: `08_planning/guide_assets/20260325_mm3_in_app_guide_v1/06_unclassified_detail.png`; 분류: changed; 선택 이유: nav 제거 후 learner-facing 결과 화면 확인; 리뷰 내 역할: UI evidence

## [Dependency / Flow Map]

- 주요 호출 흐름: `vercel build -> 09_app/package.json prebuild -> prepare:live -> verify:live -> check:runtime-surface-sidecar -> build-runtime-surface-recovery / probe / authoritative-runtime-* -> runtime-search-recovery-core -> canonical-chunk-mapping-core`
- 데이터 흐름: `kcenter_base / thin_index / translations / topik_stats -> rebuild-canonical-runtime -> live/*.json -> package-live-payloads -> internal/runtime_payloads/*.json.gz + MANIFEST + CHUNK_MANIFEST -> prepare:live -> loaderAdapter fetch -> App state -> TermDetail`
- 상태 변경 흐름: UI는 `activeTab`, `viewMode`, `selectedTermId`, `selectedTermDetail`, `expandedIds`, `focusedRootId`를 갱신한다. build side는 `kcenter_chunk_id_mapping.json.gz`, `09_app/public/data/live/*.json`, `09_app/public/data/internal/runtime_payloads/*.json.gz`를 갱신한다.

## === PASS 1: 문제 탐지 ===

## [PASS 1 Findings]

### 1. Critical Issues

- 문제: canonical `chunk_id` mapping artifact가 default build graph의 필수 입력이 됐는데 tracked artifact도 아니고 prebuild에서 생성도 하지 않는다.
- 근거: `09_app/package.json`의 `check:runtime-surface-sidecar`, `prepackage:live`, `prebuild`; `09_app/scripts/runtime-search-recovery-core.mjs`의 `buildRecoverableSearchRows`; `09_app/scripts/canonical-chunk-mapping-core.mjs`의 `loadCanonicalChunkMappingPayload`; `09_app/scripts/build-runtime-surface-recovery.mjs`; `09_app/scripts/authoritative-runtime-promotion-core.mjs`.
- 영향: clean checkout, CI, Vercel, authoritative diff/audit, sidecar recovery가 바로 깨질 수 있다.
- 확실성: 높음
- 비고: 현재 작업 디렉터리에는 파일이 있어 로컬에서만 통과했을 가능성이 높다.

### 2. Design / Architecture Issues

- 문제: deploy/build는 여전히 committed `runtime_payloads/*.json.gz`를 inflate해서 사용하고, 새 canonical rebuild entrypoint는 release path에 연결되지 않았다.
- 근거: `vercel.json`의 `buildCommand`, `09_app/package.json`의 `rebuild:canonical-runtime`, `prebuild`.
- 영향: source가 바뀌어도 operator가 `rebuild:canonical-runtime`를 빼먹으면 stale payload가 그대로 배포될 수 있다.
- 확실성: 높음
- 비고: immediate crash는 아니지만 release reproducibility는 아직 수동이다.

- 문제: `build:examples`는 새 canonical mapping contract를 사용하지 않고 offset slicing에 남아 있다.
- 근거: `09_app/scripts/build-example-chunks.mjs`와 `09_app/scripts/package-live-payloads.mjs`의 chunk membership 계산 방식이 다르다.
- 영향: chunk membership rule가 둘로 갈라져 future drift를 만들 수 있다.
- 확실성: 중간
- 비고: 현재 mapping builder가 순차 slicing이라 즉시 오동작은 아닐 수 있다.

- 문제: audit output에 dead metric가 남아 있다.
- 근거: `09_app/scripts/audit-authoritative-promotion-readiness.mjs`는 `chunk.ids`를 보지만, 현재 `CHUNK_MANIFEST`는 `entry_count`만 남긴다.
- 영향: readiness report 신뢰도가 떨어진다.
- 확실성: 높음
- 비고: release blocker는 아니다.

### 3. Bug Risks

- 문제: production runtime은 `chunk_id`가 없으면 detail load를 사실상 포기한다.
- 근거: `09_app/src/App.jsx`의 `handleSelectTerm`; `09_app/scripts/verify-runtime-payloads.mjs`; `09_app/scripts/validate-runtime-source-alignment.mjs`.
- 영향: mapping/manifest가 일부라도 틀리면 user detail이 조용히 빈약해질 수 있다.
- 확실성: 중간
- 비고: PASS 2에서 current artifact 재검증 필요

### 4. Performance Issues

- 문제: build/package path는 canonical base와 example source를 여러 번 다시 읽는다.
- 근거: `09_app/scripts/rebuild-canonical-runtime.mjs`, `09_app/scripts/package-live-payloads.mjs`, `09_app/scripts/example-chunk-sources.mjs`.
- 영향: release time과 local rebuild 비용이 불필요하게 커질 수 있다.
- 확실성: 중간
- 비고: runtime UX blocker는 아니다.

### 5. Missing Tests

- clean checkout에서 mapping artifact가 없을 때 `npm run build`가 실패하거나 auto-generate 되는지 검증하는 test가 없다.
- `APP_READY_SEARCH_INDEX.chunk_id` coverage가 `CHUNK_MANIFEST`와 일치하는지 확인하는 test가 없다.
- `build:examples`가 canonical mapping과 동일한 chunk membership를 유지하는지 검증하는 test가 없다.

## === PASS 2: 재검증 및 정제 ===

## [Final Review]

### 1. Immediate Fix Required

- 심각도: Critical
- 문제: `vocab_dictionary/output/unified_live/kcenter_chunk_id_mapping.json.gz` 가 build/recovery/promotion 공통 필수 입력인데 tracked artifact도 아니고 default build에서 생성도 안 된다.
- 왜 문제인지: consumer들은 모두 `canonical-chunk-mapping-core.mjs`의 hard fail에 걸리고, build graph는 이를 사전에 보장하지 않는다.
- 실제 영향: clean checkout, CI, `npm run build`, `check:runtime-surface-sidecar`, authoritative diff/audit가 실패한다.
- 영향 범위: `09_app/scripts/runtime-search-recovery-core.mjs`, `09_app/scripts/build-runtime-surface-recovery.mjs`, `09_app/scripts/authoritative-runtime-promotion-core.mjs`, `09_app/package.json`
- 확실성: 높음
- 권장 조치: artifact를 tracked release input으로 명확히 포함하거나, 모든 consumer 앞단에서 deterministic generate를 공통 보장하도록 build graph를 재구성해야 한다.

### 2. Important but Not Urgent

- 문제: canonical rebuild entrypoint가 추가됐지만 deploy path는 아직 이를 호출하지 않는다.
- 이유: `vercel.json`은 여전히 `npm run build`만 호출하고, `prebuild`는 committed payload inflate/verify에 머문다.
- 영향: source와 packaged runtime이 drift해도 stale payload가 배포될 수 있다.
- 권장 조치: release pipeline에서 canonical rebuild를 직접 수행하거나, source-to-payload provenance를 별도 immutable artifact promotion step으로 고정해야 한다.

- 문제: audit이 제거된 schema를 계속 검사한다.
- 이유: `audit-authoritative-promotion-readiness.mjs`는 `chunk.ids`를 보지만, `package-live-payloads.mjs`의 manifest는 이제 `entry_count`만 남긴다.
- 영향: readiness report가 misleading해진다.
- 권장 조치: dead metric를 제거하고 mapping-manifest-search coherence check로 대체해야 한다.

### 3. Refactoring Suggestions

- 대상: `09_app/scripts/build-example-chunks.mjs`
- 개선 이유: 새 canonical mapping contract를 무시하고 offset slicing에 의존한다.
- 기대 효과: chunk membership source-of-truth를 하나로 줄여 future drift를 방지한다.

- 대상: `runtime-search-recovery-core` consumers 전체
- 개선 이유: mapping precondition이 숨겨져 있어 caller마다 같은 장애를 재현한다.
- 기대 효과: build/recovery/promotion command의 failure mode를 단일화하고 진단을 명확히 만든다.

### 4. Missing Tests

- 테스트 이름: `clean-checkout build requires or generates canonical chunk mapping`
- 검증 대상: mapping artifact 부재 시 build graph 동작
- 이유: 현재 가장 큰 배포 리스크다.

- 테스트 이름: `search index chunk_id coverage matches chunk manifest`
- 검증 대상: `APP_READY_SEARCH_INDEX.chunk_id` 와 `CHUNK_MANIFEST` coherence
- 이유: production detail loading은 `chunk_id` 정확도에 의존한다.

- 테스트 이름: `build:examples uses same chunk membership as package:live`
- 검증 대상: examples chunk builder와 package builder contract 일치성
- 이유: chunk membership rule 이중화가 있다.

### 5. System-Level Risks

- 전역 상태 문제: local/generated artifact 하나가 build, recovery, audit, promotion 전부의 hidden dependency가 됐다.
- 공통 모듈 영향: `runtime-search-recovery-core.mjs` 가 build/recovery/promotion의 single point of failure가 됐다.
- 데이터 일관성 문제: current snapshot 자체는 재검증 결과 `53,012` rows 기준 `null chunk_id = 0`, `unknown chunk_id = 0` 이었다. 따라서 PASS 1의 “현재 runtime artifact가 깨졌다” 가설은 제거했다. 남는 문제는 현재 artifact가 아니라 이를 보장하는 build/test 체계다.

### 6. Final Risk Summary

- 전체 위험도: HIGH
- 가장 위험한 지점 (Top 3): untracked/generated mapping artifact 의존, manual canonical rebuild gap, duplicated chunk membership contract
- 배포 전 필수 점검 항목: clean checkout에서 mapping artifact 보장 방식 확정, release pipeline에 canonical rebuild 또는 동등 provenance gate 추가, audit/validation에 chunk mapping coherence check 추가

### 7. Remaining Uncertainty

- 추가 확인이 필요한 파일: `09_app/public/data/live/APP_READY_SEARCH_INDEX.json`, `vocab_dictionary/output/unified_live/kcenter_base.json.gz`, external corpus input used by `09_app/scripts/example-chunk-sources.mjs`
- 불확실한 판단 영역: build-time performance cost는 실행 금지 제약 때문에 정적 구조로만 판단했다. runtime UI 쪽은 치명적 회귀를 확인하지 못했고, 현재 남은 핵심 리스크는 build/deploy graph다.
