"use server";

import { createLocalWriter } from "@selfhosted/analytics-adapters";
import { AnalyticsEvent } from "@selfhosted/analytics-core";
import { db, pageViewsTable } from "@/db/client";

const persist = createLocalWriter({
  projectId: "demo-next-app",
  environment: process.env.NODE_ENV ?? "development",
  table: pageViewsTable,
  db,
});

export async function persistPageViews(events: AnalyticsEvent[]) {
  await persist(events);
}
