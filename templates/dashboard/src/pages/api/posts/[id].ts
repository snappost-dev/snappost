import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ params, locals }) => {
  const rawId = params.id ?? '';
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return new Response(JSON.stringify({ error: 'Invalid post id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await locals.runtime.env.DB
    .prepare('DELETE FROM posts WHERE id = ?')
    .bind(id)
    .run();

  const deleted = Number(result.meta?.changes ?? 0);
  if (deleted === 0) {
    return new Response(JSON.stringify({ error: 'Post not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
