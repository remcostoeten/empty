# Self Hosted Analytics (Vercel-style)

This repository contains a reusable, privacy-first analytics stack inspired by `@vercel/analytics`. It targets modern Next.js (15+) and React 19+, offering centralized ingestion, local project storage, or hybrid writes.

## Packages

- **`@remcostuten/analytics`** – The plug-and-play entry point. Re-exports the client `<Analytics />` component plus server-side helpers (Drizzle schemas, geo/fingerprint utilities, Server Action creator, and remote ingest helper).
- **`@remcostuten/analytics-core`** – Client-only instrumentation and the `<Analytics />` component. Collects page views, deduplicates navigations, batches events, and ships them via `sendBeacon`/`fetch` without blocking rendering.
- **`@remcostuten/analytics-adapters`** – Storage helpers for Drizzle ORM, portable schemas for SQLite/PostgreSQL, geo/fingerprint utilities, and remote ingestion helpers.
- **`apps/analytics-service`** – Minimal ingestion service using Hono and Drizzle to accept batched events for multiple projects.
- **`apps/analytics-demo`** – A Next.js demo wired in **local** mode that persists analytics to SQLite and renders live data with a Vercel-style dashboard.

## Quickstart

### Install the single package

```bash
bun add @remcostuten/analytics drizzle-orm
```

### Minimal usage (remote mode)

```tsx
// app/layout.tsx
import { Analytics } from "@remcostuten/analytics";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics mode="remote" endpoint="https://analytics.example.com/ingest" projectId="my-app" />
      </body>
    </html>
  );
}
```

### Local project storage (Server Actions + Drizzle)

```ts
// app/actions/analytics.ts
"use server";
import { createLocalWriter, pageViewsPg } from "@remcostuten/analytics";
import { db } from "../db";

export const persistAnalytics = createLocalWriter({
  projectId: "my-app",
  environment: process.env.NODE_ENV,
  table: pageViewsPg,
  db,
});
```

```tsx
// app/layout.tsx
import { Analytics } from "@remcostuten/analytics";
import { persistAnalytics } from "./actions/analytics";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics mode="local" action={persistAnalytics} />
      </body>
    </html>
  );
}
```

### Hybrid mode (write local + remote)

```tsx
<Analytics
  mode="hybrid"
  local={{ action: persistAnalytics }}
  remote={{ endpoint: "https://analytics.example.com/ingest", projectId: "my-app" }}
/>
```

### Example Next.js app (local storage)

The `apps/analytics-demo` project is an App Router sample with analytics wired in **local** mode. It uses a
Server Action to write page views into `data/analytics.db` via Drizzle and the packaged SQLite schema.

```bash
# from repo root
cp .env.example .env
bun install
bun dev

# navigate to http://localhost:3000 and click through the routes
# inspect the captured events
sqlite3 apps/analytics-demo/data/analytics.db 'select project_id, pathname, created_at from page_views limit 5;'
```

Key pieces inside the demo app:

- Fingerprints are derived server-side from request headers and a project secret, then handed to the client collector to keep IP hashes off the client bundle.【F:apps/analytics-demo/src/app/layout.tsx†L5-L30】
- `<Analytics />` runs on the client with `mode="local"`, batches events, deduplicates SPA navigations via history hooks, and invokes the Server Action that writes into SQLite.【F:apps/analytics-demo/src/components/ClientAnalytics.tsx†L1-L18】【F:packages/analytics-core/src/Analytics.tsx†L1-L113】
- The Drizzle client points at a workspace-local SQLite file using the shared `pageViews` schema.【F:apps/analytics-demo/src/db/client.ts†L1-L8】
- The demo includes a Vercel-style analytics dashboard, member list, and docs pages to click around and see local page-view writes. Geo is derived server-side and rendered on the analytics page; when running on localhost without platform geo headers, locations will appear as "Unknown" until deployed behind a provider that forwards geo info.【F:apps/analytics-demo/src/app/analytics/page.tsx†L1-L119】

## Privacy model

- No cookies or persistent identifiers are used.
- A short-lived `__analytics_visit_id` in `localStorage` deduplicates navigations.
- Fingerprints are opaque and project-scoped. Generate them server-side so IPs are hashed immediately and never reach the bundle. The client accepts an injected fingerprint or falls back to a transient, non-reversible token.
- Collected client fields: pathname, referrer, language, timezone, screen bucket, navigation type, visit id.
- Geo enrichment is server-side only (platform headers or coarse IP lookup) and never stores raw IPs.

### Server-side fingerprinting and geo helpers

- Use `deriveFingerprint` to hash platform headers with a rotating window and project-scoped secret, then pass the value to `<Analytics fingerprint={...} />`.
- Use `extractGeo` to map common platform headers into coarse `country/region/city` values for local writes or ingestion enrichment.
- Use `createGeoResolver` to round-robin across free IP lookup providers (ipapi, ipinfo, ipwhois) with rotating API keys to avoid rate limits. The resolver uses the IP only for lookup and never stores it.

```tsx
import { headers } from "next/headers";
import { deriveFingerprint, extractGeo, Analytics } from "@remcostuten/analytics";

const fingerprint = deriveFingerprint({
  headers: headers(),
  projectId: "my-app",
  secret: process.env.ANALYTICS_FINGERPRINT_SECRET!,
});

const geo = extractGeo(headers());

return (
  <Analytics
    mode="hybrid"
    fingerprint={fingerprint}
    local={{ action: persistAnalytics }}
    remote={{ endpoint: "https://analytics.example.com/ingest", projectId: "my-app" }}
    batching={{ maxAttempts: 3, retryDelayMs: 1000 }}
  />
);
```

## Storage modes

- **Remote**: Sends batched events to the ingestion service using `sendBeacon` with `fetch` fallback.
- **Local**: Invokes a provided Server Action (Drizzle-powered) inside the host project.
- **Hybrid**: Executes both local and remote flows, enabling local ownership with centralized aggregation.

The client batcher retries failed deliveries with configurable backoff and flushes on `visibilitychange`/`pagehide` to reduce drop rates when tabs close.【F:packages/analytics-core/src/transport.ts†L1-L92】【F:packages/analytics-core/src/Analytics.tsx†L51-L87】

## Ingestion service

The example service in `apps/analytics-service` uses SQLite via Drizzle. It validates payloads, scopes data per `projectId`, enriches geo, and will synthesize a fingerprint server-side when the client did not provide one (using `ANALYTICS_FINGERPRINT_SECRET`). It can be deployed as a standalone collector behind any platform that forwards standard geo headers.【F:apps/analytics-service/src/server.ts†L1-L66】

Optional geo lookup and rate-limit smoothing:

- Provide comma-separated `IPINFO_TOKENS` (free tier supported) to rotate through multiple ipinfo tokens.
- The service also includes ipapi and ipwho.is as keyless fallbacks and rotates through configured providers every few requests (`GEO_ROTATE_EVERY`, default 6).
- Raw IPs are only used transiently for lookup; the resolver returns coarse geo and discards the address.

### Environment template

Copy `.env.example` to `.env` to provide demo defaults:

```
ANALYTICS_SECRET=demo-secret
ANALYTICS_FINGERPRINT_SECRET=demo-secret
IPINFO_TOKENS=
PORT=8788
```

Run locally after installing dependencies:

```bash
bun install
bun run --filter analytics-service build
bun run --filter analytics-service start
```

## Feature status at a glance

### What exists for 1.0

- Client-only `<Analytics />` component for the Next.js App Router that batches page views and navigation events with `sendBeacon`/`fetch`, retry/backoff, tab-close flushing, and SPA-aware history listeners to track route changes accurately.【F:packages/analytics-core/src/Analytics.tsx†L1-L113】【F:packages/analytics-core/src/transport.ts†L1-L92】
- Privacy-preserving visit grouping via short-lived localStorage keys plus lightweight, project-scoped fingerprints that avoid IP storage on the client.【F:packages/analytics-core/src/visit.ts†L1-L25】【F:packages/analytics-core/src/fingerprint.ts†L1-L33】
- Configurable delivery modes: remote ingestion, direct local writes via server actions, or hybrid for dual writes.【F:packages/analytics-core/src/types.ts†L1-L47】【F:packages/analytics-core/src/transport.ts†L41-L72】
- Drizzle-ready schemas for SQLite/PostgreSQL with recommended indexes, and helpers to create server actions or remote ingest calls.【F:packages/analytics-adapters/src/schema.ts†L1-L70】【F:packages/analytics-adapters/src/local.ts†L1-L41】【F:packages/analytics-adapters/src/remote.ts†L1-L20】
- Server-side helpers for rotating fingerprints and geo extraction to keep PII out of the client bundle or database.【F:packages/analytics-adapters/src/fingerprint.ts†L1-L52】【F:packages/analytics-adapters/src/geo.ts†L1-L37】
- Example Hono-based ingestion service wiring that scopes data per project, enriches geo, and can synthesize fingerprints server-side.【F:apps/analytics-service/src/server.ts†L68-L102】
- Single npm entry point (`@remcostuten/analytics`) that mirrors Vercel Analytics semantics: import the component, pass props for remote/local/hybrid storage, and start collecting without extra wiring.

### Nice-to-haves beyond 1.0

- Aggregated rollups and precomputed uniques/page counters for faster dashboards.
- Observability hooks and optional logging for dropped batches and ingestion errors.
- Benchmarks and size budgets to keep the client bundle lean with retries enabled.
