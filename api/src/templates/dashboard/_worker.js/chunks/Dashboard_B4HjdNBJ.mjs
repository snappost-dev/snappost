globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderHead, a as renderSlot, b as renderTemplate, d as createAstro } from './astro/server_Cag67392.mjs';

const $$Astro = createAstro();
const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} - Dashboard</title>${renderHead()}</head> <body class="bg-gray-50"> <header class="bg-white border-b"> <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"> <h1 class="text-xl font-bold">📝 Dashboard</h1> <nav class="flex gap-4"> <a href="/" class="hover:text-blue-600">Posts</a> <a href="/new" class="hover:text-blue-600">New Post</a> <form method="POST" action="/logout" class="inline"> <button type="submit" class="text-red-600 hover:text-red-700">Logout</button> </form> </nav> </div> </header> <main class="max-w-6xl mx-auto px-4 py-8"> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "/home/aurora/snappost/templates/dashboard/src/layouts/Dashboard.astro", void 0);

export { $$Dashboard as $ };
