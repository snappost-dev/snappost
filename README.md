# Snappost

Launch your blog in 15 seconds. Email/password ile kayıt ol, blog adını seç, hazır.

**Stack:** Astro SSR + Hono + Cloudflare Workers/Pages/D1

**Canlı:** [snappost-landing.pages.dev](https://snappost-landing.pages.dev)

## Yapı

```
api/        → Provisioning API (Hono / CF Workers)
landing/    → Landing page (Astro SSR / CF Pages)
templates/  → Blog + Dashboard Astro projeleri
docs/       → Eski dokümanlar (arşiv)
```

## Detaylı Bilgi

Tüm mimari, endpoint'ler, schema'lar, deploy bilgisi ve yol haritası için:

**[PROJECT-STATUS.md](./PROJECT-STATUS.md)**

## Local Geliştirme

```bash
# API (port 8787)
cd api && npm install && npm run dev

# Landing (port 4321)
cd landing && npm install && npm run dev
```

`.dev.vars` dosyalarını oluşturmayı unutma (bakınız PROJECT-STATUS.md §7).
