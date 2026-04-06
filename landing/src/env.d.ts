/// <reference path="../.astro/types.d.ts" />

import type { AdvancedRuntime } from '@astrojs/cloudflare';

type CloudflareEnv = {
  API_URL?: string;
  SESSION_SECRET?: string;
};

declare global {
  namespace App {
    interface Locals extends AdvancedRuntime<CloudflareEnv> {}
  }
}

export {};
