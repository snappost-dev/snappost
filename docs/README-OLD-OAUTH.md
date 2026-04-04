# SNAPPOST - PHASE 2 SKELETON

Bu skeleton Phase 1'den sonra eklenmesi gereken yeni klasörleri içeriyor.

## Yapı

```
snappost/
├── templates/
│   ├── shell/          (✅ Phase 1 - mevcut)
│   └── dashboard/      (✅ Phase 1 - mevcut)
├── api/                (🆕 Phase 2)
│   ├── src/
│   │   ├── index.ts    (Hono routes - TODO endpoints)
│   │   └── db/
│   │       └── schema.sql (users, sites tables)
│   ├── package.json
│   ├── wrangler.toml
│   └── README.md
└── landing/            (🆕 Phase 2)
    ├── src/
    │   ├── pages/
    │   │   ├── index.astro      (Hero + features)
    │   │   ├── register.astro   (CF OAuth - TODO)
    │   │   └── sites.astro      (User's site list - TODO)
    │   └── layouts/
    │       └── Base.astro
    ├── package.json
    ├── astro.config.mjs
    └── README.md
```

## Kurulum

### 1. API Setup

```bash
cd ~/snappost/api
npm install

# D1 database oluştur
npm run db:create
# Output'taki database_id'yi kopyala

# wrangler.toml'daki database_id satırını güncelle:
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Schema'yı migrate et
npm run db:migrate

# Local dev
npm run dev
# → http://localhost:8787
```

### 2. Landing Setup

```bash
cd ~/snappost/landing
npm install

# Local dev
npm run dev
# → http://localhost:4321
```

## Sonraki Adımlar (Cursor'da)

### Phase 2 - Step 2: CF OAuth Integration

1. **Cloudflare OAuth App oluştur:**
   - CF Dashboard → Account → API Tokens → OAuth Applications
   - Redirect URI: `https://snappost.dev/api/auth/callback`
   - Scopes: D1 + Pages write permissions
   - Client ID & Secret al

2. **API'de OAuth callback implement et:**
   - `api/src/index.ts` → `/api/auth/callback` endpoint
   - Code exchange → Access token
   - User create/update in DB
   - Session cookie set

3. **Landing'de OAuth flow:**
   - `landing/src/pages/register.astro`
   - CF OAuth URL oluştur
   - Callback'den sonra /sites'a redirect

### Phase 2 - Step 3: D1 Creation via CF API

`api/src/index.ts` → `createD1Database()` helper:
```typescript
POST https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database
Authorization: Bearer {token}
Body: { "name": "user-blog-{timestamp}" }
```

Test et: Provisioning endpoint'inden D1 oluşturabilir mi?

### Phase 2 - Step 4: Pages Direct Upload

`api/src/index.ts` → `uploadToPages()` helper:
```typescript
1. Template'i zip'le (shell/dist veya dashboard/dist)
2. Direct Upload API'ye gönder
3. Deployment ID al
```

### Phase 2 - Step 5: Binding Automation

CF Pages API → deployment_configs:
```typescript
PATCH /accounts/{id}/pages/projects/{name}/deployments/config
Body: {
  "env_vars": { "ADMIN_PASSWORD": "...", "TOKEN": "..." },
  "d1_databases": { "DB": "{d1_database_id}" }
}
```

Bu **kritik** - manuel Dashboard adımını otomatikleştiriyor.

### Phase 2 - Step 6: Full Provision Endpoint

Tüm adımları birleştir:
```typescript
POST /api/provision
1. createD1Database()
2. executeD1SQL(schema.sql)
3. Build shell → zip → uploadToPages()
4. setPagesBinding(shell, D1)
5. Build dashboard → zip → uploadToPages()
6. setPagesBinding(dashboard, D1 + TOKEN)
7. Save to sites table
8. Return URLs
```

### Phase 2 - Step 7: Token Auth

Dashboard'a token-based auto-login ekle:
- `?token=xyz` parametresi
- Token verify → cookie set
- Password prompt skip

---

## Current Status

✅ **Completed:**
- API skeleton (Hono + D1 schema + endpoints outline)
- Landing skeleton (Astro + pages + layout)

⏭️ **Next (in order):**
1. CF OAuth integration
2. D1 creation test
3. Pages upload test
4. Binding automation
5. Full provision flow
6. Token auth
7. End-to-end test

---

## Notes

- API ve Landing henüz **TODO** state'te
- Her endpoint placeholder olarak hazır
- Cursor'da adım adım implement edilecek
- Phase 1 template'lere dokunma (shell/dashboard)

---

**Ready to start Phase 2 in Cursor!** 🚀
