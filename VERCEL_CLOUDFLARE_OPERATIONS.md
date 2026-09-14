# Vercel·Cloudflare 운영 기준

확인일: 2026-09-11

이 문서는 `vocabulary_mindmap3`의 앱 업데이트 경로를 고정하는 저장소 내부 기준이다. 이 저장소는 현재 위치와 별도 GitHub origin을 유지하며 `my-codex-project`에 편입하지 않는다.

## 단일 Source of Truth

| 항목 | 기준값 | 근거 상태 |
|---|---|---|
| 로컬 저장소 | `/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3` | 현재 Git top level 확인 |
| GitHub origin | `https://github.com/nanowindlab/vocabulary_mindmap3.git` | 로컬·원격 조회 확인 |
| 기본 브랜치 | `main` | 로컬·원격 `6e3a21f9bf453c5ec6f9a21dce66ea8faaa8eb22`; 서버 Vercel Production Branch는 인증 조회 필요 |
| Vercel 프로젝트 | `vocabulary-mindmap3`; `prj_3JRsvrzRcQ0sEtczLPqsJdt69jCj`; 팀 `team_ZQ8Z9U6TXluExTG3fp3AHorA` | `.vercel/project.json`의 로컬 연결값; 서버 재확인 필요 |
| Vercel Root Directory | 저장소 루트 `.` | `vercel.json` 명령이 `09_app` 상대 경로를 사용함; 서버 값 재확인 필요 |
| install / build / output | `npm ci && npm --prefix 09_app install`; `MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build`; `09_app/dist` | 로컬 `vercel.json` 확인 |
| 운영 URL | `https://vocabulary-mindmap3.vercel.app` | 2026-09-11 HTTP 200 확인 |
| Worker | `mm3-runtime-gateway`; `https://mm3-runtime-gateway.nanowind.workers.dev` | 로컬 설정과 공개 응답 확인 |
| R2 | 로컬 바인딩 `MM3_BUCKET` → `vocabulary-mindmap3-runtime` | `wrangler.jsonc` 확인. 실제 계정 바인딩·버킷 메타데이터는 인증 조회 필요 |

`.vercel/project.json`은 Vercel CLI의 로컬 프로젝트 선택 기록이며 Git에 올리지 않는다. 서버의 Git 연결·Production Branch·Root Directory를 대신 증명하지 않는다. 이 파일이 없는 위치에서 `vercel`을 실행하면 다른 프로젝트를 자동 link할 수 있으므로, 저장소 루트 밖에서 Vercel 명령을 실행하지 않는다.

2026-09-14 인증 화면 재확인: Vercel 프로젝트 `vocabulary-mindmap3`는 `nanowindlab/vocabulary_mindmap3`에 연결됐고, Production 브랜치는 `main`, Root Directory는 빈 값(저장소 루트), Framework Preset은 `Other`, 별도 UI install/build/output override는 꺼져 있다. 운영 `6e3a21f9...` 배포는 Ready이며 앱 루트는 HTTP 200이다. Cloudflare 계정 `0373d02278ab335b7defd42ab9c050a0`의 Worker 활성 버전은 `ee760571`(100%)이고 R2 바인딩 `MM3_BUCKET` → `vocabulary-mindmap3-runtime`을 확인했다. R2 공개 개발 URL은 비활성, 커스텀 도메인은 없음. 현재 Worker manifest와 Vercel 정적 JSON은 여전히 무인증 HTTP 200이다. 로그인 릴리스의 상세 상태와 미완료 항목은 [AUTH_SETUP.md](AUTH_SETUP.md)에 기록한다.

## 업데이트 전 확인

```sh
cd /Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3
git status --short --branch
git remote -v
git ls-remote --heads origin
sh scripts/vercel-preflight.sh inspect
```

인증된 Vercel 조회에서 다음을 대조한다. 조회가 실패하면 `미확인`으로 남기고 link·배포·브랜치 삭제를 진행하지 않는다.

- 팀·프로젝트 ID와 이름
- 서버 Git 저장소가 `nanowindlab/vocabulary_mindmap3`인지
- Production Branch가 `main`인지
- Root Directory가 저장소 루트인지
- install/build/output 설정, 도메인, 최근 Production 배포 SHA·상태
- Preview 브랜치 조건, 브랜치별 도메인, Deploy Hook, CI 사용 브랜치

Vercel CLI를 사용할 때는 먼저 위 preflight를 통과하고 명시적 작업 디렉터리를 준다.

```sh
npx vercel api '/v9/projects/prj_3JRsvrzRcQ0sEtczLPqsJdt69jCj?teamId=team_ZQ8Z9U6TXluExTG3fp3AHorA' --cwd "$PWD"
npx vercel api '/v13/deployments?projectId=prj_3JRsvrzRcQ0sEtczLPqsJdt69jCj&teamId=team_ZQ8Z9U6TXluExTG3fp3AHorA&limit=10' --cwd "$PWD"
```

CLI 인증이 없거나 팀 slug가 달라 조회가 실패하면 로그인·팀 전환을 임의 실행하지 말고 현재 상태를 보존한다. `vercel link`로 새 연결을 만들지 않는다.

## 일상 Vercel 앱 업데이트

1. 독립 저장소 `main`에 필요한 소스만 반영한다. 대형 runtime·사전 원본·로컬 R2 복원본은 Git에 넣지 않는다.
2. 원본 `09_app/public/data/live`를 지우지 않도록 격리 복사본에서 `MM3_RUNTIME_PAYLOAD_SOURCE=local npm run build`를 확인한다.
3. 커밋 후 push 전에 `sh scripts/vercel-preflight.sh production`과 서버의 프로젝트·Git·Production Branch·Root Directory를 대조한다.
4. 승인 범위에서 `main`을 push한다. push가 자동 Production 배포를 만들 수 있음을 먼저 확인한다.
5. 기대 Git SHA, 성공한 Production 배포, `https://vocabulary-mindmap3.vercel.app`의 검색·상세·지연 로딩을 확인한다.

이번 정리에서는 push, Preview/Production 배포, Vercel 설정 변경을 실행하지 않았다.

## 2026-09-11 검증 기록

- 공개 운영 URL은 HTTP 200을 반환했다. 운영 HTML·JS·CSS의 SHA-256이 기존 로컬 `09_app/dist`와 각각 일치했다.
- 원본과 분리한 `/private/tmp` 복사본에서 로컬 runtime 233개 복원, `verify:live` PASS, Vite build를 확인했다. runtime 계약 테스트는 3/3 통과했다.
- 별도의 깨끗한 격리 복사본에서는 운영과 같은 R2 Gateway 경로로 233개를 모두 내려받아 `verify:live` PASS와 같은 Vite 산출물 해시를 확인했다. 이는 읽기 전용 복원 검증이며 R2 업로드가 아니다.
- 운영 브라우저에서 `요리하다` 검색 9건, 상세 뜻, 영어 번역, 예문 19건의 지연 로딩을 확인했다.
- `12_relation_app_3`도 격리 복사본에서 정본 9개 복사·검증 후 build를 통과했다. 검증 결과는 8 families, 707 groups, 7,886 cards, 17,906 term appearances였다.
- Vercel CLI 54.18.0의 인증 토큰은 현재 없고 Wrangler 4.80.0의 저장 OAuth 갱신도 400으로 실패했다. 따라서 서버 Git 연결·Production Branch·Root Directory·배포 SHA, Worker Version ID와 R2 버킷 메타데이터는 인증 후 재확인이 필요하다.

## Cloudflare Worker/R2는 별도 절차

Vercel 앱 빌드는 Gateway의 manifest와 payload를 읽지만 Worker 코드를 배포하거나 R2 객체를 업로드하지 않는다.

- Worker 코드 대상: `cf_runtime_gateway/src/index.js`
- Worker 설정: `cf_runtime_gateway/wrangler.jsonc`
- R2 쓰기 스크립트: `09_app/scripts/publish-r2-runtime-bundle.mjs`
- 공개 허용 경로: `runtime-bundle-manifest.json`, `immutable/*`

Worker/R2 변경 전에는 인증된 Cloudflare 조회로 실제 Worker version, bindings, routes/custom domains, Workers Builds Git 연결, R2 manifest/객체 메타데이터를 기록한다. `wrangler deploy`, `wrangler r2 object put`, 버킷 생성·삭제는 Vercel 앱 업데이트와 묶어 실행하지 않는다.

2026-09-11 공개 경로 검증에서는 manifest `v2`, 생성 시각 `2026-04-01T01:03:51.183Z`, 233개 객체, 합계 817,621,806바이트를 확인했다. 허용 Origin의 CORS와 HEAD/OPTIONS, 내부 경로 403, POST 405, immutable 캐시 헤더가 현재 미커밋 Worker 소스의 보안 동작과 일치했다. Vercel에서는 `/data/internal/runtime_payloads/MANIFEST.json`이 404이고 공개 `/data/live/APP_READY_SEARCH_INDEX.json`은 200/69,740,763바이트였다. 인증된 서버 조회가 없어 배포 Version ID와 실제 버킷명은 재확인이 필요하다.

## Git 추적 후보와 제외

공유 `.gitignore`는 다음을 로컬 보존 대상으로 고정한다.

- `.vercel/`, `.wrangler/`, `.autopus/`, `.codex_tmp/`
- `05_sources/`, `06_data/`, `07_runtime/`, `tmp_reports/`, `vocab_dictionary/`
- `09_app`의 dependencies/dist/live/runtime payload
- 관계 앱의 dependencies/dist/test/audit 출력과 `12_relation_app_3/public/data/` 재생성본

별도 검토 후 추적할 후보는 다음과 같다. 이번 정리에서는 stage하지 않았다.

- 현재 수정 5개: `.gitignore`, Worker 보안 소스, 운영 인수 문서 3개
- 현재 미추적 문서 5개: `ARCHITECTURE.md`, `CHANGELOG.md`, 운영 분석 보고서 3개
- `12_relation_app_3` 소스·설정·HTML 매뉴얼 28개, 121,573바이트
- `10_relation_app` 신규 소스와 정본 JSON 9개를 합친 20개, 25,203,107바이트; 최대 파일 7,732,070바이트
- `scripts/vercel-preflight.sh`와 이 운영 문서

`03_PRD/`, `08_planning/`, `docs/`, `09_app/scripts/prune-dist-runtime-files.mjs`는 이번 앱 연결 정리에서 자동 추적하지 않고 로컬 exclude에 남겼다. 삭제하지 않았다.

## 브랜치 정리 보류

`codex-09-app-runtime-boundary`는 원격 브랜치보다 4커밋 앞서고 미커밋 작업도 포함한다. 필요한 소스를 `main`에 보존하고 Vercel Production/Preview·도메인·Hook·CI 사용 여부를 확인하기 전 로컬 또는 원격 브랜치를 삭제하지 않는다. 강제 push나 history rewrite를 하지 않는다.
