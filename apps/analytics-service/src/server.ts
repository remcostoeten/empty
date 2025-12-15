import { serve } from "@hono/node-server";
import { Hono } from "hono";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { pageViewsSqlite } from "@selfhosted/analytics-adapters";
import { nanoid } from "nanoid";

const database = new Database("analytics.db");
const db = drizzle(database);

const app = new Hono();

app.get("/", (c) =>
  c.json({ status: "ok", message: "Self hosted analytics ingestion online" })
);

app.post("/ingest", async (c) => {
  const payload = await c.req.json();
  const { projectId, environment, events } = payload ?? {};

  if (!projectId || !Array.isArray(events)) {
    return c.json({ error: "invalid payload" }, 400);
  }

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
    fingerprint: event.fingerprint,
    navigationType: event.navigationType,
    country: event.country,
    region: event.region,
    city: event.city,
    createdAt: new Date(event.timestamp ?? Date.now()),
  }));

  await db.insert(pageViewsSqlite).values(rows);

  return c.json({ inserted: rows.length });
});

const port = Number(process.env.PORT ?? 8788);
console.log(`Analytics ingestion listening on :${port}`);
serve({ fetch: app.fetch, port });
