globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { createExports } from './_@astrojs-ssr-adapter.mjs';
import { manifest } from './manifest_Bw2l53vU.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/config.astro.mjs');
const _page2 = () => import('./pages/api/posts/_id_/publish.astro.mjs');
const _page3 = () => import('./pages/api/posts/_id_.astro.mjs');
const _page4 = () => import('./pages/api/preview-html.astro.mjs');
const _page5 = () => import('./pages/api/upload-media.astro.mjs');
const _page6 = () => import('./pages/edit/_id_.astro.mjs');
const _page7 = () => import('./pages/login.astro.mjs');
const _page8 = () => import('./pages/logout.astro.mjs');
const _page9 = () => import('./pages/new.astro.mjs');
const _page10 = () => import('./pages/settings.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/api/config.ts", _page1],
    ["src/pages/api/posts/[id]/publish.ts", _page2],
    ["src/pages/api/posts/[id].ts", _page3],
    ["src/pages/api/preview-html.ts", _page4],
    ["src/pages/api/upload-media.ts", _page5],
    ["src/pages/edit/[id].astro", _page6],
    ["src/pages/login.astro", _page7],
    ["src/pages/logout.astro", _page8],
    ["src/pages/new.astro", _page9],
    ["src/pages/settings.astro", _page10],
    ["src/pages/index.astro", _page11]
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
