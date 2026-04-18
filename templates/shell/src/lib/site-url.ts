/** Kiracı blog için mutlak URL tabanı (SEO, RSS). Öncelik: custom domain -> SITE_URL -> request origin. */
export function resolveSiteOrigin(
  env: { SITE_URL?: string },
  requestUrl: string,
  customDomain?: string | null
): string {
  const customRaw = customDomain?.trim();
  if (customRaw) {
    const host = customRaw.replace(/^https?:\/\//, '').split('/')[0]?.replace(/\.$/, '') ?? '';
    if (host) {
      try {
        return new URL(`https://${host}`).origin;
      } catch {
        /* geçersiz custom domain */
      }
    }
  }

  const raw = env.SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      /* geçersiz SITE_URL */
    }
  }
  return new URL(requestUrl).origin;
}

export function absoluteUrl(origin: string, pathnameAndSearch: string): string {
  const o = origin.replace(/\/$/, '');
  const p =
    pathnameAndSearch.startsWith('/') || pathnameAndSearch === ''
      ? pathnameAndSearch || '/'
      : `/${pathnameAndSearch}`;
  return `${o}${p}`;
}
