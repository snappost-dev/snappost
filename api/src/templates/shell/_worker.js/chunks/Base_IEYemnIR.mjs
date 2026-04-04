globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as addAttribute, d as renderHead, e as renderSlot, r as renderTemplate, b as createAstro } from './astro/server_DjdN7mmd.mjs';

const $$Astro = createAstro();
const $$Base = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const { title, description } = Astro2.props;
  const configResult = await Astro2.locals.runtime.env.DB.prepare("SELECT key, value FROM config").all();
  const config = Object.fromEntries(
    configResult.results.map((r) => [r.key, r.value])
  );
  return renderTemplate`<html lang="tr"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description || config.site_description, "content")}><meta name="theme-color"${addAttribute(config.theme_color, "content")}><title>${title}</title>${renderHead()}</head> <body class="bg-gray-50 text-gray-900"> <header class="bg-white border-b sticky top-0 z-10"> <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center"> <a href="/" class="text-xl font-bold">${config.site_title}</a> <nav class="flex gap-6"> <a href="/" class="hover:text-blue-600">Home</a> <a href="/blog" class="hover:text-blue-600">Blog</a> </nav> </div> </header> <main class="max-w-4xl mx-auto px-4 py-8"> ${renderSlot($$result, $$slots["default"])} </main> <footer class="text-center py-8 text-gray-600 text-sm"> <p>© ${(/* @__PURE__ */ new Date()).getFullYear()} ${config.author_name}</p> </footer> </body></html>`;
}, "/home/aurora/snappost/templates/shell/src/layouts/Base.astro", void 0);

export { $$Base as $ };
