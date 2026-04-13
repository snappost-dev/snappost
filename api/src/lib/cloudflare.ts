import type { PreparedFile, PreparedTemplate } from './templates';

const CF_API_BASE = 'https://api.cloudflare.com/client/v4';

/** Shell/dashboard Astro şablonları ile aynı (wrangler.toml). */
const PAGES_COMPATIBILITY_DATE = '2024-01-01';

/** Wrangler pages/upload.ts ile aynı üst sınırlar. */
const MAX_BUCKET_SIZE = 40 * 1024 * 1024;
const MAX_BUCKET_FILE_COUNT = 2000;
const MAX_UPLOAD_ATTEMPTS = 5;

type CFResponse<T = any> = {
  success: boolean;
  result: T;
  errors: Array<{ message: string }>;
};

const CF_USER_AGENT = 'snappost-provision/1.0';

/** JSON gövdeli istekler için. GET kullanırken Content-Type göndermeyin. */
function authHeadersJson(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': CF_USER_AGENT,
  };
}

function authHeadersBearer(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, 'User-Agent': CF_USER_AGENT };
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

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function inlineStaticAssetsIntoWorkerBundle(
  workerBundleBase64: string,
  files: PreparedFile[]
): string {
  let code = atob(workerBundleBase64);
  for (const f of files) {
    const dataUrl = `data:${f.contentType};base64,${f.base64}`;
    code = code.split(f.path).join(dataUrl);
  }
  return btoa(code);
}

/** Upload JWT ile Pages asset API; yanıt her zaman CF v4 JSON olarak işlenir. */
async function pagesAssetsPostJson<T>(
  uploadJwt: string,
  resourcePath: string,
  body: unknown,
  label: string
): Promise<T> {
  const res = await fetch(`${CF_API_BASE}${resourcePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${uploadJwt}`,
      'Content-Type': 'application/json',
      'User-Agent': CF_USER_AGENT,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: CFResponse<T>;
  try {
    data = JSON.parse(text) as CFResponse<T>;
  } catch {
    const err = new Error(`[${label}] ${res.status}: ${text.slice(0, 800)}`) as Error & { httpStatus?: number };
    err.httpStatus = res.status;
    throw err;
  }
  if (!data.success) {
    const msg = data.errors?.map((e) => e.message).join(', ') || text.slice(0, 500);
    const err = new Error(`[${label}] ${res.status}: ${msg}`) as Error & { httpStatus?: number };
    err.httpStatus = res.status;
    throw err;
  }
  return data.result;
}

function buildUploadBuckets(filesToUpload: PreparedFile[]): PreparedFile[][] {
  if (filesToUpload.length === 0) return [];
  const totalSize = filesToUpload.reduce((a, f) => a + f.size, 0);
  if (totalSize <= MAX_BUCKET_SIZE && filesToUpload.length <= MAX_BUCKET_FILE_COUNT) {
    return [filesToUpload];
  }
  const buckets: { files: PreparedFile[]; remaining: number }[] = Array.from({ length: 3 }, () => ({
    files: [],
    remaining: MAX_BUCKET_SIZE,
  }));
  const sorted = [...filesToUpload].sort((a, b) => b.size - a.size);
  let offset = 0;
  for (const file of sorted) {
    let inserted = false;
    for (let i = 0; i < buckets.length; i++) {
      const b = buckets[(i + offset) % buckets.length];
      if (b.remaining >= file.size && b.files.length < MAX_BUCKET_FILE_COUNT) {
        b.files.push(file);
        b.remaining -= file.size;
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      buckets.push({
        files: [file],
        remaining: MAX_BUCKET_SIZE - file.size,
      });
    }
    offset++;
  }
  return buckets.map((b) => b.files).filter((f) => f.length > 0);
}

async function uploadAssetBucketsWithRetry(
  getUploadJwt: () => Promise<string>,
  bucketFiles: PreparedFile[],
  label: string
): Promise<void> {
  const payload = bucketFiles.map((f) => ({
    key: f.hash,
    value: f.base64,
    metadata: { contentType: f.contentType },
    base64: true as const,
  }));
  let attempts = 0;
  let lastError: unknown = null;

  while (attempts < MAX_UPLOAD_ATTEMPTS) {
    try {
      const uploadJwt = await getUploadJwt();
      await pagesAssetsPostJson<unknown>(uploadJwt, '/pages/assets/upload', payload, label);
      return;
    } catch (e) {
      lastError = e;
      attempts++;
      const httpStatus = (e as { httpStatus?: number }).httpStatus;
      const isRetryable = httpStatus === 500 || httpStatus === 502 || httpStatus === 503 || httpStatus === 504;
      if (attempts >= MAX_UPLOAD_ATTEMPTS || !isRetryable) break;
      await sleep(Math.min(8000, 1000 * 2 ** (attempts - 1)));
    }
  }

  // Cloudflare API zaman zaman toplu payload'larda 1101 dönebiliyor; bucket'ı bölerek tek dosyaya kadar düş.
  if (bucketFiles.length > 1) {
    const mid = Math.ceil(bucketFiles.length / 2);
    const left = bucketFiles.slice(0, mid);
    const right = bucketFiles.slice(mid);
    const errMsg = lastError instanceof Error ? lastError.message : String(lastError);
    console.warn(
      `[uploadToPages] bucket split fallback label=${label} count=${bucketFiles.length} reason=${errMsg}`
    );
    await uploadAssetBucketsWithRetry(getUploadJwt, left, `${label}:L`);
    await uploadAssetBucketsWithRetry(getUploadJwt, right, `${label}:R`);
    return;
  }

  const single = bucketFiles[0];
  const errMsg = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `[${label}] single-file upload failed path=${single.path} size=${single.size} hash=${single.hash}: ${errMsg}`
  );
}

// D1 database oluştur, database_id döner
export async function createD1Database(
  name: string,
  token: string,
  accountId: string
): Promise<string> {
  const result = await cfFetch<{ uuid: string }>(
    `${CF_API_BASE}/accounts/${accountId}/d1/database`,
    { method: 'POST', headers: authHeadersJson(token), body: JSON.stringify({ name }) },
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
    { method: 'POST', headers: authHeadersJson(token), body: JSON.stringify({ sql }) },
    'executeD1SQL'
  );
}

// Pages'e dosya upload et ve deployment oluştur. Deployment URL döner.
// CF Pages Direct Upload: upload-token → asset upload → upsert-hashes → deployment
// check-missing ile eksik hash'ler upload edilir; upload backend arızasında opsiyonel inline fallback devrededir.
export async function uploadToPages(
  projectName: string,
  template: PreparedTemplate,
  token: string,
  accountId: string,
  options?: { inlineAssetFallback?: boolean }
): Promise<string> {
  const inlineAssetFallback = options?.inlineAssetFallback !== false;
  const { files, workerBundle, routesJson } = template;
  let effectiveWorkerBundle = workerBundle;
  let manifestFiles = files;
  const encName = encodeURIComponent(projectName);

  // 1. Get upload JWT
  let uploadJwt: string | null = null;
  const getUploadJwt = async (): Promise<string> => {
    if (uploadJwt) return uploadJwt;
    const tokenResp = await cfFetch<{ jwt: string }>(
      `${CF_API_BASE}/accounts/${accountId}/pages/projects/${encName}/upload-token`,
      { method: 'GET', headers: authHeadersBearer(token) },
      'getUploadToken'
    );
    uploadJwt = tokenResp.jwt;
    return uploadJwt;
  };
  await getUploadJwt();

  // 2. Eksik hash'leri bul, sadece eksikleri upload et.
  // check-missing hata verirse "eksik yok" varsayımıyla upload'ı atlayıp manifest'i koruyoruz.
  let missingHashes: string[] = [];
  try {
    const jwt = await getUploadJwt();
    missingHashes = await pagesAssetsPostJson<string[]>(
      jwt,
      '/pages/assets/check-missing',
      { hashes: files.map((f) => f.hash) },
      'checkMissing'
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[uploadToPages] check-missing failed; assuming cache hit and skipping upload: ${msg}`);
    missingHashes = [];
  }

  const filesToUpload =
    missingHashes.length > 0
      ? files.filter((f) => missingHashes.includes(f.hash))
      : [];

  try {
    const buckets = buildUploadBuckets(filesToUpload);
    console.log(
      `[uploadToPages] project=${projectName} bucketCount=${buckets.length} manifestFileCount=${files.length} missingCount=${filesToUpload.length}`,
      JSON.stringify(
        buckets.map((bucket, idx) => ({
          bucketIndex: idx + 1,
          postUrl: `${CF_API_BASE}/pages/assets/upload`,
          itemCount: bucket.length,
          approxBodyChars: bucket.reduce((s, f) => s + f.base64.length + 80, 0),
          items: bucket.map((f) => ({
            path: f.path,
            contentType: f.contentType,
            sizeBytes: f.size,
            hash: f.hash,
          })),
        }))
      )
    );

    for (let i = 0; i < buckets.length; i++) {
      await uploadAssetBucketsWithRetry(getUploadJwt, buckets[i], `uploadBucket:${i + 1}/${buckets.length}`);
    }

    // 3. Upsert hashes (tüm dosyalar — wrangler ile aynı)
    const hashes = files.map((f) => f.hash);
    if (hashes.length > 0) {
      try {
        const jwt = await getUploadJwt();
        await pagesAssetsPostJson<unknown>(
          jwt,
          '/pages/assets/upsert-hashes',
          { hashes },
          'upsertHashes'
        );
      } catch (e) {
        try {
          uploadJwt = null;
          const jwt = await getUploadJwt();
          await pagesAssetsPostJson<unknown>(jwt, '/pages/assets/upsert-hashes', { hashes }, 'upsertHashes');
        } catch (e2) {
          const msg = e2 instanceof Error ? e2.message : String(e2);
          console.warn('[uploadToPages] upsert-hashes failed (deploy yine denenecek):', msg);
        }
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (inlineAssetFallback && effectiveWorkerBundle && files.length > 0) {
      console.warn(
        `[uploadToPages] asset upload unavailable; inlining ${files.length} assets into worker bundle for project=${projectName}: ${msg}`
      );
      effectiveWorkerBundle = inlineStaticAssetsIntoWorkerBundle(effectiveWorkerBundle, files);
      manifestFiles = [];
    } else {
      throw new Error(
        `[uploadAssets] ${msg}${inlineAssetFallback ? '' : ' (inline fallback disabled)'}`
      );
    }
  }

  // 4. Create deployment with manifest + worker bundle
  const manifest: Record<string, string> = {};
  for (const f of manifestFiles) {
    manifest[f.path] = f.hash;
  }

  const formData = new FormData();
  formData.append('manifest', JSON.stringify(manifest));
  formData.append('branch', 'main');

  if (effectiveWorkerBundle) {
    const bundleText = atob(effectiveWorkerBundle);
    formData.append('_worker.js', new Blob([bundleText], { type: 'application/javascript' }), '_worker.js');
  }

  if (routesJson) {
    formData.append('_routes.json', new Blob([routesJson], { type: 'application/json' }), '_routes.json');
  }

  const deployRes = await fetch(
    `${CF_API_BASE}/accounts/${accountId}/pages/projects/${encName}/deployments`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': CF_USER_AGENT },
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
      headers: authHeadersJson(token),
      body: JSON.stringify({
        name,
        production_branch: 'main',
        deployment_configs: {
          production: { compatibility_date: PAGES_COMPATIBILITY_DATE },
          preview: { compatibility_date: PAGES_COMPATIBILITY_DATE },
        },
      }),
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
        compatibility_date: PAGES_COMPATIBILITY_DATE,
        d1_databases: d1Bindings,
        ...(Object.keys(envVars).length > 0 && {
          // Pages API dokümanında env_vars geçiyor; bazı eski payload'lar environment_variables da kabul ediyor.
          // İkisini de göndererek kiracı dashboard runtime env'lerinin eksik kalmasını önlüyoruz.
          env_vars: envVars,
          environment_variables: envVars,
        }),
      },
      preview: {
        compatibility_date: PAGES_COMPATIBILITY_DATE,
      },
    },
  };

  await cfFetch(
    `${CF_API_BASE}/accounts/${accountId}/pages/projects/${encodeURIComponent(projectName)}`,
    { method: 'PATCH', headers: authHeadersJson(token), body: JSON.stringify(body) },
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
    `${CF_API_BASE}/accounts/${accountId}/pages/projects/${encodeURIComponent(name)}`,
    { method: 'DELETE', headers: authHeadersBearer(token) }
  );
}

export async function deleteD1Database(
  databaseId: string,
  token: string,
  accountId: string
): Promise<void> {
  await cfFetch<unknown>(
    `${CF_API_BASE}/accounts/${accountId}/d1/database/${databaseId}`,
    { method: 'DELETE', headers: authHeadersBearer(token) },
    'deleteD1Database'
  );
}

/**
 * Hesapta bu adda kayıtlı tüm D1 veritabanlarını siler.
 * `?name=` filtresi API'de güvenilir değil; tüm sayfaları dolaşıp `name` ile tam eşleşen UUID'leri siliyoruz.
 */
export async function deleteD1DatabasesByName(
  name: string,
  token: string,
  accountId: string
): Promise<void> {
  const perPage = 100;
  let page = 1;
  const deleted = new Set<string>();
  for (;;) {
    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
    });
    const rows = await cfFetch<Array<{ uuid?: string; name?: string }>>(
      `${CF_API_BASE}/accounts/${accountId}/d1/database?${params}`,
      { method: 'GET', headers: authHeadersBearer(token) },
      'listD1Databases'
    );
    for (const r of rows) {
      if (r.name === name && r.uuid && !deleted.has(r.uuid)) {
        deleted.add(r.uuid);
        await deleteD1Database(r.uuid, token, accountId);
      }
    }
    if (rows.length < perPage) break;
    page++;
  }
}

/** Cloudflare Pages — custom domain (blog / shell project only). */
export type PagesCustomDomainResult = {
  id: string;
  name: string;
  status: string;
};

export async function addPagesCustomDomain(
  projectName: string,
  domain: string,
  token: string,
  accountId: string
): Promise<PagesCustomDomainResult> {
  const result = await cfFetch<PagesCustomDomainResult>(
    `${CF_API_BASE}/accounts/${accountId}/pages/projects/${encodeURIComponent(projectName)}/domains`,
    {
      method: 'POST',
      headers: authHeadersJson(token),
      body: JSON.stringify({ name: domain }),
    },
    'addPagesCustomDomain'
  );
  return result;
}

export async function removePagesCustomDomain(
  projectName: string,
  domain: string,
  token: string,
  accountId: string
): Promise<void> {
  const url = `${CF_API_BASE}/accounts/${accountId}/pages/projects/${encodeURIComponent(projectName)}/domains/${encodeURIComponent(domain)}`;
  const res = await fetch(url, { method: 'DELETE', headers: authHeadersBearer(token) });
  const data = (await res.json()) as CFResponse<unknown>;
  if (!data.success) {
    const msg = data.errors?.map((e) => e.message).join(', ') || 'Unknown CF API error';
    throw new Error(`[removePagesCustomDomain] ${msg}`);
  }
}
