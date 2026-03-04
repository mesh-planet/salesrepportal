import type { PriceMap } from "../../types";

/**
 * Resolve the price for a variant: wholesale price from the price list,
 * or fall back to the variant's default price.
 */
export function resolvePrice(
  variantId: string,
  defaultPrice: string,
  priceMap: PriceMap | null
): string {
  if (!priceMap) return defaultPrice;
  return priceMap.get(variantId) ?? defaultPrice;
}

/**
 * Convert a PriceMap (Map) to a plain object for JSON serialization.
 */
export function priceMapToObject(priceMap: PriceMap): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of priceMap) {
    obj[key] = value;
  }
  return obj;
}

/**
 * Convert a plain object back to a PriceMap.
 */
export function objectToPriceMap(obj: Record<string, string>): PriceMap {
  return new Map(Object.entries(obj));
}
