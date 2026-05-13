import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { requireAuth } from "../lib/auth.server";
import { getZonesForCountry } from "../lib/data/countries.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth(request);

  const country = (params.country ?? "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) {
    return json({ zones: [] });
  }

  const zones = getZonesForCountry(country);
  return json({ zones }, { headers: { "Cache-Control": "private, max-age=3600" } });
};
