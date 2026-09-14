import {
  createHash,
  createHmac,
  createPublicKey,
  randomBytes,
  timingSafeEqual,
  verify as verifySignature,
} from "node:crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const FLOW_SECONDS = 10 * 60;
const SESSION_SECONDS = 7 * 24 * 60 * 60;

export function readConfig(env = process.env) {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  const sessionSecret = env.AUTH_SESSION_SECRET?.trim();
  const rawBaseUrl = env.AUTH_BASE_URL?.trim();
  if (!clientId || !clientSecret || !sessionSecret || sessionSecret.length < 32 || !rawBaseUrl) {
    return null;
  }

  try {
    const url = new URL(rawBaseUrl);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if ((url.protocol !== "https:" && !(local && url.protocol === "http:")) ||
        url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
      return null;
    }
    return {
      clientId,
      clientSecret,
      sessionSecret,
      origin: url.origin,
      host: url.host,
      secure: url.protocol === "https:",
      callbackUrl: `${url.origin}/api/auth/callback`,
      flowCookie: url.protocol === "https:" ? "__Host-mm3_oauth" : "mm3_oauth_dev",
      sessionCookie: url.protocol === "https:" ? "__Host-mm3_session" : "mm3_session_dev",
    };
  } catch {
    return null;
  }
}

function requestIsForOrigin(req, config) {
  return typeof req.headers?.host === "string" &&
    req.headers.host.toLowerCase() === config.host.toLowerCase();
}

function setNoStore(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

function json(res, status, body) {
  setNoStore(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function methodNotAllowed(res, method) {
  res.setHeader("Allow", method);
  json(res, 405, { error: "허용되지 않은 요청 방식입니다." });
}

function redirect(res, destination) {
  setNoStore(res);
  res.statusCode = 302;
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Location", destination);
  res.end();
}

function cookie(name, value, maxAge, config) {
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${config.secure ? "; Secure" : ""}`;
}

function readCookie(req, name) {
  const source = req.headers?.cookie;
  if (typeof source !== "string") return null;
  const matches = source.split(";").map((part) => part.trim())
    .filter((part) => part.startsWith(`${name}=`));
  return matches.length === 1 ? matches[0].slice(name.length + 1) : null;
}

function sign(value, secret) {
  const data = Buffer.from(JSON.stringify(value)).toString("base64url");
  const mac = createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${mac}`;
}

function unsign(token, secret) {
  if (typeof token !== "string" || token.length > 4096 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) {
    return null;
  }
  const [data, mac] = token.split(".");
  const actual = Buffer.from(mac, "base64url");
  const expected = createHmac("sha256", secret).update(data).digest();
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function isValidTimedValue(value, type, config, now) {
  return value?.type === type && value.aud === config.origin &&
    Number.isInteger(value.iat) && Number.isInteger(value.exp) &&
    value.iat <= now + 60 && value.exp > now && value.exp > value.iat;
}

function sameRandomValue(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function randomUrlSafe() {
  return randomBytes(32).toString("base64url");
}

function getQuery(req, config) {
  return new URL(req.url || "/", config.origin).searchParams;
}

export function handleStart(req, res, { env = process.env, now = Date.now() } = {}) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");
  const config = readConfig(env);
  if (!config) return json(res, 503, { error: "Google 로그인 설정이 필요합니다." });
  if (!requestIsForOrigin(req, config)) return json(res, 403, { error: "허용되지 않은 도메인입니다." });

  const issuedAt = Math.floor(now / 1000);
  const state = randomUrlSafe();
  const nonce = randomUrlSafe();
  const verifier = randomUrlSafe();
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const flow = sign({ type: "flow", aud: config.origin, iat: issuedAt, exp: issuedAt + FLOW_SECONDS,
    state, nonce, verifier }, config.sessionSecret);

  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.callbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  res.setHeader("Set-Cookie", cookie(config.flowCookie, flow, FLOW_SECONDS, config));
  redirect(res, url.toString());
}

async function verifyGoogleIdToken(idToken, config, nonce, fetchImpl, now) {
  if (typeof idToken !== "string" || idToken.length > 12000) throw new Error("invalid_id_token");
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("invalid_id_token");
  let header;
  let claims;
  try {
    header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    throw new Error("invalid_id_token");
  }
  if (header?.alg !== "RS256" || typeof header.kid !== "string") throw new Error("invalid_id_token");

  const keysResponse = await fetchImpl(GOOGLE_JWKS_URL, { signal: AbortSignal.timeout(5000) });
  if (!keysResponse.ok) throw new Error("google_keys_unavailable");
  const keys = await keysResponse.json();
  const key = keys?.keys?.find((item) => item.kid === header.kid && item.kty === "RSA" &&
    (!item.use || item.use === "sig") && (!item.alg || item.alg === "RS256"));
  if (!key) throw new Error("google_key_missing");
  const publicKey = createPublicKey({ key, format: "jwk" });
  const signedData = Buffer.from(`${parts[0]}.${parts[1]}`);
  const signature = Buffer.from(parts[2], "base64url");
  if (!verifySignature("RSA-SHA256", signedData, publicKey, signature)) throw new Error("invalid_signature");

  const seconds = Math.floor(now / 1000);
  if (!(["https://accounts.google.com", "accounts.google.com"].includes(claims.iss)) ||
      claims.aud !== config.clientId ||
      (claims.azp && claims.azp !== config.clientId) ||
      !Number.isInteger(claims.exp) || claims.exp <= seconds ||
      !Number.isInteger(claims.iat) || claims.iat > seconds + 60 ||
      !sameRandomValue(claims.nonce, nonce) ||
      claims.email_verified !== true ||
      typeof claims.sub !== "string" || !claims.sub || claims.sub.length > 255 ||
      typeof claims.email !== "string" || !claims.email || claims.email.length > 320) {
    throw new Error("invalid_claims");
  }
  return {
    user: {
      id: claims.sub,
      email: claims.email,
      name: typeof claims.name === "string" ? claims.name.slice(0, 160) : claims.email,
    },
  };
}

function isAuthorized(identity) {
  return /^[^@\s]+@gmail\.com$/i.test(identity?.user?.email || "");
}

export async function handleCallback(req, res, { env = process.env, now = Date.now(), fetchImpl = fetch } = {}) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");
  const config = readConfig(env);
  if (!config) return json(res, 503, { error: "Google 로그인 설정이 필요합니다." });
  if (!requestIsForOrigin(req, config)) return json(res, 403, { error: "허용되지 않은 도메인입니다." });

  const flow = unsign(readCookie(req, config.flowCookie), config.sessionSecret);
  res.setHeader("Set-Cookie", cookie(config.flowCookie, "", 0, config));
  const params = getQuery(req, config);
  if (!isValidTimedValue(flow, "flow", config, Math.floor(now / 1000)) ||
      !sameRandomValue(params.get("state"), flow.state) ||
      params.getAll("state").length !== 1 ||
      params.get("iss") !== "https://accounts.google.com") {
    return redirect(res, `${config.origin}/login.html?auth=failed`);
  }
  if (params.get("error")) {
    return redirect(res, `${config.origin}/login.html?auth=${params.get("error") === "access_denied" ? "cancelled" : "failed"}`);
  }
  const code = params.get("code");
  if (typeof code !== "string" || !code || code.length > 2048 || params.getAll("code").length !== 1) {
    return redirect(res, `${config.origin}/login.html?auth=failed`);
  }

  try {
    const tokenResponse = await fetchImpl(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.callbackUrl,
        grant_type: "authorization_code",
        code_verifier: flow.verifier,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!tokenResponse.ok) throw new Error("token_exchange_failed");
    const tokenData = await tokenResponse.json();
    const identity = await verifyGoogleIdToken(tokenData.id_token, config, flow.nonce, fetchImpl, now);
    if (!isAuthorized(identity)) {
      return redirect(res, `${config.origin}/login.html?auth=forbidden`);
    }
    const issuedAt = Math.floor(now / 1000);
    const session = sign({ type: "session", aud: config.origin, iat: issuedAt,
      exp: issuedAt + SESSION_SECONDS, ...identity }, config.sessionSecret);
    res.setHeader("Set-Cookie", [
      cookie(config.flowCookie, "", 0, config),
      cookie(config.sessionCookie, session, SESSION_SECONDS, config),
    ]);
    return redirect(res, config.origin);
  } catch (error) {
    console.error("Google sign-in failed:", error?.message || "unknown_error");
    return redirect(res, `${config.origin}/login.html?auth=failed`);
  }
}

export function getSessionFromCookie(cookieHeader, env = process.env, now = Date.now()) {
  const config = readConfig(env);
  if (!config) return null;
  const session = unsign(readCookie({ headers: { cookie: cookieHeader } }, config.sessionCookie), config.sessionSecret);
  const valid = isValidTimedValue(session, "session", config, Math.floor(now / 1000)) &&
    typeof session.user?.id === "string" && typeof session.user?.email === "string" &&
    isAuthorized(session);
  return valid ? session.user : null;
}

export function handleSession(req, res, { env = process.env, now = Date.now() } = {}) {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");
  const config = readConfig(env);
  if (!config || !requestIsForOrigin(req, config)) return json(res, 200, { configured: false, user: null });
  const user = getSessionFromCookie(req.headers?.cookie, env, now);
  if (!user && readCookie(req, config.sessionCookie)) {
    res.setHeader("Set-Cookie", cookie(config.sessionCookie, "", 0, config));
  }
  return json(res, 200, { configured: true, user });
}

export function handleLogout(req, res, { env = process.env } = {}) {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");
  const config = readConfig(env);
  if (!config) return json(res, 503, { error: "Google 로그인 설정이 필요합니다." });
  if (!requestIsForOrigin(req, config) || req.headers?.origin !== config.origin) {
    return json(res, 403, { error: "허용되지 않은 요청입니다." });
  }
  res.setHeader("Set-Cookie", cookie(config.sessionCookie, "", 0, config));
  return json(res, 200, { user: null });
}
