globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, d as renderComponent, r as renderTemplate, b as createAstro, a as addAttribute, u as unescapeHTML, m as maybeRenderHead } from '../chunks/astro/server_RcnIsM-u.mjs';
import { n as normalizeLanguage, l as loadTranslations, $ as $$Base } from '../chunks/Base_Bi1gJj8U.mjs';
import { l as loadBlogConfig, r as resolveSiteOrigin, a as absoluteUrl } from '../chunks/site-url_By8AeHdH.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$About = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  const db = Astro2.locals.runtime.env.DB;
  const config = await loadBlogConfig(db);
  const siteLang = normalizeLanguage(config.site_lang || "en");
  const t = loadTranslations(siteLang);
  const authorName = String(config.author_name ?? "").trim() || config.site_title;
  const authorBioShort = String(config.author_bio ?? "").trim();
  const authorBioLong = String(config.author_bio_long ?? "").trim();
  const aboutBio = authorBioLong || authorBioShort;
  const authorTypeRaw = String(config.author_type ?? "person").trim().toLowerCase();
  const authorSchemaType = authorTypeRaw === "organization" ? "Organization" : "Person";
  const pageTitle = `${t.nav_about} - ${config.site_title}`;
  const canonicalPath = "/about";
  const siteOrigin = resolveSiteOrigin(Astro2.locals.runtime.env, Astro2.url.href, config.custom_domain);
  const aboutUrl = absoluteUrl(siteOrigin, canonicalPath);
  const socialTwitter = String(config.social_twitter ?? "").trim();
  const socialLinkedin = String(config.social_linkedin ?? "").trim();
  const socialGithub = String(config.social_github ?? "").trim();
  const socialWebsite = String(config.social_website ?? "").trim();
  const socialLinks = [];
  if (socialTwitter) socialLinks.push({ label: "Twitter/X", href: socialTwitter });
  if (socialLinkedin) socialLinks.push({ label: "LinkedIn", href: socialLinkedin });
  if (socialGithub) socialLinks.push({ label: "GitHub", href: socialGithub });
  if (socialWebsite) socialLinks.push({ label: "Website", href: socialWebsite });
  const hasSocialLinks = socialLinks.length > 0;
  const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const aboutBioHtml = aboutBio ? escapeHtml(aboutBio).replace(/\r\n|\r|\n/g, "<br>") : "-";
  const aboutSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": authorSchemaType,
    name: authorName,
    description: aboutBio,
    url: aboutUrl
  }).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": pageTitle, "description": aboutBio || `${authorName} - ${config.site_title}`, "canonicalPath": canonicalPath }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script> ", '<section class="max-w-2xl mx-auto"> <div class="card border border-base-300 bg-base-100 shadow-sm"> <div class="card-body gap-4"> <h1 class="card-title text-3xl">', '</h1> <p class="text-base-content/80">', "</p> ", ' <div class="card-actions"> <a href="/blog" class="link link-primary">', "</a> </div> </div> </div> </section> "])), unescapeHTML(aboutSchema), maybeRenderHead(), authorName, unescapeHTML(aboutBioHtml), hasSocialLinks && renderTemplate`<div class="not-prose flex flex-wrap gap-2 pt-2"> ${socialLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm"> ${link.label} </a>`)} </div>`, t.about_back_to_blog) })}`;
}, "/home/aurora/snappost/templates/shell/src/pages/about.astro", void 0);

const $$file = "/home/aurora/snappost/templates/shell/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
