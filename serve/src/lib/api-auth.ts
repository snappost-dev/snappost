type TenantConfigLike = {
  access_token?: string;
} | null;

function readBearerToken(request: Request): string | undefined {
  const raw = request.headers.get("authorization") ?? "";
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const prefix = "bearer ";
  if (trimmed.toLowerCase().startsWith(prefix)) {
    return trimmed.slice(prefix.length).trim() || undefined;
  }

  return trimmed;
}

export function isApiAuthorized(
  request: Request,
  tenantConfig: TenantConfigLike,
  authCookieValue: string | undefined
): boolean {
  if (!tenantConfig) {
    return true;
  }

  const expected = (tenantConfig.access_token ?? "").trim();
  if (!expected) {
    return false;
  }

  const bearerToken = readBearerToken(request);
  return bearerToken === expected || authCookieValue === expected;
}
