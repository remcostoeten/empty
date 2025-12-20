"use server";

import { createLocalWriter, extractGeo, AnalyticsEvent } from "@remcostuten/analytics";
import { headers } from "next/headers";
import { db, pageViewsTable } from "@/db/client";

const persist = createLocalWriter({
  projectId: "demo-next-app",
  environment: process.env.NODE_ENV ?? "development",
  table: pageViewsTable,
  db,
  geo: async () => extractGeo(headers()),
});

export async function persistPageViews(events: AnalyticsEvent[]) {
  await persist(events);
}
