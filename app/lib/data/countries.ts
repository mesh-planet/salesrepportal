export interface CountryOption {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

export interface ZoneOption {
  code: string;
  name: string;
}

export function codeToFlag(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return "";
  const A = 0x1f1e6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(A + code.charCodeAt(0) - a, A + code.charCodeAt(1) - a);
}
