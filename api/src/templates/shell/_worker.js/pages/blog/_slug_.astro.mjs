globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                     */
import { c as createComponent, f as renderComponent, r as renderTemplate, b as createAstro, m as maybeRenderHead, u as unescapeHTML } from '../../chunks/astro/server_DjdN7mmd.mjs';
import { $ as $$Base } from '../../chunks/Base_IEYemnIR.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const post = await Astro2.locals.runtime.env.DB.prepare("SELECT * FROM posts WHERE slug = ? AND published = 1").bind(slug).first();
  if (!post) {
    return Astro2.redirect("/404");
  }
  const date = new Date(post.created_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": post.title, "description": post.description }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="prose prose-lg max-w-none"> <h1>${post.title}</h1> <time class="text-gray-500">${date}</time> <div>${unescapeHTML(post.content_html)}</div> </article> ` })}`;
}, "/home/aurora/snappost/templates/shell/src/pages/blog/[slug].astro", void 0);

const $$file = "/home/aurora/snappost/templates/shell/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
