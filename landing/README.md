# Snappost Landing Page

snappost.dev - Astro SSR with Cloudflare

## Setup

```bash
cd landing
npm install
```

## Development

```bash
npm run dev

# Access at: http://localhost:4321
```

## Pages

- `/` - Homepage (hero + features)
- `/register` - CF OAuth flow
- `/sites` - User's site list (authenticated)

## Environment Variables

Create `.dev.vars` for local development:

```
CF_CLIENT_ID=your-oauth-client-id
CF_CLIENT_SECRET=your-oauth-secret
API_URL=http://localhost:8787
SESSION_SECRET=random-secret-for-cookies
```

## Deploy

```bash
npm run deploy

# Or via Cloudflare Dashboard:
# 1. Connect GitHub repo
# 2. Set environment variables
# 3. Auto-deploy on push
```

## Phase 2 Implementation

1. ⏭️ CF OAuth integration (register.astro)
2. ⏭️ Session handling (cookies)
3. ⏭️ API communication
4. ⏭️ Sites list (fetch from API)
5. ⏭️ Auto-login token passing
