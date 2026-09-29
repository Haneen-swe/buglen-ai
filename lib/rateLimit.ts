/**
 * Minimal in-memory sliding-window rate limiter.
 * Good enough for a portfolio deployment; use a shared store (e.g. Upstash Redis)
 * if you run multiple instances.
 */
const hits = new Map<string, number[]>();

export function getRateLimit(): number {
  const n = Number.parseInt(process.env.RATE_LIMIT_PER_MINUTE ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 10;
}

export function checkRateLimit(
  key: string,
  limit: number = getRateLimit(),
  windowMs = 60_000,
  now: number = Date.now(),
): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow forever.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return true;
}

export function resetRateLimit(): void {
  hits.clear();
}
