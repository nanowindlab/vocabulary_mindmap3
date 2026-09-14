const ALLOWED_ORIGINS = new Set([
  "https://vocabulary-mindmap3.vercel.app",
  "https://vocabulary-mindmap3-nanowind-9046s-projects.vercel.app",
  "https://vocabulary-mindmap3-git-main-nanowind-9046s-projects.vercel.app",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

const IMMUTABLE_KEY_PATTERN = /^immutable\/[A-Za-z0-9._/-]+$/;
const MANIFEST_KEY = "runtime-bundle-manifest.json";

function buildCorsHeaders(request) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return null;
  }

  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, HEAD, OPTIONS",
    "access-control-allow-headers": "Content-Type, If-None-Match",
    vary: "Origin",
  };
}

function normalizeKey(pathname) {
  const trimmed = pathname.replace(/^\/+/, "");
  if (!trimmed) return "";
  if (trimmed.includes("..")) return null;
  return trimmed;
}

function isAllowedKey(key) {
  return key === MANIFEST_KEY || IMMUTABLE_KEY_PATTERN.test(key);
}

function applySharedHeaders(headers, corsHeaders = null) {
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  if (corsHeaders) {
    for (const [name, value] of Object.entries(corsHeaders)) {
      headers.set(name, value);
    }
  }
}

function textResponse(body, status, request) {
  const headers = new Headers({ "content-type": "text/plain; charset=utf-8" });
  headers.set("cache-control", "no-store");
  applySharedHeaders(headers, buildCorsHeaders(request));
  return new Response(body, { status, headers });
}

async function hasGatewayToken(request, env) {
  const secret = env.MM3_RUNTIME_GATEWAY_TOKEN;
  const supplied = request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9_-]{32,256})$/)?.[1];
  if (typeof secret !== "string" || !/^[A-Za-z0-9_-]{32,256}$/.test(secret) || !supplied) {
    return false;
  }

  const encoder = new TextEncoder();
  const [expectedHash, suppliedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(secret)),
    crypto.subtle.digest("SHA-256", encoder.encode(supplied)),
  ]);
  const expectedBytes = new Uint8Array(expectedHash);
  const suppliedBytes = new Uint8Array(suppliedHash);
  let difference = 0;
  for (let index = 0; index < expectedBytes.length; index += 1) {
    difference |= expectedBytes[index] ^ suppliedBytes[index];
  }
  return difference === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = buildCorsHeaders(request);

    if (request.method === "OPTIONS") {
      if (!corsHeaders) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: new Headers(corsHeaders) });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return textResponse("Method Not Allowed", 405, request);
    }

    const key = normalizeKey(url.pathname);
    if (key === null) {
      return textResponse("Invalid Path", 400, request);
    }

    if (!key) {
      return textResponse("MM3 runtime gateway", 200, request);
    }

    if (!isAllowedKey(key)) {
      return textResponse("Forbidden", 403, request);
    }

    if (!env.MM3_RUNTIME_GATEWAY_TOKEN) {
      return textResponse("Gateway Not Configured", 503, request);
    }
    if (!(await hasGatewayToken(request, env))) {
      const response = textResponse("Unauthorized", 401, request);
      response.headers.set("www-authenticate", 'Bearer realm="MM3 runtime gateway"');
      return response;
    }

    const object = await env.MM3_BUCKET.get(key);
    if (!object) {
      return textResponse("Object Not Found", 404, request);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "private, no-store");
    applySharedHeaders(headers, corsHeaders);

    return new Response(request.method === "HEAD" ? null : object.body, { headers });
  },
};
