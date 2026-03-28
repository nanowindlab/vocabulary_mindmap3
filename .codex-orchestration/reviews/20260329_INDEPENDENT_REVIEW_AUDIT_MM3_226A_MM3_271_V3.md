# 20260329 Independent Review Audit MM3-226A MM3-271 V3

- Auditor Role: Independent Review Auditor
- Input Reviews:
  - Review A: `20260329_PRINCIPAL_CODE_REVIEW_MM3_226A_MM3_271_V1.md`
  - Review B: `20260329_PRINCIPAL_CODE_REVIEW_MM3_226A_MM3_271_V2.md`
- Audit Rule:
  - 코드 근거 존재
  - 영향 범위 명확성
  - 워크스페이스 흐름 반영 여부
  - 재현 가능성
  - 테스트 필요성

## [Normalized Issue Map]

### 공통 이슈

#### C-01 Audit / Validation Contract Weakness
- 문제: `audit:authoritative-promotion`가 현재 `chunk_id` 계약을 end-to-end로 충분히 증명하지 못한다.
- 위치: `09_app/scripts/audit-authoritative-promotion-readiness.mjs`, `09_app/scripts/package-live-payloads.mjs`
- 유형: validation, architecture
- 근거:
  - Review A: mapping artifact 존재만으로 chunk gap을 닫는다고 지적
  - Review B: audit이 제거된 `chunk.ids` schema를 계속 검사한다고 지적
- 영향: readiness report가 실제 build/runtime coherence보다 더 안전해 보일 수 있다.
- 심각도: MEDIUM
- 확실성: 높음
- 권장 조치: mapping artifact, `CHUNK_MANIFEST`, `APP_READY_SEARCH_INDEX.chunk_id`의 coherence를 직접 검증하도록 audit/validation을 재구성한다.

### 부분 일치 이슈

#### P-01 Chunk Contract Fragmentation
- 문제: `chunk_id` 관련 계약이 여러 파일에 분산돼 있다.
- 위치: `09_app/scripts/canonical-chunk-mapping-core.mjs`, `09_app/scripts/package-live-payloads.mjs`, `09_app/scripts/build-example-chunks.mjs`
- 유형: architecture, maintainability
- 근거:
  - Review A: `chunk_size`와 chunk metadata source가 이중화돼 있다고 지적
  - Review B: `build:examples`가 canonical mapping 대신 offset slicing을 사용한다고 지적
- 영향: future chunk rule 변경 시 manifest, examples chunk, runtime row가 서로 다른 계약을 따를 수 있다.
- 심각도: MEDIUM
- 확실성: 높음
- 권장 조치: chunk membership와 metadata를 canonical mapping payload 하나에서만 읽도록 단일화한다.

#### P-02 Release / Build Reproducibility Gap
- 문제: deploy/build 경로가 canonical source rebuild를 필수 단계로 강제하지 않는다.
- 위치: `09_app/package.json`, `vercel.json`, `09_app/scripts/prepare-live-payloads.mjs`
- 유형: compatibility, operations, architecture
- 근거:
  - Review A: build path가 full inflate에 묶여 있고 운영 비용이 크다고 지적
  - Review B: deploy path가 `rebuild:canonical-runtime`를 호출하지 않아 stale payload 배포 가능성을 지적
- 영향: source truth와 packaged runtime 사이 drift가 수동 운영 실수에 의존하게 된다.
- 심각도: HIGH
- 확실성: 높음
- 권장 조치: release pipeline에서 canonical rebuild를 명시적으로 수행하거나, source-to-payload promotion 단계를 별도 gate로 고정한다.

### 충돌 이슈

#### X-01 Immediate Severity of Current State
- 문제: 현재 상태를 즉시 수정이 필요한 배포 리스크로 볼 것인가
- 위치: `09_app/package.json`, `09_app/scripts/runtime-search-recovery-core.mjs`, `09_app/scripts/canonical-chunk-mapping-core.mjs`, `.gitignore`, git tracked state
- 유형: severity judgment
- 근거:
  - Review A 주장: 치명적 문제 없음. 구조적 debt와 운영 비용이 중심이라고 판단
  - Review B 주장: canonical mapping artifact 보장 부재는 clean checkout/CI/build failure로 이어질 수 있어 Critical이라고 판단
- 영향: release decision과 우선순위가 달라진다.
- 심각도: HIGH to CRITICAL
- 확실성: 높음
- 권장 조치: tracked/generated artifact 보장 여부를 build graph 기준으로 판정한다. 현재는 Review B 쪽 판단이 더 강하다.

### 단독 주장 이슈

#### S-A-01 UI / Generator Projection Duplication
- 문제: tab/tree projection 로직이 UI와 generator에 각각 복제돼 있다.
- 위치: `09_app/src/App.jsx`, `09_app/scripts/rebuild-canonical-runtime.mjs`
- 유형: architecture, compatibility
- 근거: Review A 단독 주장. 실제로 meaning/situation/unclassified projection 분기가 양쪽에 존재한다.
- 영향: taxonomy/display rule 변경 시 UI와 generated payload가 조용히 drift할 수 있다.
- 심각도: MEDIUM
- 확실성: 높음
- 권장 조치: projection rule을 shared module로 통합한다.

#### S-A-02 App Tooling Writes Source Artifact Zone
- 문제: `09_app` script가 `vocab_dictionary/output/unified_live`를 직접 갱신한다.
- 위치: `09_app/scripts/canonical-chunk-mapping-core.mjs`
- 유형: system boundary
- 근거: Review A 단독 주장. 실제로 source artifact zone에 직접 write 한다.
- 영향: source zone과 app tooling 경계가 얇아진다.
- 심각도: LOW
- 확실성: 높음
- 권장 조치: source artifact write ownership을 명시적으로 문서화하거나 별도 builder boundary로 분리한다.

#### S-A-03 Rebuild-Time Double Mapping Write
- 문제: 하나의 canonical rebuild 안에서 mapping artifact를 중복 생성한다.
- 위치: `09_app/scripts/rebuild-canonical-runtime.mjs`, `09_app/scripts/package-live-payloads.mjs`
- 유형: performance, maintainability
- 근거: Review A 단독 주장. 두 경로 모두 `ensureCanonicalChunkMapping({ force: true })`를 호출한다.
- 영향: 불필요한 I/O와 source artifact write가 발생한다.
- 심각도: LOW
- 확실성: 높음
- 권장 조치: rebuild orchestration에서 이미 생성된 mapping payload를 하위 단계로 전달한다.

#### S-B-01 Missing Mapping Artifact Guarantee in Default Build Graph
- 문제: canonical mapping artifact가 build graph의 필수 입력인데 tracked artifact도 아니고 default build에서 생성도 보장되지 않는다.
- 위치: `09_app/package.json`, `09_app/scripts/runtime-search-recovery-core.mjs`, `09_app/scripts/canonical-chunk-mapping-core.mjs`, `09_app/scripts/build-runtime-surface-recovery.mjs`, `09_app/scripts/authoritative-runtime-promotion-core.mjs`
- 유형: correctness, compatibility, operations
- 근거: Review B 단독 주장. 실제로 consumer는 hard fail하고, `git ls-files` 기준 현재 artifact는 tracked 상태가 아니다.
- 영향: clean checkout, CI, `npm run build`, sidecar recovery, authoritative diff/audit가 실패할 수 있다.
- 심각도: CRITICAL
- 확실성: 높음
- 권장 조치: artifact를 tracked release input으로 포함하거나, build graph에서 deterministic generate를 공통 선행조건으로 보장한다.

#### S-B-02 Runtime Detail Fallback Fragility
- 문제: production runtime은 `chunk_id`가 없으면 detail load가 약해진다.
- 위치: `09_app/src/App.jsx`, `09_app/src/data/loaderAdapter.js`
- 유형: bug risk
- 근거: Review B PASS 1 단독 주장
- 영향: mapping/manifest 오류 시 detail 정보가 빈약해질 수 있다.
- 심각도: MEDIUM
- 확실성: 중간
- 권장 조치: current snapshot이 안전한지와 별개로, missing `chunk_id` 시 explicit failure/reporting guard를 검토한다.

## [Final Consolidated Report]

### 1. Confirmed Issues

#### 1. Missing Mapping Artifact Guarantee
- 문제: canonical mapping artifact가 default build graph의 필수 입력인데 보장되지 않는다.
- 근거:
  - `09_app/scripts/runtime-search-recovery-core.mjs`는 `buildRecoverableSearchRows()`에서 `loadCanonicalChunkMap()`를 무조건 호출한다.
  - `09_app/scripts/canonical-chunk-mapping-core.mjs`는 artifact 부재 시 hard fail한다.
  - `09_app/package.json`의 `prebuild`와 `check:runtime-surface-sidecar`는 이 artifact를 사전 생성하지 않는다.
  - `git ls-files vocab_dictionary/output/unified_live/kcenter_chunk_id_mapping.json.gz` 결과는 비어 있었다.
  - `.gitignore`는 `vocab_dictionary/output/unified_live/*.json.gz`를 허용하므로, 문제는 ignore rule이 아니라 현재 tracked/guaranteed state 부재다.
- 영향: clean checkout, CI, `npm run build`, authoritative diff/audit, sidecar recovery가 실패할 수 있다.
- 심각도: CRITICAL
- 권장 조치: artifact를 tracked input으로 포함하거나, build graph에서 deterministic generate를 선행조건으로 강제한다.

#### 2. Release Path Still Allows Stale Runtime Payloads
- 문제: release/deploy 경로가 canonical source rebuild를 필수 단계로 강제하지 않는다.
- 근거:
  - `vercel.json`의 `buildCommand`는 `npm --prefix 09_app run build`만 호출한다.
  - `09_app/package.json`의 `prebuild`는 `prepare:live -> verify:live -> check:runtime-surface-sidecar`로 이어지며, committed runtime payload inflate/verify에 머문다.
  - `rebuild:canonical-runtime`는 추가됐지만 release graph에 직접 연결되지 않았다.
- 영향: source truth가 바뀌어도 operator가 rebuild를 빠뜨리면 stale payload가 그대로 배포될 수 있다.
- 심각도: HIGH
- 권장 조치: release pipeline에 canonical rebuild 또는 동등 provenance promotion step을 필수화한다.

#### 3. Projection Logic Is Duplicated Between App and Generator
- 문제: `meaning/situation/unclassified` projection 로직이 UI와 generator에 중복돼 있다.
- 근거:
  - `09_app/src/App.jsx`에 tab projection 분기가 있다.
  - `09_app/scripts/rebuild-canonical-runtime.mjs`에 같은 역할의 projection 분기가 별도로 있다.
- 영향: taxonomy/display rule 변경 시 live tree payload와 앱 런타임이 서로 다른 분류를 가질 수 있다.
- 심각도: MEDIUM
- 권장 조치: projection rule을 shared module 하나로 통합한다.

#### 4. Chunk Contract Is Fragmented Across Multiple Builders
- 문제: chunk membership와 metadata source가 단일 source of truth가 아니다.
- 근거:
  - `09_app/scripts/canonical-chunk-mapping-core.mjs`가 canonical mapping payload를 만든다.
  - `09_app/scripts/package-live-payloads.mjs`는 이를 사용한다.
  - `09_app/scripts/build-example-chunks.mjs`는 여전히 offset slicing으로 chunk membership를 계산한다.
  - `chunk_size`도 canonical mapping 쪽과 package 쪽에 각각 존재한다.
- 영향: future chunk rule 변경 시 examples chunk, manifest, runtime row 사이 drift가 생길 수 있다.
- 심각도: MEDIUM
- 권장 조치: 모든 chunk membership 계산과 metadata는 canonical mapping payload를 직접 참조하게 한다.

#### 5. Audit No Longer Checks the Right Contract
- 문제: audit script가 현재 schema를 직접 검증하지 못한다.
- 근거:
  - `09_app/scripts/audit-authoritative-promotion-readiness.mjs`는 `chunk.ids` 존재를 보지만,
  - `09_app/scripts/package-live-payloads.mjs`가 쓰는 현재 `CHUNK_MANIFEST`는 `entry_count`만 남긴다.
- 영향: readiness report가 실제 mapping-manifest-search coherence를 보장하지 못한다.
- 심각도: MEDIUM
- 권장 조치: dead metric를 제거하고 `mapping artifact -> search rows -> chunk manifest` coherence check를 추가한다.

### 2. Disputed Issues

#### 1. Current State Severity
- 쟁점: 현재 상태를 `치명적 문제 없음`으로 볼지, `즉시 조치 필요`로 볼지
- A 주장: 구조적 debt와 운영 비용이 크지만 즉시 배포 차단 수준은 아니라고 봤다.
- B 주장: mapping artifact 보장 부재는 clean checkout/CI/build failure로 이어질 수 있어 Critical이라고 봤다.
- 현재 판단: B가 맞다.
- 추가 확인 필요: 없음. tracked state, consumer hard fail, build graph를 재검증한 결과 severity는 높게 보는 것이 타당하다.

#### 2. Audit Weakness Interpretation
- 쟁점: audit 문제를 `existence-only semantics`로 볼지, `dead metric`로 볼지
- A 주장: artifact 존재만으로 chunk gap을 닫는 판단이 약하다고 봤다.
- B 주장: audit이 이미 제거된 manifest field를 계속 검사한다고 봤다.
- 현재 판단: 둘 다 맞다. 같은 현상의 다른 표현이다.
- 추가 확인 필요: 없음. 최종 보고서에서는 하나의 confirmed issue로 통합했다.

### 3. Rejected / Deferred Issues

#### 1. Order-Based Mapping Churn
- 문제: order-based mapping이 upstream ordering 변화에 취약하다는 주장
- 이유: `vocab_dictionary/scripts/build_kcenter_dataset.py`는 merged record를 `entry.id` 기준으로 정렬한다. 즉, 현재 근거만으로는 immediate risk로 유지할 수 없다.

#### 2. Current Runtime Artifact Already Inconsistent
- 문제: 현재 runtime artifact 자체가 `chunk_id` mismatch를 포함한다는 가설
- 이유: revalidation 기준 current snapshot은 `53,012` rows 모두 `chunk_id`를 가지고 있었고, unknown chunk id도 없었다. 현재 artifact failure는 근거 부족이다.

#### 3. Full Inflate on Every Build as Immediate Release Defect
- 문제: `prepare:live`가 많은 payload를 inflate하는 점 자체를 immediate defect로 볼지
- 이유: 비용 문제는 맞지만 correctness failure 근거는 아니다. system-level performance/operations risk로만 유지한다.

#### 4. Source Zone Write Coupling as Immediate Defect
- 문제: `09_app` tooling이 source artifact zone을 직접 갱신하는 점
- 이유: boundary risk는 있으나 현재 요청 범위에서 production blocker로 단정할 근거는 약하다. system-level risk로만 유지한다.

### 4. System-Level Risks

- 내용: app tooling이 `vocab_dictionary/output/unified_live` source artifact zone을 직접 갱신한다.
- 영향: source builder boundary와 app packaging boundary가 섞여 ownership이 흐려질 수 있다.

- 내용: tracked deploy payload surface가 크다. current `MANIFEST.json` 기준 packaged artifact는 `220`개다.
- 영향: artifact churn, build I/O, release verification 비용이 계속 커진다.

- 내용: build chain은 learner runtime fetch subset보다 넓은 payload 집합을 계속 복원/검증한다.
- 영향: 안정성에는 유리하지만 CI/Vercel/local build 비용이 높다.

### 5. Missing Tests

- 테스트: `clean-checkout build requires or generates canonical chunk mapping`
- 이유: 현재 가장 큰 배포 리스크를 직접 잡는 테스트다.

- 테스트: `search index chunk_id coverage matches chunk manifest`
- 이유: `APP_READY_SEARCH_INDEX.chunk_id`, mapping artifact, `CHUNK_MANIFEST` coherence를 자동으로 보장해야 한다.

- 테스트: `build:examples uses canonical mapping membership`
- 이유: examples chunk builder와 package builder의 chunk membership drift를 방지해야 한다.

- 테스트: `rebuild canonical runtime matches app projection`
- 이유: UI projection과 generator projection 중복 구현의 drift를 자동으로 잡아야 한다.

- 테스트: `rebuild canonical runtime end-to-end`
- 이유: `build:canonical-chunk-mapping -> rebuild:canonical-runtime -> audit:authoritative-promotion -> build` 전체 계약을 자동으로 보장해야 한다.

### 6. Executive Summary

- 즉시 조치:
  - canonical mapping artifact를 tracked input 또는 guaranteed generated precondition으로 고정
  - release pipeline에 canonical rebuild 또는 동등 provenance gate 연결
  - audit script를 현재 manifest/schema 기준으로 재작성

- 중요 리스크:
  - build graph가 hidden local artifact에 의존
  - release가 stale packaged payload를 허용
  - projection/chunk contract logic가 여러 곳에 분산

- 배포 전 체크:
  - clean checkout에서 mapping artifact 보장 방식 검증
  - `APP_READY_SEARCH_INDEX.chunk_id` 와 `CHUNK_MANIFEST` coherence 검증
  - canonical rebuild를 release path에 넣을지, tracked payload promotion으로 갈지 운영 정책 확정
