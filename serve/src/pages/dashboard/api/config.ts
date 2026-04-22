import type { APIRoute } from "astro";
import { isApiAuthorized } from "../../../lib/api-auth";
import { queryD1 } from "../../../lib/d1";

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  const tenantConfig = locals.tenant.config;
  const d1ApiEnv = locals.d1ApiEnv;
  const authCookie = cookies.get("auth")?.value;

  if (!isApiAuthorized(request, tenantConfig, authCookie)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!tenantConfig) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const key =
    typeof (body as { key?: unknown }).key === "string"
      ? (body as { key: string }).key.trim()
      : "";
  const value =
    typeof (body as { value?: unknown }).value === "string"
      ? (body as { value: string }).value.trim()
      : "";

  if (!key || !value) {
    return new Response(JSON.stringify({ error: "key and value are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  await queryD1(
    "INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, value],
    tenantConfig.d1_database_id,
    d1ApiEnv
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
};
