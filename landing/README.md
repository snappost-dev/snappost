# Snappost Landing

Astro 4 SSR + Tailwind + `@astrojs/cloudflare`. Email/şifre ile kayıt/giriş, kullanıcı panelinde site listesi ve yeni blog provision formu.

Ayrıntılı mimari ve deploy için repo kökünde **[PROJECT-STATUS.md](../PROJECT-STATUS.md)**.

**Deploy modeli:** Landing **sabit** bir Pages projesidir (Git ile CF veya `npm run deploy` / `wrangler pages deploy`). Kullanıcı blogları (**shell** + **dashboard**) landing gibi bu repodan ayrı build almaz; API **provision** ile oluşturur. **Git-connected build** kullanıyorsanız `API_URL` ve diğer env değerlerinin **Cloudflare Dashboard → Pages → Settings → Environment variables** içinde tanımlı olduğundan emin olun (`wrangler.toml` `[vars]` her pipeline’da otomatik kullanılmayabilir). Detay: PROJECT-STATUS.md **§7**.

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
| `/register` | Kayıt → JWT cookie; API’de `ALLOWED_EMAILS` doluysa yalnızca listedeki adresler |
| `/login` | Giriş → JWT cookie; aynı whitelist kuralı API tarafında |
| `/dashboard` | Oturum: siteler + provision + **blog custom domain** (shell Pages; CNAME talimatı kartta) |
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

**Whitelist:** Kayıt/giriş kısıtı **landing’de değil**, **API**’de `ALLOWED_EMAILS` ile uygulanır. Oturum açıkken liste değişirse `/dashboard` içindeki API çağrıları **403** dönebilir; bu liste gizli tutulmak zorunda değildir (bkz. `api/README.md`).

## Deploy

```bash
npm run deploy
```

Bu komut `npm run build` sonrası `wrangler pages deploy dist --commit-dirty=true` çalıştırır (commit edilmemiş değişiklik uyarısını susturur). Proje adı `wrangler.toml` `name` ile uyumlu olmalı (`snappost-landing`).

Git bağlantısı kullanıyorsan build komutunu ve özellikle **`API_URL`** (production Worker URL’si) değişkenini Dashboard’da tanımla; yalnızca repodaki `wrangler.toml` yetmeyebilir (bkz. üstteki deploy modeli notu).
