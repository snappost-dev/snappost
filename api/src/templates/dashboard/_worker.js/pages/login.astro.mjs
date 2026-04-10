globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, b as renderHead, r as renderTemplate, e as createAstro } from '../chunks/astro/server_CZTmva32.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const ADMIN_PASSWORD = "changeme";
  let error = "";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const password = formData.get("password");
    if (password === ADMIN_PASSWORD) {
      Astro2.cookies.set("auth", "authenticated", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7
        // 7 gün
      });
      return Astro2.redirect("/");
    } else {
      error = "Incorrect password";
    }
  }
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Login - Dashboard</title>${renderHead()}</head> <body class="bg-gray-50 min-h-screen flex items-center justify-center"> <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> <h1 class="text-2xl font-bold mb-6">Dashboard Login</h1> ${error && renderTemplate`<div class="bg-red-50 text-red-600 p-3 rounded mb-4"> ${error} </div>`} <form method="POST"> <div class="mb-4"> <label class="block text-sm font-medium mb-2">Password</label> <input type="password" name="password" required class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="Enter password"> </div> <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
Login
</button> <p class="text-xs text-gray-500 mt-4">
Default password: <code class="bg-gray-100 px-1">changeme</code> </p> </form> </div> </body></html>`;
}, "/home/aurora/snappost/templates/dashboard/src/pages/login.astro", void 0);
const $$file = "/home/aurora/snappost/templates/dashboard/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
