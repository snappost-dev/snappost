globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, d as renderComponent, r as renderTemplate, b as createAstro, m as maybeRenderHead } from '../chunks/astro/server_RcnIsM-u.mjs';
import { n as normalizeLanguage, l as loadTranslations, $ as $$Base } from '../chunks/Base_59vZvpsA.mjs';
import { l as loadBlogConfig } from '../chunks/blog-config_8QCYqaqZ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  const db = Astro2.locals.runtime.env.DB;
  const config = await loadBlogConfig(db);
  const siteLang = normalizeLanguage(config.site_lang || "en");
  const t = loadTranslations(siteLang);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "config": config, "title": `${t.page_not_found} - ${config.site_title}`, "description": t.page_not_found_desc, "canonicalPath": "/404" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="rounded-box border border-base-300 bg-base-100 p-8 text-center"> <h1 class="text-3xl font-bold mb-3">${t.page_not_found}</h1> <p class="text-base-content/70 mb-6">${t.page_not_found_desc}</p> <a href="/" class="btn btn-primary btn-sm">${t.back_home}</a> </section> ` })}`;
}, "/home/aurora/snappost/templates/shell/src/pages/404.astro", void 0);

const $$file = "/home/aurora/snappost/templates/shell/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
