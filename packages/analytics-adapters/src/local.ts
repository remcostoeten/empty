"use server";
import { AnalyticsEvent } from "@selfhosted/analytics-core";
import { nanoid } from "nanoid";
import { InferModel, Table } from "drizzle-orm";

export interface LocalWriterConfig<TTable extends Table> {
  projectId: string;
  environment?: string;
  table: TTable;
  db: {
    insert: (table: TTable) => { values: (values: InferModel<TTable, "insert"> | InferModel<TTable, "insert">[]) => Promise<unknown> };
  };
  geo?: (event: AnalyticsEvent) => Promise<Partial<InferModel<TTable, "insert">>>;
}

/**
 * Creates a server action suitable for the analytics-core `local` mode.
 * It stores events directly in the host application's database using Drizzle.
 */
export function createLocalWriter<TTable extends Table>(config: LocalWriterConfig<TTable>) {
  return async function persist(events: AnalyticsEvent[]) {
    const rows = await Promise.all(
      events.map(async (event) => {
        const geo = config.geo ? await config.geo(event) : {};
        return {
          id: nanoid(12),
          projectId: config.projectId,
          environment: config.environment,
          pathname: event.pathname,
          referrer: event.referrer,
          locale: event.locale,
          timezone: event.timezone,
          screenBucket: event.screenBucket,
          visitId: event.visitId,
          fingerprint: event.fingerprint,
          navigationType: event.navigationType,
          createdAt: new Date(event.timestamp),
          ...geo,
        } as InferModel<TTable, "insert">;
      })
    );

    await config.db.insert(config.table).values(rows);
  };
}
