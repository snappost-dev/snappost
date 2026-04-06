# Snappost Dashboard (şablon)

Admin paneli: giriş, yazı listesi, **Editor.js** ile `/new` ve `/edit/[id]`. Bloklar: paragraph, header, list, quote, code, delimiter, alert (özel). Sunucu tarafı HTML üretimi: `src/lib/editor.ts` → `renderEditorJSToHTML`; istemci alert sınıfı: `public/dashboard/alert-block.js` → `/dashboard/alert-block.js`. Provision sırasında API bu projeyi build edip Cloudflare Pages’e yükler.

Genel mimari: repo kökünde [`PROJECT-STATUS.md`](../../PROJECT-STATUS.md).

## Yerelde V2 (Editor.js) testi

### 1) Yerel D1’de tablolar (bir kez veya şema değişince)

`wrangler.toml` içindeki `database_name` (`snappost-shell-dev`) ile:

```bash
cd templates/dashboard
npx wrangler d1 execute snappost-shell-dev --local --persist-to ../../.snappost-d1-local --file=../shell/schema.sql
```

(`--persist-to` dashboard + shell `dev:local` ile aynı yerel D1 dosyasını paylaşır.)

### 2A) Hızlı geliştirme (HMR)

```bash
npm install
npm run dev
```

Tarayıcı: **http://localhost:4322** — Astro doğrudan çalışır. **Not:** `wrangler pages dev -- astro dev` ile açılan **8788** proxy bazen 404 verebilir; günlük UI düzenlemesi için **4322** kullan. D1 ile kayıt bazen bu modda kısıtlı kalabilir.

### 2B) Üretime yakın (D1 binding + SSR — önerilen tam test)

```bash
npm run dev:local
```

Çıktıdaki URL’yi aç (genelde **http://localhost:8788**). Port meşgulse:

```bash
npx wrangler pages dev dist --local --port 8790
```

### Giriş ve editör

1. **http://localhost:&lt;port&gt;/login** — şifre: `changeme` (`wrangler.toml` `[vars]`).
2. **/new** — Editor.js blok editörü.
3. **/** — yazı listesi (kayıt sonrası).

## Shell blog ile birlikte test

Aynı yerel D1’i paylaşırlar (`snappost-shell-dev`). İkinci terminal:

```bash
cd ../shell
npm run dev:local
```

Shell genelde **http://localhost:8791** (dashboard **8788** ile port çakışmasın diye).

## Diğer

- `npm run preview` — build sonrası `wrangler pages dev dist` (script’e bakın).
- Embed / API: `PROJECT-STATUS.md` §7 ve kök `.cursor/rules/snappost.mdc`.
