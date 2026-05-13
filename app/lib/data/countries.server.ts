import fs from "node:fs";
import path from "node:path";
import { countries as RAW_COUNTRIES } from "countries-list";

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

function codeToFlag(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return "";
  const A = 0x1f1e6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(A + code.charCodeAt(0) - a, A + code.charCodeAt(1) - a);
}

let cachedCountries: CountryOption[] | null = null;

export function getAllCountries(): CountryOption[] {
  if (cachedCountries) return cachedCountries;

  const list: CountryOption[] = [];
  for (const [code, info] of Object.entries(RAW_COUNTRIES)) {
    const dial = Array.isArray(info.phone) && info.phone.length > 0 ? `+${info.phone[0]}` : "";
    list.push({
      code,
      name: info.name,
      dial,
      flag: codeToFlag(code),
    });
  }
  list.sort((a, b) => a.name.localeCompare(b.name));
  cachedCountries = list;
  return list;
}

const zonesCache = new Map<string, ZoneOption[]>();

export function getZonesForCountry(countryCode: string): ZoneOption[] {
  const code = countryCode.toUpperCase();
  if (zonesCache.has(code)) return zonesCache.get(code)!;

  try {
    const filePath = path.join(
      process.cwd(),
      "node_modules",
      "iso3166-2-db",
      "regions",
      code,
      "dispute",
      "UN",
      "en.json"
    );
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw) as Array<{ name: string; iso: string }>;
    const zones = data
      .map((z) => ({ code: z.iso, name: z.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    zonesCache.set(code, zones);
    return zones;
  } catch {
    zonesCache.set(code, []);
    return [];
  }
}
