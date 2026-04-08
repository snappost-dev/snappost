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
| [ ] | `ALLOWED_EMAILS` | Plain | Hayır | Virgülle e-postalar; boş/tanımsız = herkese açık kayıt/giriş |
| [ ] | `MAX_SITES_PER_USER` | Plain | Hayır | Örn. `3`; kullanıcı başına blog üst sınırı; boş = sınırsız |
| [ ] | `ALLOW_TEST_ROUTES` | Plain | Hayır | Yalnız `true` iken `/test/*`; **production’da tanımlama** |

\* Worker’da binding olarak da kullanılıyorsa Dashboard’da plain var olarak görünmeli.

**Komut (secret):** `cd api && wrangler secret put CF_API_TOKEN` ve `wrangler secret put JWT_SECRET`

---

## Landing (Cloudflare Pages — `snappost-landing` veya sizin proje)

SSR’da `Astro.locals.runtime.env.API_URL` okunur; **Production** (ve gerekirse **Preview**) için:

| Eklendi | Değişken | Tür | Zorunlu | Açıklama |
|--------|----------|-----|---------|----------|
| [ ] | `API_URL` | Plain | Evet | Örn. `https://snappost-api.<subdomain>.workers.dev` (sonunda `/` yok) |

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
