/// <reference path="../.astro/types.d.ts" />

import type { Runtime } from '@astrojs/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';

type CloudflareEnv = {
  DB: D1Database;
  ADMIN_PASSWORD: string;
};

declare global {
  namespace App {
    interface Locals extends Runtime<CloudflareEnv> {}
  }
}

export {};
