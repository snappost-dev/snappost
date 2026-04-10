globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, d as renderComponent, r as renderTemplate, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_BmAI9ip8.mjs';
import { $ as $$Base } from '../chunks/Base_BgXinofk.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_CFQev01P.mjs';
import { l as loadBlogConfig } from '../chunks/site-url_BzCZPAzq.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const db = Astro2.locals.runtime.env.DB;
  const config = await loadBlogConfig(db);
  const postsResult = await db.prepare("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC").all();
  const posts = postsResult.results;
  const listTitle = `Blog \u2013 ${config.site_title}`;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": listTitle, "description": config.site_description, "canonicalPath": "/blog" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-4xl font-bold mb-8">All Posts</h1> <div class="space-y-6"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post })}`)} </div> ` })}`;
}, "/home/aurora/snappost/templates/shell/src/pages/blog/index.astro", void 0);

const $$file = "/home/aurora/snappost/templates/shell/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
