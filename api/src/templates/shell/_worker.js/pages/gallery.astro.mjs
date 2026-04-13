globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                  */
import { c as createComponent, d as renderComponent, r as renderTemplate, b as createAstro, m as maybeRenderHead, a as addAttribute } from '../chunks/astro/server_BmAI9ip8.mjs';
import { $ as $$Base } from '../chunks/Base_D70NBInT.mjs';
import { l as loadBlogConfig } from '../chunks/site-url_BzCZPAzq.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Gallery = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Gallery;
  const config = await loadBlogConfig(Astro2.locals.runtime.env.DB);
  const postsResult = await Astro2.locals.runtime.env.DB.prepare(
    "SELECT slug, title, description, content_html, created_at FROM posts WHERE published = 1 ORDER BY created_at DESC"
  ).all();
  const posts = postsResult.results;
  function firstImageSrc(html) {
    if (!html) return null;
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1].trim() : null;
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `Galeri \u2014 ${config.site_title}`, "description": config.site_description, "config": config }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-bold mb-2">Galeri</h1> <p class="text-gray-600 mb-8">
Yayınlanmış yazılardan görseller. Yazıda görsel yoksa sadece başlık gösterilir.
</p> ${posts.length === 0 ? renderTemplate`<p class="text-gray-500">Henüz yayınlanmış yazı yok.</p>` : renderTemplate`<ul class="grid grid-cols-1 sm:grid-cols-2 gap-6"> ${posts.map((post) => {
    const img = firstImageSrc(post.content_html);
    return renderTemplate`<li> <a${addAttribute(`/blog/${post.slug}`, "href")} class="block bg-white rounded-lg border overflow-hidden hover:shadow-md transition"> ${img ? renderTemplate`<div class="aspect-video bg-gray-100 overflow-hidden"> <img${addAttribute(img, "src")} alt="" class="w-full h-full object-cover" loading="lazy" decoding="async"> </div>` : renderTemplate`<div class="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-sm">
Görsel yok
</div>`} <div class="p-4"> <h2 class="font-semibold text-lg hover:text-blue-600">${post.title}</h2> ${post.description && renderTemplate`<p class="text-sm text-gray-600 mt-1 line-clamp-2">${post.description}</p>`} </div> </a> </li>`;
  })} </ul>`}` })}`;
}, "/home/aurora/snappost/templates/shell/src/pages/gallery.astro", void 0);

const $$file = "/home/aurora/snappost/templates/shell/src/pages/gallery.astro";
const $$url = "/gallery";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Gallery,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
