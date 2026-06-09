// Redis is optional — if env vars are missing, falls back to in-process memory cache.
// In-process cache helps during local dev and warm serverless instances.
// For production with multiple users, configure Upstash Redis (free tier available).

// ── In-process memory fallback ────────────────────────────────────────────────
const mem = new Map<string, { data: unknown; exp: number }>();

function memGet<T>(key: string): T | null {
  const e = mem.get(key);
  if (!e || Date.now() > e.exp) { mem.delete(key); return null; }
  return e.data as T;
}

function memSet<T>(key: string, data: T, ttlSec: number): void {
  mem.set(key, { data, exp: Date.now() + ttlSec * 1000 });
  // Evict expired entries when map grows large
  if (mem.size > 500) {
    const now = Date.now();
    for (const [k, v] of mem.entries()) {
      if (now > v.exp) mem.delete(k);
    }
  }
}

// ── Redis client (Upstash) ────────────────────────────────────────────────────
let redis: import("@upstash/redis").Redis | null = null;

function getRedis() {
  if (redis) return redis;
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url.startsWith("your_") || token.startsWith("your_")) return null;
  const { Redis } = require("@upstash/redis");
  redis = new Redis({ url, token });
  return redis;
}

// ── Public API ────────────────────────────────────────────────────────────────
export const CACHE_TTL = 60;

export async function getCached<T>(key: string): Promise<T | null> {
  // 1. Try Redis first (shared across all users / instances)
  try {
    const client = getRedis();
    if (client) {
      const val = await client.get<T>(key);
      if (val !== null && val !== undefined) return val;
    }
  } catch { /* Redis unavailable — fall through */ }

  // 2. Fallback: in-process memory (helps dev + warm instances)
  return memGet<T>(key);
}

export async function setCached<T>(key: string, value: T, ttl = CACHE_TTL): Promise<void> {
  // Always write to memory cache as the immediate fallback
  memSet(key, value, ttl);

  // Also write to Redis when available
  try {
    const client = getRedis();
    if (client) await client.set(key, value, { ex: ttl });
  } catch { /* non-fatal */ }
}
