import { getSessionFromCookie, readConfig } from "./api/auth/_core.mjs";
import { next } from "@vercel/functions";

export const config = { runtime: "nodejs" };

const PUBLIC_PATHS = new Set([
  "/login.html",
  "/about.html",
  "/privacy.html",
  "/terms.html",
  "/info.css",
  "/api/auth/start",
  "/api/auth/callback",
  "/api/auth/session",
  "/api/auth/logout",
]);

export function authorizeRequest(request, env = process.env, now = Date.now()) {
  const url = new URL(request.url);
  if (PUBLIC_PATHS.has(url.pathname)) return;

  const authConfig = readConfig(env);
  const user = authConfig && url.origin === authConfig.origin
    ? getSessionFromCookie(request.headers.get("cookie"), env, now)
    : null;
  if (user) return;

  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (request.method === "GET" && request.headers.get("accept")?.includes("text/html")) {
    return new Response(null, { status: 302, headers: { ...headers, Location: "/login.html" } });
  }
  return new Response("로그인이 필요합니다.", { status: 401, headers });
}

export default function middleware(request) {
  return authorizeRequest(request) ?? next();
}
