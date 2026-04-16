import type { APIRoute } from 'astro';
import { absoluteUrl, resolveSiteOrigin } from '../lib/site-url';
import { escapeXml } from '../lib/xml-escape';

type SitemapPostRow = {
  slug: string;
  updated_at: string | null;
};

export const GET: APIRoute = async ({ locals, url }) => {
  const db = locals.runtime.env.DB;
  const origin = resolveSiteOrigin(locals.runtime.env, url.href);

  const postsResult = await db
    .prepare('SELECT slug, updated_at FROM posts WHERE published = 1 ORDER BY created_at DESC')
    .all<SitemapPostRow>();
  const posts = postsResult.results ?? [];

  const staticUrls = [
    absoluteUrl(origin, '/'),
    absoluteUrl(origin, '/blog'),
  ];

  const staticEntries = staticUrls
    .map((entryUrl) => `  <url><loc>${escapeXml(entryUrl)}</loc></url>`)
    .join('\n');

  const postEntries = posts
    .map((post) => {
      const loc = absoluteUrl(origin, `/blog/${post.slug}`);
      const lastmod = post.updated_at ? `<lastmod>${new Date(post.updated_at).toISOString()}</lastmod>` : '';
      return `  <url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
