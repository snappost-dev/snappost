/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type TenantConfig = {
  d1_database_id: string;
  shell_type: string;
  user_id: string;
  access_token?: string;
};

type RuntimeEnv = {
  TENANT_KV: KVNamespace;
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
  API_URL?: string;
  SNAPPOST_API_URL?: string;
  SNAPPOST_SITE_ID?: string;
};

declare namespace App {
  interface Locals {
    tenant: {
      subdomain: string;
      config: TenantConfig | null;
    };
    isLanding: boolean;
    manageSiteName?: string;
    d1ApiEnv: {
      CF_ACCOUNT_ID: string;
      CF_API_TOKEN: string;
    };
    runtime: import("@astrojs/cloudflare").Runtime<RuntimeEnv>;
  }
}
