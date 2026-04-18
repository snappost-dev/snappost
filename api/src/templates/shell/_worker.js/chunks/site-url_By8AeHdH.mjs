globalThis.process ??= {}; globalThis.process.env ??= {};
async function loadBlogConfig(db) {
  const configResult = await db.prepare("SELECT key, value FROM config").all();
  return Object.fromEntries(
    configResult.results.map((r) => [r.key, r.value])
  );
}

function resolveSiteOrigin(env, requestUrl, customDomain) {
  const customRaw = customDomain?.trim();
  if (customRaw) {
    const host = customRaw.replace(/^https?:\/\//, "").split("/")[0]?.replace(/\.$/, "") ?? "";
    if (host) {
      try {
        return new URL(`https://${host}`).origin;
      } catch {
      }
    }
  }
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

export { absoluteUrl as a, loadBlogConfig as l, resolveSiteOrigin as r };
