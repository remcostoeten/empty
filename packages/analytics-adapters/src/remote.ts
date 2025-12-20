import { AnalyticsEvent } from "@remcostuten/analytics-core";

export interface RemoteIngestOptions {
  endpoint: string;
  projectId: string;
  environment?: string;
  fetcher?: typeof fetch;
}

export async function ingestBatch(events: AnalyticsEvent[], options: RemoteIngestOptions) {
  const body = JSON.stringify({
    projectId: options.projectId,
    environment: options.environment,
    events,
  });

  const fn = options.fetcher ?? fetch;
  const response = await fn(options.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!response.ok) {
    throw new Error(`Remote ingest failed with status ${response.status}`);
  }
}
