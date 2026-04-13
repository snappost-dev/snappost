import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = typeof (body as { key?: unknown }).key === 'string'
    ? (body as { key: string }).key.trim()
    : '';
  const value = typeof (body as { value?: unknown }).value === 'string'
    ? (body as { value: string }).value.trim()
    : '';

  if (!key || !value) {
    return new Response(JSON.stringify({ error: 'key and value are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await locals.runtime.env.DB
    .prepare(
      'INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    )
    .bind(key, value)
    .run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
