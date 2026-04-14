globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { createExports } from './_@astrojs-ssr-adapter.mjs';
import { manifest } from './manifest_sJadFT37.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/config.astro.mjs');
const _page2 = () => import('./pages/api/preview-html.astro.mjs');
const _page3 = () => import('./pages/api/upload-media.astro.mjs');
const _page4 = () => import('./pages/edit/_id_.astro.mjs');
const _page5 = () => import('./pages/login.astro.mjs');
const _page6 = () => import('./pages/logout.astro.mjs');
const _page7 = () => import('./pages/new.astro.mjs');
const _page8 = () => import('./pages/settings.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/api/config.ts", _page1],
    ["src/pages/api/preview-html.ts", _page2],
    ["src/pages/api/upload-media.ts", _page3],
    ["src/pages/edit/[id].astro", _page4],
    ["src/pages/login.astro", _page5],
    ["src/pages/logout.astro", _page6],
    ["src/pages/new.astro", _page7],
    ["src/pages/settings.astro", _page8],
    ["src/pages/index.astro", _page9]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
