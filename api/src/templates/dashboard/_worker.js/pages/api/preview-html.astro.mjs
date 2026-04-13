globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderEditorJSToHTML } from '../../chunks/editor-html_WvNIgpGN.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Geçersiz JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!body || typeof body !== "object" || !Array.isArray(body.blocks)) {
    return new Response(JSON.stringify({ error: "Editor.js çıktısı bekleniyor (blocks dizisi)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const html = renderEditorJSToHTML(body);
  return new Response(JSON.stringify({ html }), {
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
