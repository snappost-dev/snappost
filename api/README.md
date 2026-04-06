# Snappost Provisioning API

Cloudflare Workers + [Hono](https://hono.dev/) + D1. Email/şifre auth (JWT), provision ile kullanıcı başına D1 + Shell + Dashboard (Pages) oluşturma.

Ayrıntılı mimari, endpoint listesi ve yol haritası için repo kökünde **[PROJECT-STATUS.md](../PROJECT-STATUS.md)**.

## Kurulum

```bash
cd api
npm install
```

## Geliştirme

```bash
npm run dev
# http://localhost:8787
```

Yerelde `api/.dev.vars` örneği:

```bash
CF_API_TOKEN=...      # Cloudflare API token (D1 + Pages)
CF_ACCOUNT_ID=...     # wrangler.toml [vars] ile de verilebilir
JWT_SECRET=...        # JWT imzalama
```

`wrangler.toml` içinde provisioning D1 `database_id` tanımlı olmalı.

## Veritabanı (provisioning D1)

```bash
# İlk kez: D1 oluştur (çıktıdaki database_id → wrangler.toml)
npm run db:create

# Uzak D1 şeması
npm run db:migrate
```

Yerel D1 için: `wrangler d1 execute snappost-provisioning --local --file=./src/db/schema.sql`

## Şablon gömme (dashboard/shell değişince)

`templates/*/dist` → `api/src/templates/*` senkronundan sonra:

```bash
npm run embed
```

Ardından deploy. Ayrıntı: PROJECT-STATUS.md §3 ve §7.

## Production secrets

```bash
wrangler secret put CF_API_TOKEN
wrangler secret put JWT_SECRET
```

`CF_ACCOUNT_ID` genelde `wrangler.toml` `[vars]` içinde tutulur.

## Deploy

```bash
npm run deploy
```

## Endpoint özeti

| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/` | Health |
| POST | `/api/auth/register` | `{ email, password }` → JWT |
| POST | `/api/auth/login` | `{ email, password }` → JWT |
| GET | `/api/auth/me` | `Authorization: Bearer …` |
| POST | `/api/provision` | JWT + `{ site_name }` → D1 + Pages |
| GET | `/api/sites` | JWT → kullanıcının siteleri |
| GET | `/api/sites/:id` | JWT → tek site |

Geliştirme için `/test/*` route’ları da vardır (production’da kapatılması önerilir — PROJECT-STATUS.md §8).
