# SNAPPOST PHASE 2 - REVİZE MİMARİ

**Tarih:** 4 Nisan 2026  
**Değişiklik Nedeni:** Cloudflare OAuth delegation mevcut değil

---

## ÖNEMLİ MİMARİ DEĞİŞİKLİK

### Orijinal Plan (❌ İPTAL):
- Her user kendi Cloudflare hesabında deploy eder
- OAuth ile user'ın token'ı alınır
- User ownership model

### Yeni Plan (✅ ONAYLANDI):
- **Merkezi hosting:** Herkes Snappost CF hesabında
- **Tek API token:** Bizim token ile tüm işlemler
- **Multi-tenant:** Her user = ayrı D1 database + Pages projects

**Neden?**
> Cloudflare API, third-party OAuth delegation desteklemiyor. Manuel token paste kullanıcı deneyimini bozar. CF'nin free tier (50,000 requests/gün) MVP için yeterli.

---

## YENİ MİMARİ

### Altyapı Sahipliği

**Snappost CF Account:**
```
snappost.dev (account)
├── D1 Databases
│   ├── snappost-provisioning (central)
│   ├── user-1-blog-db
│   ├── user-2-blog-db
│   └── ...
├── Pages Projects
│   ├── snappost-landing (landing page)
│   ├── snappost-api (provisioning API)
│   ├── user-1-blog-shell
│   ├── user-1-blog-dashboard
│   ├── user-2-blog-shell
│   └── ...
└── KV Namespaces (future: cache, sessions)
```

### User Flow (Basitleştirilmiş)

```
1. User: snappost.dev'e git
   ↓
2. User: "Start Free" butonuna bas
   ↓
3. Landing: Email + password ile kayıt
   ↓
4. API: Provisioning başlat (otomatik):
   - D1 database oluştur (user-{id}-blog-db)
   - Shell deploy et (user-{id}-blog-shell.pages.dev)
   - Dashboard deploy et (user-{id}-blog-dashboard.pages.dev)
   - Binding'leri ayarla
   - Access token oluştur
   ↓
5. User: Blog hazır! (30 saniye)
   - Shell: https://user-{id}-blog-shell.pages.dev
   - Dashboard: Auto-login token ile erişim
```

---

## COMPONENTS

### 1. Landing Page (snappost.dev)

**Tech:** Astro SSR + Cloudflare adapter

**Pages:**
- `/` - Hero + features
- `/register` - Email/password kayıt (OAuth YOK artık)
- `/login` - Giriş
- `/dashboard` - User's sites listesi

**Auth:** 
- Session-based (cookies)
- JWT token (API ile iletişim için)

### 2. Provisioning API

**Tech:** Hono.js + Cloudflare Workers + D1

**Database:** `snappost-provisioning`

**Endpoints:**
```typescript
// Auth (simplified - no OAuth)
POST /api/auth/register
  Input: { email, password }
  Output: { user_id, session_token }

POST /api/auth/login
  Input: { email, password }
  Output: { session_token }

// Provisioning (single account)
POST /api/provision
  Input: { user_id, site_name }
  Process:
    1. Create D1: user-{id}-blog-db
    2. Execute schema.sql
    3. Build + zip shell template
    4. Deploy to Pages: user-{id}-blog-shell
    5. Set D1 binding
    6. Build + zip dashboard template
    7. Deploy to Pages: user-{id}-blog-dashboard
    8. Set D1 binding + ACCESS_TOKEN env
    9. Save to sites table
  Output: { shell_url, dashboard_url, access_token }

// Sites management
GET /api/sites
  Input: session_token
  Output: User's blog list

DELETE /api/sites/:id
  Input: site_id
  Process: Delete D1 + Pages projects
```

### 3. Template Storage

**Location:** API repo içinde

```
api/
├── src/
│   ├── index.ts
│   └── templates/
│       ├── shell/        (built Astro output)
│       └── dashboard/    (built Astro output)
```

**Build process:**
```bash
# Phase 1 templates'leri build et
cd ~/snappost/templates/shell
npm run build
cp -r dist ~/snappost/api/src/templates/shell

cd ~/snappost/templates/dashboard
npm run build
cp -r dist ~/snappost/api/src/templates/dashboard
```

---

## DATABASE SCHEMAS

### Central Database (snappost-provisioning)

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  site_name TEXT NOT NULL,
  d1_database_id TEXT NOT NULL,
  shell_project_name TEXT NOT NULL,
  shell_url TEXT NOT NULL,
  dashboard_project_name TEXT NOT NULL,
  dashboard_url TEXT NOT NULL,
  access_token TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sites_user_id ON sites(user_id);
```

### User Blog Database (per site)

```sql
-- Same as Phase 1
CREATE TABLE posts (...)
CREATE TABLE config (...)
```

---

## CLOUDFLARE API INTEGRATION

### Required APIs

**D1 Database:**
```typescript
// Create
POST /accounts/{account_id}/d1/database
Body: { name: "user-{id}-blog-db" }

// Execute SQL
POST /accounts/{account_id}/d1/database/{db_id}/query
Body: { sql: "CREATE TABLE..." }
```

**Pages Direct Upload:**
```typescript
// Create project
POST /accounts/{account_id}/pages/projects
Body: { name: "user-{id}-blog-shell", production_branch: "main" }

// Upload
POST /accounts/{account_id}/pages/projects/{name}/deployments
Body: FormData (zip file)

// Set bindings
PATCH /accounts/{account_id}/pages/projects/{name}/deployment_configs/production
Body: {
  d1_databases: { DB: "{database_id}" },
  env_vars: { ACCESS_TOKEN: "..." }
}
```

### Authentication

**Single API Token:**
```
Token: cfat_b4v3gXOz072fGHBFaHlpuksL8qL9vUBlnCg48I7w4d94876b
Account ID: 1094e722fe9d2b939e94a8ceb124d21b
Permissions: D1:Edit, Pages:Edit, Account:Read
```

**Environment:**
```bash
# api/.dev.vars
CF_API_TOKEN=cfat_b4v3gXOz072fGHBFaHlpuksL8qL9vUBlnCg48I7w4d94876b
CF_ACCOUNT_ID=1094e722fe9d2b939e94a8ceb124d21b
JWT_SECRET=your-jwt-secret
```

---

## DEPLOYMENT FLOW

```
User Registration
  ↓
API: Create user record (email + password hash)
  ↓
Return session token
  ↓
User: "Create blog"
  ↓
API Provisioning:
  1. Generate unique names
     - DB: user-{id}-blog-db
     - Shell: user-{id}-blog-shell
     - Dashboard: user-{id}-blog-dashboard
  
  2. Create D1 database
     POST /d1/database
     → database_id
  
  3. Execute schema.sql
     POST /d1/database/{id}/query
  
  4. Zip shell template
     fs.readdir('templates/shell') → zip
  
  5. Deploy shell to Pages
     POST /pages/projects (create)
     POST /pages/projects/{name}/deployments (upload)
     → shell_url
  
  6. Set shell bindings
     PATCH /deployment_configs
     { d1_databases: { DB: database_id } }
  
  7. Zip dashboard template
     fs.readdir('templates/dashboard') → zip
  
  8. Deploy dashboard to Pages
     POST /pages/projects
     POST /pages/projects/{name}/deployments
     → dashboard_url
  
  9. Set dashboard bindings + token
     PATCH /deployment_configs
     {
       d1_databases: { DB: database_id },
       env_vars: { 
         ADMIN_PASSWORD: "temp-password",
         ACCESS_TOKEN: crypto.randomUUID()
       }
     }
  
  10. Save to sites table
      INSERT INTO sites (...)
  
  11. Return URLs to user
      { shell_url, dashboard_url, access_token }
  ↓
User: Blog ready at:
  - https://user-123-blog-shell.pages.dev
  - https://user-123-blog-dashboard.pages.dev?token=xxx (auto-login)
```

---

## IMPLEMENTATION ORDER

### ✅ Phase 1 (Tamamlandı)
- Shell template
- Dashboard template
- Manual deployment

### ⏭️ Phase 2A: API Skeleton
1. Hono.js setup
2. D1 central database
3. Basic auth endpoints (register/login)
4. Session management

### ⏭️ Phase 2B: CF API Integration
1. D1 creation helper
2. Schema execution helper
3. Pages project creation
4. Direct upload implementation
5. Binding automation

### ⏭️ Phase 2C: Provisioning Endpoint
1. Template building/zipping
2. Full provision flow
3. Error handling + rollback
4. Status tracking

### ⏭️ Phase 2D: Landing Page
1. Register/login UI
2. Dashboard (sites list)
3. Create site flow
4. Auto-login to dashboard

### ⏭️ Phase 2E: Production Deploy
1. Deploy landing to snappost.dev
2. Deploy API to workers
3. Setup secrets (CF_API_TOKEN, JWT_SECRET)
4. End-to-end test

---

## SCALING CONSIDERATIONS

### CF Free Tier Limits
- **Workers:** 100,000 requests/day
- **D1:** 100,000 reads/day, 50,000 writes/day (per database)
- **Pages:** Unlimited deployments

### MVP Target
- **Users:** 100-500
- **Sites per user:** 1
- **Total D1 databases:** 100-500
- **Traffic:** Well within free tier

### Future Scaling (v2+)
- Paid CF plan (~$5/month for Workers)
- KV for caching config
- R2 for template storage
- Analytics integration

---

## KALDIRILAN ÖZELLİKLER

❌ **Cloudflare OAuth**
- Delegation mevcut değil
- Manuel token paste UX killer

❌ **User's Own CF Account**
- OAuth olmadan imkansız
- Merkezi hosting tercih edildi

❌ **GitHub Integration**
- Direct Upload kullanıyoruz
- Git connection gereksiz

---

## YENİ ÖNCELİKLER

✅ **Basit kayıt:** Email + password
✅ **Hızlı provisioning:** 30 saniye
✅ **Auto-login:** Token-based dashboard erişimi
✅ **Template yönetimi:** API repo içinde

---

## NEXT STEPS

1. `api/` klasöründe auth endpoints implement et
2. CF API helpers yaz (D1 + Pages)
3. Template build + zip logic
4. Full provision endpoint
5. Landing page (register/login/dashboard)
6. Test + deploy

---

**Ready to start implementation!** 🚀
