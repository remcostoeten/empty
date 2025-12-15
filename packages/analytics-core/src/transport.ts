import { AnalyticsConfig, AnalyticsEvent, BatcherOptions } from "./types";

interface PendingQueue {
  timer: ReturnType<typeof setInterval> | null;
  events: AnalyticsEvent[];
}

export class EventBatcher {
  private queue: PendingQueue = { timer: null, events: [] };
  private readonly flushInterval: number;
  private readonly maxBatchSize: number;

  constructor(
    private readonly config: AnalyticsConfig,
    options?: BatcherOptions
  ) {
    this.flushInterval = options?.flushInterval ?? 5000;
    this.maxBatchSize = options?.maxBatchSize ?? 20;
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
      await sendPayload(this.config, payload);
    } catch (error) {
      console.error("Failed to deliver analytics batch", error);
      // best effort only; events are dropped on failure by design
    }
  };

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

async function postRemote(destination: { endpoint: string; projectId: string }, events: AnalyticsEvent[]) {
  const body = JSON.stringify({ projectId: destination.projectId, events });

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
