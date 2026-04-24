import type { APIRoute } from "astro";
import { isApiAuthorized } from "../../../../lib/api-auth";
import { queryD1 } from "../../../../lib/d1";

type PublishBody = {
  published?: unknown;
};

export const PATCH: APIRoute = async ({ params, request, locals, cookies }) => {
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

  let body: PublishBody;
  try {
    body = (await request.json()) as PublishBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const publishedRaw = body.published;
  if (publishedRaw !== 0 && publishedRaw !== 1) {
    return new Response(JSON.stringify({ error: "published must be 0 or 1" }), {
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
    "UPDATE posts SET published = ?, updated_at = ? WHERE id = ?",
    [publishedRaw, new Date().toISOString(), id],
    tenantConfig.d1_database_id,
    d1ApiEnv
  );

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
