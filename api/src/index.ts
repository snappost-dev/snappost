import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import {
  createD1Database, executeD1SQL, createPagesProject, uploadToPages,
  setPagesBinding, deletePagesProject, deleteD1Database,
} from './lib/cloudflare';
import { prepareShellTemplate, prepareDashboardTemplate, BLOG_SCHEMA_SQL } from './lib/templates';

type Bindings = {
  DB: D1Database;
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

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

// CORS - snappost.dev'den gelen isteklere izin ver
app.use('/*', cors({
  origin: ['http://localhost:4321', 'http://localhost:4322', 'https://snappost.dev', 'https://snappost-landing.pages.dev'],
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

// ========================================
// PHASE 2 - STEP 1: AUTH ENDPOINTS
// ========================================

// Register new user
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    
    // Check if user exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (existing) {
      return c.json({ error: 'Email already registered' }, 409);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING id, email, created_at'
    ).bind(email, passwordHash).first();
    
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
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    
    // Get user
    const user = await c.env.DB.prepare(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash as string);
    
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

  const { results } = await c.env.DB.prepare(
    'SELECT id, site_name, shell_url, dashboard_url, access_token, status, created_at FROM sites WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(user.userId).all();

  return c.json({ sites: results });
});

app.get('/api/sites/:id', async (c) => {
  const user = await verifyAuth(c);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const site = await c.env.DB.prepare(
    'SELECT * FROM sites WHERE id = ? AND user_id = ?'
  ).bind(c.req.param('id'), user.userId).first();

  if (!site) return c.json({ error: 'Site not found' }, 404);
  return c.json({ site });
});

// ========================================
// TEST ENDPOINTS (development only)
// ========================================

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
