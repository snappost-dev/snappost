globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../../renderers.mjs';

const PATCH = async ({ params, request, locals }) => {
  const rawId = params.id ?? "";
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return new Response(JSON.stringify({ error: "Invalid post id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const publishedRaw = body.published;
  if (publishedRaw !== 0 && publishedRaw !== 1) {
    return new Response(JSON.stringify({ error: "published must be 0 or 1" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const result = await locals.runtime.env.DB.prepare("UPDATE posts SET published = ?, updated_at = ? WHERE id = ?").bind(publishedRaw, (/* @__PURE__ */ new Date()).toISOString(), id).run();
  const changes = Number(result.meta?.changes ?? 0);
  if (changes === 0) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PATCH
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
