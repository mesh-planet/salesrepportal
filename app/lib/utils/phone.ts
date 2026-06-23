/**
 * Combine a dial code (e.g. "+1") with a user-entered phone number into a
 * clean E.164 string that Shopify will accept.
 *
 * - Strips spaces, dashes, parens and any other formatting.
 * - If the number already starts with "+" (e.g. a phone pre-filled from an
 *   existing customer or address, which is already in E.164), it is treated
 *   as already-prefixed and the dial code is IGNORED — this prevents the
 *   "+1+15551234567" double-prefix bug that made Shopify reject the phone.
 * - Returns "" for an empty number so callers can send `undefined`.
 */
export function toE164(dialCode: string, rawNumber: string): string {
  const num = (rawNumber ?? "").trim();
  if (!num) return "";

  if (num.startsWith("+")) {
    const digits = num.slice(1).replace(/\D/g, "");
    return digits ? `+${digits}` : "";
  }

  const national = num.replace(/\D/g, "");
  if (!national) return "";

  const cc = (dialCode ?? "").replace(/\D/g, "");
  return cc ? `+${cc}${national}` : `+${national}`;
}
