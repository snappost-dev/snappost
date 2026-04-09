import { tenantMediaPrefix } from './media-keys';

/** Public URL path için key kodlama (slash güvenli) */
export function encodeKeyForUrlPath(key: string): string {
  const bytes = new TextEncoder().encode(key);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeKeyFromUrlPath(enc: string): string | null {
  try {
    let b64 = enc.replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (b64.length % 4)) % 4;
    b64 += '='.repeat(pad);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/** buildMediaObjectKey çıktısı ile uyumlu: u123/s45/uuid-name.ext */
const PUBLIC_KEY_RE = /^u([0-9]+)\/s([0-9]+)\/([a-z0-9][a-z0-9._-]*)$/i;

export function isValidPublicMediaKey(key: string): boolean {
  if (key.length > 900) return false;
  return PUBLIC_KEY_RE.test(key);
}

/** Provision’daki dashboard hostname: sp-{userId}-{site_name}-dash.pages.dev */
export function isTenantDashboardOrigin(origin: string): boolean {
  return /^https:\/\/sp-[0-9]+-[a-z0-9-]+-dash\.pages\.dev$/i.test(origin.trim());
}

/** Site silinince R2 prefix temizliği (best-effort) */
export async function deleteR2ObjectsWithPrefix(
  bucket: R2Bucket,
  prefix: string
): Promise<void> {
  let cursor: string | undefined;
  for (;;) {
    const listed = await bucket.list({ prefix, cursor, limit: 100 });
    for (const obj of listed.objects) {
      await bucket.delete(obj.key);
    }
    if (!listed.truncated) break;
    cursor = listed.cursor;
  }
}
