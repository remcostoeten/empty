export interface GeoHeaders {
  country?: string;
  region?: string;
  city?: string;
}

function headerValue(headers: Headers | Record<string, string | undefined>, key: string) {
  if (headers instanceof Headers) return headers.get(key) ?? undefined;
  const match = Object.entries(headers).find(
    ([candidate]) => candidate.toLowerCase() === key.toLowerCase()
  );
  return match?.[1];
}

/**
 * Maps common platform headers (Vercel, Cloudflare, Fly) into a coarse geo object.
 */
export function extractGeo(
  headers: Headers | Record<string, string | undefined>
): GeoHeaders {
  const country =
    headerValue(headers, "x-vercel-ip-country") ??
    headerValue(headers, "x-country") ??
    headerValue(headers, "cf-ipcountry") ??
    headerValue(headers, "fly-region") ??
    undefined;

  const region =
    headerValue(headers, "x-vercel-ip-country-region") ??
    headerValue(headers, "x-region") ??
    headerValue(headers, "x-fly-region") ??
    headerValue(headers, "x-vercel-proxied-for") ??
    undefined;

  const city =
    headerValue(headers, "x-vercel-ip-city") ??
    headerValue(headers, "x-city") ??
    undefined;

  return {
    country: country?.toUpperCase(),
    region: region ?? undefined,
    city: city ?? undefined,
  };
}
