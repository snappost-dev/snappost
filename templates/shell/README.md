# Snappost Shell (blog şablonu)

Ziyaretçi blogu: anasayfa, yazı listesi, `/blog/[slug]`, RSS. `content_html` (dashboard + Editor.js çıktısı) doğrudan render edilir.

Nav branding, `config` tablosundaki ayarlara göre koşullu render edilir:
- `logo_display`: `text` / `logo` / `logo_text`
- `site_logo`: açık tema logo URL
- `site_logo_dark`: koyu tema logo URL (boşsa `site_logo` fallback)
- `site_favicon`: varsa `<head>` favicon olarak kullanılır, yoksa `/favicon.svg`

Genel mimari: [`PROJECT-STATUS.md`](../../PROJECT-STATUS.md).

## Yerel test (dashboard ile aynı D1)

`wrangler.toml` içindeki **`snappost-shell-dev`** binding’i, `templates/dashboard` ile **aynı yerel D1** dosyasını kullanır (aynı `database_id`). Önce şema:

```bash
cd templates/shell
npx wrangler d1 execute snappost-shell-dev --local --persist-to ../../.snappost-d1-local --file=./schema.sql
```

### Üretime yakın (önerilen)

Dashboard **8788** kullanıyorsa shell **8791**’de açılır (çakışma yok):

```bash
npm install
npm run dev:local
```

Tarayıcı: **http://localhost:8791** — yayınlı (`published = 1`) yazılar `/blog` ve slug sayfasında görünür.

### Hızlı HMR

```bash
npm run dev
```

(Astro portu wrangler çıktısına bak; D1 tam test için `dev:local` tercih et.)

## Dashboard ile birlikte

1. Terminal A: `cd templates/dashboard && npm run dev:local` → **http://localhost:8788**
2. Terminal B: `cd templates/shell && npm run dev:local` → **http://localhost:8791**
3. Dashboard’da yazı kaydet, **Published** işaretle → shell’de `/blog/<slug>` aç.
