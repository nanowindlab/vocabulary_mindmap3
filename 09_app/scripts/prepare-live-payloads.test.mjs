import assert from "node:assert/strict";
import test from "node:test";
import { fetchGatewayObject } from "./prepare-live-payloads.mjs";
import worker from "../../cf_runtime_gateway/src/index.js";

const TOKEN = "test_gateway_token_with_more_than_32_characters";

test("R2 restore sends its server token to the configured HTTPS gateway", async () => {
  let calls = 0;
  const result = await fetchGatewayObject("immutable/payload.json", {
    baseUrl: "https://gateway.example",
    token: TOKEN,
    fetchImpl: async (url, options) => {
      calls += 1;
      assert.equal(url.toString(), "https://gateway.example/immutable/payload.json");
      assert.equal(options.headers.Authorization, `Bearer ${TOKEN}`);
      assert.equal(options.redirect, "error");
      return new Response("ok");
    },
  });
  assert.equal(result.status, 200);
  assert.equal(calls, 1);
});

test("R2 restore rejects missing token or non-HTTPS URL before network access", async () => {
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return new Response("unexpected"); };
  await assert.rejects(fetchGatewayObject("runtime-bundle-manifest.json", {
    baseUrl: "https://gateway.example", token: "short", fetchImpl,
  }), /MM3_RUNTIME_GATEWAY_TOKEN/);
  await assert.rejects(fetchGatewayObject("runtime-bundle-manifest.json", {
    baseUrl: "http://gateway.example", token: TOKEN, fetchImpl,
  }), /HTTPS/);
  assert.equal(calls, 0);
});

test("Vercel build request can read a protected Worker object with the shared token", async () => {
  const env = {
    MM3_RUNTIME_GATEWAY_TOKEN: TOKEN,
    MM3_BUCKET: { get: async () => ({
      body: new Blob(['{"entries":[]}']).stream(),
      httpEtag: '"manifest"',
      writeHttpMetadata(headers) { headers.set("content-type", "application/json"); },
    }) },
  };
  const result = await fetchGatewayObject("runtime-bundle-manifest.json", {
    baseUrl: "https://mm3-runtime-gateway.nanowind.workers.dev",
    token: TOKEN,
    fetchImpl: (url, options) => worker.fetch(new Request(url, options), env),
  });
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { entries: [] });
});
