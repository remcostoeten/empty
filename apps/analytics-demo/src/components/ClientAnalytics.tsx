"use client";

import { Analytics, AnalyticsEvent } from "@remcostuten/analytics";

interface ClientAnalyticsProps {
  action: (events: AnalyticsEvent[]) => Promise<void> | void;
  fingerprint?: string;
}

export function ClientAnalytics({ action, fingerprint }: ClientAnalyticsProps) {
  return (
    <Analytics
      mode="local"
      action={action}
      fingerprint={fingerprint}
      batching={{ flushInterval: 4000, maxBatchSize: 15 }}
    />
  );
}
