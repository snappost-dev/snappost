# SNAPPOST — Project Status (V1 MVP + dashboard editörü)

**Son güncelleme:** 2026-04-06  
**Repo:** https://github.com/snappost-dev/snappost  
**Branch:** main

**MVP V1 (bu repodaki kapsam):** Kayıt/giriş, provision (blog + dashboard + kiracı D1), landing dashboard (site listesi, custom domain DNS yardımı, blog silme), dashboard’da Editor.js yazı editörü, opsiyonel e-posta whitelist ve opsiyonel kullanıcı başına blog sayısı sınırı. **Sonraki plan** için ayrı sprint: rate limiting, dashboard şifre yönetimi, mimari ölçekleme (§9.3), ürün büyümesi (§9.4).

---

## 1. Ne Bu Proje?

Snappost, kullanıcıların email/password ile kayıt olup **~15 saniyede** tam bir Astro blog + admin dashboard altyapısını Cloudflare üzerine deploy edebildiği bir SaaS. Merkezi hosting modeli — tüm siteler bizim CF hesabında çalışıyor. Her kullanıcı kendi izole D1 database'ine, blog frontend'ine ve dashboard'a sahip oluyor.

### Dashboard içerik editörü (V2 — tamamlandı)

- **`templates/dashboard`:** Yazı oluşturma/düzenleme **Editor.js** (`/new`, `/edit/[id]`): header, paragraph, list, quote, code, delimiter, **Alert** (özel); CDN araçları + `public/dashboard/alert-block.js` (`SnappostAlertBlock`). Blok ekleme yalnızca editördeki **+** (sidebar’da ayrı “Add Block” yok). Kayıt: `POST` sonrası **`/edit/{id}`** (yeni yazıda `last_row_id` ile). SSR HTML: `src/lib/editor.ts` içindeki `renderEditorJSToHTML()` (sayfalar import eder).
- **Veri modeli:** `posts.content` — Editor.js JSON; `content_html` — `renderEditorJSToHTML()`. **Eski markdown** kayıtlarında edit uyarısı; shell `content_html` kullanır.
- **Kaynak dosyalar:** `templates/dashboard/src/pages/new.astro`, `edit/[id].astro`, `src/lib/editor.ts`, `public/dashboard/alert-block.js`.
- **Provision / API:** Güncel dashboard build’i `api/src/templates/dashboard` + `npm run embed` → `api/src/generated/dashboard-template.ts`; yeni provision bu gömülü şablonu kullanır.
- **Arşiv dokümantasyon:** Tamamlanmış revize plan → [`docs/archive-editorjs-v2-plan.md`](docs/archive-editorjs-v2-plan.md). Erken taslak → [`docs/cursor-opus-prompt-v1.md`](docs/cursor-opus-prompt-v1.md).

### Mimari not — ölçekleme (sıradaki büyük iş)

- Mevcut model: **site başına** ayrı Shell + Dashboard **Cloudflare Pages projesi** + ayrı D1 → hesap düzeyinde **Pages proje sayısı** ve operasyon maliyeti hızlı büyür.
- **Sonraki faz:** Çok kiracılı (multi-tenant) veya daha az Pages yüzeyi — teknik karar ve backlog özeti aşağıda **bölüm 9**.

---

## 2. Mimari

```
┌─────────────────────────────────────────────────────┐
│  Landing (snappost-landing.pages.dev)               │
│  Astro SSR + Tailwind / Cloudflare Pages            │
│  Sayfalar: / /register /login /dashboard /logout    │
└──────────────────┬──────────────────────────────────┘
                   │ server-side fetch (JWT Bearer)
                   ▼
┌─────────────────────────────────────────────────────┐
│  API (snappost-api.snappost-dev.workers.dev)        │
│  Hono / Cloudflare Workers                          │
│  Auth: bcryptjs + hono/jwt (HS256, 7 gün expiry)   │
│  DB: D1 "snappost-provisioning" (users + sites)     │
└──────────────────┬──────────────────────────────────┘
                   │ CF REST API (D1 + Pages)
                   ▼
┌─────────────────────────────────────────────────────┐
│  Per-User Resources (provision sırasında oluşur)    │
│  ├── D1 Database   (posts + config tabloları)       │
│  ├── Shell         (blog frontend / CF Pages)       │
│  └── Dashboard     (admin panel  / CF Pages)        │
│                                                     │
│  Naming: sp-{userId}-{siteName}-db/shell/dash       │
│  Her site kendi D1 binding'ine sahip                │
└─────────────────────────────────────────────────────┘
```

### Provision Flow (POST /api/provision — ~15 saniye)

1. JWT verify
2. Unique isimler generate (`sp-{userId}-{siteName}-*`)
3. D1 database oluştur (CF API)
4. Blog schema execute (posts + config tabloları)
5. Pages projesi oluştur (shell) + D1 binding set
6. Shell template deploy (esbuild bundle + Direct Upload API)
7. Pages projesi oluştur (dashboard) + D1 binding + ACCESS_TOKEN set
8. Dashboard template deploy
9. sites tablosuna kaydet
10. URL'leri döndür

Hata olursa rollback: oluşturulan Pages projeleri ve D1 database silinir.

---

## 3. Repo Yapısı

```
~/snappost/
├── .cursor/rules/
│   └── snappost.mdc              # Cursor AI: indeks + kritik kısıtlar → bu dosya
├── api/                          # Provisioning API (Cloudflare Workers)
│   ├── src/
│   │   ├── index.ts              # Hono app — tüm endpoint'ler
│   │   ├── lib/
│   │   │   ├── cloudflare.ts     # CF API helpers (D1, Pages, bindings)
│   │   │   └── templates.ts      # Template prepare + blog schema SQL
│   │   ├── db/
│   │   │   └── schema.sql        # Provisioning DB schema (users + sites)
│   │   ├── generated/            # Auto-generated (npm run embed)
│   │   │   ├── shell-template.ts     # Shell build output (base64 embedded)
│   │   │   └── dashboard-template.ts # Dashboard build output (base64 embedded)
│   │   └── templates/            # Raw build output (esbuild source)
│   │       ├── shell/            # Astro SSR build (18 files)
│   │       └── dashboard/        # Astro SSR build (19 files)
│   ├── scripts/
│   │   └── embed-templates.mjs   # Template → base64 TS + esbuild bundle
│   ├── wrangler.toml
│   └── package.json
│
├── landing/                      # Landing page (Cloudflare Pages)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro       # Home (hero + features)
│   │   │   ├── register.astro    # Email/password register → cookie → /dashboard
│   │   │   ├── login.astro       # Email/password login → cookie → /dashboard
│   │   │   ├── dashboard.astro   # Sites listesi + provision form
│   │   │   └── logout.astro      # Cookie sil → redirect /
│   │   └── layouts/
│   │       └── Base.astro        # Nav (login/signup veya dashboard)
│   ├── wrangler.toml
│   ├── package.json
│   └── typings/minimatch/        # tsserver: vendored @types/minimatch (tsconfig typeRoots)
│
├── templates/                    # Kaynak Astro projeleri (Phase 1'den)
│   ├── shell/                    # Blog frontend (Astro + Tailwind + D1)
│   │   ├── README.md             # Yerel test + dashboard ile aynı D1
│   │   ├── src/pages/            # index, blog/[slug], rss.xml
│   │   ├── schema.sql            # Blog DB schema (posts + config)
│   │   ├── typings/minimatch/    # tsserver shim (typeRoots)
│   │   └── dist/                 # Build output → api/src/templates/shell/
│   └── dashboard/                # Admin panel (Astro + Tailwind + D1 + Editor.js)
│       ├── README.md             # Yerel V2 testi (D1 şema + dev:local)
│       ├── src/pages/            # index, login, logout, new, edit/[id]
│       ├── src/middleware.ts     # Auth middleware (password + access_token)
│       ├── typings/minimatch/    # tsserver shim (typeRoots)
│       └── dist/                 # Build output → api/src/templates/dashboard/
│
├── docs/                         # Arşiv / referans dokümanlar
│   ├── archive-editorjs-v2-plan.md   # Tamamlanan Editor.js V2 planı (arşiv)
│   └── cursor-opus-prompt-v1.md      # İlk Editor.js taslağı (arşiv)
├── PROJECT-STATUS.md             # ← Bu dosya
└── .gitignore
```

---

## 4. API Endpoints

### Auth
| Method | Path | Açıklama |
|--------|------|----------|
| POST | `/api/auth/register` | Email + password → bcrypt hash → JWT token |
| POST | `/api/auth/login` | Email + password verify → JWT token |
| GET | `/api/auth/me` | Bearer token → user info; `ALLOWED_EMAILS` doluysa whitelist kontrolü |

### Provisioning
| Method | Path | Açıklama |
|--------|------|----------|
| POST | `/api/provision` | Auth + whitelist (varsa). `{ site_name }` → D1 + Shell + Dashboard deploy |
| GET | `/api/sites` | Auth + whitelist (varsa). Kullanıcının tüm siteleri (`shell_project_name`, `custom_domain` dahil) |
| GET | `/api/sites/:id` | Auth + whitelist (varsa). Tek site detay |
| POST | `/api/sites/:id/domain` | Auth + whitelist. Body `{ domain }` → shell Pages’e CF custom domain; DB `custom_domain` |
| DELETE | `/api/sites/:id/domain` | Auth + whitelist. CF’den domain kaldırır; DB `custom_domain` null |
| DELETE | `/api/sites/:id` | Auth + whitelist. Önce custom domain (varsa), sonra dashboard/shell Pages + kiracı D1 **best-effort** silinir; provisioning `sites` satırı silinir |

### Utility
| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/` | Health check |
| GET | `/test/*` | Test endpoint'leri (5 adet); yalnız `ALLOW_TEST_ROUTES=true` iken, aksi halde **404** |

---

## 5. Database Schema'lar

### Provisioning DB (api/src/db/schema.sql) — Merkezi

```sql
users (id, email, password_hash, created_at)
sites (id, user_id, site_name, d1_database_id, shell_project_name,
       shell_url, dashboard_project_name, dashboard_url,
       access_token, status, error_message, custom_domain, created_at)
```

### Blog DB (templates/shell/schema.sql) — Her user için ayrı D1

```sql
posts (id, slug, title, description, content, content_html,
       published, created_at, updated_at)
config (key, value)
  -- Defaults: site_title, site_description, author_name, author_bio, theme_color
```

---

## 6. Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| API | Hono, Cloudflare Workers, D1 |
| Auth | bcryptjs (hash), hono/jwt (HS256) |
| Landing | Astro 4 SSR, Tailwind, @astrojs/cloudflare |
| Templates (dashboard) | Astro 4 SSR, Tailwind, D1, **Editor.js** (CDN), DaisyUI (sadece new/edit sayfaları); sunucuda JSON→HTML |
| Templates (shell) | Astro 4 SSR, Tailwind, D1; `marked` bağımlılığı şemada/kodda legacy için kalabilir |
| Deploy mekanizması | CF Pages Direct Upload API (upload-token → bucket upload → upsert-hashes → FormData deployment with _worker.js bundle) |
| Template embedding | Build time esbuild bundle → base64 encoded TS modules |
| Session | httpOnly cookie (`auth_token`), JWT Bearer token |

---

## 7. Production Deploy

> **Not:** Cloudflare’deki projeler hesaptan kaldırılmış veya yeniden oluşturulmuş olabilir. Aşağıdaki URL’ler **son bilinen** örneklerdir; canlı ortamı Cloudflare Dashboard ve `wrangler` ile doğrula.

### URL'ler
- **API:** `https://snappost-api.snappost-dev.workers.dev`
- **Landing:** `https://snappost-landing.pages.dev` (Astro `site` / canonical tabanı: `landing/astro.config.mjs`; özel alan bağlanınca orayı güncelleyin)
- **Custom domain:** `snappost.dev` (opsiyonel; bağlıysa Dashboard’dan doğrulanmalı)

### Deploy modeli — sabit projeler (Git / CLI) vs kiracı (provision)

| Tür | Ne | Nasıl güncellenir |
|-----|-----|-------------------|
| **Sabit** | `api` (Worker), `landing` (Pages) | Repoyu **Git ile Cloudflare’e bağlayıp** otomatik build veya **`wrangler deploy`** / **`wrangler pages deploy`**. |
| **Kiracı başına** | Shell + Dashboard (Pages) + blog D1 | **Git push ile değil**; yalnızca **`POST /api/provision`** tetiklenince Worker **CF REST API** ile proje oluşturur ve gömülü şablonu **Direct Upload** eder (bkz. §2 provision adımları). Şablon kaynağı: `templates/*` → build → `api/src/templates/*` → **`npm run embed`** → API deploy. |

**Git kullanıyorsanız:** `wrangler.toml` içindeki `[vars]` (ör. landing `API_URL`) her build’de otomatik okunmayabilir. **Cloudflare Dashboard → Workers/Pages projesi → Settings → Variables** içinde `API_URL`, secret’lar ve production değerlerinin tanımlı olduğunu doğrulayın.

**İş listesi:** Üretimde hangi değişkenin nerede olması gerektiği için [`docs/ENV-VARIABLES-CHECKLIST.md`](docs/ENV-VARIABLES-CHECKLIST.md) dosyasındaki kutuları işaretleyerek ilerleyin.

### CF Resources
- **D1:** `snappost-provisioning` (`d8c8583f-e604-44f0-8ead-7b0d53b4f151`)
- **Account ID:** `1094e722fe9d2b939e94a8ceb124d21b`

### Secrets (wrangler secret put ile eklendi)
- `CF_API_TOKEN` — Cloudflare API token (D1 + Pages permissions)
- `JWT_SECRET` — JWT imzalama anahtarı

### Deploy Komutları
```bash
# API
cd api && wrangler deploy

# Landing
cd landing && npm run build && wrangler pages deploy dist --project-name=snappost-landing

# Template değişikliği sonrası
cd api && npm run embed && wrangler deploy

# Provisioning D1 — custom_domain sütunu (mevcut DB bir kez)
cd api && wrangler d1 execute snappost-provisioning --remote --file=./src/db/migrations/001_add_custom_domain.sql
```

### Env Variables
```bash
# api/.dev.vars (local dev)
CF_API_TOKEN=...
CF_ACCOUNT_ID=...
JWT_SECRET=...
# Opsiyonel; SEO/trafik testi için [vars] veya dashboard’da düz metin verilebilir (gizli değil)
ALLOWED_EMAILS=...
# Opsiyonel; kullanıcı başına en fazla blog sayısı (pozitif tam sayı). Boş = sınırsız
# MAX_SITES_PER_USER=3
# Yerelde /test/* kullanacaksanız:
ALLOW_TEST_ROUTES=true

# landing/.dev.vars (local dev)
API_URL=http://localhost:8787
```

Landing'de runtime env: `Astro.locals.runtime.env.API_URL` (CF Pages SSR'da `import.meta.env` çalışmaz). Whitelist yalnızca API tarafında (`ALLOWED_EMAILS`); ayrıntı: `api/README.md`, `landing/README.md`.

---

## 8. Bilinen Limitasyonlar / Teknik Borç

| # | Konu | Detay |
|---|------|-------|
| 1 | Test endpoint'leri | `/test/*` yalnız `ALLOW_TEST_ROUTES=true` (ör. yerel `.dev.vars`); production’da tanımlanmaz → **404** |
| 2 | Rate limiting yok | Register, login, provision endpoint'lerine sınırsız istek atılabilir |
| 3 | ~~Site silme yok~~ | **Kaldırıldı:** `DELETE /api/sites/:id` + landing **Delete blog** (§4). |
| 4 | Blog custom domain | Shell Pages için API + landing kartı (CNAME tablosu); dashboard yalnız `*.pages.dev`. |
| 5 | Dashboard default password | Her dashboard `changeme` password ile oluşturuluyor, değiştirme UI'ı yok |
| 6 | ~~Provision UI feedback yok~~ | **İyileştirildi:** Landing’de **Create Blog** sonrası buton devre dışı + “Creating…”; tam progress bar yok. |
| 7 | Error handling MVP seviyesinde | Genel try-catch, spesifik hata mesajları kısmen (whitelist, domain, site limiti). |
| 8 | Site limiti | **Opsiyonel:** `MAX_SITES_PER_USER` (pozitif tam sayı) ile kullanıcı başına üst sınır; tanımsız/boş = sınırsız. |
| 9 | Email verification yok | Doğrulama e-postası yok; kayıtta **basit e-posta formatı** kontrolü var. |
| 10 | Password reset yok | Unutulan password kurtarılamaz |
| 11 | CORS config hardcoded | Origin listesi kod içinde, config'den okunmuyor |
| 12 | Template güncelleme mekanizması yok | Template değişince mevcut siteler eski versiyonda kalıyor |
| 13 | Site başına 2× Pages + 1× D1 ölçeklenmesi | CF Pages proje limitleri; tek hesapta çok müşteri sürdürülebilir değil — multi-tenant veya az yüzey mimarisi gerekir |
| 14 | E-posta whitelist | **Uygulandı:** `ALLOWED_EMAILS` (opsiyonel); boş/tanımsız = kısıt yok. Uçlar: register, login, me, sites, site detay, provision, domain, site silme — **§9.5 (kapatıldı)**. |

---

## 9. Yol haritası

### 9.1 Tamamlanan — Dashboard V2 (içerik editörü)

- Editor.js tabanlı yazı editörü (`new` / `edit`), JSON + `content_html` akışı, arşiv plan: [`docs/archive-editorjs-v2-plan.md`](docs/archive-editorjs-v2-plan.md).
- **Site silme:** `DELETE /api/sites/:id` (CF cleanup + provisioning satırı); landing **Delete blog** ile aynı API.

### 9.2 Sıradaki — Stabilizasyon ve güvenlik (önceden “V2 backlog”)

- `/test/*`: `ALLOW_TEST_ROUTES=true` ile açılır (varsayılan kapalı — yapıldı)
- Rate limiting (CF Workers built-in veya custom)
- Dashboard password'ü provision sırasında set etme
- ~~Provision sırasında loading/progress UI~~ → **Kısmen yapıldı** (landing buton durumu + metin); gerçek ilerleme çubuğu yok
- ~~Email validation (format)~~ → **Basit format** register/login’de; doğrulama e-postası / uniqueness DB’de zaten
- ~~Site sayısı limiti~~ → **Opsiyonel env** `MAX_SITES_PER_USER` (free tier’da örn. `3` verilebilir)
- Abuse azaltma (kayıt doğrulama, CAPTCHA vb.)

### 9.3 Mimari pivot — ölçekleme (V2.5 / platform)

- **Hedef:** Tek CF hesabında **daha az Pages projesi**, çok kiracı routing; isteğe bağlı kiracı başına D1 veya paylaşımlı D1 + `tenant_id` (bkz. [D1 limits](https://developers.cloudflare.com/d1/platform/limits/) — örn. ~5k D1 binding / Worker, 50k DB / Workers Paid hesabı).
- Mevcut **per-site shell + dashboard deploy** modeli korunacaksa: CF limit artırımı + maliyet modeli ayrı planlanmalı.

### 9.4 V3 — Büyüme (ürün)

- Shell blog custom domain — tamam (API + landing). İleride: apex/`www` otomasyonu, landing kendi alanı vb.
- Template theme seçimi (birden fazla blog tasarımı)
- Template hot-update (mevcut siteleri yeni template'e upgrade)
- Analytics dashboard (sayfa görüntüleme, post istatistikleri)
- Stripe entegrasyonu (paid tier)
- Password reset flow (email gönderimi)
- Admin panel (tüm kullanıcılar / siteler yönetimi)

### 9.5 Whitelist + kapalı test — **MVP kapsamında kapatıldı (2026-04-06)**

**Karar:** Mimari pivot (§9.3) sonraya; **site başına Shell + Dashboard + ayrı D1** modeli korunuyor.

**Kod + dokümantasyon:** `ALLOWED_EMAILS` (opsiyonel, virgülle ayrılmış). **Semantik:** tanımsız veya boş string = kısıt yok; en az bir adres varsa yalnızca listedekiler register/login ve tüm korumalı API uçları. **Normalize:** trim + lowercase. **Sonraki sprint (isteğe bağlı):** A1 **aşama 2** — whitelist’i provisioning D1’de tablo olarak tutup deploy etmeden güncelleme; rate limiting (§9.2) ile birlikte ele alınmalı.

#### Faz A — Whitelist (API) — durum

| Adım | Durum |
|------|--------|
| A1 aşama 1 — env listesi | Tamam (`ALLOWED_EMAILS`, `api/README.md`, `wrangler.toml` yorumu) |
| A1 aşama 2 — D1 tablosu | Yapılmadı; sonraki plan |
| A2 — Normalize | Tamam |
| A3 — `POST /api/auth/register` | Tamam (403 + Türkçe mesaj) |
| A4 — `POST /api/auth/login` | Tamam |
| A5 — `POST /api/provision` + diğer korumalı uçlar | Tamam (`me`, `sites`, `sites/:id`, domain, site silme) |
| A6 — Boş liste = kısıt yok | Dokümante (`api/README.md`) |

#### Faz B — Landing UX — durum

- Register/login: API `error` (ve provision’da `detail`) gösteriliyor.
- Register + login: davetli erişim kısa notu eklendi.

#### Faz C — Test checklist (operatör)

| Ortam | Ne test edilir |
|--------|----------------|
| Yerel | `api` + `landing`; `.dev.vars` içinde `ALLOWED_EMAILS` / `JWT_SECRET` / `CF_*` |
| Şablon | `templates/*` `dev:local` + ortak D1 persist (README’ler) |
| CF | API + landing deploy; whitelist ve `MAX_SITES_PER_USER` env doğrulama |

#### Faz D — kalan borç (sonraki plan)

- Rate limiting + enumeration riski
- D1 tabanlı whitelist (A1 aşama 2) ihtiyaç halinde

#### Tanım (MVP) tamamlandı

- Whitelist açıkken listede olmayan e-posta register/login reddedilir; JWT ile gelen isteklerde de e-posta whitelist’ten düşürülürse API 403 döner.
- Dokümantasyon: `api/README.md`, bu dosya §8/§9, `landing/README.md`.
