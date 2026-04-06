# Snappost Landing

Astro 4 SSR + Tailwind + `@astrojs/cloudflare`. Email/şifre ile kayıt/giriş, kullanıcı panelinde site listesi ve yeni blog provision formu.

Ayrıntılı mimari ve deploy için repo kökünde **[PROJECT-STATUS.md](../PROJECT-STATUS.md)**.

## Kurulum

```bash
cd landing
npm install
```

## Geliştirme

```bash
npm run dev
# http://localhost:4321
```

## Sayfalar

| Rota | Açıklama |
|------|----------|
| `/` | Ana sayfa |
| `/register` | Kayıt → JWT cookie |
| `/login` | Giriş → JWT cookie |
| `/dashboard` | Oturum: siteler + provision (API’ye Bearer/cookie ile istek) |
| `/logout` | Cookie temizleme |

## Ortam değişkenleri

**Production:** `wrangler.toml` içinde `[vars]` — örnek:

```toml
[vars]
API_URL = "https://snappost-api.<subdomain>.workers.dev"
```

**Local:** `landing/.dev.vars` (Wrangler / Astro):

```bash
API_URL=http://localhost:8787
```

SSR’da API adresi: `Astro.locals.runtime.env.API_URL` (bkz. `src/env.d.ts`).

## Deploy

```bash
npm run deploy
```

Bu komut `npm run build` sonrası `wrangler pages deploy dist` çalıştırır. Proje adı komutta veya `wrangler.toml` `name` ile uyumlu olmalı (ör. `snappost-landing`).

Cloudflare Dashboard üzerinden Git bağlantısı kullanıyorsan build komutunu ve `API_URL` env’ini orada da tanımla.
