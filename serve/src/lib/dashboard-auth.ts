type TenantConfigLike = {
  access_token?: string;
  user_id?: string;
} | null;

type KvTenantConfig = {
  access_token?: unknown;
  user_id?: unknown;
} | null;

type DashboardGuardContext = {
  cookies: {
    get(name: string): { value: string } | undefined;
  };
  locals: App.Locals;
  redirect?: (path: string) => Response;
  isApi?: boolean;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseKvTenantConfig(value: unknown): KvTenantConfig {
  if (!value || typeof value !== "object") {
    return null;
  }
  return value as KvTenantConfig;
}

export async function requireDashboardAuth(ctx: DashboardGuardContext): Promise<Response | null> {
  const unauthorized = () => {
    if (ctx.isApi) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return ctx.redirect ? ctx.redirect("/dashboard/login") : new Response(null, { status: 401 });
  };

  const tenantConfig = ctx.locals.tenant.config as TenantConfigLike;
  if (!tenantConfig) {
    return null;
  }

  const authCookie = readString(ctx.cookies.get("auth")?.value);
  const authUserIdCookie = readString(ctx.cookies.get("auth_user_id")?.value);
  if (!authCookie || !authUserIdCookie) {
    return unauthorized();
  }

  const subdomain = readString(ctx.locals.tenant.subdomain);
  const tenantKv = ctx.locals.runtime.env.TENANT_KV;
  if (!subdomain || !tenantKv) {
    return unauthorized();
  }

  try {
    const kvRaw = await tenantKv.get(subdomain, "json");
    const kvConfig = parseKvTenantConfig(
      typeof kvRaw === "string" ? JSON.parse(kvRaw) : kvRaw
    );
    if (!kvConfig) {
      return unauthorized();
    }

    const kvUserId = readString(kvConfig.user_id);
    const kvAccessToken = readString(kvConfig.access_token);
    if (!kvUserId || !kvAccessToken) {
      return unauthorized();
    }

    if (authUserIdCookie !== kvUserId || authCookie !== kvAccessToken) {
      return unauthorized();
    }
  } catch {
    return unauthorized();
  }

  return null;
}
