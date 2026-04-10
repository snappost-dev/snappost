import type { D1Database } from '@cloudflare/workers-types';

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** null = whitelist kapalı (herkese açık) — yalnızca env */
export function parseAllowedEmailSetFromEnv(raw: string | undefined): Set<string> | null {
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

export function isEmailAllowed(email: string, allowed: Set<string> | null): boolean {
  if (allowed == null) return true;
  return allowed.has(normalizeEmail(email));
}

/** Provisioning D1 `allowed_emails` tablosu (satır yoksa boş küme) */
export async function loadAllowedEmailsFromD1(db: D1Database): Promise<Set<string>> {
  const { results } = await db.prepare('SELECT email FROM allowed_emails').all();
  const set = new Set<string>();
  for (const r of results as { email?: string }[]) {
    const n = normalizeEmail(String(r.email ?? ''));
    if (n && EMAIL_FORMAT.test(n)) set.add(n);
  }
  return set;
}

/**
 * Etkili davet listesi: env ∪ D1 birleşimi.
 * İkisi de boş → null (kısıt yok). Yalnız biri dolu → o küme. İkisi dolu → birleşim.
 */
export async function resolveEffectiveAllowedEmailSet(
  env: { ALLOWED_EMAILS?: string },
  db: D1Database
): Promise<Set<string> | null> {
  const fromEnv = parseAllowedEmailSetFromEnv(env.ALLOWED_EMAILS);
  let fromD1: Set<string>;
  try {
    fromD1 = await loadAllowedEmailsFromD1(db);
  } catch (e) {
    console.warn('[whitelist] allowed_emails okunamadı:', e);
    fromD1 = new Set();
  }

  if (fromD1.size === 0 && fromEnv === null) return null;
  if (fromEnv === null) return fromD1.size > 0 ? fromD1 : null;
  if (fromD1.size === 0) return fromEnv;
  const merged = new Set(fromEnv);
  for (const e of fromD1) merged.add(e);
  return merged;
}
