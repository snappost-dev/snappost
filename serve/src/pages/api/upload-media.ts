import type { APIRoute } from "astro";
import { isApiAuthorized } from "../../lib/api-auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const tenantConfig = locals.tenant.config;
  const authCookie = cookies.get("auth")?.value;

  if (!isApiAuthorized(request, tenantConfig, authCookie)) {
    return new Response(JSON.stringify({ success: 0, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const runtimeEnv = locals.runtime.env as {
    SNAPPOST_API_URL?: string;
    SNAPPOST_SITE_ID?: string;
  };
  const apiUrl = runtimeEnv.SNAPPOST_API_URL?.replace(/\/$/, "");
  const siteId = runtimeEnv.SNAPPOST_SITE_ID?.trim();
  const token = (tenantConfig?.access_token ?? "").trim();

  if (!apiUrl || !siteId || !token) {
    return new Response(
      JSON.stringify({ success: 0, error: "Medya yükleme yapılandırılmamış (SNAPPOST_* / access_token)" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return new Response(JSON.stringify({ success: 0, error: "Geçersiz form" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const field = incoming.get("file") ?? incoming.get("image");
  if (!field || typeof field === "string") {
    return new Response(
      JSON.stringify({ success: 0, error: "multipart alanı file veya image gerekli" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const outbound = new FormData();
  try {
    if (field instanceof File) {
      const buf = await field.arrayBuffer();
      const blob = new Blob([buf], {
        type: field.type || "application/octet-stream"
      });
      outbound.append("file", blob, field.name || "upload.jpg");
    } else {
      outbound.append("file", field, "upload.jpg");
    }
  } catch {
    return new Response(JSON.stringify({ success: 0, error: "Dosya okunamadı" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const upstream = await fetch(`${apiUrl}/api/sites/${encodeURIComponent(siteId)}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: outbound
  });

  const text = await upstream.text();
  let payload: { url?: string; error?: string };
  try {
    payload = JSON.parse(text) as { url?: string; error?: string };
  } catch {
    return new Response(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" }
    });
  }

  if (!upstream.ok || !payload.url) {
    return new Response(
      JSON.stringify({
        success: 0,
        error: payload.error || `Yükleme başarısız (${upstream.status})`
      }),
      {
        status: upstream.status,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response(JSON.stringify({ success: 1, file: { url: payload.url } }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
