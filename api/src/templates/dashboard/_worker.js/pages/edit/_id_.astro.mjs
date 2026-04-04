globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                   */
import { c as createComponent, e as renderComponent, b as renderTemplate, d as createAstro, m as maybeRenderHead, f as addAttribute } from '../../chunks/astro/server_Cag67392.mjs';
import { $ as $$Dashboard } from '../../chunks/Dashboard_B4HjdNBJ.mjs';
import { m as marked } from '../../chunks/marked.esm_DWslfSAC.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const post = await Astro2.locals.runtime.env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
  if (!post) {
    return Astro2.redirect("/");
  }
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
        "UPDATE posts SET title = ?, slug = ?, description = ?, content = ?, content_html = ?, published = ?, updated_at = ? WHERE id = ?"
      ).bind(title, slug, description, content, content_html, published, now, id).run();
      return Astro2.redirect("/");
    } catch (e) {
      error = "Error updating post: " + e.message;
    }
  }
  return renderTemplate`${renderComponent($$result, "Dashboard", $$Dashboard, { "title": `Edit: ${post.title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-bold mb-6">Edit Post</h1> ${error && renderTemplate`<div class="bg-red-50 text-red-600 p-4 rounded mb-4"> ${error} </div>`}<form method="POST" class="bg-white rounded-lg border p-6"> <div class="space-y-4"> <div> <label class="block text-sm font-medium mb-1">Title</label> <input type="text" name="title" required${addAttribute(post.title, "value")} class="w-full px-3 py-2 border rounded"> </div> <div> <label class="block text-sm font-medium mb-1">Slug</label> <input type="text" name="slug" required${addAttribute(post.slug, "value")} class="w-full px-3 py-2 border rounded"> </div> <div> <label class="block text-sm font-medium mb-1">Description</label> <input type="text" name="description"${addAttribute(post.description || "", "value")} class="w-full px-3 py-2 border rounded"> </div> <div> <label class="block text-sm font-medium mb-1">Content (Markdown)</label> <textarea name="content" required rows="15" class="w-full px-3 py-2 border rounded font-mono text-sm">${post.content}</textarea> </div> <div class="flex items-center gap-2"> <input type="checkbox" name="published" id="published"${addAttribute(post.published === 1, "checked")} class="w-4 h-4"> <label for="published" class="text-sm">Published</label> </div> <div class="flex gap-2 pt-4"> <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
Save Changes
</button> <a href="/" class="px-6 py-2 border rounded hover:bg-gray-50">
Cancel
</a> </div> </div> </form> ` })}`;
}, "/home/aurora/snappost/templates/dashboard/src/pages/edit/[id].astro", void 0);

const $$file = "/home/aurora/snappost/templates/dashboard/src/pages/edit/[id].astro";
const $$url = "/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
