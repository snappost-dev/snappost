import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import {
  createD1Database, executeD1SQL, createPagesProject, uploadToPages,
  setPagesBinding, deletePagesProject, deleteD1Database,
  addPagesCustomDomain, removePagesCustomDomain,
} from './lib/cloudflare';
import { prepareShellTemplate, prepareDashboardTemplate, BLOG_SCHEMA_SQL } from './lib/templates';
import { MEDIA_KEY_PREFIX_DOC } from './lib/media-keys';

type Bindings = {
  DB: D1Database;
  /** R2 — kiracı görselleri (B1); B2’de upload bu binding ile yazacak */
  MEDIA_BUCKET: R2Bucket;
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
  JWT_SECRET: string;
  /** Virgülle ayrılmış; tanımsız veya boş = kısıt yok */
  ALLOWED_EMAILS?: string;
  /** Pozitif tam sayı; kullanıcı başına en fazla kaç blog (sites satırı). Tanımsız/boş = sınırsız */
  MAX_SITES_PER_USER?: string;
  /** Yalnızca tam olarak "true" iken /test/* açılır; production’da tanımlamayın */
  ALLOW_TEST_ROUTES?: string;
  /** Virgülle ayrılmış tarayıcı Origin listesi; boş/tanımsız = yerleşik varsayılanlar */
  CORS_ORIGINS?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Basit FQDN e-posta formatı (MVP); tam RFC doğrulaması değil */
function isValidEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** null = sınır yok */
function parseMaxSitesPerUser(raw: string | undefined): number | null {
  if (raw == null) return null;
  const t = raw.trim();
  if (t === '') return null;
  const n = parseInt(t, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

/** null = whitelist kapalı (herkese açık) */
function parseAllowedEmailSet(raw: string | undefined): Set<string> | null {
  if (raw == null) return null;
  const t = raw.trim();
  if (t === '') return null;
  const set = new Set<string>();
  for (const part of t.split(',')) {
    const n = normalizeEmail(part);
    if (n) set.add(n);
  }
  return set.size > 0 ? set : null;
}

function isEmailAllowed(email: string, allowed: Set<string> | null): boolean {
  if (allowed == null) return true;
  return allowed.has(normalizeEmail(email));
}

function rejectIfNotWhitelisted(c: { env: Bindings; json: (body: unknown, status?: number) => Response }, email: string): Response | null {
  const allowed = parseAllowedEmailSet(c.env.ALLOWED_EMAILS);
  if (!isEmailAllowed(email, allowed)) {
    return c.json(
      { error: 'Bu hesap için API erişimi kapalı. E-posta davetli listede değil.' },
      403
    );
  }
  return null;
}

function testRoutesAllowed(env: Bindings): boolean {
  return env.ALLOW_TEST_ROUTES === 'true';
}

async function verifyAuth(c: any): Promise<{ userId: number; email: string } | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const decoded = await verify(authHeader.substring(7), c.env.JWT_SECRET, 'HS256');
    return { userId: decoded.userId as number, email: decoded.email as string };
  } catch {
    return null;
  }
}

/** FQDN for custom blog domain (shell Pages only). null = invalid */
function normalizeCustomDomain(raw: unknown): string | null {
  if (raw == null || typeof raw !== 'string') return null;
  let d = raw.trim().toLowerCase();
  if (!d) return null;
  d = d.replace(/^https?:\/\//, '');
  d = d.split('/')[0]?.split(':')[0] ?? '';
  d = d.replace(/\.$/, '');
  if (d.length < 3 || d.length > 253) return null;
  if (!d.includes('.')) return null;
  // etiketler: harf/rakam, içeride tire; nokta ile ayrılmış en az iki segment
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(d)) return null;
  return d;
}

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:4321',
  'http://localhost:4322',
  'https://snappost.dev',
  'https://snappost-landing.pages.dev',
] as const;

function corsOriginsForEnv(raw: string | undefined): string[] {
  if (raw == null || raw.trim() === '') {
    return [...DEFAULT_CORS_ORIGINS];
  }
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : [...DEFAULT_CORS_ORIGINS];
}

// CORS — tarayıcıdan gelen istekler; özel landing alanı için CORS_ORIGINS kullanın
app.use('/*', cors({
  origin: (origin, c) => {
    const allowed = corsOriginsForEnv(c.env.CORS_ORIGINS);
    if (!origin) return null;
    return allowed.includes(origin) ? origin : null;
  },
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({ 
    status: 'ok',
    service: 'snappost-provisioning-api',
    version: '1.0.0'
  });
});

/** Medya/R2 durumu (B1) — upload B2’de; key stratejisi dokümantasyon için */
app.get('/api/media/status', (c) => {
  return c.json({
    r2: true,
    binding: 'MEDIA_BUCKET',
    tenant_key_prefix: MEDIA_KEY_PREFIX_DOC,
    note: 'Upload ve imzalı URL B2 sprintinde eklenecek.',
  });
});

// ========================================
// PHASE 2 - STEP 1: AUTH ENDPOINTS
// ========================================

// Register new user
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password } = await c.req.json();

    const passwordPlain = typeof password === 'string' ? password.trim() : '';
    if (!email || !passwordPlain) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const normalizedEmail = normalizeEmail(String(email));
    if (!normalizedEmail) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    if (!isValidEmailFormat(normalizedEmail)) {
      return c.json({ error: 'Geçerli bir e-posta adresi girin.' }, 400);
    }

    const allowed = parseAllowedEmailSet(c.env.ALLOWED_EMAILS);
    if (!isEmailAllowed(normalizedEmail, allowed)) {
      return c.json(
        { error: 'Bu e-posta ile kayıt şu an kapalı. Davetli kullanıcı listesinde değilsiniz.' },
        403
      );
    }
    
    // Check if user exists (mevcut kayıtlar için case-insensitive)
    const existing = await c.env.DB.prepare(
      'SELECT id FROM users WHERE LOWER(TRIM(email)) = ?'
    ).bind(normalizedEmail).first();
    
    if (existing) {
      return c.json({ error: 'Email already registered' }, 409);
    }
    
    // Hash password (trim: tarayıcı / kopyala-yapıştır ile gelen görünmez boşlukları önler)
    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    
    // Create user
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING id, email, created_at'
    ).bind(normalizedEmail, passwordHash).first();
    
    if (!result) {
      return c.json({ error: 'Failed to create user' }, 500);
    }
    
    const token = await sign(
      { userId: result.id, email: result.email, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 },
      c.env.JWT_SECRET
    );
    
    return c.json({
      token,
      user: {
        id: result.id,
        email: result.email,
        createdAt: result.created_at
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Login
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    const passwordPlain = typeof password === 'string' ? password.trim() : '';
    if (!email || !passwordPlain) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const normalizedEmail = normalizeEmail(String(email));
    if (!normalizedEmail) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    if (!isValidEmailFormat(normalizedEmail)) {
      return c.json({ error: 'Geçerli bir e-posta adresi girin.' }, 400);
    }

    const allowed = parseAllowedEmailSet(c.env.ALLOWED_EMAILS);
    if (!isEmailAllowed(normalizedEmail, allowed)) {
      return c.json(
        { error: 'Bu e-posta ile giriş kapalı. Davetli kullanıcı listesinde değilsiniz.' },
        403
      );
    }
    
    // Get user
    const user = await c.env.DB.prepare(
      'SELECT id, email, password_hash, created_at FROM users WHERE LOWER(TRIM(email)) = ?'
    ).bind(normalizedEmail).first();
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Verify password
    const valid = await bcrypt.compare(passwordPlain, user.password_hash as string);
    
    if (!valid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const token = await sign(
      { userId: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 },
      c.env.JWT_SECRET
    );
    
    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Get current user
app.get('/api/auth/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }
    
    const token = authHeader.substring(7);
    
    const decoded = await verify(token, c.env.JWT_SECRET, 'HS256');
    
    const user = await c.env.DB.prepare(
      'SELECT id, email, created_at FROM users WHERE id = ?'
    ).bind(decoded.userId).first();
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const denied = rejectIfNotWhitelisted(c, String(user.email));
    if (denied) return denied;
    
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// ========================================
// PHASE 2 - STEP 3-6: PROVISIONING
// ========================================

app.post('/api/provision', async (c) => {
  // 1. Auth
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const deniedProvision = rejectIfNotWhitelisted(c, user.email);
  if (deniedProvision) return deniedProvision;

  const maxSites = parseMaxSitesPerUser(c.env.MAX_SITES_PER_USER);
  if (maxSites != null) {
    const row = await c.env.DB.prepare('SELECT COUNT(*) as cnt FROM sites WHERE user_id = ?')
      .bind(user.userId)
      .first<{ cnt: number }>();
    const count = Number(row?.cnt ?? 0);
    if (count >= maxSites) {
      return c.json(
        {
          error: 'Blog sınırına ulaşıldı',
          detail: `Bu hesapla en fazla ${maxSites} blog oluşturabilirsiniz.`,
        },
        403
      );
    }
  }

  const { site_name } = await c.req.json();
  if (!site_name || !/^[a-z0-9-]+$/.test(site_name)) {
    return c.json({ error: 'site_name required (lowercase alphanumeric + hyphens only)' }, 400);
  }

  const token = c.env.CF_API_TOKEN;
  const accountId = c.env.CF_ACCOUNT_ID;

  // 2. Generate unique names
  const prefix = `sp-${user.userId}-${site_name}`;
  const dbName = `${prefix}-db`;
  const shellName = `${prefix}-shell`;
  const dashboardName = `${prefix}-dash`;
  const accessToken = crypto.randomUUID();

  // Rollback tracking
  let databaseId: string | null = null;
  let shellCreated = false;
  let dashboardCreated = false;

  try {
    // 3. Create D1 database
    console.log(`[provision] Creating D1: ${dbName}`);
    databaseId = await createD1Database(dbName, token, accountId);

    // 4. Execute blog schema
    console.log(`[provision] Executing schema on ${databaseId}`);
    await executeD1SQL(databaseId, BLOG_SCHEMA_SQL, token, accountId);

    // 5. Create shell project + set binding BEFORE deploy
    console.log(`[provision] Creating shell project: ${shellName}`);
    await createPagesProject(shellName, token, accountId);
    shellCreated = true;
    await setPagesBinding(shellName, { d1DatabaseId: databaseId, d1DatabaseName: dbName }, token, accountId);

    // 6. Deploy shell
    const shellTemplate = await prepareShellTemplate();
    const shellUrl = await uploadToPages(shellName, shellTemplate, token, accountId);
    console.log(`[provision] Shell deployed: ${shellUrl}`);

    // 7. Create dashboard project + set binding BEFORE deploy
    console.log(`[provision] Creating dashboard project: ${dashboardName}`);
    await createPagesProject(dashboardName, token, accountId);
    dashboardCreated = true;
    await setPagesBinding(
      dashboardName,
      {
        d1DatabaseId: databaseId,
        d1DatabaseName: dbName,
        envVars: { ACCESS_TOKEN: accessToken },
      },
      token,
      accountId
    );

    // 8. Deploy dashboard
    const dashTemplate = await prepareDashboardTemplate();
    const dashUrl = await uploadToPages(dashboardName, dashTemplate, token, accountId);
    console.log(`[provision] Dashboard deployed: ${dashUrl}`);

    // 9. Production URLs
    const shellProdUrl = `https://${shellName}.pages.dev`;
    const dashProdUrl = `https://${dashboardName}.pages.dev`;

    // 10. Save to sites table
    await c.env.DB.prepare(
      `INSERT INTO sites (user_id, site_name, d1_database_id, shell_project_name, shell_url, 
       dashboard_project_name, dashboard_url, access_token, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`
    ).bind(
      user.userId, site_name, databaseId,
      shellName, shellProdUrl,
      dashboardName, dashProdUrl,
      accessToken
    ).run();

    return c.json({
      shell_url: shellProdUrl,
      dashboard_url: dashProdUrl,
      access_token: accessToken,
    });
  } catch (error) {
    console.error('[provision] Error:', error);

    // Rollback: best-effort cleanup
    try {
      if (dashboardCreated) await deletePagesProject(dashboardName, token, accountId);
      if (shellCreated) await deletePagesProject(shellName, token, accountId);
      if (databaseId) await deleteD1Database(databaseId, token, accountId);
    } catch (rollbackErr) {
      console.error('[provision] Rollback error:', rollbackErr);
    }

    return c.json({ error: 'Provisioning failed', detail: String(error) }, 500);
  }
});

app.get('/api/sites', async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const denied = rejectIfNotWhitelisted(c, user.email);
  if (denied) return denied;

  const { results } = await c.env.DB.prepare(
    `SELECT id, site_name, shell_url, dashboard_url, access_token, status, created_at,
            shell_project_name, custom_domain
     FROM sites WHERE user_id = ? ORDER BY created_at DESC`
  ).bind(user.userId).all();

  return c.json({ sites: results });
});

app.get('/api/sites/:id', async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const denied = rejectIfNotWhitelisted(c, user.email);
  if (denied) return denied;

  const site = await c.env.DB.prepare(
    'SELECT * FROM sites WHERE id = ? AND user_id = ?'
  ).bind(c.req.param('id'), user.userId).first();

  if (!site) return c.json({ error: 'Site not found' }, 404);
  return c.json({ site });
});

// Custom domain → yalnızca shell (blog) Pages projesi
app.post('/api/sites/:id/domain', async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const denied = rejectIfNotWhitelisted(c, user.email);
  if (denied) return denied;

  const siteId = c.req.param('id');
  let body: { domain?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const domain = normalizeCustomDomain(body.domain);
  if (!domain) {
    return c.json({ error: 'Invalid domain. Use a hostname like blog.example.com (no https://).' }, 400);
  }

  const site = await c.env.DB.prepare(
    'SELECT id, user_id, shell_project_name, custom_domain FROM sites WHERE id = ? AND user_id = ?'
  )
    .bind(siteId, user.userId)
    .first();

  if (!site) return c.json({ error: 'Site not found' }, 404);

  const shellProject = site.shell_project_name as string | null;
  if (!shellProject) {
    return c.json({ error: 'Site has no shell project' }, 400);
  }

  const existing = site.custom_domain as string | null;
  if (existing && existing === domain) {
    const cnameTarget = `${shellProject}.pages.dev`;
    return c.json({
      success: true,
      domain,
      cname_target: cnameTarget,
      status: 'unchanged',
      message: 'Domain already connected.',
    });
  }
  if (existing) {
    return c.json(
      { error: 'Another domain is already connected. Remove it first, then add a new one.' },
      409
    );
  }

  const token = c.env.CF_API_TOKEN;
  const accountId = c.env.CF_ACCOUNT_ID;

  try {
    const cfResult = await addPagesCustomDomain(shellProject, domain, token, accountId);
    await c.env.DB.prepare('UPDATE sites SET custom_domain = ? WHERE id = ? AND user_id = ?')
      .bind(domain, siteId, user.userId)
      .run();

    const cnameTarget = `${shellProject}.pages.dev`;
    return c.json({
      success: true,
      domain: cfResult.name || domain,
      cname_target: cnameTarget,
      status: cfResult.status || 'pending',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[domain] add failed:', msg);
    return c.json(
      { error: 'Cloudflare could not add this domain.', detail: msg.replace(/^\[[^\]]+\]\s*/, '') },
      502
    );
  }
});

app.delete('/api/sites/:id/domain', async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const denied = rejectIfNotWhitelisted(c, user.email);
  if (denied) return denied;

  const siteId = c.req.param('id');

  const site = await c.env.DB.prepare(
    'SELECT id, user_id, shell_project_name, custom_domain FROM sites WHERE id = ? AND user_id = ?'
  )
    .bind(siteId, user.userId)
    .first();

  if (!site) return c.json({ error: 'Site not found' }, 404);

  const shellProject = site.shell_project_name as string | null;
  const customDomain = site.custom_domain as string | null;

  if (!customDomain) {
    return c.json({ error: 'No custom domain connected' }, 400);
  }
  if (!shellProject) {
    return c.json({ error: 'Site has no shell project' }, 400);
  }

  const token = c.env.CF_API_TOKEN;
  const accountId = c.env.CF_ACCOUNT_ID;

  try {
    await removePagesCustomDomain(shellProject, customDomain, token, accountId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[domain] remove CF failed:', msg);
    return c.json(
      { error: 'Cloudflare could not remove this domain.', detail: msg.replace(/^\[[^\]]+\]\s*/, '') },
      502
    );
  }

  await c.env.DB.prepare('UPDATE sites SET custom_domain = NULL WHERE id = ? AND user_id = ?')
    .bind(siteId, user.userId)
    .run();

  return c.json({ success: true });
});

/** Remove site row + best-effort Cloudflare cleanup (dashboard Pages, shell Pages, tenant D1). */
app.delete('/api/sites/:id', async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const denied = rejectIfNotWhitelisted(c, user.email);
  if (denied) return denied;

  const siteId = c.req.param('id');

  const site = await c.env.DB.prepare('SELECT * FROM sites WHERE id = ? AND user_id = ?')
    .bind(siteId, user.userId)
    .first();

  if (!site) return c.json({ error: 'Site not found' }, 404);

  const token = c.env.CF_API_TOKEN;
  const accountId = c.env.CF_ACCOUNT_ID;
  const warnings: string[] = [];

  const shellProject = site.shell_project_name as string | null | undefined;
  const dashProject = site.dashboard_project_name as string | null | undefined;
  const d1Id = site.d1_database_id as string | null | undefined;
  const customDomain = site.custom_domain as string | null | undefined;

  if (token && accountId) {
    if (customDomain && shellProject) {
      try {
        await removePagesCustomDomain(shellProject, customDomain, token, accountId);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        warnings.push(`Custom domain: ${msg.replace(/^\[[^\]]+\]\s*/, '')}`);
      }
    }
    if (dashProject) {
      try {
        await deletePagesProject(dashProject, token, accountId);
      } catch (e) {
        warnings.push(`Dashboard Pages: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    if (shellProject) {
      try {
        await deletePagesProject(shellProject, token, accountId);
      } catch (e) {
        warnings.push(`Shell Pages: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    if (d1Id) {
      try {
        await deleteD1Database(d1Id, token, accountId);
      } catch (e) {
        warnings.push(`Tenant D1: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } else {
    warnings.push('CF_API_TOKEN or CF_ACCOUNT_ID missing; only the provisioning record was removed.');
  }

  await c.env.DB.prepare('DELETE FROM sites WHERE id = ? AND user_id = ?')
    .bind(siteId, user.userId)
    .run();

  return c.json({ success: true, warnings: warnings.length ? warnings : undefined });
});

// ========================================
// TEST ENDPOINTS — yalnız ALLOW_TEST_ROUTES=true iken (yerel: .dev.vars)
// ========================================

app.use('/test/*', async (c, next) => {
  if (!testRoutesAllowed(c.env)) {
    return c.body(null, 404);
  }
  await next();
});

app.get('/test/d1', async (c) => {
  try {
    const name = `test-db-${Date.now()}`;
    const dbId = await createD1Database(name, c.env.CF_API_TOKEN, c.env.CF_ACCOUNT_ID);
    return c.json({ success: true, name, databaseId: dbId });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get('/test/sql', async (c) => {
  const dbId = c.req.query('db');
  if (!dbId) return c.json({ error: 'db query param required' }, 400);

  try {
    await executeD1SQL(
      dbId,
      'CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, value TEXT)',
      c.env.CF_API_TOKEN,
      c.env.CF_ACCOUNT_ID
    );
    return c.json({ success: true, message: 'SQL executed' });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get('/test/pages', async (c) => {
  try {
    const name = `test-pages-${Date.now()}`;
    await createPagesProject(name, c.env.CF_API_TOKEN, c.env.CF_ACCOUNT_ID);
    return c.json({ success: true, projectName: name });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get('/test/prepare-shell', async (c) => {
  try {
    const t = await prepareShellTemplate();
    return c.json({
      success: true,
      fileCount: t.files.length,
      hasWorkerBundle: !!t.workerBundle,
      hasRoutes: !!t.routesJson,
      files: t.files.map(f => ({ path: f.path, size: f.size, contentType: f.contentType })),
    });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get('/test/deploy-shell', async (c) => {
  const dbId = c.req.query('db');
  try {
    const projectName = `test-shell-${Date.now()}`;
    await createPagesProject(projectName, c.env.CF_API_TOKEN, c.env.CF_ACCOUNT_ID);
    if (dbId) {
      await setPagesBinding(projectName, { d1DatabaseId: dbId, d1DatabaseName: 'test-db' }, c.env.CF_API_TOKEN, c.env.CF_ACCOUNT_ID);
    }
    const template = await prepareShellTemplate();
    const url = await uploadToPages(projectName, template, c.env.CF_API_TOKEN, c.env.CF_ACCOUNT_ID);
    return c.json({ success: true, projectName, url });
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500);
  }
});

export default app;
