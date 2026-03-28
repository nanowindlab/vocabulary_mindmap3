# 20260329 Principal Code Review MM3-226A / MM3-271 V4

독립 교차검증 기준:
- 코드 수정 금지
- 기존 파일 변경 금지
- Review A / Review B 비교 후 실제 코드 근거로 재판정
- 실행 검증 없이 정적 근거만 사용

## [Normalized Issue Map]

### 공통 이슈

#### N1. Chunk contract single source-of-truth 부재
- 문제: `chunk_id`/chunk grouping 계약이 mapping artifact, packaging path, examples path에 분산되어 있다.
- 위치:
  - `09_app/scripts/canonical-chunk-mapping-core.mjs:12-19, 33-62`
  - `09_app/scripts/package-live-payloads.mjs:27, 119-155`
  - `09_app/scripts/build-example-chunks.mjs:23-52`
- 유형: design / data contract
- 근거:
  - mapping payload는 `entry_ids` 기반 chunk membership를 가진다.
  - package path는 mapping payload를 읽어 `CHUNK_MANIFEST_V1.json`과 chunk payload를 만든다.
  - `build-example-chunks.mjs`는 mapping을 읽지 않고 `entry_count` + offset slicing으로 다시 membership를 재구성한다.
- 영향: future drift 시 examples/chunk manifest/package 결과가 서로 다른 규칙을 따를 수 있다.
- 심각도: Medium
- 확실성: 높음
- 권장 조치: examples/package/manifest 모두 canonical mapping payload 하나만 읽게 통합한다.

#### N2. Audit / validation coverage 불완전
- 문제: readiness audit는 일부 coherence를 보지만, mapping-manifest-search 계약을 직접 증명하지는 않는다.
- 위치:
  - `09_app/scripts/audit-authoritative-promotion-readiness.mjs:25-75`
  - `09_app/scripts/verify-runtime-payloads.mjs:35-70`
- 유형: validation gap
- 근거:
  - audit는 `runtimeSearch` vs `recoveredSearch` full/semantic 비교를 수행한다.
  - 동시에 `chunk_manifest_has_entry_ids`처럼 현재 schema에서 항상 비활성인 metric도 남아 있다.
  - verify는 hash/size 존재성만 검증하고 mapping-manifest-search coherence 자체는 확인하지 않는다.
- 영향: current artifact parity는 일부 확인되지만, chunk contract drift를 직접 잡는 gate는 약하다.
- 심각도: Medium
- 확실성: 높음
- 권장 조치: `search index chunk_id` coverage, manifest chunk set, mapping payload record set을 직접 교차검증하는 테스트/감사를 추가한다.

#### N3. Mapping / rebuild / chunk coherence 관련 테스트 부재
- 문제: clean checkout, mapping coverage, projection parity, chunk coherence를 잡는 자동 테스트가 없다.
- 위치:
  - `09_app/package.json:9-31`
  - `09_app/tests/*`
- 유형: missing tests
- 근거:
  - 관련 스크립트는 있으나 대응하는 test entry가 없다.
  - `09_app/tests`는 UI/playwright 중심이며 mapping/rebuild contract 검증 전용 테스트 파일이 없다.
- 영향: build graph drift가 문서/수동 명령에만 의존한다.
- 심각도: High
- 확실성: 높음
- 권장 조치: clean checkout build, mapping-manifest-search coherence, rebuild parity, examples chunk parity 테스트를 추가한다.

### 부분 일치 이슈

#### N4. Build / release provenance gap
- 문제: canonical rebuild는 도입됐지만 default deploy path는 여전히 committed payload inflate/verify에 머문다.
- 위치:
  - `vercel.json:3-5`
  - `09_app/package.json:20, 30-32`
  - `09_app/scripts/rebuild-canonical-runtime.mjs:111-144`
- 유형: release workflow
- 근거:
  - deploy/build는 `npm run build`만 호출한다.
  - `prebuild`는 `prepare:live -> verify:live -> check:runtime-surface-sidecar`이고 `rebuild:canonical-runtime`를 포함하지 않는다.
  - canonical rebuild는 별도 명령으로만 존재한다.
- 영향: source가 바뀌어도 operator가 rebuild를 빼먹으면 stale payload가 유지될 수 있다.
- 심각도: High
- 확실성: 높음
- 권장 조치: release pipeline에 canonical rebuild 또는 동등한 provenance gate를 포함한다.

#### N5. `chunk_id` 부재 시 detail resilience 약함
- 문제: production runtime은 `chunk_id`가 없으면 debug 모드가 아닌 한 detail fallback을 수행하지 않는다.
- 위치:
  - `09_app/src/App.jsx:797-826`
  - `09_app/src/data/loaderAdapter.js:196-250`
- 유형: bug risk / resilience gap
- 근거:
  - `term.chunk_id`가 있으면 chunk loader를 사용한다.
  - 없을 때는 debug flag가 켜진 경우에만 `loadEntryDetail` fallback을 사용한다.
  - 일반 경로는 warning만 남긴다.
- 영향: current artifact가 아니라 future chunk contract drift 발생 시 detail degradation이 조용히 일어날 수 있다.
- 심각도: Medium
- 확실성: 중간
- 권장 조치: production-safe fallback 또는 사전 coverage gate를 추가한다.

### 충돌 이슈

#### N6. Audit 결함의 심각도 평가
- 문제: Review A는 audit이 chunk gap을 존재 여부만으로 닫는다고 봤고, Review B는 dead metric과 coherence gap으로 봤다.
- 위치:
  - `09_app/scripts/audit-authoritative-promotion-readiness.mjs:31-75`
- 유형: severity disagreement
- 근거:
  - audit는 full/semantic row 비교와 facet exact match를 수행한다.
  - 따라서 "존재 여부만 본다"는 표현은 과장이다.
  - 그러나 mapping-manifest-search coherence를 직접 검증하지 않고, `chunk_manifest_has_entry_ids`는 현재 schema상 dead metric이다.
- 영향: audit는 완전히 무력하지는 않지만, readiness gate로는 불완전하다.
- 심각도: Medium
- 확실성: 높음
- 권장 조치: A의 표현은 완화하고, B의 지적처럼 coherence check 추가로 보완한다.

### 단독 주장 이슈

#### N7. Hidden mapping artifact dependency
- 문제: canonical mapping artifact가 여러 consumer의 hard precondition인데 default build graph에서 생성이 보장되지 않는다.
- 위치:
  - `09_app/scripts/canonical-chunk-mapping-core.mjs:65-89`
  - `09_app/scripts/runtime-search-recovery-core.mjs:140-162`
  - `09_app/package.json:22, 30-31`
  - `09_app/scripts/build-runtime-surface-recovery.mjs:1-20`
- 유형: critical build / dependency
- 근거:
  - `loadCanonicalChunkMappingPayload()`는 artifact가 없으면 hard fail한다.
  - `buildRecoverableSearchRows()`는 항상 `loadCanonicalChunkMap()`를 호출한다.
  - `prebuild`와 `check:runtime-surface-sidecar`는 mapping generate step 없이 위 consumer들을 실행한다.
  - 실제 워크스페이스에서 `git ls-files`에는 이 파일이 없고, `git status --short`는 `?? vocab_dictionary/output/unified_live/kcenter_chunk_id_mapping.json.gz`를 보여 줬다.
- 영향: clean checkout, CI, Vercel, sidecar recovery, authoritative diff/audit가 local residue 없이 재현되지 않을 수 있다.
- 심각도: Critical
- 확실성: 높음
- 권장 조치: artifact를 tracked release input으로 승격하거나, 모든 consumer 앞단에서 deterministic generate를 강제한다.

#### N8. Projection logic duplication
- 문제: UI projection rule과 canonical rebuild projection rule이 중복 구현되어 있다.
- 위치:
  - `09_app/src/App.jsx:222-281`
  - `09_app/scripts/rebuild-canonical-runtime.mjs:23-102`
- 유형: architecture / drift risk
- 근거:
  - `meaning / situation / unclassified` projection logic이 두 파일에 거의 동일하게 존재한다.
- 영향: taxonomy/display rule 변경 시 runtime tree와 app projection이 조용히 드리프트할 수 있다.
- 심각도: Medium
- 확실성: 높음
- 권장 조치: shared projection module로 통합하고 parity test를 추가한다.

#### N9. App-side script가 source artifact zone을 직접 갱신
- 문제: `09_app` 스크립트가 `vocab_dictionary/output/unified_live`에 직접 write한다.
- 위치:
  - `09_app/scripts/canonical-chunk-mapping-core.mjs:13-19, 77-89`
- 유형: boundary / architecture
- 근거:
  - app-side script가 source zone에 직접 artifact를 쓴다.
- 영향: app tooling과 source builder 경계가 얇아진다.
- 심각도: Low
- 확실성: 높음
- 권장 조치: ownership을 문서화하거나 source-builder 쪽으로 이동시켜 경계를 분명히 한다.

## [Final Consolidated Report]

### 1. Confirmed Issues

#### 1. Hidden canonical mapping dependency가 default build graph에서 보장되지 않는다
- 문제:
  - `kcenter_chunk_id_mapping.json.gz`가 build/recovery/promotion 공통 필수 입력인데 default build graph가 생성/추적을 보장하지 않는다.
- 근거:
  - `canonical-chunk-mapping-core.mjs:65-89`는 artifact 부재 시 hard fail한다.
  - `runtime-search-recovery-core.mjs:140-162`는 이를 항상 소비한다.
  - `package.json:22, 30-31`의 `check:runtime-surface-sidecar`, `prebuild`는 mapping generate step 없이 consumer를 실행한다.
  - 워크스페이스 기준 `git status --short`에서 해당 파일은 untracked였다.
- 영향:
  - clean checkout, CI, Vercel, sidecar recovery, authoritative diff/audit의 재현성이 깨질 수 있다.
- 심각도:
  - Critical
- 권장 조치:
  - tracked input으로 승격하거나, prebuild 이전 공통 단계에서 deterministic generate를 강제한다.

#### 2. Release path가 canonical rebuild provenance를 보장하지 않는다
- 문제:
  - deploy path는 canonical source에서 runtime payload를 재생성하지 않고 committed payload 복원/검증에 머문다.
- 근거:
  - `vercel.json:3-5`는 `npm --prefix 09_app run build`만 호출한다.
  - `package.json:30-32`의 `prebuild`는 `prepare:live`, `verify:live`, `check:runtime-surface-sidecar`만 실행한다.
  - `rebuild-canonical-runtime.mjs:111-144`는 별도 명령으로만 존재한다.
- 영향:
  - source 변경 후 rebuild 누락 시 stale payload가 그대로 배포될 수 있다.
- 심각도:
  - High
- 권장 조치:
  - release pipeline에 `rebuild:canonical-runtime` 또는 동등한 immutable provenance gate를 포함한다.

#### 3. Chunk contract가 mapping / package / examples 경로에 분산되어 있다
- 문제:
  - chunk membership source-of-truth가 하나가 아니다.
- 근거:
  - `canonical-chunk-mapping-core.mjs:33-62`는 `entry_ids` 기반 canonical mapping을 정의한다.
  - `package-live-payloads.mjs:119-155`는 이 mapping을 기준으로 manifest와 rich/examples chunk를 생성한다.
  - 반면 `build-example-chunks.mjs:23-52`는 mapping을 읽지 않고 `entry_count` + offset slicing으로 membership를 다시 계산한다.
  - 추가로 `build-example-chunks.mjs:25-37`는 `Map`을 `entries[id]`로 접근해 standalone path 신뢰도도 낮다.
- 영향:
  - examples/chunk manifest/runtime payload가 서로 다른 계약을 따를 수 있고, 별도 examples build path는 잘못된 결과를 만들 가능성이 크다.
- 심각도:
  - High
- 권장 조치:
  - examples/package/manifest 모두 canonical mapping payload 하나만 읽게 통합한다.

#### 4. UI projection과 generator projection이 중복 구현되어 있다
- 문제:
  - `meaning / situation / unclassified` projection rule이 UI와 generator에 중복되어 있다.
- 근거:
  - `App.jsx:222-281`
  - `rebuild-canonical-runtime.mjs:23-102`
- 영향:
  - taxonomy/display rule 변경 시 search/runtime tree와 UI surface가 조용히 드리프트할 수 있다.
- 심각도:
  - Medium
- 권장 조치:
  - shared projection module로 통합하고 parity test를 추가한다.

### 2. Disputed Issues

#### 1. Audit가 chunk gap을 단순 존재 여부만으로 닫는가
- 쟁점:
  - Review A는 audit가 mapping artifact 존재만 보고 gap을 닫는다고 봤다.
- A 주장:
  - audit는 chunk alignment를 직접 증명하지 못하고 existence check에 과도하게 의존한다.
- B 주장:
  - audit에는 dead metric가 남아 있고 coherence check가 부족하지만, 완전히 existence-only는 아니다.
- 현재 판단:
  - B 쪽이 더 정확하다.
  - `audit-authoritative-promotion-readiness.mjs:31-75`는 full/semantic row comparison과 facet exact match를 수행한다.
  - 다만 mapping-manifest-search coherence를 직접 검증하지 않고, `chunk_manifest_has_entry_ids`는 현재 schema에서 실질 가치가 없다.
- 추가 확인 필요:
  - audit에 `mapping records == search row chunk_id == manifest chunk set` 검증을 추가한 뒤 readiness gate로 재평가해야 한다.

#### 2. `chunk_id` 부재 시 production detail loading 문제를 현재 defect로 볼 수 있는가
- 쟁점:
  - Review B는 production runtime이 `chunk_id` 없으면 detail을 사실상 포기한다고 봤다.
- A 주장:
  - 직접적인 현재 defect로는 다루지 않았다.
- B 주장:
  - fallback이 debug 전용이라 future mapping mismatch 시 user detail이 조용히 약화될 수 있다.
- 현재 판단:
  - 현재 snapshot defect로 단정하기는 어렵다.
  - 코드상 resilience gap은 실제 존재하지만, 이번 감사에서 current artifact의 `chunk_id` 결손 자체는 재현하지 않았다.
- 추가 확인 필요:
  - `APP_READY_SEARCH_INDEX.json` 전체에 대해 `chunk_id` non-null / manifest membership gate를 자동 검증해야 한다.

### 3. Rejected / Deferred Issues

#### 1. `chunk_size` 상수 중복을 standalone high-severity issue로 채택하지 않음
- 문제:
  - `CANONICAL_CHUNK_SIZE`와 `CHUNK_SIZE`가 둘 다 500이다.
- 이유:
  - 중복은 사실이지만, 현재 material risk는 상수명 자체보다 `chunk membership` 재구현에 있다.
  - 따라서 standalone 이슈로 올리기보다 Confirmed Issue 3에 흡수하는 것이 적절하다.

#### 2. Full inflate / repeated read를 standalone defect로 채택하지 않음
- 문제:
  - build/package path가 payload inflate와 재읽기에 의존한다.
- 이유:
  - 코드 구조상 비용 증가는 명확하지만, 실행 금지 제약 때문에 실제 병목 규모를 계측하지 못했다.
  - 성능 회귀보다는 운영 비용 리스크로 보는 것이 정확하다.

#### 3. Source zone write boundary를 release blocker로 채택하지 않음
- 문제:
  - app-side script가 source artifact zone을 직접 갱신한다.
- 이유:
  - 경계는 얇지만, 현 시점에서는 intentional trade-off로 보인다.
  - blocker보다는 ownership/documentation 보강이 필요한 architecture risk다.

### 4. System-Level Risks

#### 1. Build graph가 local residue에 민감하다
- 내용:
  - hidden mapping artifact가 local에 남아 있으면 build가 통과하고, clean environment에서는 깨질 수 있다.
- 영향:
  - 로컬 성공과 CI/Vercel 성공이 분리될 수 있다.

#### 2. Runtime provenance가 수동 운영 절차에 의존한다
- 내용:
  - canonical source -> live payload -> compressed runtime payload로 이어지는 경로가 default build에 내장되어 있지 않다.
- 영향:
  - stale payload 배포 위험이 남는다.

#### 3. Build-side validation 비용이 크다
- 내용:
  - `prepare-live-payloads.mjs:43-57`는 `MANIFEST` 기반 compressed payload와 모든 chunk payload를 다시 inflate한다.
  - 현재 tracked compressed payload manifest는 `220`개 payload를 가진다.
- 영향:
  - correctness gate는 강하지만, local/CI/Vercel 비용이 높다.

#### 4. Chunk examples 경로의 신뢰도가 낮다
- 내용:
  - standalone `build:examples`는 mapping source-of-truth를 사용하지 않고, 구현도 `Map`을 object처럼 접근한다.
- 영향:
  - examples artifact가 별도 경로로 재생성될 때 correctness가 흔들릴 수 있다.

### 5. Missing Tests

#### 1. Clean checkout build mapping guarantee
- 테스트:
  - `clean-checkout build requires or generates canonical chunk mapping`
- 이유:
  - 현재 가장 직접적인 배포/CI 리스크다.

#### 2. Mapping-manifest-search coherence
- 테스트:
  - `search index chunk_id coverage matches canonical mapping and chunk manifest`
- 이유:
  - current audit는 direct coherence proof가 부족하다.

#### 3. Projection parity
- 테스트:
  - `rebuild canonical runtime projection matches App projection`
- 이유:
  - duplicated projection rule drift를 자동으로 막아야 한다.

#### 4. Examples chunk parity
- 테스트:
  - `build:examples uses canonical mapping membership`
- 이유:
  - examples path가 별도 계약을 재구현하고 있다.

### 6. Executive Summary

#### 즉시 조치
- `kcenter_chunk_id_mapping.json.gz`의 ownership을 결정한다.
- default build/release graph에서 mapping generate 또는 tracked input 보장을 명시한다.
- canonical rebuild를 release gate에 포함한다.

#### 중요 리스크
- hidden local artifact dependency
- manual canonical rebuild gap
- split chunk contract across mapping/package/examples

#### 배포 전 체크
- clean checkout 기준으로 `npm --prefix 09_app run build` 재현 가능성 확인
- canonical mapping artifact 생성/추적 방식 확정
- `search index / mapping / chunk manifest` coherence check 추가
- canonical rebuild provenance가 release path에 반영됐는지 확인
