import type { APIRoute } from 'astro';
import { loadBlogConfig } from '../lib/blog-config';
import { absoluteUrl, resolveSiteOrigin } from '../lib/site-url';
import { escapeXml } from '../lib/xml-escape';

export const GET: APIRoute = async ({ locals, url }) => {
  const db = locals.runtime.env.DB;
  const config = await loadBlogConfig(db);

  const postsResult = await db
    .prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 20')
    .all();

  const posts = postsResult.results as {
    title: string;
    description: string | null;
    slug: string;
    created_at: string;
  }[];

  const origin = resolveSiteOrigin(locals.runtime.env, url.href);
  const homeUrl = absoluteUrl(origin, '/');

  const items = posts
    .map((post) => {
      const itemLink = absoluteUrl(origin, `/blog/${post.slug}`);
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description || '')}</description>
      <link>${escapeXml(itemLink)}</link>
      <guid isPermaLink="true">${escapeXml(itemLink)}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    </item>`;
    })
    .join('');

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
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
