/** B2 — yükleme kuralları (SVG script riski: kapalı) */

export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const DEFAULT_MAX_MB = 5;
const MIN_MB = 0.5;
const MAX_MB_CAP = 20;

export function maxUploadBytes(envMb: string | undefined): number {
  if (envMb == null || envMb.trim() === '') {
    return Math.floor(DEFAULT_MAX_MB * 1024 * 1024);
  }
  const n = parseFloat(envMb.trim());
  if (!Number.isFinite(n)) {
    return Math.floor(DEFAULT_MAX_MB * 1024 * 1024);
  }
  const clamped = Math.min(Math.max(n, MIN_MB), MAX_MB_CAP);
  return Math.floor(clamped * 1024 * 1024);
}
