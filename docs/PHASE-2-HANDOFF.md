# SNAPPOST - PHASE 2 HANDOFF

## PROJECT STATE (April 3, 2026)

### ✅ COMPLETED: Phase 1A-B-C

**Location:** `~/snappost/`

```
snappost/
├── templates/
│   ├── shell/          (Astro SSR blog - public)
│   └── dashboard/      (Astro SSR admin - private)
└── .git/
```

**Git:** Private repo pushed to GitHub

---

## PHASE 1 DELIVERABLES

### 1. Shell Template ✅
- **Local:** `~/snappost/templates/shell/`
- **Tech:** Astro v4 SSR + Cloudflare adapter + Tailwind + D1
- **Pages:** index, blog, blog/[slug], rss.xml
- **Components:** Header, Footer, PostCard
- **Database:** D1 (posts, config tables)
- **Production:** Deployed to `41276598.my-blog-6w9.pages.dev`

**Key files:**
- `wrangler.toml` - D1 binding configuration
- `src/pages/` - All routes
- `src/layouts/Base.astro` - Main layout with D1 config
- `schema.sql` - Database schema
- `seed.sql` - Demo posts

### 2. Dashboard Template ✅
- **Local:** `~/snappost/templates/dashboard/`
- **Tech:** Astro SSR + D1 + marked.js (Markdown rendering)
- **Pages:** login, index (list), new, edit/[id], logout
- **Auth:** Cookie-based, middleware protected
- **Production:** Deployed to `my-blog-dashboard.pages.dev`

**Key files:**
- `src/middleware.ts` - Auth check
- `src/pages/login.astro` - Password auth
- Environment: `ADMIN_PASSWORD=changeme`

### 3. Production Deployment ✅
- **D1:** `snappost-production` (ID: fe7f0120-f53b-4419-926f-0032e9b6c47e)
- **Shell:** Deployed with D1 binding
- **Dashboard:** Deployed with D1 binding + ADMIN_PASSWORD env var
- **Both apps:** Same D1 database

**Manual steps learned:**
1. D1 create → `wrangler d1 create`
2. Schema apply → `wrangler d1 execute --remote --file=schema.sql`
3. Build → `npm run build`
4. Deploy → `wrangler pages deploy dist --project-name=X`
5. **Binding:** CF Dashboard → Settings → Bindings → Add D1
6. **Env vars:** CF Dashboard → Settings → Variables and Secrets

---

## ARCHITECTURE DECISIONS

### User Ownership Model (Scenario A)
- Each user deploys to **their own Cloudflare account**
- Shell + Dashboard = separate Pages projects
- Shared D1 database
- **No GitHub needed** - Direct Upload API

### Multi-site Management
- Central landing: `snappost.dev` (site list)
- Each site: own dashboard deployment
- **Auto-login:** Token-based (`?token=xyz`)
- No password prompt when clicking from site list

### Why Separate Shell + Dashboard?
- **Shell:** Public blog, SEO, aggressive cache
- **Dashboard:** Private, auth required, no cache
- Different domains, independent deployments
- Same D1 for content

---

## PHASE 2 SCOPE

### Goal
Automate the entire provisioning flow - user registers, gets blog + dashboard deployed automatically.

### Components to Build

#### 1. Landing Page (`snappost.dev`)
- **Tech:** Astro static (or SSR if needed)
- **Pages:**
  - `/` - Hero + features + "Start Free" CTA
  - `/register` - CF OAuth flow
  - `/sites` - User's site list (after login)
- **Features:**
  - Cloudflare OAuth integration
  - Registration flow
  - Site management UI

#### 2. Provisioning API
- **Tech:** Hono.js on Cloudflare Workers
- **Database:** D1 (users, sites tables)
- **Endpoints:**

```typescript
POST /api/auth/callback
  - Exchange CF OAuth code for token
  - Create user record
  - Return session

POST /api/provision
  - Input: { user_id, site_name }
  - Creates:
    * D1 database (CF API)
    * Apply schema (CF D1 API)
    * Deploy shell (CF Pages Direct Upload API)
    * Deploy dashboard (CF Pages Direct Upload API)
    * Set bindings (CF Pages API)
    * Set env vars (CF Pages API)
    * Generate access token
  - Output: { shell_url, dashboard_url, access_token }
  - Save to sites table

GET /api/sites
  - Input: user session
  - Output: User's site list
```

#### 3. CF API Integration
**Required APIs:**
- D1: Create database, execute SQL
- Pages: Create project, direct upload, set bindings
- OAuth: Token exchange

**Key challenge:** Bindings must be set programmatically (not manual like Phase 1)

#### 4. Token Auth for Dashboard
- Generate JWT or random token on provision
- Dashboard accepts `?token=xyz` → auto-login
- Store in cookie, no password prompt

---

## DATABASE SCHEMAS

### Provisioning API Database (central)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  cf_account_id TEXT,
  cf_access_token TEXT, -- encrypted
  created_at TEXT
);

CREATE TABLE sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  site_name TEXT,
  shell_url TEXT,
  dashboard_url TEXT,
  d1_database_id TEXT,
  access_token TEXT, -- for dashboard auto-login
  created_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User's D1 Database (per site)
```sql
-- Same as Phase 1: posts, config tables
-- Provisioned automatically via schema.sql
```

---

## TECHNICAL NOTES

### Cloudflare Direct Upload
- Shell/Dashboard templates zipped and uploaded
- No GitHub connection needed
- User never touches code

### Module Bundling
- Astro builds → ~15-16 modules per app
- Code splitting automatic
- Worker loads modules on-demand

### Deployment Flow
```
User registers
  ↓
CF OAuth (get token)
  ↓
Provisioning API:
  1. Create D1 (CF API)
  2. Execute schema.sql (CF D1 API)
  3. Zip shell template
  4. Upload to Pages (CF Pages API)
  5. Set D1 binding + env vars
  6. Zip dashboard template
  7. Upload to Pages
  8. Set D1 binding + ADMIN_PASSWORD + token
  ↓
Return URLs to user
  ↓
Save to sites table
```

---

## NEXT STEPS (Phase 2 Implementation)

### Order of Work:
1. **Provisioning API skeleton** (Hono + D1 setup)
2. **CF OAuth integration** (test token flow)
3. **D1 creation via API** (test programmatic database creation)
4. **Pages Direct Upload** (test shell deployment)
5. **Binding automation** (critical - must work programmatically)
6. **Full provision endpoint** (integrate all steps)
7. **Landing page** (register + site list UI)
8. **Token auth** (dashboard auto-login)
9. **End-to-end test** (full user flow)

### Known Challenges:
- **Bindings:** Must be set via API (no manual Dashboard step)
- **CF API rate limits:** Handle errors gracefully
- **Token security:** Encrypt/hash access tokens
- **Error rollback:** If step 5 fails, clean up steps 1-4

---

## QUESTIONS TO RESOLVE

1. ✅ How to handle bindings? → CF Pages API `deployment_configs`
2. ✅ Multi-site dashboard? → No, keep separate + central list
3. ✅ Auto-login? → Token-based (`?token=xyz`)
4. ⏭️ CF OAuth scope? → Need D1 + Pages permissions
5. ⏭️ Template storage? → In provisioning API repo
6. ⏭️ User onboarding? → Just CF OAuth, no manual steps

---

## CURRENT WORKING EXAMPLES

### Shell
- URL: https://41276598.my-blog-6w9.pages.dev
- Login: N/A (public)

### Dashboard  
- URL: https://my-blog-dashboard.pages.dev
- Login: `changeme`

### Test Flow
1. Dashboard: Create post
2. Shell: Immediately visible (same D1)

---

## AI MODEL RECOMMENDATION FOR PHASE 2

**Complexity:** Medium-High
- Backend API development
- CF API integration (multiple endpoints)
- OAuth flow implementation
- Provisioning orchestration logic

**Recommended:** 
- **Claude Opus 4.5** - Best for complex backend logic, API integration
- **Claude Sonnet 4.5** - Sufficient if broken into smaller tasks

**Use Opus if:**
- Building full provision endpoint in one go
- Debugging complex CF API issues
- Architecting error handling + rollback

**Use Sonnet if:**
- Step-by-step implementation (one API at a time)
- UI/frontend work (landing page)
- Simple CRUD endpoints

---

## FILES TO REFERENCE

In new conversation, these files are available:
- `~/snappost/templates/shell/` - Full shell codebase
- `~/snappost/templates/dashboard/` - Full dashboard codebase
- `~/snappost/templates/shell/schema.sql` - Database schema
- `~/snappost/templates/shell/seed.sql` - Demo data

---

## MEMORY CONTEXT

When starting Phase 2 conversation, mention:
- "Continuing from Phase 1 (MVP complete)"
- "Repo: ~/snappost/"
- "Ready for Phase 2: Provisioning API + Landing"

Memory includes full project context.
