"use client";

import { Analytics } from "@selfhosted/analytics-core";
import { AnalyticsEvent } from "@selfhosted/analytics-core";

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
