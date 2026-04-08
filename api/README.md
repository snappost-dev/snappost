# Snappost Provisioning API

Cloudflare Workers + [Hono](https://hono.dev/) + D1. Email/şifre auth (JWT), provision ile kullanıcı başına D1 + Shell + Dashboard (Pages) oluşturma.

Ayrıntılı mimari, endpoint listesi ve yol haritası için repo kökünde **[PROJECT-STATUS.md](../PROJECT-STATUS.md)**.

**Deploy modeli:** Bu Worker **sabit** uygulamadır (Git veya `wrangler deploy`). Kiracıların **shell/dashboard** Pages projeleri buradan deploy edilmez; **`POST /api/provision`** ile CF API üzerinden oluşturulur. Şablon değişince: dashboard/shell build → `api/src/templates/*` → `npm run embed` → bu Worker’ı yeniden deploy. Ayrıntı: PROJECT-STATUS.md **§7**.

**CF API token:** Custom domain için Pages projelerinde domain yönetimi yetkisi gerekir (Account / Cloudflare Pages — ilgili izinler).

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
# Opsiyonel — tanımlı değil veya boş = kayıt/giriş kısıtı yok
ALLOWED_EMAILS=alice@example.com,bob@example.com
# Yerelde /test/* açmak için (production’da kullanmayın)
ALLOW_TEST_ROUTES=true
```

**ALLOWED_EMAILS:** Virgülle ayrılmış liste; karşılaştırma **trim + küçük harf**. Şu uçlarda uygulanır: `register`, `login`, `me`, `sites`, `sites/:id`, `provision`. Listede olmayan e-posta **403** döner.

**ALLOW_TEST_ROUTES:** Yalnızca tam olarak `true` iken `/test/*` yanıt verir. Tanımsız veya başka değer → **404** (production’da tanımlamayın).

**Gizlilik:** Bu liste **hassas bir sır değildir** (yalnızca hangi adreslerin kayıt/giriş yapabileceğini sınırlar). SEO / trafik testi için davetli adresleri `wrangler.toml` `[vars]` veya Pages/Workers dashboard env olarak **açıkça** tutabilirsiniz. `JWT_SECRET` ve `CF_API_TOKEN` ise **asla** repoya veya `[vars]` ile halka açık yere koymayın; secret olarak kalır.

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

`CF_ACCOUNT_ID` genelde `wrangler.toml` `[vars]` içinde tutulur. `ALLOWED_EMAILS` isteğe bağlıdır; `[vars]` veya dashboard’da düz metin verilebilir (secret gerekmez).

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
| GET | `/api/auth/me` | `Authorization: Bearer …` (whitelist varsa kontrol) |
| POST | `/api/provision` | JWT + `{ site_name }` → D1 + Pages (whitelist varsa kontrol) |
| GET | `/api/sites` | JWT → kullanıcının siteleri (whitelist varsa kontrol) |
| GET | `/api/sites/:id` | JWT → tek site (whitelist varsa kontrol) |
| POST | `/api/sites/:id/domain` | JWT + `{ domain }` → shell Pages custom domain (blog) |
| DELETE | `/api/sites/:id/domain` | JWT → custom domain kaldır |
| DELETE | `/api/sites/:id` | JWT → site kaydını sil; CF’de dashboard/shell Pages + kiracı D1 + custom domain (varsa) best-effort temizlik |

`/test/*` route’ları yalnız `ALLOW_TEST_ROUTES=true` iken çalışır (bkz. yukarıdaki `.dev.vars` örneği).
