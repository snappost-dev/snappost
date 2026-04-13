import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Editor.js Image → provisioning API medya yükleme (cookie ile korunur).
 * Sunucu ACCESS_TOKEN ile API’ye proxy’ler; tarayıcıya token gitmez.
 *
 * Cloudflare Workers’ta gelen FormData’nın doğrudan forward edilmesi bazen kırılır;
 * dosyayı buffer’a alıp yeni FormData ile gönderiyoruz.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const apiUrl = env.SNAPPOST_API_URL?.replace(/\/$/, '');
  const siteId = env.SNAPPOST_SITE_ID?.trim();
  const token = env.ACCESS_TOKEN?.trim();

  if (!apiUrl || !siteId || !token) {
    return new Response(
      JSON.stringify({ success: 0, error: 'Medya yükleme yapılandırılmamış (SNAPPOST_*)' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return new Response(JSON.stringify({ success: 0, error: 'Geçersiz form' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const field = incoming.get('file') ?? incoming.get('image');
  if (!field || typeof field === 'string') {
    return new Response(
      JSON.stringify({ success: 0, error: 'multipart alanı file veya image gerekli' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const outbound = new FormData();
  try {
    if (field instanceof File) {
      const buf = await field.arrayBuffer();
      const blob = new Blob([buf], {
        type: field.type || 'application/octet-stream',
      });
      outbound.append('file', blob, field.name || 'upload.jpg');
    } else {
      outbound.append('file', field, 'upload.jpg');
    }
  } catch {
    return new Response(JSON.stringify({ success: 0, error: 'Dosya okunamadı' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const upstream = await fetch(`${apiUrl}/api/sites/${encodeURIComponent(siteId)}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: outbound,
  });

  const text = await upstream.text();
  let payload: { url?: string; error?: string };
  try {
    payload = JSON.parse(text) as { url?: string; error?: string };
  } catch {
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('Content-Type') || 'application/json' },
    });
  }

  if (!upstream.ok || !payload.url) {
    return new Response(
      JSON.stringify({
        success: 0,
        error: payload.error || `Yükleme başarısız (${upstream.status})`,
      }),
      {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(JSON.stringify({ success: 1, file: { url: payload.url } }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
