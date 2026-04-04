globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, e as renderComponent, b as renderTemplate, d as createAstro, m as maybeRenderHead } from '../chunks/astro/server_Cag67392.mjs';
import { $ as $$Dashboard } from '../chunks/Dashboard_B4HjdNBJ.mjs';
import { m as marked } from '../chunks/marked.esm_DWslfSAC.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$New;
  let error = "";
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const title = formData.get("title");
      const slug = formData.get("slug");
      const description = formData.get("description");
      const content = formData.get("content");
      const published = formData.get("published") === "on" ? 1 : 0;
      const content_html = marked(content);
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await Astro2.locals.runtime.env.DB.prepare(
        "INSERT INTO posts (slug, title, description, content, content_html, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(slug, title, description, content, content_html, published, now, now).run();
      return Astro2.redirect("/");
    } catch (e) {
      error = "Error creating post: " + e.message;
    }
  }
  return renderTemplate`${renderComponent($$result, "Dashboard", $$Dashboard, { "title": "New Post" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-bold mb-6">Create New Post</h1> ${error && renderTemplate`<div class="bg-red-50 text-red-600 p-4 rounded mb-4"> ${error} </div>`}<form method="POST" class="bg-white rounded-lg border p-6"> <div class="space-y-4"> <div> <label class="block text-sm font-medium mb-1">Title</label> <input type="text" name="title" required class="w-full px-3 py-2 border rounded" placeholder="My First Post"> </div> <div> <label class="block text-sm font-medium mb-1">Slug</label> <input type="text" name="slug" required class="w-full px-3 py-2 border rounded" placeholder="my-first-post"> <p class="text-xs text-gray-500 mt-1">URL: /blog/slug</p> </div> <div> <label class="block text-sm font-medium mb-1">Description</label> <input type="text" name="description" class="w-full px-3 py-2 border rounded" placeholder="A short description"> </div> <div> <label class="block text-sm font-medium mb-1">Content (Markdown)</label> <textarea name="content" required rows="15" class="w-full px-3 py-2 border rounded font-mono text-sm" placeholder="# Hello World

This is my **first post**!"></textarea> </div> <div class="flex items-center gap-2"> <input type="checkbox" name="published" id="published" class="w-4 h-4"> <label for="published" class="text-sm">Publish immediately</label> </div> <div class="flex gap-2 pt-4"> <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
Create Post
</button> <a href="/" class="px-6 py-2 border rounded hover:bg-gray-50">
Cancel
</a> </div> </div> </form> ` })}`;
}, "/home/aurora/snappost/templates/dashboard/src/pages/new.astro", void 0);

const $$file = "/home/aurora/snappost/templates/dashboard/src/pages/new.astro";
const $$url = "/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
