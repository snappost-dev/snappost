import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    cloudflareModules: true,
    routes: {
      extend: {
        exclude: [{ pattern: '/favicon.ico' }]
      }
    }
  }),
});
