import type { PreparedFile, PreparedTemplate } from './templates';

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

type CFResponse<T = any> = {
  success: boolean;
  result: T;
  errors: Array<{ message: string }>;
};

function authHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function cfFetch<T>(url: string, init: RequestInit, label: string): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json() as CFResponse<T>;

  if (!data.success) {
    const msg = data.errors?.map(e => e.message).join(', ') || 'Unknown CF API error';
    throw new Error(`[${label}] ${msg}`);
  }

  return data.result;
}

// D1 database oluştur, database_id döner
export async function createD1Database(
  name: string,
  token: string,
  accountId: string
): Promise<string> {
  const result = await cfFetch<{ uuid: string }>(
    `${CF_API_BASE}/accounts/${accountId}/d1/database`,
    { method: 'POST', headers: authHeaders(token), body: JSON.stringify({ name }) },
    'createD1Database'
  );
  return result.uuid;
}

// D1 database'ine SQL çalıştır
export async function executeD1SQL(
  databaseId: string,
  sql: string,
  token: string,
  accountId: string
): Promise<void> {
  await cfFetch(
    `${CF_API_BASE}/accounts/${accountId}/d1/database/${databaseId}/query`,
    { method: 'POST', headers: authHeaders(token), body: JSON.stringify({ sql }) },
    'executeD1SQL'
  );
}

// Pages'e dosya upload et ve deployment oluştur. Deployment URL döner.
// CF Pages Direct Upload flow: upload-token → bucket upload → upsert-hashes → create deployment
export async function uploadToPages(
  projectName: string,
  template: PreparedTemplate,
  token: string,
  accountId: string
): Promise<string> {
  const { files, workerBundle, routesJson } = template;

  // 1. Get upload JWT
  const { jwt: uploadJwt } = await cfFetch<{ jwt: string }>(
    `${CF_API_BASE}/accounts/${accountId}/pages/projects/${projectName}/upload-token`,
    { method: 'GET', headers: authHeaders(token) },
    'getUploadToken'
  );

  // 2. Upload static files in buckets
  const bucket = files.map(f => ({
    key: f.hash,
    value: f.base64,
    metadata: { contentType: f.contentType },
    base64: true,
  }));

  if (bucket.length > 0) {
    const uploadRes = await fetch(
      `${CF_API_BASE}/pages/assets/upload`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${uploadJwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(bucket),
      }
    );
    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      throw new Error(`[uploadBucket] ${uploadRes.status}: ${text}`);
    }
  }

  // 3. Upsert hashes
  const hashes = files.map(f => f.hash);
  if (hashes.length > 0) {
    const upsertRes = await fetch(
      `${CF_API_BASE}/pages/assets/upsert-hashes`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${uploadJwt}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashes }),
      }
    );
    if (!upsertRes.ok) {
      const text = await upsertRes.text();
      throw new Error(`[upsertHashes] ${upsertRes.status}: ${text}`);
    }
  }

  // 4. Create deployment with manifest + worker bundle
  const manifest: Record<string, string> = {};
  for (const f of files) {
    manifest[f.path] = f.hash;
  }

  const formData = new FormData();
  formData.append('manifest', JSON.stringify(manifest));
  formData.append('branch', 'main');

  if (workerBundle) {
    const bundleText = atob(workerBundle);
    formData.append('_worker.js', new Blob([bundleText], { type: 'application/javascript' }), '_worker.js');
  }

  if (routesJson) {
    formData.append('_routes.json', new Blob([routesJson], { type: 'application/json' }), '_routes.json');
  }

  const deployRes = await fetch(
    `${CF_API_BASE}/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    }
  );
  const deployData = await deployRes.json() as CFResponse<{ url: string }>;
  if (!deployData.success) {
    const msg = deployData.errors?.map(e => e.message).join(', ') || 'Deploy failed';
    throw new Error(`[createDeployment] ${msg}`);
  }

  return deployData.result.url;
}

// Pages projesi oluştur
export async function createPagesProject(
  name: string,
  token: string,
  accountId: string
): Promise<void> {
  await cfFetch(
    `${CF_API_BASE}/accounts/${accountId}/pages/projects`,
    {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ name, production_branch: 'main' }),
    },
    'createPagesProject'
  );
}

// Pages projesine D1 binding ve env vars set et
export async function setPagesBinding(
  projectName: string,
  config: {
    d1DatabaseId: string;
    d1DatabaseName: string;
    envVars?: Record<string, string>;
  },
  token: string,
  accountId: string
): Promise<void> {
  const d1Bindings: Record<string, { id: string }> = {
    DB: { id: config.d1DatabaseId },
  };

  const envVars: Record<string, { type: string; value: string }> = {};
  if (config.envVars) {
    for (const [k, v] of Object.entries(config.envVars)) {
      envVars[k] = { type: 'plain_text', value: v };
    }
  }

  const body: any = {
    deployment_configs: {
      production: {
        d1_databases: d1Bindings,
        ...(Object.keys(envVars).length > 0 && { environment_variables: envVars }),
      },
    },
  };

  await cfFetch(
    `${CF_API_BASE}/accounts/${accountId}/pages/projects/${projectName}`,
    { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(body) },
    'setPagesBinding'
  );
}

// Rollback helpers
export async function deletePagesProject(
  name: string,
  token: string,
  accountId: string
): Promise<void> {
  await fetch(
    `${CF_API_BASE}/accounts/${accountId}/pages/projects/${name}`,
    { method: 'DELETE', headers: authHeaders(token) }
  );
}

export async function deleteD1Database(
  databaseId: string,
  token: string,
  accountId: string
): Promise<void> {
  await fetch(
    `${CF_API_BASE}/accounts/${accountId}/d1/database/${databaseId}`,
    { method: 'DELETE', headers: authHeaders(token) }
  );
}
