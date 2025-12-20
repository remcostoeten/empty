import { serve } from "@hono/node-server";
import { Hono } from "hono";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import {
  deriveFingerprint,
  extractGeo,
  createGeoResolver,
  pageViewsSqlite,
} from "@remcostuten/analytics-adapters";
import { nanoid } from "nanoid";

const database = new Database("analytics.db");
const db = drizzle(database);

const app = new Hono();
const fingerprintSecret = process.env.ANALYTICS_FINGERPRINT_SECRET ?? "change-me";
const ipinfoTokens = process.env.IPINFO_TOKENS?.split(",").map((item) => item.trim()).filter(Boolean);
const geoResolver = createGeoResolver({
  providers: [
    { type: "ipapi" },
    { type: "ipwhois" },
    ...(ipinfoTokens?.length ? [{ type: "ipinfo", apiKeys: ipinfoTokens }] : []),
  ],
  rotateEvery: Number(process.env.GEO_ROTATE_EVERY ?? 6),
});

function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for") ?? headers.get("forwarded");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return headers.get("x-real-ip") ?? undefined;
}

app.get("/", (c) =>
  c.json({ status: "ok", message: "Self hosted analytics ingestion online" })
);

app.post("/ingest", async (c) => {
  const payload = await c.req.json();
  const { projectId, environment, events } = payload ?? {};

  if (!projectId || !Array.isArray(events)) {
    return c.json({ error: "invalid payload" }, 400);
  }

  const geoHeaders = extractGeo(c.req.raw.headers);
  const ip = clientIp(c.req.raw.headers);
  const lookedUpGeo = await geoResolver(ip);
  const geo = {
    country: geoHeaders.country ?? lookedUpGeo?.country,
    region: geoHeaders.region ?? lookedUpGeo?.region,
    city: geoHeaders.city ?? lookedUpGeo?.city,
  };

  const rows = events.map((event: any) => ({
    id: nanoid(12),
    projectId,
    environment,
    pathname: event.pathname,
    referrer: event.referrer,
    locale: event.locale,
    timezone: event.timezone,
    screenBucket: event.screenBucket,
    visitId: event.visitId,
    fingerprint:
      event.fingerprint ??
      deriveFingerprint({
        headers: c.req.raw.headers,
        projectId,
        secret: fingerprintSecret,
      }),
    navigationType: event.navigationType,
    country: event.country ?? geo.country,
    region: event.region ?? geo.region,
    city: event.city ?? geo.city,
    createdAt: new Date(event.timestamp ?? Date.now()),
  }));

  await db.insert(pageViewsSqlite).values(rows);

  return c.json({ inserted: rows.length });
});

const port = Number(process.env.PORT ?? 8788);
console.log(`Analytics ingestion listening on :${port}`);
serve({ fetch: app.fetch, port });
