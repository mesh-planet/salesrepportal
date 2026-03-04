/**
 * Format a numeric amount string with currency code.
 */
export function formatMoney(amount: string, currencyCode: string = "USD"): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return `${currencyCode} 0.00`;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(num);
}

/**
 * Format an ISO date string to a human-readable format.
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format an address object into a single-line string.
 */
export function formatAddress(address: {
  address1?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
  zip?: string | null;
} | null): string {
  if (!address) return "No address";
  const parts = [
    address.address1,
    address.city,
    address.province,
    address.zip,
    address.country,
  ].filter(Boolean);
  return parts.join(", ") || "No address";
}
