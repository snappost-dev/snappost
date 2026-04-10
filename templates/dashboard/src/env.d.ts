/// <reference path="../.astro/types.d.ts" />

import type { Runtime } from '@astrojs/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';

type CloudflareEnv = {
  DB: D1Database;
  ADMIN_PASSWORD: string;
  /** Provisioning API’deki `sites.access_token` (Pages env, provision ile yazılır) */
  ACCESS_TOKEN?: string;
  /** Kamuya açık API kökü, sondaki / olmadan */
  SNAPPOST_API_URL?: string;
  /** Merkezi `sites.id` (string) */
  SNAPPOST_SITE_ID?: string;
};

declare global {
  namespace App {
    interface Locals extends Runtime<CloudflareEnv> {}
  }
}

export {};
