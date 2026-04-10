globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as addAttribute, r as renderTemplate, u as unescapeHTML, b as createAstro, d as renderComponent, e as renderHead, f as renderSlot } from './astro/server_BmAI9ip8.mjs';
import { l as loadBlogConfig, r as resolveSiteOrigin, a as absoluteUrl } from './site-url_BzCZPAzq.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$SeoHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SeoHead;
  const { title, description, canonicalHref, siteName, ogType, publishedTime, modifiedTime, rssHref } = Astro2.props;
  const twDesc = description.length > 200 ? `${description.slice(0, 197)}\u2026` : description;
  let articleJsonLd = null;
  if (ogType === "article" && publishedTime) {
    articleJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      url: canonicalHref,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalHref }
    }).replace(/</g, "\\u003c");
  }
  return renderTemplate`<link rel="canonical"${addAttribute(canonicalHref, "href")}><link rel="alternate" type="application/rss+xml"${addAttribute(siteName, "title")}${addAttribute(rssHref, "href")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalHref, "content")}><meta property="og:type"${addAttribute(ogType, "content")}><meta property="og:site_name"${addAttribute(siteName, "content")}><meta property="og:locale" content="tr_TR">${publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>`}${modifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>`}<meta name="twitter:card" content="summary"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(twDesc, "content")}>${articleJsonLd && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(articleJsonLd))}`;
}, "/home/aurora/snappost/templates/shell/src/components/SeoHead.astro", void 0);

const $$Astro = createAstro();
const $$Base = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const {
    title,
    description,
    canonicalPath,
    ogType = "website",
    publishedTime,
    modifiedTime,
    config: configProp
  } = Astro2.props;
  const config = configProp ?? await loadBlogConfig(Astro2.locals.runtime.env.DB);
  const origin = resolveSiteOrigin(Astro2.locals.runtime.env, Astro2.url.href);
  const path = canonicalPath ?? `${Astro2.url.pathname}${Astro2.url.search}`;
  const canonicalHref = absoluteUrl(origin, path);
  const rssHref = absoluteUrl(origin, "/rss.xml");
  const metaDescRaw = (description ?? config.site_description ?? "").trim();
  const metaDesc = metaDescRaw.length > 160 ? `${metaDescRaw.slice(0, 157)}\u2026` : metaDescRaw;
  return renderTemplate`<html lang="tr"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(metaDesc, "content")}><meta name="theme-color"${addAttribute(config.theme_color, "content")}><title>${title}</title>${renderComponent($$result, "SeoHead", $$SeoHead, { "title": title, "description": metaDesc, "canonicalHref": canonicalHref, "siteName": config.site_title, "ogType": ogType, "publishedTime": publishedTime, "modifiedTime": modifiedTime, "rssHref": rssHref })}${renderHead()}</head> <body class="bg-gray-50 text-gray-900"> <header class="bg-white border-b sticky top-0 z-10"> <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center"> <a href="/" class="text-xl font-bold">${config.site_title}</a> <nav class="flex gap-6"> <a href="/" class="hover:text-blue-600">Home</a> <a href="/blog" class="hover:text-blue-600">Blog</a> </nav> </div> </header> <main class="max-w-4xl mx-auto px-4 py-8"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="text-center py-8 text-gray-600 text-sm"> <p>© ${(/* @__PURE__ */ new Date()).getFullYear()} ${config.author_name}</p> </footer> </body></html>`;
}, "/home/aurora/snappost/templates/shell/src/layouts/Base.astro", void 0);

export { $$Base as $ };
