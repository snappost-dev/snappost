globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../renderers.mjs';

async function GET(context) {
  const db = context.locals.runtime.env.DB;
  const configResult = await db.prepare("SELECT key, value FROM config").all();
  const config = Object.fromEntries(
    configResult.results.map((r) => [r.key, r.value])
  );
  const postsResult = await db.prepare(
    "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 20"
  ).all();
  const posts = postsResult.results;
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${config.site_title}</title>
    <description>${config.site_description}</description>
    <link>https://example.com</link>
    ${posts.map((post) => `
    <item>
      <title>${post.title}</title>
      <description>${post.description || ""}</description>
      <link>https://example.com/blog/${post.slug}</link>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
    </item>
    `).join("")}
  </channel>
</rss>`;
  return new Response(rss, {
    headers: { "Content-Type": "application/xml" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
