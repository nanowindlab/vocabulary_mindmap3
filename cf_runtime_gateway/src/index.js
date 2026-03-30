export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+/, "");

    if (!key) {
      return new Response("MM3 runtime gateway", { status: 200 });
    }

    const object = await env.MM3_BUCKET.get(key);
    if (!object) {
      return new Response("Object Not Found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", "public, max-age=60");
    headers.set("access-control-allow-origin", "*");

    return new Response(object.body, { headers });
  },
};
