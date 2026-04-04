globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, f as renderComponent, r as renderTemplate, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_DjdN7mmd.mjs';
import { $ as $$Base } from '../chunks/Base_IEYemnIR.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_CKYqEOt9.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const configResult = await Astro2.locals.runtime.env.DB.prepare("SELECT key, value FROM config").all();
  const config = Object.fromEntries(
    configResult.results.map((r) => [r.key, r.value])
  );
  const postsResult = await Astro2.locals.runtime.env.DB.prepare("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC").all();
  const posts = postsResult.results;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `All Posts - ${config.site_title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-4xl font-bold mb-8">All Posts</h1> <div class="space-y-6"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post })}`)} </div> ` })}`;
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
