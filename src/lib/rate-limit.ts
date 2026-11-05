/**
 * Soft in-memory rate limit for spam / brute-force UX.
 *
 * On Vercel serverless each isolate has its own Map, so this is not a hard
 * distributed limit. It still reduces burst abuse on a warm instance.
 * Upgrade to KV/Upstash if stricter cross-instance limits are required.
 */
const buckets = new Map<string, number[]>();

export function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}
