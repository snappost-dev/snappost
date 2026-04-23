import { defineMiddleware } from "astro:middleware";
import type { APIContext } from "astro";

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

function apiBaseUrl(context: APIContext): string {
  const envApiUrl = context.locals.runtime.env.API_URL;
  if (typeof envApiUrl === "string" && envApiUrl.trim()) {
    return envApiUrl.replace(/\/$/, "");
  }
  return "https://snappost-api.snappost-dev.workers.dev";
}

async function isOwnedSite(authToken: string, siteName: string, context: APIContext): Promise<boolean> {
  const apiBase = apiBaseUrl(context);
  const headers = { Authorization: `Bearer ${authToken}` };

  const meRes = await fetch(`${apiBase}/api/auth/me`, { headers });
  if (!meRes.ok) return false;

  const sitesRes = await fetch(`${apiBase}/api/sites`, { headers });
  if (!sitesRes.ok) return false;
  const sitesPayload = (await sitesRes.json()) as { sites?: Array<{ site_name?: string }> };
  return Boolean(sitesPayload.sites?.some((s) => s.site_name === siteName));
}

async function resolveTenantFromKv(
  siteName: string,
  env: { TENANT_KV?: KVNamespace }
): Promise<TenantConfig | null> {
  const tenantKv = env.TENANT_KV;
  if (!tenantKv) return null;
  const storedValue = await tenantKv.get(siteName, "json");
  const config =
    typeof storedValue === "string"
      ? JSON.parse(storedValue)
      : storedValue;
  return isTenantConfig(config) ? config : null;
}

export const onRequest = defineMiddleware(async (context: APIContext, next) => {
  const request = context.request;
  const host =
    request.headers.get("X-Forwarded-Host") ||
    request.headers.get("Host") ||
    "";
  const hostname = host.split(",")[0]?.trim() ?? "";
  const normalizedHost = hostname.toLowerCase().split(":")[0];
  const runtime = context.locals.runtime;
  const env = runtime.env as {
    CF_ACCOUNT_ID?: string;
    CF_API_TOKEN?: string;
    TENANT_KV?: KVNamespace;
  };
  const d1ApiEnv = {
    CF_ACCOUNT_ID: env.CF_ACCOUNT_ID ?? "",
    CF_API_TOKEN: env.CF_API_TOKEN ?? ""
  };

  if (normalizedHost === "snappost.app") {
    context.locals.isLanding = true;
    context.locals.tenant = { subdomain: "landing", config: null };
    context.locals.d1ApiEnv = d1ApiEnv;

    const path = new URL(request.url).pathname;
    const manageMatch = path.match(/^\/manage\/([^/]+)\/(?:dashboard|api)(?:\/|$)/);
    const activeSiteCookie = context.cookies.get("active_site")?.value;
    const needsTenantByActiveSite =
      !manageMatch && (path.startsWith("/dashboard") || path.startsWith("/api")) && !!activeSiteCookie;
    const targetSiteName = manageMatch?.[1] ?? (needsTenantByActiveSite ? activeSiteCookie : undefined);

    if (!targetSiteName) {
      return next();
    }

    if (manageMatch) {
      const authToken = context.cookies.get("auth_token")?.value;
      if (!authToken) {
        if (path.includes("/api/")) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        return context.redirect("/login");
      }

      try {
        const owned = await isOwnedSite(authToken, targetSiteName, context);
        if (!owned) {
          if (path.includes("/api/")) {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
              status: 403,
              headers: { "Content-Type": "application/json" }
            });
          }
          return context.redirect("/login");
        }
      } catch {
        if (path.includes("/api/")) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        return context.redirect("/login");
      }
    }

    try {
      const config = await resolveTenantFromKv(targetSiteName, env);
      if (!config) {
        return new Response("Site not found", { status: 404 });
      }
      context.locals.tenant = { subdomain: targetSiteName, config };
      context.locals.manageSiteName = targetSiteName;
      context.cookies.set("active_site", targetSiteName, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7
      });
      if (config.access_token) {
        context.cookies.set("auth", config.access_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7
        });
      }
    } catch {
      return new Response("Site not found", { status: 404 });
    }

    return next();
  }

  context.locals.isLanding = false;
  const subdomain = resolveSubdomain(hostname);

  if (subdomain === "local") {
    context.locals.tenant = { subdomain, config: null };
    context.locals.d1ApiEnv = d1ApiEnv;
    return next();
  }

  try {
    const tenantKv = env.TENANT_KV;
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
