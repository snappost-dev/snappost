globalThis.process ??= {}; globalThis.process.env ??= {};
function resolveSiteOrigin(env, requestUrl) {
  const raw = env.SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
    }
  }
  return new URL(requestUrl).origin;
}
function absoluteUrl(origin, pathnameAndSearch) {
  const o = origin.replace(/\/$/, "");
  const p = pathnameAndSearch.startsWith("/") || pathnameAndSearch === "" ? pathnameAndSearch || "/" : `/${pathnameAndSearch}`;
  return `${o}${p}`;
}

export { absoluteUrl as a, resolveSiteOrigin as r };
