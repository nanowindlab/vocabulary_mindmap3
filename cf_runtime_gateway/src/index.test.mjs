import assert from "node:assert/strict";
import test from "node:test";
import worker from "./index.js";

const ORIGIN = "https://mm3-runtime-gateway.nanowind.workers.dev";
const TOKEN = "test_gateway_token_with_more_than_32_characters";

function environment(token = TOKEN) {
  let reads = 0;
  const env = {
    MM3_RUNTIME_GATEWAY_TOKEN: token,
    MM3_BUCKET: {
      async get() {
        reads += 1;
        return {
          body: new Blob(['{"ok":true}']).stream(),
          httpEtag: '"test-etag"',
          writeHttpMetadata(headers) { headers.set("content-type", "application/json"); },
        };
      },
    },
  };
  return { env, reads: () => reads };
}

test("gateway denies raw JSON and manifest before any R2 read", async () => {
  const { env, reads } = environment();
  for (const path of ["/runtime-bundle-manifest.json", "/immutable/payload.json"]) {
    const result = await worker.fetch(new Request(`${ORIGIN}${path}`), env);
    assert.equal(result.status, 401, path);
    assert.equal(result.headers.get("cache-control"), "no-store");
    assert.match(result.headers.get("www-authenticate"), /^Bearer /);
  }
  const wrong = await worker.fetch(new Request(`${ORIGIN}/immutable/payload.json`, {
    headers: { Authorization: `Bearer ${"x".repeat(40)}` },
  }), env);
  assert.equal(wrong.status, 401);
  assert.equal(reads(), 0);
});

test("gateway fails closed when the secret is absent", async () => {
  const { env, reads } = environment("");
  const result = await worker.fetch(new Request(`${ORIGIN}/runtime-bundle-manifest.json`), env);
  assert.equal(result.status, 503);
  assert.equal(reads(), 0);
});

test("valid server token reads the manifest and immutable payload without public caching", async () => {
  const { env, reads } = environment();
  for (const path of ["/runtime-bundle-manifest.json", "/immutable/payload.json"]) {
    const result = await worker.fetch(new Request(`${ORIGIN}${path}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }), env);
    assert.equal(result.status, 200, path);
    assert.equal(result.headers.get("cache-control"), "private, no-store");
    assert.deepEqual(await result.json(), { ok: true });
  }
  assert.equal(reads(), 2);
});

test("authorized HEAD returns metadata without a JSON body", async () => {
  const { env, reads } = environment();
  const result = await worker.fetch(new Request(`${ORIGIN}/immutable/payload.json`, {
    method: "HEAD", headers: { Authorization: `Bearer ${TOKEN}` },
  }), env);
  assert.equal(result.status, 200);
  assert.equal(result.body, null);
  assert.equal(reads(), 1);
});
