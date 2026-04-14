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
  const descriptionRaw = (post.description ?? "").trim();
  const description = descriptionRaw.length > 120 ? `${descriptionRaw.slice(0, 117)}...` : descriptionRaw;
  const imgMatch = post.content_html?.match(/<img[^>]+src="([^"]+)"/);
  const thumbnail = imgMatch?.[1] ?? null;
  return renderTemplate`${maybeRenderHead()}<article class="card bg-base-100 border border-base-300 transition hover:shadow-md"> ${thumbnail && renderTemplate`<figure class="aspect-[16/9] overflow-hidden"> <img${addAttribute(thumbnail, "src")} alt="" class="h-full w-full object-cover"> </figure>`} <a${addAttribute(`/blog/${post.slug}`, "href")} class="card-body block"> <h2 class="card-title text-2xl mb-2 hover:text-primary">${post.title}</h2> ${description && renderTemplate`<p class="mb-4 text-base-content/80">${description}</p>`} <time class="text-sm text-base-content/60">${date}</time> </a> </article>`;
}, "/home/aurora/snappost/templates/shell/src/components/PostCard.astro", void 0);

export { $$PostCard as $ };
