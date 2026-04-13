globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, d as renderTemplate, g as renderComponent, e as createAstro, m as maybeRenderHead, a as addAttribute } from '../chunks/astro/server_CO8Dftjj.mjs';
import { $ as $$Dashboard } from '../chunks/Dashboard_Dq3s_Fl-.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Settings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Settings;
  const THEMES = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset"
  ];
  const themeRow = await Astro2.locals.runtime.env.DB.prepare("SELECT value FROM config WHERE key = ? LIMIT 1").bind("site_theme").first();
  const currentThemeRaw = (themeRow?.value || "light").trim();
  const currentTheme = THEMES.includes(currentThemeRaw) ? currentThemeRaw : "light";
  return renderTemplate(_a || (_a = __template(["", " <script>\n  const form = document.getElementById('theme-form');\n  const select = document.getElementById('site-theme');\n  const message = document.getElementById('theme-message');\n\n  form?.addEventListener('submit', async (event) => {\n    event.preventDefault();\n    const value = select && 'value' in select ? select.value : 'light';\n\n    try {\n      const response = await fetch('/api/config', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        credentials: 'same-origin',\n        body: JSON.stringify({ key: 'site_theme', value }),\n      });\n\n      if (!response.ok) {\n        throw new Error('Theme save failed');\n      }\n\n      if (message) {\n        message.textContent = 'Saved. Reloading...';\n      }\n      window.location.reload();\n    } catch (err) {\n      if (message) {\n        message.textContent = 'Could not save theme. Try again.';\n      }\n      console.error(err);\n    }\n  });\n<\/script>"])), renderComponent($$result, "Dashboard", $$Dashboard, { "title": "Settings" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-xl"> <h1 class="text-3xl font-bold mb-2">Theme Settings</h1> <p class="text-sm text-base-content/70 mb-6">
Choose a DaisyUI theme for both dashboard and shell rendering.
</p> <form id="theme-form" class="space-y-4"> <div class="form-control"> <label class="label" for="site-theme"> <span class="label-text font-medium">Site Theme</span> </label> <select id="site-theme" class="select select-bordered w-full" name="theme"> ${THEMES.map((theme) => renderTemplate`<option${addAttribute(theme, "value")}${addAttribute(theme === currentTheme, "selected")}> ${theme} </option>`)} </select> </div> <button type="submit" class="btn btn-primary">Save Theme</button> <p id="theme-message" class="text-sm"></p> </form> </section> ` }));
}, "/home/aurora/snappost/templates/dashboard/src/pages/settings.astro", void 0);

const $$file = "/home/aurora/snappost/templates/dashboard/src/pages/settings.astro";
const $$url = "/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
