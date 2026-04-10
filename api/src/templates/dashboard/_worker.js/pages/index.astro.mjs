globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, b as renderHead, f as renderSlot, r as renderTemplate, e as createAstro, g as renderComponent, m as maybeRenderHead, a as addAttribute } from '../chunks/astro/server_CZTmva32.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} - Dashboard</title>${renderHead()}</head> <body class="bg-gray-50"> <header class="bg-white border-b"> <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"> <h1 class="text-xl font-bold">📝 Dashboard</h1> <nav class="flex gap-4"> <a href="/" class="hover:text-blue-600">Posts</a> <a href="/new" class="hover:text-blue-600">New Post</a> <form method="POST" action="/logout" class="inline"> <button type="submit" class="text-red-600 hover:text-red-700">Logout</button> </form> </nav> </div> </header> <main class="max-w-6xl mx-auto px-4 py-8"> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "/home/aurora/snappost/templates/dashboard/src/layouts/Dashboard.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const postsResult = await Astro2.locals.runtime.env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  const posts = postsResult.results;
  return renderTemplate`${renderComponent($$result, "Dashboard", $$Dashboard, { "title": "All Posts" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex justify-between items-center mb-6"> <h1 class="text-3xl font-bold">All Posts</h1> <a href="/new" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
+ New Post
</a> </div> <div class="bg-white rounded-lg border"> ${posts.length === 0 ? renderTemplate`<div class="p-8 text-center text-gray-500">
No posts yet. Create your first post!
</div>` : renderTemplate`<table class="w-full"> <thead class="border-b bg-gray-50"> <tr> <th class="text-left p-4">Title</th> <th class="text-left p-4">Status</th> <th class="text-left p-4">Created</th> <th class="text-right p-4">Actions</th> </tr> </thead> <tbody> ${posts.map((post) => renderTemplate`<tr class="border-b hover:bg-gray-50"> <td class="p-4 font-medium">${post.title}</td> <td class="p-4"> <span${addAttribute(`px-2 py-1 rounded text-xs ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`, "class")}> ${post.published ? "Published" : "Draft"} </span> </td> <td class="p-4 text-sm text-gray-600"> ${new Date(post.created_at).toLocaleDateString()} </td> <td class="p-4 text-right"> <a${addAttribute(`/edit/${post.id}`, "href")} class="text-blue-600 hover:text-blue-700 text-sm">
Edit
</a> </td> </tr>`)} </tbody> </table>`} </div> ` })}`;
}, "/home/aurora/snappost/templates/dashboard/src/pages/index.astro", void 0);

const $$file = "/home/aurora/snappost/templates/dashboard/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
