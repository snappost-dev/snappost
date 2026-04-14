globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const DELETE = async ({ params, locals }) => {
  const rawId = params.id ?? "";
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return new Response(JSON.stringify({ error: "Invalid post id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const result = await locals.runtime.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  const deleted = Number(result.meta?.changes ?? 0);
  if (deleted === 0) {
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
  DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
