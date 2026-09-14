# Google 계정 로그인 설정

[확정] 2026-09-14 사용자 선택: 이 앱 전용 Google Cloud 프로젝트 `Vocabulary Mindmap 3`(ID `vocabulary-mindmap3-nanowind`)를 사용하고, Google이 확인한 `@gmail.com` 주소만 허용하며, Cloudflare 원본 JSON 경로도 보호한다. 사용자는 Vercel Production과 Worker 릴리스를 승인했고, Google OAuth 앱의 공개 게시만 보류했다.

`09_app`은 Google 계정 로그인 후에만 열린다. **Google이 확인한 `@gmail.com` 주소만 허용**하며, 회사·학교 주소나 `@googlemail.com`은 허용하지 않는다. 로그인 요청에는 `openid email`만 사용하고 Gmail 메일 접근 권한은 요청하지 않는다. Vercel Routing Middleware가 로그인 화면과 인증 API를 제외한 앱 HTML, JS/CSS, `/data/live/*` 요청을 세션 쿠키로 검사한다.

앱 화면은 Vercel의 `/data/live/*` 정적 JSON을 읽는다. Cloudflare runtime gateway는 Vercel **빌드가** R2 원본을 복원할 때만 사용하므로 브라우저로 Gateway 토큰을 보내지 않는다. Worker 코드는 manifest와 `immutable/*`에 서버 전용 Bearer 토큰을 요구하고 응답을 `no-store`로 지정한다. 2026-09-14 11:07 KST 현재 Worker 릴리스는 아직 진행 중이므로 원본 게이트웨이는 공개 상태다.

2026-09-14에 확인한 Vercel 프로젝트 설정에서는 Vercel Authentication의 Standard Protection이 켜져 있어 Preview와 생성된 배포 URL은 보호되지만 운영 도메인은 공개 범위다([Vercel 설명](https://vercel.com/docs/deployment-protection)). 운영 도메인은 이 앱의 Google 로그인으로 보호한다.

전용 Google Cloud 프로젝트에서 `Vercel Production Web` 웹 OAuth 클라이언트를 만들고 승인된 리디렉션 URI에 `https://vocabulary-mindmap3.vercel.app/api/auth/callback`을 등록했다. Google 동의 화면의 앱 이름은 `어휘 마인드맵`이며, 데이터 액세스의 최종 필요 범위는 `openid`, `userinfo.email`이다. 공개 앱 소개(`/about.html`), 개인정보처리방침(`/privacy.html`), 이용약관(`/terms.html`)의 운영 URL도 저장했다. Google OAuth 앱은 아직 `테스트 중`이며 게시하지 않았다. 공개 정책 문구를 사용자가 검토하고 운영 배포를 승인했다. Vercel Production 환경에는 아래 값을 **서버 환경변수**로 설정했다. 비밀값은 Git이나 `VITE_` 변수에 저장하지 않았다.

- `GOOGLE_CLIENT_ID`: Google OAuth 웹 클라이언트 ID
- `GOOGLE_CLIENT_SECRET`: 해당 클라이언트 보안 비밀
- `AUTH_SESSION_SECRET`: 32자 이상의 무작위 비밀값. 예: `openssl rand -hex 32`로 생성
- `AUTH_BASE_URL`: `https://vocabulary-mindmap3.vercel.app`
- `MM3_RUNTIME_GATEWAY_TOKEN`: 32바이트 이상의 무작위 base64url 또는 hex 토큰. Cloudflare Worker secret에도 **같은 값**을 지정한다.

원본 Gateway 잠금 순서: 먼저 Vercel Production 환경 변수에 Gateway 토큰을 넣고, [기존 Vercel·Cloudflare 운영 기준](VERCEL_CLOUDFLARE_OPERATIONS.md)의 preflight와 승인 절차를 거쳐 앱 배포에서 토큰을 담은 R2 복원을 검증한다. 그때까지 운영 Worker는 기존 공개 동작이므로 빌드가 계속 작동한다. 그 다음 **별도 승인된 Worker 릴리스**에서 같은 토큰을 Worker secret으로 설정하고 인증 코드를 배포한다. `wrangler secret put` 자체도 Worker 버전을 즉시 배포하므로 준비 단계가 아닌 릴리스 작업으로 취급한다([Cloudflare 설명](https://developers.cloudflare.com/workers/configuration/secrets/)). 마지막으로 무인증 manifest/immutable 요청의 401과 인증된 빌드 복원의 성공을 확인한다. Cloudflare R2 버킷 자체의 `r2.dev`·커스텀 도메인 공개 설정도 인증된 대시보드에서 확인해야 한다([R2 설명](https://developers.cloudflare.com/r2/buckets/public-buckets/)).

Preview 도메인에서 로그인하려면 그 도메인에 맞는 `AUTH_BASE_URL`과 Google 승인 리디렉션 URI가 별도로 필요하다. 값이 없거나 요청 도메인이 다르면 앱은 로그인 화면으로 보내고 인증을 시작하지 않는다. 로컬에서 실제 OAuth를 시험할 때는 `09_app/.env.local`에 같은 이름의 값을 두고 `AUTH_BASE_URL=http://127.0.0.1:4173` 및 해당 로컬 리디렉션 URI를 등록한 뒤 `npm --prefix 09_app run dev -- --host 127.0.0.1 --port 4173 --strictPort`를 실행한다.

검증 명령은 저장소 루트에서 `npm run test:auth`, `npm run test:gateway`, `09_app`에서 `npm run test:smoke`다. Vercel 설정과 실제 Google 왕복 로그인, Production 앱·Gateway 접근 차단은 배포 후 별도로 확인해야 한다.

2026-09-14 KST 현재: `@gmail.com` 접근 정책의 로컬 인증 테스트 9/9, Gateway/복원 테스트 7/7, runtime 계약 테스트 3/3, Playwright 화면 테스트 9/9, Vite 직접 빌드 PASS다. 간헐 실패했던 사이드바 테스트는 조건 기반 대기로 수정한 뒤 5회 반복 PASS였다. 공개 앱 소개·개인정보처리방침의 실제 브라우저 렌더링과 페이지 간 이동도 확인했다. Wrangler 4.80.0 `deploy --dry-run`은 PASS였고 `secrets.required`가 실험적 기능이라는 경고가 있었다. `sh scripts/vercel-preflight.sh inspect`도 로컬 연결·설정 범위에서 PASS였다. R2 토큰을 뺀 복원은 파일을 지우기 전에 실패했고 기존 live manifest의 SHA-256이 유지되며 `verify:live`가 233개 PASS였다. `@vercel/nft` 파일 추적과 Node 22 번들 검사에서는 인증 함수와 미들웨어의 의존 파일이 포함되어 PASS였다(사용하지 않는 선택적 `ws` peer dependency 경고 1건). Vercel CLI 산출물 빌드는 CLI 로그인 자격 증명이 없어 NOT_RUN이며, 실제 Google 왕복 로그인과 Production 앱·Gateway 접근 차단 검증도 NOT_RUN이다.

인증된 Vercel 화면에서 프로젝트 `vocabulary-mindmap3`가 `nanowindlab/vocabulary_mindmap3`에 연결됐고 Production 브랜치는 `main`, Root Directory는 빈 값(저장소 루트), Framework Preset은 `Other`, build/install/output 별도 UI override는 꺼진 상태임을 확인했다. 현재 Production은 `6e3a21f9...` Ready이며, 새 Production 환경변수 5개가 저장됐다는 성공 안내를 확인했다. Vercel Authentication은 Standard Protection이다.

인증된 Cloudflare 화면에서는 계정 `0373d02278ab335b7defd42ab9c050a0`의 Worker `mm3-runtime-gateway` 활성 버전 `ee760571`에 트래픽 100%가 가고, `MM3_BUCKET`이 `vocabulary-mindmap3-runtime`에 연결된 것을 확인했다. 현재 바인딩은 R2 1개이며 토큰 secret은 아직 없다. Worker 도메인은 `mm3-runtime-gateway.nanowind.workers.dev` 하나이고 커스텀 도메인·route는 없다. R2 버킷의 공개 개발 URL은 꺼져 있고 커스텀 도메인도 없다. 토큰 요구 Worker 코드는 아직 배포되지 않았다.

2026-09-14 10:44 KST 읽기 전용 HTTP 확인: 현 운영 앱 루트 200, 새 `/about.html` 404, 현 Vercel `/data/live/APP_READY_SEARCH_INDEX.json` 인증 없이 200(69,740,763바이트), 현 Cloudflare `runtime-bundle-manifest.json` 인증 없이 200(`public, max-age=60`)이었다. 따라서 현재 운영 JSON은 아직 공개 상태다. `sh scripts/vercel-preflight.sh inspect`는 로컬 설정 범위 PASS, `production`은 현 작업 브랜치가 `main`이 아니어서 의도대로 BLOCKED였다. 원격 `main`은 `6e3a21f9...`, 현 작업 HEAD는 `103e81ba...`이며 서로 분기되어 있다. 기존 사용자 작업을 섞지 않도록 전용 인증 변경만 현재 원격 `main`에 적용한 임시 후보를 `/private/tmp/mm3-auth-candidate.MSG4N7`에 만들었고, 그 후보에서 인증 테스트 9/9, Gateway 테스트 7/7, Vite 직접 빌드 PASS였다. 임시 후보의 빌드는 실제 runtime JSON 복원과 Vercel 배포를 포함하지 않는다.
