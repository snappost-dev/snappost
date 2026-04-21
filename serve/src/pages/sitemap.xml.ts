import type { APIRoute } from "astro";
import { loadBlogConfig, localBlogConfig } from "../lib/blog-config";
import { queryD1 } from "../lib/d1";
import { absoluteUrl, resolveSiteOrigin } from "../lib/site-url";
import { escapeXml } from "../lib/xml-escape";

type SitemapPostRow = {
  slug: string;
  updated_at: string | null;
};

export const GET: APIRoute = async ({ locals, url }) => {
  const tenantConfig = locals.tenant.config;
  const d1ApiEnv = locals.d1ApiEnv;
  const config = tenantConfig
    ? await loadBlogConfig(tenantConfig.d1_database_id, d1ApiEnv)
    : localBlogConfig();
  const origin = resolveSiteOrigin({}, url.href, config.custom_domain);

  const posts = tenantConfig
    ? await queryD1<SitemapPostRow>(
        "SELECT slug, updated_at FROM posts WHERE published = 1 ORDER BY created_at DESC",
        [],
        tenantConfig.d1_database_id,
        d1ApiEnv
      )
    : [];

  const staticUrls = [absoluteUrl(origin, "/"), absoluteUrl(origin, "/blog")];

  const staticEntries = staticUrls
    .map((entryUrl) => `  <url><loc>${escapeXml(entryUrl)}</loc></url>`)
    .join("\n");

  const postEntries = posts
    .map((post) => {
      const loc = absoluteUrl(origin, `/blog/${post.slug}`);
      const lastmod = post.updated_at ? `<lastmod>${new Date(post.updated_at).toISOString()}</lastmod>` : "";
      return `  <url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
