type TenantConfigLike = {
  access_token?: string;
} | null;

export function isDashboardAuthenticated(
  tenantConfig: TenantConfigLike,
  cookieValue: string | undefined
): boolean {
  if (!tenantConfig) {
    return true;
  }

  const expected = (tenantConfig.access_token ?? "").trim();
  if (!expected) {
    return false;
  }

  return cookieValue === expected;
}
