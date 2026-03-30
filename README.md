# vocabulary_mindmap3

`09_app` is the only app included in the default GitHub -> Vercel build path.

Runtime bundle policy:
- Source code, config, restore scripts, and small metadata live in GitHub.
- Full `09_app` runtime bundle lives in Cloudflare R2 bucket `vocabulary-mindmap3-runtime`.
- `09_app` build attempts runtime restore from R2 before Vite build.
- If the public runtime gateway URL is not configured yet, build falls back to the local seed bundle.

`10_relation_app` is intentionally excluded from the default Vercel build scope.
