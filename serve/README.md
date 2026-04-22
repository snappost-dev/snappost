# Snappost Serve (SaaS shell+dashboard runtime)

`serve/`, `templates/shell` ve `templates/dashboard` kaynaklarından ayrik, cok kiracili SSR denemesi icin olusturulmus Astro projesidir.

## Amac

- Tek Astro runtime icinde subdomain'e gore tenant cozumlemek
- Tenant konfigunu `TENANT_KV` uzerinden okumak
- Tenant D1 verisine static binding yerine `queryD1` (Cloudflare D1 HTTP API) ile erismek
- Shell ve dashboard sayfalarini ayni codebase icinde calistirmak

## Mimari Ozeti

- **Middleware:** `src/middleware.ts`
  - Host header'dan subdomain cozer (`ozzie.snappost.app` -> `ozzie`)
  - `local` modda KV atlanir
  - `TENANT_KV` kaydi bulunamazsa `404 Site not found`
- **Tenant context:** `src/env.d.ts`
  - `App.Locals.tenant` -> `{ subdomain, config }`
  - `App.Locals.d1ApiEnv` -> `{ CF_ACCOUNT_ID, CF_API_TOKEN }`
- **D1 helper:** `src/lib/d1.ts`
  - `queryD1(sql, params, databaseId, env)` imzasi ile sorgu calisir

## Dizinler

- `src/pages/` -> shell + dashboard route'lari
- `src/pages/api/` -> dashboard API endpoint'leri
- `src/pages/dashboard/api/` -> dashboard altindan ayni API yuzeyi
- `src/lib/` -> auth, D1, editor, config yardimcilari

## Ortam Degiskenleri

Yerel gelistirme icin `serve/.dev.vars`:

```bash
CF_ACCOUNT_ID="..."
CF_API_TOKEN="..."
JWT_SECRET="..."
```

`wrangler.toml` icinde:

- `TENANT_KV` namespace binding
- `CF_ACCOUNT_ID`, `CF_API_TOKEN` vars placeholders

## Gelistirme

```bash
cd serve
npm install
npm run build
npm run dev
```

Tenant test ornegi:

```bash
curl -H "Host: ozzie.snappost.app" http://localhost:8787
curl -H "Host: ozzie.snappost.app" http://localhost:8787/dashboard/login
```

## Deploy

Mevcut `package.json` deploy scripti:

```bash
npm run deploy
```

Not: Bu klasor aktif production template kaynagi degildir. Production provision hatti halen `templates/* -> api/src/templates/* -> npm run embed -> wrangler deploy` modelindedir.
