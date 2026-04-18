globalThis.process ??= {}; globalThis.process.env ??= {};
import { l as loadBlogConfig, r as resolveSiteOrigin, a as absoluteUrl } from '../chunks/site-url_By8AeHdH.mjs';
import { e as escapeXml } from '../chunks/xml-escape_B3aNQUL_.mjs';
export { renderers } from '../renderers.mjs';

const GET = async ({ locals, url }) => {
  const db = locals.runtime.env.DB;
  const config = await loadBlogConfig(db);
  const origin = resolveSiteOrigin(locals.runtime.env, url.href, config.custom_domain);
  const postsResult = await db.prepare("SELECT slug, updated_at FROM posts WHERE published = 1 ORDER BY created_at DESC").all();
  const posts = postsResult.results ?? [];
  const staticUrls = [
    absoluteUrl(origin, "/"),
    absoluteUrl(origin, "/blog")
  ];
  const staticEntries = staticUrls.map((entryUrl) => `  <url><loc>${escapeXml(entryUrl)}</loc></url>`).join("\n");
  const postEntries = posts.map((post) => {
    const loc = absoluteUrl(origin, `/blog/${post.slug}`);
    const lastmod = post.updated_at ? `<lastmod>${new Date(post.updated_at).toISOString()}</lastmod>` : "";
    return `  <url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
