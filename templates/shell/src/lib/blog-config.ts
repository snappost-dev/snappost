import type { D1Database } from '@cloudflare/workers-types';

export async function loadBlogConfig(db: D1Database): Promise<Record<string, string>> {
  const configResult = await db.prepare('SELECT key, value FROM config').all();
  return Object.fromEntries(
    (configResult.results as { key: string; value: string }[]).map((r) => [r.key, r.value])
  );
}
