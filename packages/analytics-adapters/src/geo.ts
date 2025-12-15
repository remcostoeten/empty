export interface GeoHeaders {
  country?: string;
  region?: string;
  city?: string;
}

export type GeoProvider =
  | {
      /**
       * ipapi.com JSON endpoint. Free tier is unauthenticated but rate limited.
       * You can also pass multiple API keys to rotate through paid/free quotas.
       */
      type: "ipapi";
      apiKeys?: string[];
      baseUrl?: string;
    }
  | {
      /**
       * ipinfo.io JSON endpoint. Supply multiple tokens to rotate and avoid rate caps.
       */
      type: "ipinfo";
      apiKeys: string[];
      baseUrl?: string;
    }
  | {
      /**
       * ipwho.is JSON endpoint. Free and keyless; kept as a fallback option.
       */
      type: "ipwhois";
      baseUrl?: string;
    };

export interface GeoResolverOptions {
  providers: GeoProvider[];
  /** Rotate to the next provider/key after this many successful lookups. */
  rotateEvery?: number;
  /** Abort slow lookups to keep ingestion fast. */
  timeoutMs?: number;
}

type ProviderConfig = { type: GeoProvider["type"]; key?: string; baseUrl?: string };

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

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchIpapi(ip: string, source: ProviderConfig, timeoutMs: number) {
  const url = `${source.baseUrl ?? "https://ipapi.co"}/${ip}/json/${
    source.key ? `?key=${source.key}` : ""
  }`;
  try {
    const res = await fetchWithTimeout(url, timeoutMs);
    if (!res.ok) return undefined;
    const json: any = await res.json();
    if (json?.error) return undefined;
    return {
      country: json.country?.toUpperCase(),
      region: json.region,
      city: json.city,
    } satisfies GeoHeaders;
  } catch (e) {
    return undefined;
  }
}

async function fetchIpinfo(ip: string, source: ProviderConfig, timeoutMs: number) {
  if (!source.key) return undefined;
  const url = `${source.baseUrl ?? "https://ipinfo.io"}/${ip}/json?token=${source.key}`;
  try {
    const res = await fetchWithTimeout(url, timeoutMs);
    if (!res.ok) return undefined;
    const json: any = await res.json();
    if (json?.error) return undefined;
    return {
      country: json.country?.toUpperCase(),
      region: json.region,
      city: json.city,
    } satisfies GeoHeaders;
  } catch (e) {
    return undefined;
  }
}

async function fetchIpwhois(ip: string, source: ProviderConfig, timeoutMs: number) {
  const url = `${source.baseUrl ?? "https://ipwho.is"}/${ip}`;
  try {
    const res = await fetchWithTimeout(url, timeoutMs);
    if (!res.ok) return undefined;
    const json: any = await res.json();
    if (json?.success === false) return undefined;
    return {
      country: json.country_code?.toUpperCase() ?? json.country,
      region: json.region,
      city: json.city,
    } satisfies GeoHeaders;
  } catch (e) {
    return undefined;
  }
}

async function resolveWithProvider(
  provider: ProviderConfig,
  ip: string,
  timeoutMs: number
): Promise<GeoHeaders | undefined> {
  switch (provider.type) {
    case "ipapi":
      return fetchIpapi(ip, provider, timeoutMs);
    case "ipinfo":
      return fetchIpinfo(ip, provider, timeoutMs);
    case "ipwhois":
      return fetchIpwhois(ip, provider, timeoutMs);
    default:
      return undefined;
  }
}

function flattenProviders(providers: GeoProvider[]): ProviderConfig[] {
  const configs: ProviderConfig[] = [];
  for (const provider of providers) {
    if (provider.type === "ipapi") {
      const keys = provider.apiKeys?.length ? provider.apiKeys : [undefined];
      configs.push(
        ...keys.map((key) => ({ type: provider.type, baseUrl: provider.baseUrl, key }))
      );
    } else if (provider.type === "ipinfo") {
      configs.push(
        ...provider.apiKeys.map((key) => ({
          type: provider.type,
          baseUrl: provider.baseUrl,
          key,
        }))
      );
    } else {
      configs.push({ type: provider.type, baseUrl: provider.baseUrl });
    }
  }
  return configs;
}

/**
 * Creates a round-robin geo resolver that rotates through multiple free providers/keys
 * to soften rate limits. IPs are only used for lookup and never stored.
 */
export function createGeoResolver(options: GeoResolverOptions) {
  const { providers, rotateEvery = 5, timeoutMs = 1500 } = options;
  const pool = flattenProviders(providers);
  let cursor = 0;
  let successesWithCurrent = 0;

  return async function resolve(ip?: string | null): Promise<GeoHeaders | undefined> {
    if (!ip || !pool.length) return undefined;
    const starting = cursor;

    for (let i = 0; i < pool.length; i++) {
      const provider = pool[(starting + i) % pool.length];
      const result = await resolveWithProvider(provider, ip, timeoutMs);
      if (result && (result.country || result.region || result.city)) {
        successesWithCurrent++;
        if (successesWithCurrent >= rotateEvery) {
          cursor = (starting + i + 1) % pool.length;
          successesWithCurrent = 0;
        }
        return result;
      }
    }

    // Advance the cursor when all providers fail to avoid sticking to a bad source.
    cursor = (cursor + 1) % Math.max(pool.length, 1);
    successesWithCurrent = 0;
    return undefined;
  };
}
