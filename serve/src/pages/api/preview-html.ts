import type { APIRoute } from "astro";
import { renderEditorJSToHTML } from "../../lib/editor";
import { isApiAuthorized } from "../../lib/api-auth";
import { requireDashboardAuth } from "../../lib/dashboard-auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const authResult = await requireDashboardAuth({ cookies, locals, isApi: true });
  if (authResult) return authResult;

  const tenantConfig = locals.tenant.config;
  const authCookie = cookies.get("auth")?.value;

  if (!isApiAuthorized(request, tenantConfig, authCookie)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Geçersiz JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!body || typeof body !== "object" || !Array.isArray((body as { blocks?: unknown }).blocks)) {
    return new Response(JSON.stringify({ error: "Editor.js çıktısı bekleniyor (blocks dizisi)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const html = renderEditorJSToHTML(body as { blocks: unknown[] });
  return new Response(JSON.stringify({ html }), {
    headers: { "Content-Type": "application/json" }
  });
};
