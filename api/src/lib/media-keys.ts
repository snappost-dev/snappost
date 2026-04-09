/**
 * Tek R2 bucket; kiracı izolasyonu yalnızca object key prefix ile (B1).
 * Biçim: u{userId}/s{siteId}/{uuid}-{safeDosyaAdı}
 * userId = provisioning users.id, siteId = provisioning sites.id (kararlı; site_name değişse bile id sabit).
 */

const SAFE_SEGMENT = /[^a-zA-Z0-9._-]/g;

/** R2 object key max ~1024 UTF-8 byte; güvenli marj için dosya adı kısaltılır */
const MAX_ORIGINAL_NAME_LEN = 180;

export function tenantMediaPrefix(userId: number, siteId: number): string {
  return `u${userId}/s${siteId}/`;
}

export function sanitizeFileSegment(name: string): string {
  const base = name.split('/').pop()?.trim() || 'file';
  const cleaned = base.replace(SAFE_SEGMENT, '_').slice(0, MAX_ORIGINAL_NAME_LEN);
  return cleaned || 'file';
}

/** B2 upload bu key ile put edecek; objectId genelde crypto.randomUUID() */
export function buildMediaObjectKey(
  userId: number,
  siteId: number,
  objectId: string,
  originalFileName: string
): string {
  const safe = sanitizeFileSegment(originalFileName);
  const id = objectId.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64) || 'obj';
  return `${tenantMediaPrefix(userId, siteId)}${id}-${safe}`;
}

export const MEDIA_KEY_PREFIX_DOC =
  'u{numericUserId}/s{numericSiteId}/{objectId}-{sanitizedFileName}';
