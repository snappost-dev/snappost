globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as addAttribute, r as renderTemplate, u as unescapeHTML, b as createAstro, f as defineScriptVars, g as renderSlot, h as renderHead, d as renderComponent } from './astro/server_RcnIsM-u.mjs';
import { l as loadBlogConfig } from './blog-config_8QCYqaqZ.mjs';
import { r as resolveSiteOrigin, a as absoluteUrl } from './site-url_DbiFQCpv.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
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
  return renderTemplate`<link rel="canonical"${addAttribute(canonicalHref, "href")}><link rel="alternate" type="application/rss+xml"${addAttribute(siteName, "title")}${addAttribute(rssHref, "href")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalHref, "content")}><meta property="og:type"${addAttribute(ogType, "content")}><meta property="og:site_name"${addAttribute(siteName, "content")}><meta property="og:locale" content="tr_TR">${publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>`}${modifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>`}<meta name="twitter:card" content="summary"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(twDesc, "content")}>${articleJsonLd && renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(articleJsonLd))}`;
}, "/home/aurora/snappost/templates/shell/src/components/SeoHead.astro", void 0);

const nav_home$3 = "Home";
const nav_blog$3 = "Blog";
const nav_about$3 = "About";
const all_posts$3 = "All Posts";
const all_posts_link$3 = "All posts →";
const author_about$3 = "About the Author";
const page_not_found$3 = "Page not found";
const page_not_found_desc$3 = "The content you are looking for may have been moved or removed.";
const back_home$3 = "Back to home";
const about_back_to_blog$3 = "← Blog";
const reading_time$3 = "min read";
const share$3 = "Share";
const copy_link$3 = "Copy Link";
const copied$3 = "Copied!";
const prev_post$3 = "Previous";
const next_post$3 = "Next";
const draft$3 = "Draft";
const published$3 = "Published";
const en = {
	nav_home: nav_home$3,
	nav_blog: nav_blog$3,
	nav_about: nav_about$3,
	all_posts: all_posts$3,
	all_posts_link: all_posts_link$3,
	author_about: author_about$3,
	page_not_found: page_not_found$3,
	page_not_found_desc: page_not_found_desc$3,
	back_home: back_home$3,
	about_back_to_blog: about_back_to_blog$3,
	reading_time: reading_time$3,
	share: share$3,
	copy_link: copy_link$3,
	copied: copied$3,
	prev_post: prev_post$3,
	next_post: next_post$3,
	draft: draft$3,
	published: published$3
};

const nav_home$2 = "Etusivu";
const nav_blog$2 = "Blogi";
const nav_about$2 = "Tietoa";
const all_posts$2 = "Kaikki kirjoitukset";
const all_posts_link$2 = "Kaikki kirjoitukset →";
const author_about$2 = "Kirjoittajasta";
const page_not_found$2 = "Sivua ei löytynyt";
const page_not_found_desc$2 = "Etsimäsi sisältö on voitu siirtää tai poistaa.";
const back_home$2 = "Palaa etusivulle";
const about_back_to_blog$2 = "← Blogi";
const reading_time$2 = "min lukuaika";
const share$2 = "Jaa";
const copy_link$2 = "Kopioi linkki";
const copied$2 = "Kopioitu!";
const prev_post$2 = "Edellinen";
const next_post$2 = "Seuraava";
const draft$2 = "Luonnos";
const published$2 = "Julkaistu";
const fi = {
	nav_home: nav_home$2,
	nav_blog: nav_blog$2,
	nav_about: nav_about$2,
	all_posts: all_posts$2,
	all_posts_link: all_posts_link$2,
	author_about: author_about$2,
	page_not_found: page_not_found$2,
	page_not_found_desc: page_not_found_desc$2,
	back_home: back_home$2,
	about_back_to_blog: about_back_to_blog$2,
	reading_time: reading_time$2,
	share: share$2,
	copy_link: copy_link$2,
	copied: copied$2,
	prev_post: prev_post$2,
	next_post: next_post$2,
	draft: draft$2,
	published: published$2
};

const nav_home$1 = "Hem";
const nav_blog$1 = "Blogg";
const nav_about$1 = "Om";
const all_posts$1 = "Alla inlägg";
const all_posts_link$1 = "Alla inlägg →";
const author_about$1 = "Om författaren";
const page_not_found$1 = "Sidan hittades inte";
const page_not_found_desc$1 = "Innehållet du letar efter kan ha flyttats eller tagits bort.";
const back_home$1 = "Tillbaka till startsidan";
const about_back_to_blog$1 = "← Blogg";
const reading_time$1 = "min läsning";
const share$1 = "Dela";
const copy_link$1 = "Kopiera länk";
const copied$1 = "Kopierad!";
const prev_post$1 = "Föregående";
const next_post$1 = "Nästa";
const draft$1 = "Utkast";
const published$1 = "Publicerad";
const sv = {
	nav_home: nav_home$1,
	nav_blog: nav_blog$1,
	nav_about: nav_about$1,
	all_posts: all_posts$1,
	all_posts_link: all_posts_link$1,
	author_about: author_about$1,
	page_not_found: page_not_found$1,
	page_not_found_desc: page_not_found_desc$1,
	back_home: back_home$1,
	about_back_to_blog: about_back_to_blog$1,
	reading_time: reading_time$1,
	share: share$1,
	copy_link: copy_link$1,
	copied: copied$1,
	prev_post: prev_post$1,
	next_post: next_post$1,
	draft: draft$1,
	published: published$1
};

const nav_home = "Ana Sayfa";
const nav_blog = "Blog";
const nav_about = "Hakkinda";
const all_posts = "Tüm Yazılar";
const all_posts_link = "Tum yazilar →";
const author_about = "Yazar Hakkında";
const page_not_found = "Sayfa bulunamadı";
const page_not_found_desc = "Aradığınız içerik taşınmış veya silinmiş olabilir.";
const back_home = "Ana sayfaya dön";
const about_back_to_blog = "← Blog";
const reading_time = "dk okuma";
const share = "Paylaş";
const copy_link = "Linki Kopyala";
const copied = "Kopyalandı!";
const prev_post = "Önceki";
const next_post = "Sonraki";
const draft = "Taslak";
const published = "Yayında";
const tr = {
	nav_home: nav_home,
	nav_blog: nav_blog,
	nav_about: nav_about,
	all_posts: all_posts,
	all_posts_link: all_posts_link,
	author_about: author_about,
	page_not_found: page_not_found,
	page_not_found_desc: page_not_found_desc,
	back_home: back_home,
	about_back_to_blog: about_back_to_blog,
	reading_time: reading_time,
	share: share,
	copy_link: copy_link,
	copied: copied,
	prev_post: prev_post,
	next_post: next_post,
	draft: draft,
	published: published
};

const translationMap = {
  en,
  tr,
  fi,
  sv
};
function normalizeLanguage(lang) {
  const normalized = (lang || "en").trim().toLowerCase();
  if (normalized in translationMap) return normalized;
  return "en";
}
function loadTranslations(lang) {
  const normalized = normalizeLanguage(lang);
  return translationMap[normalized];
}
function getDateLocale(lang) {
  const normalized = normalizeLanguage(lang);
  const localeMap = {
    en: "en-US",
    tr: "tr-TR",
    fi: "fi-FI",
    sv: "sv-SE"
  };
  return localeMap[normalized];
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
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
  const webSiteJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.site_title,
    description: config.site_description,
    url: origin
  }).replace(/</g, "\\u003c");
  const metaDescRaw = (description ?? config.site_description ?? "").trim();
  const metaDesc = metaDescRaw.length > 160 ? `${metaDescRaw.slice(0, 157)}\u2026` : metaDescRaw;
  const siteLang = normalizeLanguage(config.site_lang || "en");
  const t = loadTranslations(siteLang);
  const siteThemeLight = (config.site_theme_light || "light").trim() || "light";
  const siteThemeDark = (config.site_theme_dark || "dark").trim() || "dark";
  return renderTemplate(_a || (_a = __template(["<html", "", '> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><meta name="theme-color"', "><title>", "</title>", '<script type="application/ld+json">', "<\/script>", '</head> <body class="min-h-screen bg-base-200 text-base-content"> <header class="sticky top-0 z-10 border-b border-base-300 bg-base-100/95 backdrop-blur"> <div class="navbar max-w-3xl mx-auto px-4"> <div class="flex-1"> <a href="/" class="text-xl font-bold">', '</a> </div> <nav class="flex-none"> <ul class="menu menu-horizontal px-1 gap-2"> <li><a href="/" class="hover:text-primary">', '</a></li> <li><a href="/blog" class="hover:text-primary">', '</a></li> <li><a href="/about" class="hover:text-primary">', '</a></li> </ul> </nav> </div> </header> <main class="max-w-3xl mx-auto px-4 py-8"> ', ' </main> <footer class="border-t border-base-300 bg-base-200 text-center py-8 text-sm text-base-content/60"> <p>&copy; ', " ", '</p> </footer> <button id="theme-toggle-btn" type="button" class="btn btn-outline btn-sm fixed bottom-4 right-4 z-20" aria-label="Tema degistir">\n\u2600\uFE0F\n</button> <script>(function(){', "\n    const themeToggleBtn = document.getElementById('theme-toggle-btn');\n    const root = document.documentElement;\n    const storageKey = 'theme-preference';\n\n    const applyThemePreference = (preference) => {\n      const nextTheme = preference === 'dark' ? siteThemeDark : siteThemeLight;\n      root.setAttribute('data-theme', nextTheme);\n      if (themeToggleBtn) {\n        themeToggleBtn.textContent = preference === 'dark' ? '\u{1F319}' : '\u2600\uFE0F';\n      }\n    };\n\n    const storedPreference = localStorage.getItem(storageKey);\n    const initialPreference = storedPreference === 'dark' ? 'dark' : 'light';\n    applyThemePreference(initialPreference);\n\n    themeToggleBtn?.addEventListener('click', () => {\n      const currentPreference = localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';\n      const nextPreference = currentPreference === 'dark' ? 'light' : 'dark';\n      localStorage.setItem(storageKey, nextPreference);\n      applyThemePreference(nextPreference);\n    });\n  })();<\/script> </body> </html>"])), addAttribute(siteLang, "lang"), addAttribute(siteThemeLight, "data-theme"), addAttribute(metaDesc, "content"), addAttribute(title, "content"), addAttribute(metaDesc, "content"), addAttribute(config.theme_color, "content"), title, renderComponent($$result, "SeoHead", $$SeoHead, { "title": title, "description": metaDesc, "canonicalHref": canonicalHref, "siteName": config.site_title, "ogType": ogType, "publishedTime": publishedTime, "modifiedTime": modifiedTime, "rssHref": rssHref }), unescapeHTML(webSiteJsonLd), renderHead(), config.site_title, t.nav_home, t.nav_blog, t.nav_about, renderSlot($$result, $$slots["default"]), (/* @__PURE__ */ new Date()).getFullYear(), config.author_name, defineScriptVars({ siteThemeLight, siteThemeDark }));
}, "/home/aurora/snappost/templates/shell/src/layouts/Base.astro", void 0);

export { $$Base as $, getDateLocale as g, loadTranslations as l, normalizeLanguage as n };
