import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";

type TenantConfig = {
  d1_database_id: string;
  shell_type: string;
  user_id: string;
  access_token?: string;
};

function resolveSubdomain(hostname: string): string {
  const host = hostname.toLowerCase().trim().split(":")[0];

  if (
    host === "localhost" ||
    host.startsWith("127.") ||
    host === "::1" ||
    host === ""
  ) {
    return "local";
  }

  const parts = host.split(".");
  if (parts.length >= 3) {
    return parts[0];
  }

  return "local";
}

function isTenantConfig(value: unknown): value is TenantConfig {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const config = value as Record<string, unknown>;
  return (
    typeof config.d1_database_id === "string" &&
    typeof config.shell_type === "string" &&
    typeof config.user_id === "string" &&
    (typeof config.access_token === "undefined" ||
      typeof config.access_token === "string")
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const requestUrl = new URL(context.request.url);
  const forwardedHost = context.request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const hostHeader = context.request.headers.get("host");

  const hostname = forwardedHost ?? hostHeader ?? requestUrl.hostname;
  const subdomain = resolveSubdomain(hostname);
  const d1ApiEnv = {
    CF_ACCOUNT_ID: env.CF_ACCOUNT_ID ?? "",
    CF_API_TOKEN: env.CF_API_TOKEN ?? ""
  };

  if (subdomain === "local") {
    context.locals.tenant = { subdomain, config: null };
    context.locals.d1ApiEnv = d1ApiEnv;
    return next();
  }

  try {
    const tenantKv = (env as { TENANT_KV?: KVNamespace }).TENANT_KV;
    if (!tenantKv) {
      return new Response("Site not found", { status: 404 });
    }

    const storedValue = await tenantKv.get(subdomain, "json");
    const config =
      typeof storedValue === "string"
        ? JSON.parse(storedValue)
        : storedValue;

    if (!isTenantConfig(config)) {
      return new Response("Site not found", { status: 404 });
    }

    context.locals.tenant = { subdomain, config };
    context.locals.d1ApiEnv = d1ApiEnv;
  } catch {
    return new Response("Site not found", { status: 404 });
  }

  return next();
});
