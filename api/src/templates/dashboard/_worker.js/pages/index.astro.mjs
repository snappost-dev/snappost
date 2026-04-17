globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, d as renderTemplate, g as renderComponent, e as createAstro, m as maybeRenderHead, a as addAttribute } from '../chunks/astro/server_CO8Dftjj.mjs';
import { $ as $$Dashboard } from '../chunks/Dashboard_DgN7kGK8.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const postsResult = await Astro2.locals.runtime.env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  const posts = postsResult.results;
  return renderTemplate(_a || (_a = __template(["", " <script>\n  const deleteButtons = document.querySelectorAll('[data-delete-post-id]');\n  const publishButtons = document.querySelectorAll('[data-publish-post-id]');\n\n  deleteButtons.forEach((button) => {\n    button.addEventListener('click', async () => {\n      const postId = button.getAttribute('data-delete-post-id');\n      if (!postId) return;\n\n      const confirmed = window.confirm('Bu yaz\u0131y\u0131 silmek istedi\u011Finizden emin misiniz?');\n      if (!confirmed) return;\n\n      try {\n        const response = await fetch(`/api/posts/${postId}`, {\n          method: 'DELETE',\n          credentials: 'same-origin',\n        });\n        if (!response.ok) {\n          throw new Error(`Delete failed (${response.status})`);\n        }\n        window.location.reload();\n      } catch (error) {\n        console.error(error);\n        window.alert('Yaz\u0131 silinemedi. L\xFCtfen tekrar deneyin.');\n      }\n    });\n  });\n\n  publishButtons.forEach((button) => {\n    button.addEventListener('click', async () => {\n      const postId = button.getAttribute('data-publish-post-id');\n      const nextPublishedRaw = button.getAttribute('data-next-published');\n      const nextPublished = nextPublishedRaw === '1' ? 1 : 0;\n      if (!postId) return;\n\n      try {\n        const response = await fetch(`/api/posts/${postId}/publish`, {\n          method: 'PATCH',\n          headers: { 'Content-Type': 'application/json' },\n          credentials: 'same-origin',\n          body: JSON.stringify({ published: nextPublished }),\n        });\n        if (!response.ok) {\n          throw new Error(`Publish toggle failed (${response.status})`);\n        }\n        window.location.reload();\n      } catch (error) {\n        console.error(error);\n        window.alert('Yayin durumu guncellenemedi. Lutfen tekrar deneyin.');\n      }\n    });\n  });\n<\/script>"], ["", " <script>\n  const deleteButtons = document.querySelectorAll('[data-delete-post-id]');\n  const publishButtons = document.querySelectorAll('[data-publish-post-id]');\n\n  deleteButtons.forEach((button) => {\n    button.addEventListener('click', async () => {\n      const postId = button.getAttribute('data-delete-post-id');\n      if (!postId) return;\n\n      const confirmed = window.confirm('Bu yaz\u0131y\u0131 silmek istedi\u011Finizden emin misiniz?');\n      if (!confirmed) return;\n\n      try {\n        const response = await fetch(\\`/api/posts/\\${postId}\\`, {\n          method: 'DELETE',\n          credentials: 'same-origin',\n        });\n        if (!response.ok) {\n          throw new Error(\\`Delete failed (\\${response.status})\\`);\n        }\n        window.location.reload();\n      } catch (error) {\n        console.error(error);\n        window.alert('Yaz\u0131 silinemedi. L\xFCtfen tekrar deneyin.');\n      }\n    });\n  });\n\n  publishButtons.forEach((button) => {\n    button.addEventListener('click', async () => {\n      const postId = button.getAttribute('data-publish-post-id');\n      const nextPublishedRaw = button.getAttribute('data-next-published');\n      const nextPublished = nextPublishedRaw === '1' ? 1 : 0;\n      if (!postId) return;\n\n      try {\n        const response = await fetch(\\`/api/posts/\\${postId}/publish\\`, {\n          method: 'PATCH',\n          headers: { 'Content-Type': 'application/json' },\n          credentials: 'same-origin',\n          body: JSON.stringify({ published: nextPublished }),\n        });\n        if (!response.ok) {\n          throw new Error(\\`Publish toggle failed (\\${response.status})\\`);\n        }\n        window.location.reload();\n      } catch (error) {\n        console.error(error);\n        window.alert('Yayin durumu guncellenemedi. Lutfen tekrar deneyin.');\n      }\n    });\n  });\n<\/script>"])), renderComponent($$result, "Dashboard", $$Dashboard, { "title": "All Posts" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex justify-between items-center mb-6"> <h1 class="text-3xl font-bold">All Posts</h1> <a href="/new" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
+ New Post
</a> </div> <div class="bg-white rounded-lg border"> ${posts.length === 0 ? renderTemplate`<div class="p-8 text-center text-gray-500">
No posts yet. Create your first post!
</div>` : renderTemplate`<table class="w-full"> <thead class="border-b bg-gray-50"> <tr> <th class="text-left p-4">Title</th> <th class="text-left p-4">Status</th> <th class="text-left p-4">Created</th> <th class="text-right p-4">Actions</th> </tr> </thead> <tbody> ${posts.map((post) => renderTemplate`<tr class="border-b hover:bg-gray-50"> <td class="p-4 font-medium"> <a${addAttribute(`/blog/${post.slug}`, "href")} target="_blank" class="link link-hover"> ${post.title} </a> </td> <td class="p-4"> <span${addAttribute(`px-2 py-1 rounded text-xs ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`, "class")}> ${post.published ? "Published" : "Draft"} </span> </td> <td class="p-4 text-sm text-gray-600"> ${new Date(post.created_at).toLocaleDateString()} </td> <td class="p-4 text-right"> <div class="inline-flex items-center gap-2"> <a${addAttribute(`/edit/${post.id}`, "href")} class="text-blue-600 hover:text-blue-700 text-sm">
Edit
</a> <button type="button"${addAttribute(`btn btn-xs ${post.published ? "btn-warning" : "btn-success"}`, "class")}${addAttribute(String(post.id), "data-publish-post-id")}${addAttribute(post.published ? "0" : "1", "data-next-published")}> ${post.published ? "Unpublish" : "Publish"} </button> <button type="button" class="btn btn-error btn-xs"${addAttribute(String(post.id), "data-delete-post-id")}>
Delete
</button> </div> </td> </tr>`)} </tbody> </table>`} </div> ` }));
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
