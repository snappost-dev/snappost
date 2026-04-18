globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, d as renderComponent, r as renderTemplate, b as createAstro, m as maybeRenderHead, a as addAttribute } from '../chunks/astro/server_RcnIsM-u.mjs';
import { n as normalizeLanguage, l as loadTranslations, g as getDateLocale, $ as $$Base } from '../chunks/Base_59vZvpsA.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_BhkuaLvp.mjs';
import { l as loadBlogConfig } from '../chunks/blog-config_8QCYqaqZ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const db = Astro2.locals.runtime.env.DB;
  const config = await loadBlogConfig(db);
  const siteLang = normalizeLanguage(config.site_lang || "en");
  const t = loadTranslations(siteLang);
  const dateLocale = getDateLocale(siteLang);
  const postsResult = await db.prepare("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 3").all();
  const posts = postsResult.results;
  const blogLayoutRaw = String(config.blog_layout ?? "list").trim();
  const blogLayout = blogLayoutRaw === "grid" || blogLayoutRaw === "featured" ? blogLayoutRaw : "list";
  const featuredPost = blogLayout === "featured" ? posts[0] : null;
  const remainingPosts = blogLayout === "featured" ? posts.slice(1) : posts;
  const featuredDate = featuredPost ? new Date(featuredPost.created_at).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";
  const featuredDescription = (featuredPost?.description ?? "").trim();
  const featuredImgMatch = featuredPost?.content_html?.match(/<img[^>]+src="([^"]+)"/);
  const featuredThumbnail = featuredImgMatch?.[1] ?? null;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": config.site_title, "description": config.site_description, "canonicalPath": "/" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="mb-10 rounded-box border border-base-300 bg-base-100 p-6 text-center"> <h1 class="text-4xl font-bold mb-4">${config.site_title}</h1> <p class="text-xl text-base-content/70">${config.site_description}</p> <div class="mt-6"> <a href="/blog" class="link link-primary text-sm font-medium">${t.all_posts_link}</a> </div> </section> ${blogLayout === "grid" ? renderTemplate`<div class="grid grid-cols-1 gap-6 md:grid-cols-2"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "locale": dateLocale })}`)} </div>` : blogLayout === "featured" ? renderTemplate`<div class="space-y-6"> ${featuredPost && renderTemplate`<article class="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"> ${featuredThumbnail && renderTemplate`<figure class="max-h-96 overflow-hidden"> <img${addAttribute(featuredThumbnail, "src")} alt="" class="h-full w-full object-cover"> </figure>`} <a${addAttribute(`/blog/${featuredPost.slug}`, "href")} class="card-body block"> <h2 class="mb-2 text-2xl font-bold hover:text-primary">${featuredPost.title}</h2> ${featuredDescription && renderTemplate`<p class="mb-4 text-base-content/80">${featuredDescription}</p>`} <time class="text-sm text-base-content/60">${featuredDate}</time> </a> </article>`} ${remainingPosts.length > 0 && renderTemplate`<div class="grid grid-cols-1 gap-6 md:grid-cols-2"> ${remainingPosts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "locale": dateLocale })}`)} </div>`} </div>` : renderTemplate`<div class="space-y-6"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "locale": dateLocale })}`)} </div>`}` })}`;
}, "/home/aurora/snappost/templates/shell/src/pages/index.astro", void 0);

const $$file = "/home/aurora/snappost/templates/shell/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
