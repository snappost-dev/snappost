globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const apiUrl = env.SNAPPOST_API_URL?.replace(/\/$/, "");
  const siteId = env.SNAPPOST_SITE_ID?.trim();
  const token = env.ACCESS_TOKEN?.trim();
  if (!apiUrl || !siteId || !token) {
    return new Response(
      JSON.stringify({ success: 0, error: "Medya yükleme yapılandırılmamış (SNAPPOST_*)" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
  let body;
  try {
    body = await request.formData();
  } catch {
    return new Response(JSON.stringify({ success: 0, error: "Geçersiz form" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const upstream = await fetch(`${apiUrl}/api/sites/${encodeURIComponent(siteId)}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body
  });
  const text = await upstream.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" }
    });
  }
  if (!upstream.ok || !payload.url) {
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ success: 1, file: { url: payload.url } }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
