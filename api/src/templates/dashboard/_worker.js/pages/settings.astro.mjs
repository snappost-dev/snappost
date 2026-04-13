globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, d as renderTemplate, g as renderComponent, e as createAstro, m as maybeRenderHead, a as addAttribute } from '../chunks/astro/server_CO8Dftjj.mjs';
import { $ as $$Dashboard } from '../chunks/Dashboard_BuCE_YL7.mjs';
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
  const siteThemeRow = await Astro2.locals.runtime.env.DB.prepare("SELECT value FROM config WHERE key = ? LIMIT 1").bind("site_theme").first();
  const dashboardThemeRow = await Astro2.locals.runtime.env.DB.prepare("SELECT value FROM config WHERE key = ? LIMIT 1").bind("dashboard_theme").first();
  const currentSiteThemeRaw = (siteThemeRow?.value || "light").trim();
  const currentSiteTheme = THEMES.includes(currentSiteThemeRaw) ? currentSiteThemeRaw : "light";
  const currentDashboardThemeRaw = (dashboardThemeRow?.value || "light").trim();
  const currentDashboardTheme = THEMES.includes(currentDashboardThemeRaw) ? currentDashboardThemeRaw : "light";
  return renderTemplate(_a || (_a = __template(["", " <script>\n  const form = document.getElementById('theme-form');\n  const blogThemeSelect = document.getElementById('blog-theme');\n  const dashboardThemeSelect = document.getElementById('dashboard-theme');\n  const message = document.getElementById('theme-message');\n\n  form?.addEventListener('submit', async (event) => {\n    event.preventDefault();\n    const blogTheme = blogThemeSelect && 'value' in blogThemeSelect ? blogThemeSelect.value : 'light';\n    const dashboardTheme =\n      dashboardThemeSelect && 'value' in dashboardThemeSelect ? dashboardThemeSelect.value : 'light';\n\n    try {\n      const requests = await Promise.all([\n        fetch('/api/config', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          credentials: 'same-origin',\n          body: JSON.stringify({ key: 'site_theme', value: blogTheme }),\n        }),\n        fetch('/api/config', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          credentials: 'same-origin',\n          body: JSON.stringify({ key: 'dashboard_theme', value: dashboardTheme }),\n        }),\n      ]);\n\n      if (requests.some((response) => !response.ok)) throw new Error('Theme save failed');\n\n      if (message) {\n        message.textContent = 'Saved. Reloading...';\n      }\n      window.location.reload();\n    } catch (err) {\n      if (message) {\n        message.textContent = 'Could not save theme. Try again.';\n      }\n      console.error(err);\n    }\n  });\n<\/script>"])), renderComponent($$result, "Dashboard", $$Dashboard, { "title": "Settings" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-xl"> <h1 class="text-3xl font-bold mb-2">Theme Settings</h1> <p class="text-sm text-base-content/70 mb-6">Manage blog and dashboard themes independently.</p> <form id="theme-form" class="space-y-4"> <div class="form-control"> <label class="label" for="blog-theme"> <span class="label-text font-medium">Blog Theme</span> </label> <select id="blog-theme" class="select select-bordered w-full" name="blog-theme"> ${THEMES.map((theme) => renderTemplate`<option${addAttribute(theme, "value")}${addAttribute(theme === currentSiteTheme, "selected")}> ${theme} </option>`)} </select> </div> <div class="form-control"> <label class="label" for="dashboard-theme"> <span class="label-text font-medium">Dashboard Theme</span> </label> <select id="dashboard-theme" class="select select-bordered w-full" name="dashboard-theme"> ${THEMES.map((theme) => renderTemplate`<option${addAttribute(theme, "value")}${addAttribute(theme === currentDashboardTheme, "selected")}> ${theme} </option>`)} </select> </div> <button type="submit" class="btn btn-primary">Save Themes</button> <p id="theme-message" class="text-sm"></p> </form> </section> ` }));
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
