globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as addAttribute, r as renderTemplate, u as unescapeHTML, b as createAstro, d as renderComponent, e as renderHead, f as renderSlot } from './astro/server_D71aSNc0.mjs';
import { l as loadBlogConfig } from './blog-config_8QCYqaqZ.mjs';
import { r as resolveSiteOrigin, a as absoluteUrl } from './site-url_DbiFQCpv.mjs';

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
  const theme = (config.site_theme || "light").trim() || "light";
  return renderTemplate`<html lang="tr"${addAttribute(theme, "data-theme")}> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(metaDesc, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(metaDesc, "content")}><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><meta name="theme-color"${addAttribute(config.theme_color, "content")}><title>${title}</title>${renderComponent($$result, "SeoHead", $$SeoHead, { "title": title, "description": metaDesc, "canonicalHref": canonicalHref, "siteName": config.site_title, "ogType": ogType, "publishedTime": publishedTime, "modifiedTime": modifiedTime, "rssHref": rssHref })}${renderHead()}</head> <body class="min-h-screen bg-base-200 text-base-content"> <header class="sticky top-0 z-10 border-b border-base-300 bg-base-100/95 backdrop-blur"> <div class="navbar max-w-3xl mx-auto px-4"> <div class="flex-1"> <a href="/" class="text-xl font-bold">${config.site_title}</a> </div> <nav class="flex-none"> <ul class="menu menu-horizontal px-1 gap-2"> <li><a href="/" class="hover:text-primary">Home</a></li> <li><a href="/blog" class="hover:text-primary">Blog</a></li> </ul> </nav> </div> </header> <main class="max-w-3xl mx-auto px-4 py-8"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="border-t border-base-300 bg-base-200 text-center py-8 text-sm text-base-content/60"> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} ${config.author_name}</p> </footer> </body></html>`;
}, "/home/aurora/snappost/templates/shell/src/layouts/Base.astro", void 0);

export { $$Base as $ };
