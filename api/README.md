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
# Opsiyonel — kullanıcı başına en fazla kaç blog (sites). Boş = sınırsız
# MAX_SITES_PER_USER=3
# Opsiyonel — CORS Origin listesi (virgülle); boş = varsayılan localhost + snappost.* + pages.dev
# CORS_ORIGINS=http://localhost:4321,http://localhost:4322
# Opsiyonel — görsel yükleme üst sınırı (MB)
# MAX_MEDIA_UPLOAD_MB=5
# Yerelde /test/* açmak için (production’da kullanmayın)
ALLOW_TEST_ROUTES=true
```

**ALLOWED_EMAILS:** Virgülle ayrılmış liste; karşılaştırma **trim + küçük harf**. Şu uçlarda uygulanır: `register`, `login`, `me`, `sites`, `sites/:id`, `provision`, `sites/:id/domain`, `sites/:id` (DELETE). Listede olmayan e-posta **403** döner.

**MAX_SITES_PER_USER:** Pozitif tam sayı string (örn. `3`). Tanımsız veya boş = sınırsız blog. `POST /api/provision` öncesi kullanıcının mevcut `sites` sayısı bu üst sınıra eşit veya üstündeyse **403** (`error` + `detail`).

**CORS_ORIGINS:** Virgülle ayrılmış tam origin (`https://example.com`, `http://localhost:4321`). Tarayıcıdan landing → API çağrıları için `Origin` burada olmalı. Tanımsız veya boş = yerleşik liste: `localhost:4321`, `localhost:4322`, `https://snappost.dev`, `https://snappost-landing.pages.dev`. **Özel landing alanı** kullanıyorsanız bu değişkende **hem yeni origin’i hem ihtiyaç duyduğunuz mevcut origin’leri** birlikte verin (boş bırakırsanız özel alan CORS’ta yoktur).

**Kiracı dashboard (B2):** `https://sp-{userId}-{site_name}-dash.pages.dev` origin’leri **ekstra env gerekmeden** CORS’ta kabul edilir (multipart upload için).

**MAX_MEDIA_UPLOAD_MB:** Opsiyonel; görsel yükleme üst sınırı megabayt (0.5–20, varsayılan 5).

**ALLOW_TEST_ROUTES:** Yalnızca tam olarak `true` iken `/test/*` yanıt verir. Tanımsız veya başka değer → **404** (production’da tanımlamayın).

**Gizlilik:** Bu liste **hassas bir sır değildir** (yalnızca hangi adreslerin kayıt/giriş yapabileceğini sınırlar). SEO / trafik testi için davetli adresleri `wrangler.toml` `[vars]` veya Pages/Workers dashboard env olarak **açıkça** tutabilirsiniz. `JWT_SECRET` ve `CF_API_TOKEN` ise **asla** repoya veya `[vars]` ile halka açık yere koymayın; secret olarak kalır.

`wrangler.toml` içinde provisioning D1 `database_id` tanımlı olmalı.

## R2 medya (B1)

Tek bucket **`snappost-media`**, Worker binding **`MEDIA_BUCKET`**. Kiracı görselleri **object key prefix** ile ayrılır: `u{userId}/s{siteId}/…` (`userId` = provisioning `users.id`, `siteId` = `sites.id`). Yardımcılar: [`src/lib/media-keys.ts`](src/lib/media-keys.ts).

İlk kurulum (bucket yoksa):

```bash
npx wrangler r2 bucket create snappost-media
```

Durum JSON: `GET /api/media/status` (auth gerekmez).

**Yükleme (B2):** `POST /api/sites/{siteId}/media` — `Authorization: Bearer …`, `Content-Type: multipart/form-data`, alan adı `file`. İzinli türler: `image/jpeg`, `image/png`, `image/webp`, `image/gif`. Yanıt: `{ key, url, content_type, size }` — `url` yazıda `<img src>` olarak kullanılabilir.

**Public okuma:** `GET /api/media/raw/{base64urlKey}` — auth yok; shell/blog görselleri için.

Örnek (token ve site id ile):

```bash
curl -sS -X POST "$API_URL/api/sites/1/media" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./photo.jpg"
```

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

## Duman testleri (smoke)

Üretim veya staging API köküne karşı hızlı kontrol (secret’ları repoya yazmayın):

```bash
export SMOKE_API_URL="https://snappost-api.<subdomain>.workers.dev"
# İsteğe bağlı — login + /api/sites:
# export SMOKE_EMAIL="..."
# export SMOKE_PASSWORD="..."
npm run smoke
```

Ayrıntılı manuel liste: [docs/SPRINT-PLAN.md](../docs/SPRINT-PLAN.md) §C.

## Endpoint özeti

| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/` | Health |
| GET | `/api/media/status` | R2 + yükleme limiti özeti |
| GET | `/api/media/raw/:enc` | R2 nesnesi (base64url key; public) |
| POST | `/api/sites/:id/media` | Multipart `file` — görsel yükleme (JWT + site sahibi) |
| POST | `/api/auth/register` | `{ email, password }` → JWT |
| POST | `/api/auth/login` | `{ email, password }` → JWT |
| GET | `/api/auth/me` | `Authorization: Bearer …` (whitelist varsa kontrol) |
| POST | `/api/provision` | JWT + `{ site_name }` → D1 + Pages (whitelist + isteğe bağlı `MAX_SITES_PER_USER`) |
| GET | `/api/sites` | JWT → kullanıcının siteleri (whitelist varsa kontrol) |
| GET | `/api/sites/:id` | JWT → tek site (whitelist varsa kontrol) |
| POST | `/api/sites/:id/domain` | JWT + `{ domain }` → shell Pages custom domain (blog) |
| DELETE | `/api/sites/:id/domain` | JWT → custom domain kaldır |
| DELETE | `/api/sites/:id` | JWT → site kaydını sil; CF’de dashboard/shell Pages + kiracı D1 + custom domain (varsa) best-effort temizlik |

`/test/*` route’ları yalnız `ALLOW_TEST_ROUTES=true` iken çalışır (bkz. yukarıdaki `.dev.vars` örneği).
