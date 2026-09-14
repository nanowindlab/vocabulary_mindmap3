# cf_runtime_gateway

Vercel 빌드에 R2의 `09_app` runtime bundle을 제공하는 Cloudflare Worker다. manifest와 `immutable/*`에 `MM3_RUNTIME_GATEWAY_TOKEN` Worker secret을 요구한다. Vercel Production 서버 환경 변수에도 같은 값을 설정해야 한다. 이 토큰을 `VITE_` 변수나 Git에 넣지 않는다. 운영 버전과 검증 상태는 [AUTH_SETUP.md](../AUTH_SETUP.md)에서 확인한다.
