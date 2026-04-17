globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                */
import { c as createComponent, d as renderTemplate, g as renderComponent, e as createAstro, m as maybeRenderHead, a as addAttribute } from '../chunks/astro/server_CO8Dftjj.mjs';
import { $ as $$Dashboard } from '../chunks/Dashboard_DgN7kGK8.mjs';
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
  const siteThemeLightRow = await Astro2.locals.runtime.env.DB.prepare("SELECT value FROM config WHERE key = ? LIMIT 1").bind("site_theme_light").first();
  const siteThemeDarkRow = await Astro2.locals.runtime.env.DB.prepare("SELECT value FROM config WHERE key = ? LIMIT 1").bind("site_theme_dark").first();
  const dashboardThemeRow = await Astro2.locals.runtime.env.DB.prepare("SELECT value FROM config WHERE key = ? LIMIT 1").bind("dashboard_theme").first();
  const siteConfigRows = await Astro2.locals.runtime.env.DB.prepare(
    `SELECT key, value FROM config
     WHERE key IN ('site_title', 'site_description', 'author_name', 'author_bio', 'blog_layout', 'share_twitter', 'share_linkedin', 'share_facebook', 'share_whatsapp', 'share_copy')`
  ).all();
  const siteConfig = Object.fromEntries(
    (siteConfigRows.results || []).map((row) => [row.key, row.value])
  );
  const siteTitle = (siteConfig.site_title || "").trim();
  const siteDescription = (siteConfig.site_description || "").trim();
  const authorName = (siteConfig.author_name || "").trim();
  const authorBio = (siteConfig.author_bio || "").trim();
  const blogLayoutRaw = (siteConfig.blog_layout || "list").trim();
  const blogLayout = blogLayoutRaw === "grid" || blogLayoutRaw === "featured" ? blogLayoutRaw : "list";
  const shareTwitter = (siteConfig.share_twitter || "").trim() === "1";
  const shareLinkedin = (siteConfig.share_linkedin || "").trim() === "1";
  const shareFacebook = (siteConfig.share_facebook || "").trim() === "1";
  const shareWhatsapp = (siteConfig.share_whatsapp || "").trim() === "1";
  const shareCopyRaw = (siteConfig.share_copy || "").trim();
  const shareCopy = shareCopyRaw === "" ? true : shareCopyRaw === "1";
  const currentSiteThemeLightRaw = (siteThemeLightRow?.value || "light").trim();
  const currentSiteThemeLight = THEMES.includes(currentSiteThemeLightRaw) ? currentSiteThemeLightRaw : "light";
  const currentSiteThemeDarkRaw = (siteThemeDarkRow?.value || "dark").trim();
  const currentSiteThemeDark = THEMES.includes(currentSiteThemeDarkRaw) ? currentSiteThemeDarkRaw : "dark";
  const currentDashboardThemeRaw = (dashboardThemeRow?.value || "light").trim();
  const currentDashboardTheme = THEMES.includes(currentDashboardThemeRaw) ? currentDashboardThemeRaw : "light";
  return renderTemplate(_a || (_a = __template(["", " <script>\n  const siteConfigForm = document.getElementById('site-config-form');\n  const siteConfigMessage = document.getElementById('site-config-message');\n\n  siteConfigForm?.addEventListener('submit', async (event) => {\n    event.preventDefault();\n    const titleInput = document.getElementById('site-title');\n    const descriptionInput = document.getElementById('site-description');\n    const authorNameInput = document.getElementById('author-name');\n    const authorBioInput = document.getElementById('author-bio');\n    const blogLayoutInput = document.getElementById('blog-layout');\n    const shareTwitterInput = document.getElementById('share-twitter');\n    const shareLinkedinInput = document.getElementById('share-linkedin');\n    const shareFacebookInput = document.getElementById('share-facebook');\n    const shareWhatsappInput = document.getElementById('share-whatsapp');\n    const shareCopyInput = document.getElementById('share-copy');\n\n    const updates = [\n      { key: 'site_title', value: titleInput && 'value' in titleInput ? titleInput.value : '' },\n      {\n        key: 'site_description',\n        value: descriptionInput && 'value' in descriptionInput ? descriptionInput.value : '',\n      },\n      { key: 'author_name', value: authorNameInput && 'value' in authorNameInput ? authorNameInput.value : '' },\n      { key: 'author_bio', value: authorBioInput && 'value' in authorBioInput ? authorBioInput.value : '' },\n      { key: 'blog_layout', value: blogLayoutInput && 'value' in blogLayoutInput ? blogLayoutInput.value : 'list' },\n      { key: 'share_twitter', value: shareTwitterInput && 'checked' in shareTwitterInput && shareTwitterInput.checked ? '1' : '0' },\n      { key: 'share_linkedin', value: shareLinkedinInput && 'checked' in shareLinkedinInput && shareLinkedinInput.checked ? '1' : '0' },\n      { key: 'share_facebook', value: shareFacebookInput && 'checked' in shareFacebookInput && shareFacebookInput.checked ? '1' : '0' },\n      { key: 'share_whatsapp', value: shareWhatsappInput && 'checked' in shareWhatsappInput && shareWhatsappInput.checked ? '1' : '0' },\n      { key: 'share_copy', value: shareCopyInput && 'checked' in shareCopyInput && shareCopyInput.checked ? '1' : '0' },\n    ];\n\n    try {\n      const responses = await Promise.all(\n        updates.map((update) =>\n          fetch('/api/config', {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            credentials: 'same-origin',\n            body: JSON.stringify(update),\n          })\n        )\n      );\n      if (responses.some((response) => !response.ok)) throw new Error('Settings save failed');\n      if (siteConfigMessage) siteConfigMessage.textContent = 'Saved. Reloading...';\n      window.location.reload();\n    } catch (err) {\n      if (siteConfigMessage) siteConfigMessage.textContent = 'Could not save settings. Try again.';\n      console.error(err);\n    }\n  });\n\n  const form = document.getElementById('theme-form');\n  const siteThemeLightSelect = document.getElementById('site-theme-light');\n  const siteThemeDarkSelect = document.getElementById('site-theme-dark');\n  const dashboardThemeSelect = document.getElementById('dashboard-theme');\n  const message = document.getElementById('theme-message');\n\n  form?.addEventListener('submit', async (event) => {\n    event.preventDefault();\n    const siteThemeLight = siteThemeLightSelect && 'value' in siteThemeLightSelect ? siteThemeLightSelect.value : 'light';\n    const siteThemeDark = siteThemeDarkSelect && 'value' in siteThemeDarkSelect ? siteThemeDarkSelect.value : 'dark';\n    const dashboardTheme =\n      dashboardThemeSelect && 'value' in dashboardThemeSelect ? dashboardThemeSelect.value : 'light';\n\n    try {\n      const requests = await Promise.all([\n        fetch('/api/config', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          credentials: 'same-origin',\n          body: JSON.stringify({ key: 'site_theme_light', value: siteThemeLight }),\n        }),\n        fetch('/api/config', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          credentials: 'same-origin',\n          body: JSON.stringify({ key: 'site_theme_dark', value: siteThemeDark }),\n        }),\n        fetch('/api/config', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          credentials: 'same-origin',\n          body: JSON.stringify({ key: 'dashboard_theme', value: dashboardTheme }),\n        }),\n      ]);\n\n      if (requests.some((response) => !response.ok)) throw new Error('Theme save failed');\n\n      if (message) {\n        message.textContent = 'Saved. Reloading...';\n      }\n      window.location.reload();\n    } catch (err) {\n      if (message) {\n        message.textContent = 'Could not save theme. Try again.';\n      }\n      console.error(err);\n    }\n  });\n<\/script>"])), renderComponent($$result, "Dashboard", $$Dashboard, { "title": "Settings" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-xl"> <h1 class="text-3xl font-bold mb-2">Site Settings</h1> <p class="text-sm text-base-content/70 mb-6">Update core blog metadata and theme preferences.</p> <form id="site-config-form" class="space-y-4 mb-10"> <div class="form-control"> <label class="label" for="site-title"> <span class="label-text font-medium">Site Basligi</span> </label> <input id="site-title" name="site_title" class="input input-bordered w-full"${addAttribute(siteTitle, "value")}> </div> <div class="form-control"> <label class="label" for="site-description"> <span class="label-text font-medium">Site Aciklamasi</span> </label> <input id="site-description" name="site_description" class="input input-bordered w-full"${addAttribute(siteDescription, "value")}> </div> <div class="form-control"> <label class="label" for="author-name"> <span class="label-text font-medium">Yazar Adi</span> </label> <input id="author-name" name="author_name" class="input input-bordered w-full"${addAttribute(authorName, "value")}> </div> <div class="form-control"> <label class="label" for="author-bio"> <span class="label-text font-medium">Yazar Biyografisi</span> </label> <textarea id="author-bio" name="author_bio" class="textarea textarea-bordered w-full" rows="4">${authorBio}</textarea> </div> <div class="form-control"> <label class="label" for="blog-layout"> <span class="label-text font-medium">Blog Duzeni</span> </label> <select id="blog-layout" name="blog_layout" class="select select-bordered w-full"> <option value="list"${addAttribute(blogLayout === "list", "selected")}>Liste (alt alta)</option> <option value="grid"${addAttribute(blogLayout === "grid", "selected")}>2 Kolonlu Grid</option> <option value="featured"${addAttribute(blogLayout === "featured", "selected")}>One Cikan + Liste</option> </select> </div> <div class="form-control"> <label class="label"> <span class="label-text font-medium">Paylasim Butonlari</span> </label> <div class="space-y-2 rounded-box border border-base-300 bg-base-100 p-3"> <label class="label cursor-pointer justify-start gap-3 py-1" for="share-twitter"> <input id="share-twitter" type="checkbox" class="checkbox checkbox-sm"${addAttribute(shareTwitter, "checked")}> <span class="label-text">Twitter/X</span> </label> <label class="label cursor-pointer justify-start gap-3 py-1" for="share-linkedin"> <input id="share-linkedin" type="checkbox" class="checkbox checkbox-sm"${addAttribute(shareLinkedin, "checked")}> <span class="label-text">LinkedIn</span> </label> <label class="label cursor-pointer justify-start gap-3 py-1" for="share-facebook"> <input id="share-facebook" type="checkbox" class="checkbox checkbox-sm"${addAttribute(shareFacebook, "checked")}> <span class="label-text">Facebook</span> </label> <label class="label cursor-pointer justify-start gap-3 py-1" for="share-whatsapp"> <input id="share-whatsapp" type="checkbox" class="checkbox checkbox-sm"${addAttribute(shareWhatsapp, "checked")}> <span class="label-text">WhatsApp</span> </label> <label class="label cursor-pointer justify-start gap-3 py-1" for="share-copy"> <input id="share-copy" type="checkbox" class="checkbox checkbox-sm"${addAttribute(shareCopy, "checked")}> <span class="label-text">Linki Kopyala</span> </label> </div> </div> <button type="submit" class="btn btn-primary">Kaydet</button> <p id="site-config-message" class="text-sm"></p> </form> <h1 class="text-3xl font-bold mb-2">Theme Settings</h1> <p class="text-sm text-base-content/70 mb-6">Manage blog and dashboard themes independently.</p> <form id="theme-form" class="space-y-4"> <div class="form-control"> <label class="label" for="site-theme-light"> <span class="label-text font-medium">Acik Tema</span> </label> <select id="site-theme-light" class="select select-bordered w-full" name="site-theme-light"> ${THEMES.map((theme) => renderTemplate`<option${addAttribute(theme, "value")}${addAttribute(theme === currentSiteThemeLight, "selected")}> ${theme} </option>`)} </select> </div> <div class="form-control"> <label class="label" for="site-theme-dark"> <span class="label-text font-medium">Koyu Tema</span> </label> <select id="site-theme-dark" class="select select-bordered w-full" name="site-theme-dark"> ${THEMES.map((theme) => renderTemplate`<option${addAttribute(theme, "value")}${addAttribute(theme === currentSiteThemeDark, "selected")}> ${theme} </option>`)} </select> </div> <div class="form-control"> <label class="label" for="dashboard-theme"> <span class="label-text font-medium">Dashboard Theme</span> </label> <select id="dashboard-theme" class="select select-bordered w-full" name="dashboard-theme"> ${THEMES.map((theme) => renderTemplate`<option${addAttribute(theme, "value")}${addAttribute(theme === currentDashboardTheme, "selected")}> ${theme} </option>`)} </select> </div> <button type="submit" class="btn btn-primary">Save Themes</button> <p id="theme-message" class="text-sm"></p> </form> </section> ` }));
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
