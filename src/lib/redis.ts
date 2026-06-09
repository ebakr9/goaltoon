// Redis is optional — if env vars are missing, all cache ops are no-ops
// This lets the app run locally without Upstash configured

let redis: import("@upstash/redis").Redis | null = null;

function getClient() {
  if (redis) return redis;
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url.startsWith("your_") || token.startsWith("your_")) {
    return null;
  }
  // Lazy import so the module doesn't throw at load time when env vars are missing
  const { Redis } = require("@upstash/redis");
  redis = new Redis({ url, token });
  return redis;
}

export const CACHE_TTL = 60;

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const client = getClient();
    if (!client) return null;
    return await client.get<T>(key);
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttl = CACHE_TTL): Promise<void> {
  try {
    const client = getClient();
    if (!client) return;
    await client.set(key, value, { ex: ttl });
  } catch {
    // non-fatal
  }
}
