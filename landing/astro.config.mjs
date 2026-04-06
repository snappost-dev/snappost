import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server', // SSR mode for session handling
  adapter: cloudflare(),
  integrations: [tailwind()],
  site: 'https://snappost-landing.pages.dev'
});
