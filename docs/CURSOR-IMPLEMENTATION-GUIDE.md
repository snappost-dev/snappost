# SNAPPOST PHASE 2 - IMPLEMENTATION GUIDE

**Mimari Revizyon:** Merkezi hosting (OAuth kaldırıldı)

---

## HIZLI ÖZET

**Ne değişti?**
- ❌ Cloudflare OAuth (mevcut değil)
- ❌ User's own CF account (imkansız)
- ✅ Merkezi hosting (bizim CF hesabı)
- ✅ Basitleştirilmiş flow

**Yeni akış:**
```
User → Register (email/pw) → Create blog → Ready in 30sec
```

---

## MEVCUT DURUM

```
~/snappost/
├── api/              ← Skeleton hazır, implement edilecek
├── landing/          ← Skeleton hazır, OAuth kaldırılacak
└── templates/
    ├── shell/        ← Phase 1 - hazır
    └── dashboard/    ← Phase 1 - hazır
```

**Credentials:**
```bash
# api/.dev.vars
CF_API_TOKEN=cfat_b4v3gXOz072fGHBFaHlpuksL8qL9vUBlnCg48I7w4d94876b
CF_ACCOUNT_ID=1094e722fe9d2b939e94a8ceb124d21b
JWT_SECRET=dev-jwt-secret-change-in-prod
```

```bash
# landing/.dev.vars
API_URL=http://localhost:8787
SESSION_SECRET=dev-session-secret-change-in-prod
```

---

## IMPLEMENTATION ORDER

### STEP 1: API - Auth Endpoints ⏭️

**File:** `api/src/index.ts`

**Implement:**
```typescript
// Basit auth - OAuth YOK artık
POST /api/auth/register
  - Email + password validation
  - bcrypt password hash
  - Save to users table
  - Return JWT session token

POST /api/auth/login
  - Email + password check
  - Return JWT session token

GET /api/auth/me
  - Verify JWT
  - Return user info
```

**Database migration:**
```bash
cd ~/snappost/api
npm run db:migrate  # schema.sql zaten hazır
```

**Test:**
```bash
npm run dev  # localhost:8787

# Postman/curl test:
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

### STEP 2: API - CF API Helpers ⏭️

**File:** `api/src/lib/cloudflare.ts` (yeni dosya)

**Implement:**
```typescript
export async function createD1Database(name: string): Promise<string> {
  // POST /accounts/{id}/d1/database
  // Return database_id
}

export async function executeD1SQL(databaseId: string, sql: string): Promise<void> {
  // POST /accounts/{id}/d1/database/{db_id}/query
}

export async function createPagesProject(name: string): Promise<void> {
  // POST /accounts/{id}/pages/projects
}

export async function uploadToPages(projectName: string, files: Blob): Promise<string> {
  // POST /accounts/{id}/pages/projects/{name}/deployments
  // Return deployment_url
}

export async function setPagesBinding(projectName: string, binding: any): Promise<void> {
  // PATCH /accounts/{id}/pages/projects/{name}/deployment_configs/production
}
```

**Test her fonksiyonu ayrı ayrı:**
```bash
# D1 oluştur
curl http://localhost:8787/test/d1/create

# Pages project oluştur
curl http://localhost:8787/test/pages/create
```

---

### STEP 3: API - Template Build & Zip ⏭️

**Templates'leri API'ye kopyala:**
```bash
cd ~/snappost/templates/shell
npm run build
mkdir -p ~/snappost/api/src/templates/shell
cp -r dist/* ~/snappost/api/src/templates/shell/

cd ~/snappost/templates/dashboard
npm run build
mkdir -p ~/snappost/api/src/templates/dashboard
cp -r dist/* ~/snappost/api/src/templates/dashboard/
```

**File:** `api/src/lib/templates.ts` (yeni dosya)

**Implement:**
```typescript
export async function zipShellTemplate(): Promise<Blob> {
  // Read templates/shell/
  // Create zip
  // Return blob
}

export async function zipDashboardTemplate(): Promise<Blob> {
  // Read templates/dashboard/
  // Create zip
  // Return blob
}
```

---

### STEP 4: API - Provision Endpoint ⏭️

**File:** `api/src/index.ts`

**Implement:**
```typescript
POST /api/provision
  Input: { user_id, site_name }
  
  Process:
    1. Generate names (user-{id}-blog-*)
    2. createD1Database()
    3. executeD1SQL(schema.sql)
    4. zipShellTemplate()
    5. createPagesProject(shell)
    6. uploadToPages(shell, zip)
    7. setPagesBinding(shell, d1_id)
    8. zipDashboardTemplate()
    9. createPagesProject(dashboard)
    10. uploadToPages(dashboard, zip)
    11. setPagesBinding(dashboard, d1_id + token)
    12. Save to sites table
  
  Output: {
    shell_url: "https://user-123-blog-shell.pages.dev",
    dashboard_url: "https://user-123-blog-dashboard.pages.dev",
    access_token: "xyz"
  }
```

**Error handling:**
```typescript
try {
  // Steps 1-12
} catch (error) {
  // Rollback: Delete created resources
  // Return error
}
```

**Test:**
```bash
curl -X POST http://localhost:8787/api/provision \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"site_name":"my-test-blog"}'
```

---

### STEP 5: Landing - OAuth Kaldır ⏭️

**File:** `landing/src/pages/register.astro`

**Değiştir:**
```astro
---
// OAuth kodlarını SİL
// Basit form ekle
---

<form method="POST" action="/api/auth/register">
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <button type="submit">Register</button>
</form>
```

**File:** `landing/src/pages/login.astro`

```astro
<form method="POST" action="/api/auth/login">
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <button type="submit">Login</button>
</form>
```

---

### STEP 6: Landing - Dashboard Page ⏭️

**File:** `landing/src/pages/dashboard.astro`

**Implement:**
```astro
---
// Check session cookie
// Fetch user's sites from API
const sites = await fetch(`${API_URL}/api/sites`, {
  headers: { Authorization: `Bearer ${sessionToken}` }
}).then(r => r.json());
---

<div>
  <h1>My Sites</h1>
  
  <button onclick="createSite()">Create New Blog</button>
  
  {sites.map(site => (
    <div>
      <h3>{site.site_name}</h3>
      <a href={site.shell_url}>View Blog</a>
      <a href={`${site.dashboard_url}?token=${site.access_token}`}>
        Open Dashboard
      </a>
    </div>
  ))}
</div>

<script>
async function createSite() {
  const name = prompt("Blog name:");
  const res = await fetch('/api/provision', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ site_name: name })
  });
  const data = await res.json();
  alert(`Blog ready at: ${data.shell_url}`);
  location.reload();
}
</script>
```

---

### STEP 7: Dashboard - Auto-Login Token ⏭️

**File:** `templates/dashboard/src/pages/login.astro`

**Ekle:**
```astro
---
const token = Astro.url.searchParams.get('token');
if (token) {
  // Verify token (check in D1 sites table or JWT)
  // Set auth cookie
  return Astro.redirect('/');
}
---
```

---

## TEST CHECKLIST

- [ ] API auth endpoints work
- [ ] D1 database creation works
- [ ] Pages project creation works
- [ ] Template zipping works
- [ ] Full provision flow works (end-to-end)
- [ ] Landing register/login works
- [ ] Dashboard site list works
- [ ] Create site button works
- [ ] Auto-login to dashboard works

---

## PRODUCTION DEPLOYMENT

### 1. Deploy API
```bash
cd ~/snappost/api
wrangler secret put CF_API_TOKEN
wrangler secret put JWT_SECRET
wrangler deploy
# → https://snappost-api.workers.dev
```

### 2. Deploy Landing
```bash
cd ~/snappost/landing
# Update .env.production:
# API_URL=https://snappost-api.workers.dev
npm run deploy
# → https://snappost.dev
```

### 3. Test Production
- Register new account
- Create blog
- Verify URLs
- Test dashboard access

---

## CURSOR PROMPTS

**API Auth:**
```
Implement POST /api/auth/register and /api/auth/login endpoints in api/src/index.ts. Use bcrypt for password hashing, save to D1 users table, return JWT token. Also implement GET /api/auth/me to verify JWT.
```

**CF API Helpers:**
```
Create api/src/lib/cloudflare.ts with functions: createD1Database, executeD1SQL, createPagesProject, uploadToPages, setPagesBinding. Use CF_API_TOKEN and CF_ACCOUNT_ID from env. Reference Cloudflare API docs.
```

**Provision Endpoint:**
```
Implement POST /api/provision in api/src/index.ts. Should create D1 database, deploy shell and dashboard templates to Pages, set bindings, and save to sites table. Include error handling and rollback.
```

**Landing Pages:**
```
Update landing/src/pages/register.astro and login.astro to use simple email/password forms instead of OAuth. Remove all CF OAuth code.
```

---

**BAŞLAMAYA HAZIR!** 🚀

Cursor'da ilk adım: **API Auth Endpoints**
