import type { APIRoute } from "astro";
import { loadBlogConfig, localBlogConfig } from "../lib/blog-config";
import { queryD1 } from "../lib/d1";
import { absoluteUrl, resolveSiteOrigin } from "../lib/site-url";
import { escapeXml } from "../lib/xml-escape";

type RssPostRow = {
  title: string;
  description: string | null;
  slug: string;
  created_at: string;
};

export const GET: APIRoute = async ({ locals, url }) => {
  const tenantConfig = locals.tenant.config;
  const d1ApiEnv = locals.d1ApiEnv;
  const config = tenantConfig
    ? await loadBlogConfig(tenantConfig.d1_database_id, d1ApiEnv)
    : localBlogConfig();

  const posts = tenantConfig
    ? await queryD1<RssPostRow>(
        "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC",
        [],
        tenantConfig.d1_database_id,
        d1ApiEnv
      )
    : [];

  const origin = resolveSiteOrigin({}, url.href, config.custom_domain);
  const homeUrl = absoluteUrl(origin, "/");

  const items = posts
    .map((post) => {
      const itemLink = absoluteUrl(origin, `/blog/${post.slug}`);
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description || "")}</description>
      <link>${escapeXml(itemLink)}</link>
      <guid isPermaLink="true">${escapeXml(itemLink)}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(config.site_title)}</title>
    <description>${escapeXml(config.site_description)}</description>
    <link>${escapeXml(homeUrl)}</link>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
