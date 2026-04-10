globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, a as addAttribute, r as renderTemplate, b as createAstro } from './astro/server_BmAI9ip8.mjs';

const $$Astro = createAstro();
const $$PostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PostCard;
  const { post } = Astro2.props;
  const date = new Date(post.created_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return renderTemplate`${maybeRenderHead()}<article class="bg-white rounded-lg border p-6 hover:shadow-md transition"> <a${addAttribute(`/blog/${post.slug}`, "href")} class="block"> <h2 class="text-2xl font-bold mb-2 hover:text-blue-600">${post.title}</h2> <p class="text-gray-600 mb-4">${post.description}</p> <time class="text-sm text-gray-500">${date}</time> </a> </article>`;
}, "/home/aurora/snappost/templates/shell/src/components/PostCard.astro", void 0);

export { $$PostCard as $ };
