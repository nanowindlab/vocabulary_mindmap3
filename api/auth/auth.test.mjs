import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, sign as rsaSign } from "node:crypto";
import test from "node:test";
import {
  getSessionFromCookie,
  handleCallback,
  handleLogout,
  handleSession,
  handleStart,
  readConfig,
} from "./_core.mjs";
import middleware, { authorizeRequest } from "../../middleware.js";

const NOW = Date.UTC(2026, 8, 14, 0, 0, 0);
const ORIGIN = "https://vocabulary-mindmap3.vercel.app";
const ENV = {
  GOOGLE_CLIENT_ID: "test-client.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
  AUTH_SESSION_SECRET: "a-long-random-test-secret-with-more-than-32-characters",
  AUTH_BASE_URL: ORIGIN,
};
const HOST = new URL(ORIGIN).host;

function response() {
  const headers = new Map();
  return {
    headers,
    statusCode: 200,
    body: "",
    setHeader(name, value) { headers.set(name.toLowerCase(), value); },
    getHeader(name) { return headers.get(name.toLowerCase()); },
    end(value = "") { this.body = value; },
  };
}

function request(url, { method = "GET", cookie = "", origin = ORIGIN, host = HOST } = {}) {
  return { url, method, headers: { host, cookie, origin } };
}

function cookiePair(setCookie) {
  return setCookie.split(";")[0];
}

function startFlow(env = ENV) {
  const res = response();
  handleStart(request("/api/auth/start"), res, { env, now: NOW });
  assert.equal(res.statusCode, 302);
  return {
    redirect: new URL(res.getHeader("Location")),
    cookie: cookiePair(res.getHeader("Set-Cookie")),
    setCookie: res.getHeader("Set-Cookie"),
  };
}

function googleToken(claims) {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const header = Buffer.from(JSON.stringify({ alg: "RS256", kid: "test-key" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const data = `${header}.${payload}`;
  return {
    idToken: `${data}.${rsaSign("RSA-SHA256", Buffer.from(data), privateKey).toString("base64url")}`,
    jwks: { keys: [{ ...publicKey.export({ format: "jwk" }), kid: "test-key", use: "sig", alg: "RS256" }] },
  };
}

function callbackUrl(flow, extra = {}) {
  const params = new URLSearchParams({ state: flow.redirect.searchParams.get("state"),
    iss: "https://accounts.google.com", code: "one-time-code", ...extra });
  return `/api/auth/callback?${params}`;
}

test("start requests only identity scopes and binds state, nonce and PKCE to a secure cookie", () => {
  const flow = startFlow();
  assert.equal(flow.redirect.origin, "https://accounts.google.com");
  assert.equal(flow.redirect.searchParams.get("redirect_uri"), `${ORIGIN}/api/auth/callback`);
  assert.equal(flow.redirect.searchParams.get("scope"), "openid email");
  assert.equal(flow.redirect.searchParams.get("code_challenge_method"), "S256");
  assert.match(flow.setCookie, /^__Host-mm3_oauth=/);
  assert.match(flow.setCookie, /HttpOnly; SameSite=Lax; Secure/);
  const flowData = JSON.parse(Buffer.from(flow.cookie.split("=")[1].split(".")[0], "base64url"));
  assert.equal(flowData.state, flow.redirect.searchParams.get("state"));
  assert.equal(flowData.nonce, flow.redirect.searchParams.get("nonce"));
  assert.equal(createHash("sha256").update(flowData.verifier).digest("base64url"),
    flow.redirect.searchParams.get("code_challenge"));
  assert.equal(flow.redirect.searchParams.has("access_type"), false);
});

test("Vercel middleware forwards the public login route", () => {
  const result = middleware(new Request(`${ORIGIN}/login.html`));
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("x-middleware-next"), "1");
});

test("verified Google callback creates a signed session; middleware protects app and data routes", async () => {
  const flow = startFlow();
  const seconds = Math.floor(NOW / 1000);
  const token = googleToken({ iss: "https://accounts.google.com", aud: ENV.GOOGLE_CLIENT_ID,
    iat: seconds, exp: seconds + 3600, nonce: flow.redirect.searchParams.get("nonce"),
    sub: "google-account-123", email: "user@gmail.com", email_verified: true, name: "학습자" });
  const flowData = JSON.parse(Buffer.from(flow.cookie.split("=")[1].split(".")[0], "base64url"));
  let tokenCalls = 0;
  const fetchImpl = async (url, options) => {
    if (url === "https://oauth2.googleapis.com/token") {
      tokenCalls += 1;
      assert.equal(options.method, "POST");
      assert.equal(options.body.get("redirect_uri"), `${ORIGIN}/api/auth/callback`);
      assert.equal(options.body.get("code"), "one-time-code");
      assert.equal(options.body.get("code_verifier"), flowData.verifier);
      return { ok: true, json: async () => ({ id_token: token.idToken }) };
    }
    assert.equal(url, "https://www.googleapis.com/oauth2/v3/certs");
    return { ok: true, json: async () => token.jwks };
  };
  const callback = response();
  await handleCallback(request(callbackUrl(flow), { cookie: flow.cookie }), callback,
    { env: ENV, now: NOW, fetchImpl });
  assert.equal(tokenCalls, 1);
  assert.equal(callback.statusCode, 302);
  assert.equal(callback.getHeader("Location"), ORIGIN);
  const setCookies = callback.getHeader("Set-Cookie");
  assert.match(setCookies[0], /Max-Age=0/);
  assert.match(setCookies[1], /HttpOnly; SameSite=Lax; Secure/);
  const sessionCookie = cookiePair(setCookies[1]);

  const session = response();
  handleSession(request("/api/auth/session", { cookie: sessionCookie }), session, { env: ENV, now: NOW });
  assert.deepEqual(JSON.parse(session.body), { configured: true,
    user: { id: "google-account-123", email: "user@gmail.com" } });

  const protectedPaths = ["/", "/index.html", "/assets/app.js", "/data/live/APP_READY_SEARCH_INDEX.json", "/api/private"];
  for (const path of protectedPaths) {
    const withoutCookie = await authorizeRequest(new Request(`${ORIGIN}${path}`, { headers: { accept: "application/json" } }), ENV, NOW);
    assert.equal(withoutCookie.status, 401, path);
    const withCookie = await authorizeRequest(new Request(`${ORIGIN}${path}`, { headers: { cookie: sessionCookie } }), ENV, NOW);
    assert.equal(withCookie, undefined, path);
  }
  const anonymousPage = await authorizeRequest(new Request(`${ORIGIN}/`, { headers: { accept: "text/html" } }), ENV, NOW);
  assert.equal(anonymousPage.status, 302);
  assert.equal(anonymousPage.headers.get("Location"), "/login.html");
  for (const path of ["/login.html", "/about.html", "/privacy.html", "/terms.html", "/info.css",
    "/api/auth/start", "/api/auth/callback", "/api/auth/session", "/api/auth/logout"]) {
    assert.equal(await authorizeRequest(new Request(`${ORIGIN}${path}`), ENV, NOW), undefined, path);
  }

  const tampered = sessionCookie.replace(/.$/, sessionCookie.endsWith("A") ? "B" : "A");
  assert.equal(getSessionFromCookie(tampered, ENV, NOW), null);
  assert.equal((await authorizeRequest(new Request(`${ORIGIN}/data/live/file.json`,
    { headers: { cookie: tampered } }), ENV, NOW)).status, 401);
  assert.equal(getSessionFromCookie(sessionCookie, ENV, NOW + 8 * 24 * 60 * 60 * 1000), null);
});

test("callback rejects CSRF state mismatch before token exchange", async () => {
  const flow = startFlow();
  const callback = response();
  await handleCallback(request(callbackUrl(flow, { state: "wrong-state" }), { cookie: flow.cookie }), callback,
    { env: ENV, now: NOW, fetchImpl: async () => { throw new Error("must not fetch"); } });
  assert.equal(callback.getHeader("Location"), `${ORIGIN}/login.html?auth=failed`);
  assert.match(callback.getHeader("Set-Cookie"), /Max-Age=0/);
});

test("cancelled Google consent returns to login without exchanging a token", async () => {
  const flow = startFlow();
  const callback = response();
  await handleCallback(request(callbackUrl(flow, { iss: "", error: "access_denied" }),
    { cookie: flow.cookie }), callback,
    { env: ENV, now: NOW, fetchImpl: async () => { throw new Error("must not fetch"); } });
  assert.equal(callback.getHeader("Location"), `${ORIGIN}/login.html?auth=cancelled`);
  assert.match(callback.getHeader("Set-Cookie"), /Max-Age=0/);
});

test("callback rejects a validly signed ID token for a different audience", async () => {
  const flow = startFlow();
  const seconds = Math.floor(NOW / 1000);
  const token = googleToken({ iss: "https://accounts.google.com", aud: "other-client", iat: seconds,
    exp: seconds + 3600, nonce: flow.redirect.searchParams.get("nonce"),
    sub: "other", email: "other@gmail.com", email_verified: true });
  const callback = response();
  const oldError = console.error;
  console.error = () => {};
  try {
    await handleCallback(request(callbackUrl(flow), { cookie: flow.cookie }), callback, {
      env: ENV, now: NOW,
      fetchImpl: async (url) => ({ ok: true, json: async () =>
        url.includes("/token") ? { id_token: token.idToken } : token.jwks }),
    });
  } finally {
    console.error = oldError;
  }
  assert.equal(callback.getHeader("Location"), `${ORIGIN}/login.html?auth=failed`);
  assert.match(callback.getHeader("Set-Cookie"), /Max-Age=0/);
});

test("callback rejects a signed token with a different nonce", async () => {
  const flow = startFlow();
  const seconds = Math.floor(NOW / 1000);
  const token = googleToken({ iss: "https://accounts.google.com", aud: ENV.GOOGLE_CLIENT_ID, iat: seconds,
    exp: seconds + 3600, nonce: "different-nonce", sub: "other", email: "other@gmail.com", email_verified: true });
  const callback = response();
  const oldError = console.error;
  console.error = () => {};
  try {
    await handleCallback(request(callbackUrl(flow), { cookie: flow.cookie }), callback, {
      env: ENV, now: NOW,
      fetchImpl: async (url) => ({ ok: true, json: async () =>
        url.includes("/token") ? { id_token: token.idToken } : token.jwks }),
    });
  } finally {
    console.error = oldError;
  }
  assert.equal(callback.getHeader("Location"), `${ORIGIN}/login.html?auth=failed`);
  assert.equal(typeof callback.getHeader("Set-Cookie"), "string");
});

test("Google-verified addresses from any email domain can create a session", async () => {
  for (const email of ["teacher@school.example", "other@googlemail.com"]) {
    const flow = startFlow();
    const seconds = Math.floor(NOW / 1000);
    const token = googleToken({ iss: "https://accounts.google.com", aud: ENV.GOOGLE_CLIENT_ID, iat: seconds,
      exp: seconds + 3600, nonce: flow.redirect.searchParams.get("nonce"),
      sub: "other", email, email_verified: true });
    const callback = response();
    await handleCallback(request(callbackUrl(flow), { cookie: flow.cookie }), callback, {
      env: ENV, now: NOW,
      fetchImpl: async (url) => ({ ok: true, json: async () =>
        url.includes("/token") ? { id_token: token.idToken } : token.jwks }),
    });
    assert.equal(callback.getHeader("Location"), ORIGIN, email);
    const sessionCookie = cookiePair(callback.getHeader("Set-Cookie")[1]);
    const session = response();
    handleSession(request("/api/auth/session", { cookie: sessionCookie }), session, { env: ENV, now: NOW });
    assert.equal(JSON.parse(session.body).user.email, email);
    assert.equal(await authorizeRequest(new Request(`${ORIGIN}/data/live/file.json`,
      { headers: { cookie: sessionCookie } }), ENV, NOW), undefined);
  }
});

test("Google accounts without a verified email cannot create a session", async () => {
  const flow = startFlow();
  const seconds = Math.floor(NOW / 1000);
  const token = googleToken({ iss: "https://accounts.google.com", aud: ENV.GOOGLE_CLIENT_ID, iat: seconds,
    exp: seconds + 3600, nonce: flow.redirect.searchParams.get("nonce"),
    sub: "unverified", email: "teacher@school.example", email_verified: false });
  const callback = response();
  const oldError = console.error;
  console.error = () => {};
  try {
    await handleCallback(request(callbackUrl(flow), { cookie: flow.cookie }), callback, {
      env: ENV, now: NOW,
      fetchImpl: async (url) => ({ ok: true, json: async () =>
        url.includes("/token") ? { id_token: token.idToken } : token.jwks }),
    });
  } finally {
    console.error = oldError;
  }
  assert.equal(callback.getHeader("Location"), `${ORIGIN}/login.html?auth=failed`);
  assert.equal(typeof callback.getHeader("Set-Cookie"), "string");
});

test("logout requires same-origin POST and clears the session", () => {
  const denied = response();
  handleLogout(request("/api/auth/logout", { method: "POST", origin: "https://attacker.example" }), denied, { env: ENV });
  assert.equal(denied.statusCode, 403);
  const accepted = response();
  handleLogout(request("/api/auth/logout", { method: "POST" }), accepted, { env: ENV });
  assert.equal(accepted.statusCode, 200);
  assert.match(accepted.getHeader("Set-Cookie"), /Max-Age=0/);
});

test("missing configuration fails closed", async () => {
  assert.equal(readConfig({ ...ENV, AUTH_SESSION_SECRET: "short" }), null);
  assert.equal(readConfig({ ...ENV, GOOGLE_CLIENT_ID: "" }), null);
  const start = response();
  handleStart(request("/api/auth/start"), start, { env: {} });
  assert.equal(start.statusCode, 503);
  const app = await authorizeRequest(new Request(`${ORIGIN}/`, { headers: { accept: "text/html" } }), {}, NOW);
  assert.equal(app.headers.get("Location"), "/login.html");
  assert.equal(await authorizeRequest(new Request(`${ORIGIN}/login.html`), {}, NOW), undefined);
});
