import type { Context } from 'hono';

/** Cloudflare Workers Rate Limit binding (wrangler `ratelimits`) */
export type CfRateLimiter = {
  limit(input: { key: string }): Promise<{ success: boolean }>;
};

/** CF edge’de müşteri IP; yoksa X-Forwarded-For veya `unknown` (NAT uyarısı: paylaşımlı IP). */
export function rateLimitClientKey(c: Context): string {
  const cfIp = c.req.header('cf-connecting-ip') || c.req.header('CF-Connecting-IP');
  if (cfIp?.trim()) return cfIp.trim();
  const xff = c.req.header('x-forwarded-for') || c.req.header('X-Forwarded-For');
  const first = xff?.split(',')[0]?.trim();
  if (first) return first;
  return 'unknown';
}

export async function tryRateLimit(
  limiter: CfRateLimiter | undefined,
  key: string
): Promise<boolean> {
  if (limiter == null) return true;
  const { success } = await limiter.limit({ key });
  return success;
}
