globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as addAttribute, r as renderTemplate, b as createAstro, f as defineScriptVars, g as renderSlot, h as renderHead, u as unescapeHTML, d as renderComponent } from './astro/server_RcnIsM-u.mjs';
import { l as loadBlogConfig, r as resolveSiteOrigin, a as absoluteUrl } from './site-url_By8AeHdH.mjs';

const $$Astro$1 = createAstro();
const $$SeoHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SeoHead;
  const { title, description, canonicalHref, siteName, ogType, publishedTime, modifiedTime, rssHref } = Astro2.props;
  const twDesc = description.length > 200 ? `${description.slice(0, 197)}\u2026` : description;
  return renderTemplate`<link rel="canonical"${addAttribute(canonicalHref, "href")}><link rel="alternate" type="application/rss+xml"${addAttribute(siteName, "title")}${addAttribute(rssHref, "href")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalHref, "content")}><meta property="og:type"${addAttribute(ogType, "content")}><meta property="og:site_name"${addAttribute(siteName, "content")}><meta property="og:locale" content="tr_TR">${publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>`}${modifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>`}<meta name="twitter:card" content="summary"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(twDesc, "content")}>`;
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

const FALLBACK_THEME = "light";
const THEME_VARS = {
  light: "--p: 259 94% 51%; --s: 314 100% 47%; --a: 174 60% 51%; --n: 219 14% 28%; --b1: 0 0% 100%; --b2: 0 0% 95%; --b3: 0 0% 90%; --bc: 215 28% 17%;",
  dark: "--p: 262 80% 52%; --s: 316 70% 52%; --a: 175 70% 41%; --n: 220 18% 20%; --b1: 220 18% 12%; --b2: 220 18% 10%; --b3: 220 18% 8%; --bc: 220 14% 92%;",
  corporate: "--p: 229 96% 64%; --s: 215 26% 59%; --a: 154 49% 50%; --n: 233 27% 19%; --b1: 0 0% 100%; --b2: 210 20% 98%; --b3: 210 20% 94%; --bc: 233 27% 19%;",
  nord: "--p: 213 32% 52%; --s: 179 25% 65%; --a: 343 76% 65%; --n: 220 16% 22%; --b1: 218 27% 94%; --b2: 218 27% 90%; --b3: 218 27% 86%; --bc: 220 16% 22%;",
  business: "--p: 210 100% 50%; --s: 210 24% 49%; --a: 24 95% 53%; --n: 210 11% 15%; --b1: 210 11% 10%; --b2: 210 11% 8%; --b3: 210 11% 6%; --bc: 210 20% 92%;",
  winter: "--p: 212 100% 45%; --s: 220 26% 59%; --a: 7 80% 57%; --n: 214 12% 31%; --b1: 210 100% 99%; --b2: 210 30% 96%; --b3: 210 25% 92%; --bc: 214 12% 31%;",
  cupcake: "--p: 183 47% 59%; --s: 338 71% 67%; --a: 39 84% 58%; --n: 280 46% 14%; --b1: 24 33% 97%; --b2: 24 33% 93%; --b3: 24 33% 89%; --bc: 280 46% 14%;",
  emerald: "--p: 141 50% 48%; --s: 219 96% 59%; --a: 10 79% 66%; --n: 219 20% 20%; --b1: 0 0% 100%; --b2: 0 0% 96%; --b3: 0 0% 92%; --bc: 219 20% 20%;",
  lofi: "--p: 0 0% 10%; --s: 0 2% 39%; --a: 0 0% 30%; --n: 0 0% 10%; --b1: 0 0% 100%; --b2: 0 0% 97%; --b3: 0 0% 94%; --bc: 0 0% 10%;",
  dracula: "--p: 326 100% 74%; --s: 265 89% 78%; --a: 31 100% 71%; --n: 231 15% 18%; --b1: 231 15% 14%; --b2: 231 15% 12%; --b3: 231 15% 10%; --bc: 60 30% 96%;",
  night: "--p: 198 93% 60%; --s: 234 89% 74%; --a: 329 86% 70%; --n: 222 40% 16%; --b1: 222 40% 10%; --b2: 222 40% 8%; --b3: 222 40% 6%; --bc: 220 17% 92%;",
  coffee: "--p: 30 67% 58%; --s: 182 25% 58%; --a: 263 42% 61%; --n: 35 19% 18%; --b1: 30 16% 12%; --b2: 30 16% 10%; --b3: 30 16% 8%; --bc: 33 10% 88%;",
  synthwave: "--p: 321 70% 69%; --s: 197 87% 69%; --a: 48 89% 60%; --n: 253 61% 24%; --b1: 253 61% 14%; --b2: 253 61% 12%; --b3: 253 61% 10%; --bc: 257 100% 90%;",
  cyberpunk: "--p: 291 96% 64%; --s: 49 99% 64%; --a: 333 71% 51%; --n: 220 7% 20%; --b1: 56 100% 50%; --b2: 56 100% 46%; --b3: 56 100% 42%; --bc: 220 7% 20%;",
  retro: "--p: 3 74% 76%; --s: 145 27% 72%; --a: 49 67% 76%; --n: 345 5% 24%; --b1: 45 47% 80%; --b2: 45 47% 76%; --b3: 45 47% 72%; --bc: 345 5% 24%;",
  valentine: "--p: 353 74% 67%; --s: 254 86% 75%; --a: 181 56% 67%; --n: 336 43% 38%; --b1: 318 100% 98%; --b2: 318 100% 94%; --b3: 318 100% 90%; --bc: 336 43% 38%;",
  halloween: "--p: 32 95% 56%; --s: 271 46% 51%; --a: 91 33% 48%; --n: 180 2% 11%; --b1: 180 2% 9%; --b2: 180 2% 7%; --b3: 180 2% 5%; --bc: 32 100% 90%;",
  garden: "--p: 139 16% 43%; --s: 96 37% 61%; --a: 0 67% 79%; --n: 0 4% 16%; --b1: 0 0% 98%; --b2: 0 0% 94%; --b3: 0 0% 90%; --bc: 0 4% 16%;",
  forest: "--p: 141 75% 43%; --s: 141 72% 38%; --a: 35 68% 60%; --n: 141 10% 14%; --b1: 141 10% 10%; --b2: 141 10% 8%; --b3: 141 10% 6%; --bc: 141 35% 92%;",
  aqua: "--p: 182 93% 45%; --s: 274 95% 76%; --a: 47 98% 63%; --n: 183 100% 15%; --b1: 181 83% 17%; --b2: 181 83% 14%; --b3: 181 83% 11%; --bc: 181 100% 90%;",
  pastel: "--p: 284 22% 80%; --s: 352 70% 88%; --a: 158 54% 83%; --n: 259 12% 44%; --b1: 0 0% 100%; --b2: 0 0% 96%; --b3: 0 0% 92%; --bc: 259 12% 44%;",
  fantasy: "--p: 296 83% 64%; --s: 200 67% 55%; --a: 27 87% 67%; --n: 271 39% 27%; --b1: 0 0% 100%; --b2: 0 0% 96%; --b3: 0 0% 92%; --bc: 271 39% 27%;",
  wireframe: "--p: 0 0% 0%; --s: 0 0% 20%; --a: 0 0% 30%; --n: 0 0% 10%; --b1: 0 0% 100%; --b2: 0 0% 95%; --b3: 0 0% 90%; --bc: 0 0% 10%;",
  black: "--p: 0 0% 100%; --s: 0 0% 85%; --a: 0 0% 75%; --n: 0 0% 0%; --b1: 0 0% 0%; --b2: 0 0% 5%; --b3: 0 0% 10%; --bc: 0 0% 100%;",
  luxury: "--p: 0 0% 70%; --s: 0 0% 85%; --a: 37 67% 58%; --n: 0 0% 15%; --b1: 0 0% 10%; --b2: 0 0% 8%; --b3: 0 0% 6%; --bc: 0 0% 85%;",
  cmyk: "--p: 327 82% 53%; --s: 196 100% 39%; --a: 43 100% 50%; --n: 195 100% 5%; --b1: 0 0% 100%; --b2: 0 0% 95%; --b3: 0 0% 90%; --bc: 195 100% 5%;",
  autumn: "--p: 344 85% 45%; --s: 22 91% 50%; --a: 45 94% 53%; --n: 0 0% 20%; --b1: 35 100% 96%; --b2: 35 100% 92%; --b3: 35 100% 88%; --bc: 0 0% 20%;",
  acid: "--p: 77 85% 57%; --s: 208 100% 66%; --a: 2 100% 66%; --n: 237 22% 20%; --b1: 60 100% 50%; --b2: 60 100% 46%; --b3: 60 100% 42%; --bc: 237 22% 20%;",
  lemonade: "--p: 89 80% 40%; --s: 48 95% 55%; --a: 197 73% 53%; --n: 0 0% 20%; --b1: 58 100% 96%; --b2: 58 100% 92%; --b3: 58 100% 88%; --bc: 0 0% 20%;",
  sunset: "--p: 331 79% 58%; --s: 45 93% 58%; --a: 13 96% 67%; --n: 245 25% 20%; --b1: 245 25% 14%; --b2: 245 25% 12%; --b3: 245 25% 10%; --bc: 45 100% 92%;"
};
function getThemeVars(themeName) {
  const name = (themeName || FALLBACK_THEME).trim();
  return THEME_VARS[name] ?? THEME_VARS[FALLBACK_THEME];
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
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
  const origin = resolveSiteOrigin(Astro2.locals.runtime.env, Astro2.url.href, config.custom_domain);
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
  const lightThemeVars = getThemeVars(siteThemeLight);
  const darkThemeVars = getThemeVars(siteThemeDark);
  const inlineThemeCss = `[data-theme="${siteThemeLight}"] { ${lightThemeVars} } [data-theme="${siteThemeDark}"] { ${darkThemeVars} }`;
  return renderTemplate(_a || (_a = __template(["<html", "", '> <head><link rel="preconnect" href="https://media.snaplinx.net"><link rel="dns-prefetch" href="https://media.snaplinx.net"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><meta name="theme-color"', "><title>", "</title>", "<style>", `</style><script>
    const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
    styleLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
      const noscript = document.createElement('noscript');
      noscript.innerHTML = \`<link rel="stylesheet" href="\${href}">\`;
      link.insertAdjacentElement('afterend', noscript);
    });
  <\/script><script type="application/ld+json">`, "<\/script>", '</head> <body class="min-h-screen bg-base-200 text-base-content"> <header class="sticky top-0 z-10 border-b border-base-300 bg-base-100/95 backdrop-blur"> <div class="navbar max-w-3xl mx-auto px-4"> <div class="flex-1"> <a href="/" class="text-xl font-bold">', '</a> </div> <nav class="flex-none"> <ul class="menu menu-horizontal px-1 gap-2"> <li><a href="/" class="hover:text-primary">', '</a></li> <li><a href="/blog" class="hover:text-primary">', '</a></li> <li><a href="/about" class="hover:text-primary">', '</a></li> </ul> </nav> </div> </header> <main class="max-w-3xl mx-auto px-4 py-8"> ', ' </main> <footer class="border-t border-base-300 bg-base-200 text-center py-8 text-sm text-base-content/60"> <p>&copy; ', " ", '</p> </footer> <button id="theme-toggle-btn" type="button" class="btn btn-outline btn-sm fixed bottom-4 right-4 z-20" aria-label="Tema degistir">\n\u2600\uFE0F\n</button> <script>(function(){', "\n    const themeToggleBtn = document.getElementById('theme-toggle-btn');\n    const root = document.documentElement;\n    const storageKey = 'theme-preference';\n\n    const applyThemePreference = (preference) => {\n      const nextTheme = preference === 'dark' ? siteThemeDark : siteThemeLight;\n      root.setAttribute('data-theme', nextTheme);\n      if (themeToggleBtn) {\n        themeToggleBtn.textContent = preference === 'dark' ? '\u{1F319}' : '\u2600\uFE0F';\n      }\n    };\n\n    const storedPreference = localStorage.getItem(storageKey);\n    const initialPreference = storedPreference === 'dark' ? 'dark' : 'light';\n    applyThemePreference(initialPreference);\n\n    themeToggleBtn?.addEventListener('click', () => {\n      const currentPreference = localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';\n      const nextPreference = currentPreference === 'dark' ? 'light' : 'dark';\n      localStorage.setItem(storageKey, nextPreference);\n      applyThemePreference(nextPreference);\n    });\n  })();<\/script> </body> </html>"], ["<html", "", '> <head><link rel="preconnect" href="https://media.snaplinx.net"><link rel="dns-prefetch" href="https://media.snaplinx.net"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><meta name="theme-color"', "><title>", "</title>", "<style>", `</style><script>
    const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
    styleLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
      const noscript = document.createElement('noscript');
      noscript.innerHTML = \\\`<link rel="stylesheet" href="\\\${href}">\\\`;
      link.insertAdjacentElement('afterend', noscript);
    });
  <\/script><script type="application/ld+json">`, "<\/script>", '</head> <body class="min-h-screen bg-base-200 text-base-content"> <header class="sticky top-0 z-10 border-b border-base-300 bg-base-100/95 backdrop-blur"> <div class="navbar max-w-3xl mx-auto px-4"> <div class="flex-1"> <a href="/" class="text-xl font-bold">', '</a> </div> <nav class="flex-none"> <ul class="menu menu-horizontal px-1 gap-2"> <li><a href="/" class="hover:text-primary">', '</a></li> <li><a href="/blog" class="hover:text-primary">', '</a></li> <li><a href="/about" class="hover:text-primary">', '</a></li> </ul> </nav> </div> </header> <main class="max-w-3xl mx-auto px-4 py-8"> ', ' </main> <footer class="border-t border-base-300 bg-base-200 text-center py-8 text-sm text-base-content/60"> <p>&copy; ', " ", '</p> </footer> <button id="theme-toggle-btn" type="button" class="btn btn-outline btn-sm fixed bottom-4 right-4 z-20" aria-label="Tema degistir">\n\u2600\uFE0F\n</button> <script>(function(){', "\n    const themeToggleBtn = document.getElementById('theme-toggle-btn');\n    const root = document.documentElement;\n    const storageKey = 'theme-preference';\n\n    const applyThemePreference = (preference) => {\n      const nextTheme = preference === 'dark' ? siteThemeDark : siteThemeLight;\n      root.setAttribute('data-theme', nextTheme);\n      if (themeToggleBtn) {\n        themeToggleBtn.textContent = preference === 'dark' ? '\u{1F319}' : '\u2600\uFE0F';\n      }\n    };\n\n    const storedPreference = localStorage.getItem(storageKey);\n    const initialPreference = storedPreference === 'dark' ? 'dark' : 'light';\n    applyThemePreference(initialPreference);\n\n    themeToggleBtn?.addEventListener('click', () => {\n      const currentPreference = localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';\n      const nextPreference = currentPreference === 'dark' ? 'light' : 'dark';\n      localStorage.setItem(storageKey, nextPreference);\n      applyThemePreference(nextPreference);\n    });\n  })();<\/script> </body> </html>"])), addAttribute(siteLang, "lang"), addAttribute(siteThemeLight, "data-theme"), addAttribute(metaDesc, "content"), addAttribute(title, "content"), addAttribute(metaDesc, "content"), addAttribute(config.theme_color, "content"), title, renderComponent($$result, "SeoHead", $$SeoHead, { "title": title, "description": metaDesc, "canonicalHref": canonicalHref, "siteName": config.site_title, "ogType": ogType, "publishedTime": publishedTime, "modifiedTime": modifiedTime, "rssHref": rssHref }), unescapeHTML(inlineThemeCss), unescapeHTML(webSiteJsonLd), renderHead(), config.site_title, t.nav_home, t.nav_blog, t.nav_about, renderSlot($$result, $$slots["default"]), (/* @__PURE__ */ new Date()).getFullYear(), config.author_name, defineScriptVars({ siteThemeLight, siteThemeDark }));
}, "/home/aurora/snappost/templates/shell/src/layouts/Base.astro", void 0);

export { $$Base as $, getDateLocale as g, loadTranslations as l, normalizeLanguage as n };
