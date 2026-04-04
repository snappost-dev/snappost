# Snappost Provisioning API

Cloudflare Workers + Hono.js + D1

## Setup

```bash
cd api
npm install
```

## Development

```bash
# Local dev server
npm run dev

# Access at: http://localhost:8787
```

## Database Setup

```bash
# 1. Create D1 database
npm run db:create

# Output: database_id değerini kopyala
# 2. wrangler.toml'daki database_id'yi güncelle

# 3. Migrate schema
npm run db:migrate
```

## Secrets Setup

```bash
# Set CF API token (D1 + Pages permissions)
wrangler secret put CF_API_TOKEN

# Set JWT secret for dashboard tokens
wrangler secret put JWT_SECRET
```

## Deploy

```bash
npm run deploy
```

## Endpoints

### Auth
- `POST /api/auth/callback` - CF OAuth callback
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout

### Provisioning
- `POST /api/provision` - Create new site
- `GET /api/sites` - List user's sites
- `GET /api/sites/:id` - Site details

## Implementation Order (Phase 2)

1. ✅ Skeleton setup
2. ⏭️ CF OAuth integration
3. ⏭️ D1 creation via CF API
4. ⏭️ Pages Direct Upload
5. ⏭️ Binding automation
6. ⏭️ Full provision endpoint
7. ⏭️ Token auth
