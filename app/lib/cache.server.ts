import NodeCache from "node-cache";

const CACHE_TTL = {
  STAFF_ASSIGNMENTS: 2 * 60,  // 2 min during dev (raise to 15 min for production)
  CATALOG_PUBLICATION: 60 * 60,
  PRODUCT_DATA: 30,  // 30s during dev (raise to 5 min for production)
  PRICE_LIST: 30,  // 30s during dev (raise to 1 hour for production)
  COMPANY_CONTACTS: 30 * 60,
};

const cache = new NodeCache({ checkperiod: 120 });

export function getCached<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function setCached<T>(key: string, value: T, ttlKey: keyof typeof CACHE_TTL): void {
  cache.set(key, value, CACHE_TTL[ttlKey]);
}

export function setCachedWithTTL<T>(key: string, value: T, ttlSeconds: number): void {
  cache.set(key, value, ttlSeconds);
}

export function invalidatePattern(pattern: string): void {
  const keys = cache.keys();
  for (const key of keys) {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  }
}

export function invalidateAll(): void {
  cache.flushAll();
}

export { CACHE_TTL };
