globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, d as createAstro } from '../chunks/astro/server_Cag67392.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Logout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Logout;
  if (Astro2.request.method === "POST") {
    Astro2.cookies.delete("auth");
    return Astro2.redirect("/login");
  }
  return Astro2.redirect("/");
}, "/home/aurora/snappost/templates/dashboard/src/pages/logout.astro", void 0);

const $$file = "/home/aurora/snappost/templates/dashboard/src/pages/logout.astro";
const $$url = "/logout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Logout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
