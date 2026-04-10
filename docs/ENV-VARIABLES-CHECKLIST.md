# Cloudflare / ortam değişkenleri — kontrol listesi

Üretim ve staging’de **Workers Dashboard** ve **Pages Dashboard** içinde tanımlı mı diye buradan işaretleyin. Kaynak ayrıntı: repo kökü **[PROJECT-STATUS.md](../PROJECT-STATUS.md)** §7, **[api/README.md](../api/README.md)**, **[landing/README.md](../landing/README.md)**.

**Not:** Git’e bağlı Pages/Workers build kullanıyorsanız `wrangler.toml` `[vars]` her deploy’da otomatik gitmeyebilir; **Dashboard → Settings → Variables** ile doğrulayın.

---

## API Worker (`snappost-api` veya sizin proje adı)

| Eklendi | Değişken | Tür | Zorunlu | Açıklama |
|--------|----------|-----|---------|----------|
| [ ] | `CF_ACCOUNT_ID` | Plain | Evet* | CF hesap ID; genelde `wrangler.toml` ile aynı |
| [ ] | `CF_API_TOKEN` | **Secret** | Evet | D1 + Pages API; repoya koyma |
| [ ] | `JWT_SECRET` | **Secret** | Evet | JWT imza; repoya koyma |
| [ ] | `ALLOWED_EMAILS` | Plain | Hayır | Virgülle e-postalar; boş/tanımsız = env tarafı açık. D1 `allowed_emails` ile **birleşim** — ikisi de boş = kısıt yok (`api/README.md`) |
| [ ] | `MAX_SITES_PER_USER` | Plain | Hayır | Örn. `3`; kullanıcı başına blog üst sınırı; boş = sınırsız |
| [ ] | `ALLOW_TEST_ROUTES` | Plain | Hayır | Yalnız `true` iken `/test/*`; **production’da tanımlama** |
| [ ] | `CORS_ORIGINS` | Plain | Hayır | Virgülle tam Origin URL’leri (`https://…`); özel landing alanı eklerken **mutlaka** buraya + varsayılanları birlikte yazın. Boş = kod içi varsayılan liste. Kiracı `sp-*-dash.pages.dev` upload için kodda ayrıca izinli |
| [ ] | `MAX_MEDIA_UPLOAD_MB` | Plain | Hayır | Görsel yükleme üst sınırı (0.5–20), varsayılan 5 |
| [ ] | `SNAPPOST_API_PUBLIC_URL` | Plain | Hayır | Kamuya açık API kökü (`https://…`, sondaki `/` olmadan). **Önerilir:** production’da tanımlayın; medya `url` yanıtı ve provision’da dashboard’a yazılan `SNAPPOST_API_URL` bununla hizalanır. Boş bırakılırsa isteğin `Origin`’i kullanılır (yerel `wrangler dev` ile oluşan dashboard’da upload URL’leri yanlış olabilir) |

\* Worker’da binding olarak da kullanılıyorsa Dashboard’da plain var olarak görünmeli.

**Komut (secret):** `cd api && wrangler secret put CF_API_TOKEN` ve `wrangler secret put JWT_SECRET`

### Operasyonel (Cloudflare Dashboard — Worker env değil)

| Yapıldı | Ne | Açıklama |
|--------|-----|----------|
| [ ] | Rate limiting / WAF | API Worker hostname’inde `POST /api/auth/register`, `/api/auth/login`, `/api/provision` için IP başına eşik — [docs/SPRINT-PLAN.md](./SPRINT-PLAN.md) §A2 |
| [ ] | R2 bucket `snappost-media` | [`api/wrangler.toml`](../api/wrangler.toml) `MEDIA_BUCKET` binding; yoksa `wrangler r2 bucket create snappost-media` — [api/README.md](../api/README.md) § R2 medya |

---

## Landing (Cloudflare Pages — `snappost-landing` veya sizin proje)

SSR’da `Astro.locals.runtime.env.API_URL` okunur; **Production** (ve gerekirse **Preview**) için:

| Eklendi | Değişken | Tür | Zorunlu | Açıklama |
|--------|----------|-----|---------|----------|
| [ ] | `API_URL` | Plain | Evet | Örn. `https://snappost-api.<subdomain>.workers.dev` (sonunda `/` yok) |

---

## Kiracı blog dashboard (Cloudflare Pages — `sp-*-dash`; provision otomatik yazar)

| Eklendi | Değişken | Tür | Açıklama |
|--------|----------|-----|----------|
| [ ] | `ACCESS_TOKEN` | Plain | `sites.access_token` — `/api/upload-media` sunucu proxy’si ile API medya yüklemesi |
| [ ] | `SNAPPOST_API_URL` | Plain | API kamu kökü, sondaki `/` yok (Worker’da `SNAPPOST_API_PUBLIC_URL` veya provision isteğinin origin’i) |
| [ ] | `SNAPPOST_SITE_ID` | Plain | Merkezi `sites.id` (string) |
| [ ] | `ADMIN_PASSWORD` | Plain | Dashboard cookie girişi — **yeni provision** ile rastgele üretilir ve API yanıtında bir kez döner; Pages env’e yazılır. Eski `changeme` projeler: CF’de elle güncelleyin |

**Mevcut kiracılar:** `SNAPPOST_*` / `ACCESS_TOKEN` yoksa görsel yükleme **503**. `ADMIN_PASSWORD` yoksa veya `changeme` ise güvenlik için CF’de güçlü değer tanımlayın.

---

## Kiracı shell — blog (Cloudflare Pages — `sp-*-shell`; provision otomatik yazar)

| Eklendi | Değişken | Tür | Açıklama |
|--------|----------|-----|----------|
| [ ] | `SITE_URL` | Plain | Kanonik blog kökü, sondaki `/` yok (örn. `https://sp-…-shell.pages.dev`). SEO canonical, `og:url`, RSS `<link>` için. **Özel blog domain** bağladıysanız değeri `https://blog.example.com` olacak şekilde Pages’de güncelleyin. Boşsa isteğin `Origin`’i kullanılır |

**Mevcut kiracılar:** Yeni provision öncesi oluşmuş shell’de `SITE_URL` yoksa canonical/RSS isteğin host’una göre üretilir; mümkünse env’i ekleyin.

---

## Yerel geliştirme (repoda commitlenmez)

| Dosya | İçerik özeti |
|--------|----------------|
| `api/.dev.vars` | `CF_API_TOKEN`, `CF_ACCOUNT_ID`, `JWT_SECRET`, isteğe bağlı `ALLOWED_EMAILS`, `MAX_SITES_PER_USER`, `ALLOW_TEST_ROUTES` |
| `landing/.dev.vars` | `API_URL=http://localhost:8787` (veya tünel URL’niz) |

---

## Son kontrol (kısa)

- [ ] API: `GET /` health dönüyor
- [ ] Landing: kayıt/giriş gerçek API’ye gidiyor (yanlış `API_URL` = sessiz hata veya boş dashboard)
- [ ] Whitelist kullanacaksanız: `ALLOWED_EMAILS` hem **doğru ortamda** hem liste güncel
- [ ] Blog limiti istiyorsanız: `MAX_SITES_PER_USER` sayı string (örn. `3`)
- [ ] Özel landing domain: tarayıcıdan API’ye istek atılıyorsa `CORS_ORIGINS` içinde o `https://…` origin’i de var (veya tam listeyi CF’de güncellediniz)
- [ ] Duman testleri: `SMOKE_API_URL=… cd api && npm run smoke` (isteğe bağlı `SMOKE_EMAIL` / `SMOKE_PASSWORD`) — [SPRINT-PLAN.md](./SPRINT-PLAN.md) §C
- [ ] Kiracı **shell/dashboard** şablonunu değiştirdiyseniz: `cd api && npm run templates:ship`, ardından **`wrangler deploy`** ve `api/src/templates/*` + `api/src/generated/*` commit — [SPRINT-PLAN.md](./SPRINT-PLAN.md) §B7, [PROJECT-STATUS.md](../PROJECT-STATUS.md) §7
