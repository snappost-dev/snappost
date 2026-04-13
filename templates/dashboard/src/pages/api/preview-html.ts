import type { APIRoute } from 'astro';
import { renderEditorJSToHTML } from '@snappost/editor-html';

export const prerender = false;

/** Editor.js `save()` çıktısı → sunucu tarafı HTML (önizleme = kayıt ile aynı renderer). */
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Geçersiz JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body || typeof body !== 'object' || !Array.isArray((body as { blocks?: unknown }).blocks)) {
    return new Response(JSON.stringify({ error: 'Editor.js çıktısı bekleniyor (blocks dizisi)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const html = renderEditorJSToHTML(body as { blocks: unknown[] });
  return new Response(JSON.stringify({ html }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
