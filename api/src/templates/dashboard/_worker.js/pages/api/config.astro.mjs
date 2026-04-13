globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, locals }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const key = typeof body.key === "string" ? body.key.trim() : "";
  const value = typeof body.value === "string" ? body.value.trim() : "";
  if (!key || !value) {
    return new Response(JSON.stringify({ error: "key and value are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  await locals.runtime.env.DB.prepare(
    "INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).bind(key, value).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
