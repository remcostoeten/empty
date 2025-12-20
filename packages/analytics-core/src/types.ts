export type AnalyticsMode = "remote" | "local" | "hybrid";

export interface RemoteDestination {
  endpoint: string;
  projectId: string;
  environment?: string;
}

export interface LocalDestination {
  /**
   * Server action that persists analytics events inside the host project.
   * The action should be declared with the `"use server"` directive in a Next.js app.
   */
  action: (events: AnalyticsEvent[]) => Promise<void> | void;
}

export interface HybridDestination {
  local: LocalDestination;
  remote: RemoteDestination;
}

export type AnalyticsConfig =
  | ({ mode: "remote" } & RemoteDestination)
  | ({ mode: "local" } & LocalDestination)
  | ({ mode: "hybrid" } & HybridDestination);

export interface AnalyticsEvent {
  type: "page_view" | "navigation";
  pathname: string;
  referrer?: string;
  locale?: string;
  timezone?: string;
  screenBucket?: string;
  visitId: string;
  fingerprint?: string;
  navigationType?: NavigationType;
  timestamp: number;
}

export type NavigationType = "initial" | "route_change" | "visibility_flush";

export interface BatcherOptions {
  flushInterval?: number;
  maxBatchSize?: number;
  /**
   * Maximum attempts to deliver a batch before dropping it. Defaults to 2 (1 retry).
   */
  maxAttempts?: number;
  /**
   * Base delay in milliseconds between retries. Defaults to 750ms.
   */
  retryDelayMs?: number;
  /**
   * Optional observer for delivery failures. Useful for host logging/telemetry.
   */
  onDeliveryError?: (error: unknown, events: AnalyticsEvent[]) => void;
}
