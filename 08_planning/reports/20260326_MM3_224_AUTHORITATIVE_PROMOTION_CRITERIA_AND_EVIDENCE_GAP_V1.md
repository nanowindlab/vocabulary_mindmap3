# 20260326_MM3_224_AUTHORITATIVE_PROMOTION_CRITERIA_AND_EVIDENCE_GAP_V1

## Current Revision

- `R2`

## Last Updated

- `2026-03-26 12:26 KST`

## Last Updated By

- `Codex PM`

## Scope

- `MM3-217C` authoritative promotion criteria lock
- evidence gap audit
- initial authoritative candidate scope decision

## Criteria Lock

- `C1`
  - initial authoritative candidate는 `search + facets only`로 고정한다.
  - tree/detail/chunk full rebuild readiness는 이 tranche의 promotion scope에 포함하지 않는다.
  - status:
    - `CLOSED`
- `C2`
  - `APP_READY_SEARCH_INDEX` semantic fields는 canonical inputs 기준 exact match여야 한다.
  - `chunk_id`는 initial semantic-authority gate에서 제외한다.
  - status:
    - `CLOSED`
- `C3`
  - `APP_READY_FACETS`는 canonical facet payload와 exact match여야 한다.
  - status:
    - `CLOSED`
- `C4`
  - current app는 `chunk_id`가 없더라도 detail fallback path가 있어야 한다.
  - status:
    - `CLOSED`
- `C5`
  - builder output을 authoritative runtime payload 경로에 쓰는 explicit write path와 rollback plan이 있어야 한다.
  - status:
    - `CLOSED`
- `C6`
  - authoritative switch 전에는 dual-run diff gate가 있어야 한다.
  - status:
    - `CLOSED`

## Evidence

- command:
  - `npm run audit:authoritative-promotion`
- result:
  - `exact_match_full = true`
  - `exact_match_without_chunk_id = true`
  - `semantic_authority_candidate_ready = true`
  - `chunk_manifest_has_entry_ids = false`
  - `detail_map_bytes = 337,096,539`
- code evidence:
  - `09_app/scripts/runtime-search-recovery-core.mjs`
    - current builder는 `APP_READY_DETAIL_MAP.json`을 읽고 `chunk_id`를 채운다.
  - `09_app/src/App.jsx`
    - `term.chunk_id`가 없으면 `loadEntryDetail(term.id)` fallback이 있다.
  - `09_app/src/data/loaderAdapter.js`
    - fallback detail path는 `APP_READY_DETAIL_MAP.json`을 직접 읽는다.
- prior acceptance:
  - `08_planning/reports/20260324_MM3_049_DETAIL_WIRING_ACCEPTANCE_V1.md`
    - detail slice는 `entry-id 기반 detail loader` 방향이 accept돼 있다.

## Evidence Gap

- current builder는 semantic search fields와 facets는 exact 재구성 가능하다.
- 그러나 current `chunk_id`는 `APP_READY_DETAIL_MAP.json`에 의존한다.
- `CHUNK_MANIFEST_V1.json`에는 entry-level id mapping이 없어서 manifest alone으로 `chunk_id`를 복구할 수 없다.
- actual authoritative write path / rollback / dual-run diff는 정의되고 실행됐다.
- therefore current open gap은 `semantic correctness`보다 `broader runtime payload parity`에 더 가깝다.

## Scope Decision

- initial authoritative promotion candidate는 `APP_READY_SEARCH_INDEX` semantic fields + `APP_READY_FACETS`로 좁힌다.
- `chunk_id`는 initial authoritative semantic gate에서 제외하고, runtime navigation/performance enrichment field로 분리 관리한다.
- tree/detail/chunk full rebuild는 별도 future tranche로 유지한다.

## Verification

- recurring gates:
  - `npm run validate:source-alignment`
  - `npm run prepackage:live`
  - `npm run build`
- status:
  - `PASS`
- protocol checks:
  - `npm run plan:authoritative-runtime`
  - `PLAN_READY`
  - `npm run diff:authoritative-runtime`
  - `PASS`
  - `npm run rollback:authoritative-runtime`
  - `ROLLBACK_READY`

## PM Verdict

- `ACCEPT`
- `CRITERIA_LOCKED`
- `EVIDENCE_GAP_AUDITED`
- `INITIAL_SCOPE_NARROWED`

## Next Active Work

- `MM3-217 Runtime Payload Builder Activation`
- active subtrack:
  - `MM3-217C authoritative output promotion hardening`
- next unblock:
  - authoritative write path + rollback plan 정의
  - dual-run diff gate 정의
  - `chunk_id`를 runtime-enrichment로 유지할지, canonical mapping을 새로 만들지 결정

## Revision History

- `R1` / `2026-03-26 11:44 KST` / `Codex PM` / authoritative promotion criteria, evidence gap, initial scope decision과 audit evidence를 최초 고정
- `R2` / `2026-03-26 12:26 KST` / `Codex PM` / write path / rollback / dual-run diff close 상태와 updated gap을 반영
