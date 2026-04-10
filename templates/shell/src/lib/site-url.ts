/** Kiracı blog için mutlak URL tabanı (SEO, RSS). `SITE_URL` yoksa isteğin origin’i. */
export function resolveSiteOrigin(env: { SITE_URL?: string }, requestUrl: string): string {
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
