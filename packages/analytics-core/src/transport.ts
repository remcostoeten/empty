import { AnalyticsConfig, AnalyticsEvent, BatcherOptions } from "./types";

interface PendingQueue {
  timer: ReturnType<typeof setInterval> | null;
  events: AnalyticsEvent[];
}

export class EventBatcher {
  private queue: PendingQueue = { timer: null, events: [] };
  private readonly flushInterval: number;
  private readonly maxBatchSize: number;
  private readonly maxAttempts: number;
  private readonly retryDelayMs: number;
  private readonly onDeliveryError?: (error: unknown, events: AnalyticsEvent[]) => void;

  constructor(
    private readonly config: AnalyticsConfig,
    options?: BatcherOptions
  ) {
    this.flushInterval = options?.flushInterval ?? 5000;
    this.maxBatchSize = options?.maxBatchSize ?? 20;
    this.maxAttempts = Math.max(1, options?.maxAttempts ?? 2);
    this.retryDelayMs = options?.retryDelayMs ?? 750;
    this.onDeliveryError = options?.onDeliveryError;
    if (typeof window !== "undefined") {
      this.start();
    }
  }

  push(event: AnalyticsEvent) {
    this.queue.events.push(event);
    if (this.queue.events.length >= this.maxBatchSize) {
      this.flush();
    }
  }

  flush = async () => {
    if (this.queue.events.length === 0) return;
    const payload = [...this.queue.events];
    this.queue.events = [];

    try {
      await this.sendWithRetry(payload);
    } catch (error) {
      if (this.onDeliveryError) {
        this.onDeliveryError(error, payload);
      }
      console.error("Failed to deliver analytics batch", error);
      // best effort only; events are dropped on failure by design
    }
  };

  private async sendWithRetry(events: AnalyticsEvent[]) {
    let attempt = 0;
    let lastError: unknown;

    while (attempt < this.maxAttempts) {
      try {
        await sendPayload(this.config, events);
        return;
      } catch (error) {
        lastError = error;
        attempt += 1;
        if (attempt >= this.maxAttempts) break;
        await delay(this.retryDelayMs * attempt);
      }
    }

    throw lastError ?? new Error("Unknown analytics delivery failure");
  }

  private start() {
    if (this.queue.timer) return;
    this.queue.timer = setInterval(this.flush, this.flushInterval);
  }

  stop() {
    if (this.queue.timer) {
      clearInterval(this.queue.timer);
    }
    this.queue.timer = null;
  }
}

async function sendPayload(config: AnalyticsConfig, events: AnalyticsEvent[]) {
  if (config.mode === "remote") {
    return postRemote(config, events);
  }

  if (config.mode === "local") {
    return config.action(events);
  }

  await Promise.all([
    postRemote(config.remote, events),
    config.local.action(events),
  ]);
}

async function postRemote(
  destination: { endpoint: string; projectId: string; environment?: string },
  events: AnalyticsEvent[]
) {
  const body = JSON.stringify({
    projectId: destination.projectId,
    environment: destination.environment,
    events,
  });

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    const success = navigator.sendBeacon(destination.endpoint, blob);
    if (success) return;
  }

  await fetch(destination.endpoint, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
