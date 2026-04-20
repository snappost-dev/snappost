# Snappost

Launch your blog in 15 seconds. Email/password ile kayıt ol, blog adını seç, hazır.

**Stack:** Astro SSR + Hono + Cloudflare Workers/Pages/D1

**Canlı:** [snappost-landing.pages.dev](https://snappost-landing.pages.dev)

## Son Güncellemeler (Özet)

- Dashboard branding ayarları: `site_logo`, `site_logo_dark` (opsiyonel), `site_favicon`, `logo_display` (`text` / `logo` / `logo_text`)
- Shell nav branding: aktif tema tercihine göre light/dark logo swap (dark logo boşsa light logo fallback)
- Medya upload API: `POST /api/sites/:id/media` artık SVG (`image/svg+xml`) kabul eder

## Yapı

```
api/        → Provisioning API (Hono / CF Workers)
landing/    → Landing page (Astro SSR / CF Pages)
templates/  → Blog + Dashboard Astro projeleri
docs/       → Operasyon + sprint + env checklist + arşiv
```

## Detaylı Bilgi

Tüm mimari, endpoint'ler, schema'lar, deploy bilgisi ve yol haritası için:

**[PROJECT-STATUS.md](./PROJECT-STATUS.md)**

## Dokumantasyon Hiyerarsisi

- Aktif kaynaklar: `PROJECT-STATUS.md`, `README.md`, `api/README.md`, `landing/README.md`
- Operasyonel rehberler: `docs/SPRINT-PLAN.md`, `docs/ENV-VARIABLES-CHECKLIST.md`
- Template calisma rehberleri: `templates/shell/README.md`, `templates/dashboard/README.md`
- Legacy/arsiv belgeleri yalnizca tarihsel baglam icindir; karar verirken aktif kaynaklar esas alinmalidir.

## Local Geliştirme

```bash
# API (port 8787)
cd api && npm install && npm run dev

# Landing (port 4321)
cd landing && npm install && npm run dev
```

`.dev.vars` dosyalarını oluşturmayı unutma (bakınız PROJECT-STATUS.md §7).
