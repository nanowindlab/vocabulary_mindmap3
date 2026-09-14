# vocabulary_mindmap3 project guidance

This is the independent `vocabulary_mindmap3` repository. The default Vercel deployment serves `09_app`; `10_relation_app` and `12_relation_app_3` are separate local lanes.

Canonical pointers:
- `README.md`: app entry points and lane boundaries.
- `AUTH_SETUP.md`: Google sign-in configuration and verification.
- `vercel.json`: production install, build, and output contract.
- `VERCEL_CLOUDFLARE_OPERATIONS.md`: deployment boundary and release preflight.

Keep source/config in Git. `09_app/public/data/live`, `09_app/public/data/internal/runtime_payloads`, `09_app/dist`, dependencies, and large source datasets are local/generated; never delete or stage them as cleanup. The Vercel build restores the runtime bundle from Cloudflare R2. `prepare:live` replaces local live files, so use an isolated copy for build-path checks.

Google account sign-in is handled by root `api/auth/` functions and `middleware.js`. Permit any Google-verified email address regardless of domain; request only identity scopes and never Gmail mailbox access. Keep OAuth secrets server-side and protect app and Vercel data routes before static delivery. The Cloudflare runtime gateway requires a server-only shared token for R2 reads by the Vercel build. Run `npm run test:auth`, `npm run test:gateway`, `npm --prefix 09_app run test:smoke`, and a Vite build for authentication changes; verify deployed behavior separately when deployment is authorized.
