globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, d as renderComponent, r as renderTemplate, b as createAstro, a as addAttribute, m as maybeRenderHead, u as unescapeHTML } from '../chunks/astro/server_RcnIsM-u.mjs';
import { n as normalizeLanguage, l as loadTranslations, g as getDateLocale, $ as $$Base } from '../chunks/Base_Cu8nUGoL.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_BSq3Conv.mjs';
import { l as loadBlogConfig, r as resolveSiteOrigin, a as absoluteUrl } from '../chunks/site-url_By8AeHdH.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const db = Astro2.locals.runtime.env.DB;
  const config = await loadBlogConfig(db);
  const siteLang = normalizeLanguage(config.site_lang || "en");
  const t = loadTranslations(siteLang);
  const dateLocale = getDateLocale(siteLang);
  const postsResult = await db.prepare("SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC").all();
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
  const siteOrigin = resolveSiteOrigin(Astro2.locals.runtime.env, Astro2.url.href, config.custom_domain);
  const blogUrl = absoluteUrl(siteOrigin, "/blog");
  const blogJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${config.site_title} - Blog`,
    url: blogUrl,
    description: config.site_description
  }).replace(/</g, "\\u003c");
  const listTitle = `Blog \u2013 ${config.site_title}`;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": listTitle, "description": config.site_description, "canonicalPath": "/blog" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script> ", '<h1 class="text-4xl font-bold mb-8">', "</h1> ", ""])), unescapeHTML(blogJsonLd), maybeRenderHead(), t.all_posts, blogLayout === "grid" ? renderTemplate`<div class="grid grid-cols-1 gap-6 md:grid-cols-2"> ${posts.map((post, index) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "locale": dateLocale, "priority": index === 0 })}`)} </div>` : blogLayout === "featured" ? renderTemplate`<div class="space-y-6"> ${featuredPost && renderTemplate`<article class="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"> ${featuredThumbnail && renderTemplate`<figure class="max-h-96 overflow-hidden"> <img${addAttribute(featuredThumbnail, "src")} alt="" class="h-full w-full object-cover" loading="eager" fetchpriority="high"> </figure>`} <a${addAttribute(`/blog/${featuredPost.slug}`, "href")} class="card-body block"> <h2 class="mb-2 text-2xl font-bold hover:text-primary">${featuredPost.title}</h2> ${featuredDescription && renderTemplate`<p class="mb-4 text-base-content/80">${featuredDescription}</p>`} <time class="text-sm text-base-content/60">${featuredDate}</time> </a> </article>`} ${remainingPosts.length > 0 && renderTemplate`<div class="grid grid-cols-1 gap-6 md:grid-cols-2"> ${remainingPosts.map((post, index) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "locale": dateLocale, "priority": index === 0 })}`)} </div>`} </div>` : renderTemplate`<div class="space-y-6"> ${posts.map((post, index) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "locale": dateLocale, "priority": index === 0 })}`)} </div>`) })}`;
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
