import type { APIRoute } from "astro";
import { isApiAuthorized } from "../../../lib/api-auth";
import { queryD1 } from "../../../lib/d1";

export const DELETE: APIRoute = async ({ params, locals, request, cookies }) => {
  const tenantConfig = locals.tenant.config;
  const d1ApiEnv = locals.d1ApiEnv;
  const authCookie = cookies.get("auth")?.value;

  if (!isApiAuthorized(request, tenantConfig, authCookie)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const rawId = params.id ?? "";
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return new Response(JSON.stringify({ error: "Invalid post id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!tenantConfig) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  const post = await queryD1<{ id: number }>(
    "SELECT id FROM posts WHERE id = ? LIMIT 1",
    [id],
    tenantConfig.d1_database_id,
    d1ApiEnv
  );

  if (post.length === 0) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  await queryD1(
    "DELETE FROM posts WHERE id = ?",
    [id],
    tenantConfig.d1_database_id,
    d1ApiEnv
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
