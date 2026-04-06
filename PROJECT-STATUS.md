# SNAPPOST — Project Status (V1 MVP + dashboard editörü)

**Son güncelleme:** 2026-04-06  
**Repo:** https://github.com/snappost-dev/snappost  
**Branch:** main

---

## 1. Ne Bu Proje?

Snappost, kullanıcıların email/password ile kayıt olup **~15 saniyede** tam bir Astro blog + admin dashboard altyapısını Cloudflare üzerine deploy edebildiği bir SaaS. Merkezi hosting modeli — tüm siteler bizim CF hesabında çalışıyor. Her kullanıcı kendi izole D1 database'ine, blog frontend'ine ve dashboard'a sahip oluyor.

### Dashboard içerik editörü (V2 — tamamlandı)

- **`templates/dashboard`:** Yazı oluşturma/düzenleme sayfaları **Editor.js** blok editörüne geçirildi (`/new`, `/edit/[id]`): yan menü navigasyonu, özellikler paneli, **Alert** özel bloğu; CDN üzerinden Editor.js + (sadece bu sayfalarda) DaisyUI/Tailwind.
- **Veri modeli:** `posts.content` alanında **Editor.js JSON** string; `content_html` sunucuda `renderEditorJSToHTML()` ile üretilir. **Eski markdown** içerikli kayıtlar için edit tarafında uyumluluk/uyarı vardır; shell blog yine `content_html` render eder.
- **Kaynak dosyalar:** `templates/dashboard/src/pages/new.astro`, `edit/[id].astro`.
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
| GET | `/api/auth/me` | Bearer token → user info |

### Provisioning
| Method | Path | Açıklama |
|--------|------|----------|
| POST | `/api/provision` | Auth required. `{ site_name }` → D1 + Shell + Dashboard deploy |
| GET | `/api/sites` | Auth required. Kullanıcının tüm siteleri |
| GET | `/api/sites/:id` | Auth required. Tek site detay |

### Utility
| Method | Path | Açıklama |
|--------|------|----------|
| GET | `/` | Health check |
| GET | `/test/*` | Development test endpoint'leri (5 adet) |

---

## 5. Database Schema'lar

### Provisioning DB (api/src/db/schema.sql) — Merkezi

```sql
users (id, email, password_hash, created_at)
sites (id, user_id, site_name, d1_database_id, shell_project_name,
       shell_url, dashboard_project_name, dashboard_url,
       access_token, status, error_message, created_at)
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
- **Landing:** `https://snappost-landing.pages.dev`
- **Custom domain:** `snappost.dev` (opsiyonel; bağlıysa Dashboard’dan doğrulanmalı)

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
```

### Env Variables
```bash
# api/.dev.vars (local dev)
CF_API_TOKEN=...
CF_ACCOUNT_ID=...
JWT_SECRET=...

# landing/.dev.vars (local dev)
API_URL=http://localhost:8787
```

Landing'de runtime env: `Astro.locals.runtime.env.API_URL` (CF Pages SSR'da `import.meta.env` çalışmaz).

---

## 8. Bilinen Limitasyonlar / Teknik Borç

| # | Konu | Detay |
|---|------|-------|
| 1 | Test endpoint'leri açık | `/test/*` endpoint'leri production'da da erişilebilir, gerçek CF kaynakları oluşturabilir |
| 2 | Rate limiting yok | Register, login, provision endpoint'lerine sınırsız istek atılabilir |
| 3 | Site silme yok | Oluşturulan blog silinemez (ne API'de ne UI'da) |
| 4 | Custom domain yok | Siteler sadece `*.pages.dev` subdomain'inde çalışıyor |
| 5 | Dashboard default password | Her dashboard `changeme` password ile oluşturuluyor, değiştirme UI'ı yok |
| 6 | Provision sırasında UI feedback yok | 15 saniye boyunca kullanıcı blank page görüyor |
| 7 | Error handling MVP seviyesinde | Genel try-catch, spesifik hata mesajları yok |
| 8 | Site limiti yok | Kullanıcı sınırsız site oluşturabilir |
| 9 | Email verification yok | Herhangi bir email ile kayıt olunabilir |
| 10 | Password reset yok | Unutulan password kurtarılamaz |
| 11 | CORS config hardcoded | Origin listesi kod içinde, config'den okunmuyor |
| 12 | Template güncelleme mekanizması yok | Template değişince mevcut siteler eski versiyonda kalıyor |
| 13 | Site başına 2× Pages + 1× D1 ölçeklenmesi | CF Pages proje limitleri; tek hesapta çok müşteri sürdürülebilir değil — multi-tenant veya az yüzey mimarisi gerekir |

---

## 9. Yol haritası

### 9.1 Tamamlanan — Dashboard V2 (içerik editörü)

- Editor.js tabanlı yazı editörü (`new` / `edit`), JSON + `content_html` akışı, arşiv plan: [`docs/archive-editorjs-v2-plan.md`](docs/archive-editorjs-v2-plan.md).

### 9.2 Sıradaki — Stabilizasyon ve güvenlik (önceden “V2 backlog”)

- `/test/*` endpoint'lerini kaldır veya auth arkasına al
- Rate limiting (CF Workers built-in veya custom)
- Site silme / durdurma (DELETE /api/sites/:id)
- Dashboard password'ü provision sırasında set etme
- Provision sırasında loading/progress UI
- Email validation (format + uniqueness)
- Site sayısı limiti (free tier: 1-3 site)
- Abuse azaltma (kayıt doğrulama, CAPTCHA vb.)

### 9.3 Mimari pivot — ölçekleme (V2.5 / platform)

- **Hedef:** Tek CF hesabında **daha az Pages projesi**, çok kiracı routing; isteğe bağlı kiracı başına D1 veya paylaşımlı D1 + `tenant_id` (bkz. [D1 limits](https://developers.cloudflare.com/d1/platform/limits/) — örn. ~5k D1 binding / Worker, 50k DB / Workers Paid hesabı).
- Mevcut **per-site shell + dashboard deploy** modeli korunacaksa: CF limit artırımı + maliyet modeli ayrı planlanmalı.

### 9.4 V3 — Büyüme (ürün)

- Custom domain bağlama (CF API + DNS)
- Template theme seçimi (birden fazla blog tasarımı)
- Template hot-update (mevcut siteleri yeni template'e upgrade)
- Analytics dashboard (sayfa görüntüleme, post istatistikleri)
- Stripe entegrasyonu (paid tier)
- Password reset flow (email gönderimi)
- Admin panel (tüm kullanıcılar / siteler yönetimi)
