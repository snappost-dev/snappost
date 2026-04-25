# Snappost SaaS Transition Notes

> **Durum:** Geçiş / yön belirleme notu  
> **Amaç:** Bu repo open source / V1 referans repo olarak kalırken, yeni `snappost-saas` repo ile hangi sınırların çizileceğini netleştirmek.

## 1. Kısa Karar

Bu repo artık **V1 legacy/provision/template referansı** olarak konumlanmalı.

Yeni SaaS runtime, mümkünse ayrı bir repo olarak geliştirilmeli:

```text
snappost/       -> V1 legacy: API + landing + shell/dashboard templates + per-tenant Pages provision
snappost-saas/  -> V2 SaaS runtime: tek runtime, tenant routing, shared data model
```

Bu kararın nedeni: mevcut repo çalışan template/provision davranışlarını koruyor. Yeni SaaS mimarisini bu repo içinde hızlı pivot olarak zorlamak, önceki `serve/` denemesinde olduğu gibi yarım kalan auth, routing ve deploy karmaşası yaratabiliyor.

## 2. Bu Repo Ne Olarak Kalacak?

Bu repo şunlar için kaynak kalır:

- **Template referansı:** `templates/shell` ve `templates/dashboard`
- **Davranış referansı:** blog render, Editor.js kayıt akışı, settings, media upload, custom domain, delete blog
- **Legacy provision referansı:** kullanıcı başına Shell Pages + Dashboard Pages + tenant D1 oluşturma akışı
- **Operasyon dokümantasyonu:** env checklist, template ship hattı, R2 medya, smoke testler

Bu repo şunların ana yeri olmamalı:

- Yeni tek runtime SaaS mimarisi
- Shared D1 + `tenant_id` veri modeli
- Hono-first request-time tenant routing
- Landing session ile dashboard session birleştirme

## 3. Dokümantasyon Durumu

### Uyumlu Görünenler

- `PROJECT-STATUS.md` hâlâ V1 sistemin ana doğruluk kaynağı olarak doğru yerde.
- `README.md`, `api/README.md`, `landing/README.md`, `templates/*/README.md` mevcut V1 modeli genel olarak doğru anlatıyor.
- `.cursor/rules/snappost.mdc` aktif dosya yolları ve kritik kısıtlar için doğru hızlı indeks görevi görüyor.
- Arşiv belgeleri çoğunlukla açıkça işaretlenmiş:
  - `docs/PHASE-2-HANDOFF.md`
  - `docs/PHASE-2-REVISED-ARCHITECTURE.md`
  - `docs/README-OLD-OAUTH.md`
  - `templates/*/CURSOR-*.md`
  - `docs/archive-editorjs-v2-plan.md`
  - `docs/cursor-opus-prompt-v1.md`

### Dikkat İsteyen Noktalar

- `PROJECT-STATUS.md` V1 per-tenant Pages modelini anlatıyor. Bu, bu repo için doğru; fakat yeni `snappost-saas` repo için karar kaynağı olmamalı.
- `ALLOWED_EMAILS` dokümantasyonu hâlâ opsiyonel whitelist özelliği olarak geçiyor. `api/wrangler.toml` içinde aktif env tutulmamasıyla çelişmez; open source kullanım için opsiyonel özellik olarak kalabilir.
- `docs/ENV-VARIABLES-CHECKLIST.md` iç operasyon diline sahip. Public repo için korunabilir, ancak daha nötr bir "deployment checklist" diliyle sadeleştirilebilir.
- `api/README.md` içinde `SNAPPOST_API_PUBLIC_URL`, `ACCESS_TOKEN`, `ADMIN_PASSWORD` gibi legacy dashboard/shell env’leri doğru ama V2 SaaS repo için taşınmamalı.
- Landing dashboard hâlâ legacy dashboard link akışında `dashboard_url` ve `access_token` kavramlarını gösterir. Bu V1 için kabul edilebilir, V2 için referans alınmamalı.

## 4. Eksik Open Source Hazırlıkları

Open source öncesi önerilen dosyalar:

- `LICENSE`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `api/.dev.vars.example`
- `landing/.dev.vars.example`
- Kök `README.md` içine net kapsam notu:
  - Bu repo V1 legacy/template/provisioning referansıdır.
  - Yeni SaaS runtime ayrı `snappost-saas` repo içinde geliştirilecektir.

Örnek kapsam cümlesi:

```md
This repository contains the Snappost V1 provisioning system and legacy tenant templates.
The next-generation multi-tenant SaaS runtime is developed separately in `snappost-saas`.
```

## 5. Riskli Noktalar

### Secret Geçmişi

`.dev.vars` dosyaları `.gitignore` içinde, bu doğru. Ancak open source öncesi git geçmişi taranmalı.

Önerilen kontroller:

```bash
git log --all -- api/.dev.vars
git log --all -S "cfat_" -- .
git log --all -S "JWT_SECRET" -- .
git log --all -S "CF_API_TOKEN" -- .
```

Eğer geçmişte secret commitlendiyse:

- Cloudflare token rotate edilmeli.
- JWT secret rotate edilmeli.
- Gerekirse git history temizlenmeli.

### Hardcoded Production URL’ler

Repo içinde V1 production URL örnekleri bulunabilir:

- `snappost-api.snappost-dev.workers.dev`
- `snappost-landing.pages.dev`
- `sp-*-shell.pages.dev`
- `sp-*-dash.pages.dev`

Open source için bunlar "example / current deployment" olarak dokümante edilmeli veya env örneğine taşınmalı. Yeni SaaS repo bu URL’lere hard dependency almamalı.

### Legacy Auth Ayrımı

V1’de üç ayrı auth kavramı var:

- Landing hesabı: JWT (`auth_token`)
- Dashboard login: `ADMIN_PASSWORD` + `auth=authenticated`
- Dashboard API/media proxy: `ACCESS_TOKEN`

Bu V1 için tarihsel olarak kabul edilebilir. `snappost-saas` içinde bu model taşınmamalı; dashboard auth landing session ile birleşmeli.

## 6. `snappost-saas` İçin Planlanan Model

Yeni repo için önerilen başlangıç kapsamı: **Minimal Shell Pivot**.

Amaç tüm sistemi bir anda taşımak değil; önce yeni blog/shell runtime modelini kanıtlamak.

### İlk Kapsam

```text
landing/auth mevcut repo veya mevcut API üzerinden devam edebilir
snappost-saas runtime:
  Host -> tenant lookup
  tenant -> shared D1 rows
  blog render
```

### Veri Modeli

Başlangıç için önerilen model:

```text
Shared D1 + tenant_id
```

Neden:

- Worker D1 binding statiktir.
- Request anında KV’den `d1_database_id` alıp doğrudan D1 binding seçilemez.
- D1 HTTP API çalışır ama latency ve token yönetimi ekler.
- Shared D1 + `tenant_id` en basit ve en az sürprizli başlangıçtır.

Örnek tablo yaklaşımı:

```sql
sites (
  id,
  user_id,
  site_name,
  custom_domain,
  status,
  created_at
)

posts (
  id,
  tenant_id,
  slug,
  title,
  description,
  content,
  content_html,
  published,
  created_at,
  updated_at
)

site_config (
  tenant_id,
  key,
  value,
  primary key (tenant_id, key)
)
```

### Provision V2-lite

Legacy provision:

```text
D1 create -> schema execute -> shell Pages create/deploy -> dashboard Pages create/deploy
```

V2-lite provision:

```text
site row insert
initial config rows insert
optional starter post insert
shell_url = https://{site}.snappost.app
no Pages project create
no per-tenant D1 create
```

## 7. Yeni Repo ile Bu Repo Arasındaki İlişki

Bu repo yeni repo için şu alanlarda referans olur:

- Shell sayfa davranışları
- Blog SEO davranışı
- Editor.js JSON -> HTML render davranışı
- Dashboard settings alanları
- Media upload güvenlik kuralları
- Custom domain operasyon kararları

Bu repo yeni repo için şu alanlarda referans olmamalı:

- Per-tenant Pages deploy modeli
- `ADMIN_PASSWORD` dashboard auth
- Her tenant için ayrı D1 yaratma
- Runtime’da D1 HTTP API ile tenant DB seçimi
- Landing -> dashboard `access_token` geçişi

## 8. Önerilen Sonraki Adım

Open source öncesi bu repo için:

1. `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md` ekle.
2. `.dev.vars.example` dosyalarını ekle.
3. Secret history scan yap.
4. `README.md` içine "V1 legacy/reference repo" kapsamını yaz.
5. `PROJECT-STATUS.md` içine bu geçiş notuna kısa link ekle.

Yeni `snappost-saas` repo için:

1. Hono Worker scaffold.
2. Shared D1 schema (`tenant_id`).
3. Host -> tenant lookup.
4. Basit blog render.
5. Sonra dashboard ve media port.

