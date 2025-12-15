# Self Hosted Analytics (Vercel-style)

This repository contains a reusable, privacy-first analytics stack inspired by `@vercel/analytics`. It is designed for modern Next.js (15+) and React 19+ projects, with opt-in centralized ingestion, local project storage, or hybrid writes.

## Packages

- **`packages/analytics-core`** – Client-only instrumentation and the `<Analytics />` component. Collects page views, deduplicates navigations, batches events, and ships them via `sendBeacon`/`fetch` without blocking rendering.
- **`packages/analytics-adapters`** – Storage helpers for Drizzle ORM, portable schemas for SQLite/PostgreSQL, and remote ingestion utilities.
- **`apps/analytics-service`** – Minimal ingestion service using Hono and Drizzle to accept batched events for multiple projects.

## Quickstart

### What’s in this branch
- **Analytics libraries** (`packages/analytics-core`, `packages/analytics-adapters`) with the client `<Analytics />` component, fingerprint/geo helpers, batching transport, and Drizzle-ready schemas.
- **Central ingestion service** (`apps/analytics-service`) that accepts batched events, enriches geo, and can derive fingerprints server-side.
- **Demo Next.js app** (`apps/analytics-demo`) wired to the libraries in **local** mode to showcase how analytics are collected and written to a SQLite database.

### What you need to provide
- A database connection for the mode you choose: SQLite/Turso/Neon/etc. for local writes, or Postgres/SQLite for the ingestion service. The demo already points to a workspace-local SQLite file.
- Run the packaged Drizzle schema (`pageViews`) in your target database; the demo and service both import it for migrations/inserts.
- Optional free geo API tokens (e.g., ipinfo) if your hosting platform does not supply geo headers and you want IP-based coarse geo enrichment.

Install the packages from a registry or via workspace linking:

```bash
npm install @selfhosted/analytics-core @selfhosted/analytics-adapters
```

### Centralized analytics (remote mode)

```tsx
import { Analytics } from "@selfhosted/analytics-core";

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

### Local project storage (server actions + Drizzle)

```ts
// app/actions/analytics.ts
"use server";
import { createLocalWriter, pageViewsPg } from "@selfhosted/analytics-adapters";
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
import { Analytics } from "@selfhosted/analytics-core";
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

The `apps/analytics-demo` project is a minimal App Router sample with the analytics packages wired in **local** mode. It uses a
Server Action to write page views into `data/analytics.db` via Drizzle and the packaged SQLite schema.

```bash
# from repo root
npm install
npm run dev --workspace analytics-demo

# navigate to http://localhost:3000 and click through the routes
# inspect the captured events
sqlite3 apps/analytics-demo/data/analytics.db 'select project_id, pathname, created_at from page_views limit 5;'
```

Key pieces inside the demo app:

- Fingerprints are derived server-side from request headers and a project secret, then handed to the client collector to keep
  IP hashes off the client bundle.【F:apps/analytics-demo/src/app/layout.tsx†L1-L46】
- `<Analytics />` runs on the client with `mode="local"`, batching events and invoking the Server Action that writes into
  SQLite.【F:apps/analytics-demo/src/components/ClientAnalytics.tsx†L1-L19】【F:apps/analytics-demo/src/app/actions/persist-analytics.ts†L1-L16】
- The Drizzle client points at a workspace-local SQLite file using the shared `pageViews` schema.【F:apps/analytics-demo/src/db/client.ts†L1-L8】
- The demo includes two visually distinct pages inspired by Vercel analytics (an overview dashboard and a members list) so you can click around and see local page-view writes while previewing UI styles. Geo is derived server-side and rendered on the analytics page; when running on localhost without platform geo headers, locations will appear as "Unknown" until deployed behind a provider that forwards geo info.【F:apps/analytics-demo/src/app/page.tsx†L1-L69】【F:apps/analytics-demo/src/app/analytics/page.tsx†L1-L119】【F:apps/analytics-demo/src/app/members/page.tsx†L1-L48】

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
import { deriveFingerprint, extractGeo } from "@selfhosted/analytics-adapters";
import { Analytics } from "@selfhosted/analytics-core";

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

The client batcher retries failed deliveries with configurable backoff and flushes on `visibilitychange`/`pagehide` to reduce drop rates when tabs close.【F:packages/analytics-core/src/transport.ts†L1-L92】【F:packages/analytics-core/src/Analytics.tsx†L38-L82】

## Ingestion service

The example service in `apps/analytics-service` uses SQLite via Drizzle. It validates payloads, scopes data per `projectId`, enriches geo from platform headers, and will synthesize a fingerprint server-side when the client did not provide one (using `ANALYTICS_FINGERPRINT_SECRET`). It can be deployed as a standalone collector behind any platform that forwards standard geo headers.【F:apps/analytics-service/src/server.ts†L1-L53】

Optional geo lookup and rate-limit smoothing:

- Provide comma-separated `IPINFO_TOKENS` (free tier supported) to rotate through multiple ipinfo tokens.
- The service also includes ipapi and ipwho.is as keyless fallbacks and rotates through configured providers every few requests (`GEO_ROTATE_EVERY`, default 6).
- Raw IPs are only used transiently for lookup; the resolver returns coarse geo and discards the address.

Run locally after installing dependencies:

```bash
npm install
npm run --workspace apps/analytics-service build
npm run --workspace apps/analytics-service start
```

## Non-goals

- No dashboards or visualization
- No session replay or heatmaps
- No user profiling or cross-site tracking
- No reliance on cookies

## Feature status at a glance

### What exists today

- Client-only `<Analytics />` component for Next.js app router that batches page views and navigation events with `sendBeacon`/`fetch` plus retry/backoff and tab-close flushing.【F:packages/analytics-core/src/Analytics.tsx†L1-L82】【F:packages/analytics-core/src/transport.ts†L1-L92】
- Privacy-preserving visit grouping via short-lived localStorage keys plus lightweight, project-scoped fingerprints that avoid IP storage on the client.【F:packages/analytics-core/src/visit.ts†L1-L25】【F:packages/analytics-core/src/fingerprint.ts†L1-L33】
- Configurable delivery modes: remote ingestion, direct local writes via server actions, or hybrid for dual writes.【F:packages/analytics-core/src/types.ts†L1-L47】【F:packages/analytics-core/src/transport.ts†L41-L72】
- Drizzle-ready schemas for SQLite/PostgreSQL with recommended indexes, and helpers to create server actions or remote ingest calls.【F:packages/analytics-adapters/src/schema.ts†L1-L70】【F:packages/analytics-adapters/src/local.ts†L1-L41】【F:packages/analytics-adapters/src/remote.ts†L1-L20】
- Server-side helpers for rotating fingerprints and geo extraction to keep PII out of the client bundle or database.【F:packages/analytics-adapters/src/fingerprint.ts†L1-L52】【F:packages/analytics-adapters/src/geo.ts†L1-L37】
- Example Hono-based ingestion service wiring that scopes data per project, enriches geo, and can synthesize fingerprints server-side.【F:apps/analytics-service/src/server.ts†L1-L53】

### Near-term additions we could ship

- Navigation event enrichment (first/returning visit markers, navigation performance buckets) while keeping payloads anonymous.
- Aggregates and rollups (unique visitors, page counters) plus migrations for both SQLite and Postgres.
- Observability hooks and optional logging for dropped batches and ingestion errors.
- Benchmarks and size budgets to keep the client bundle lean with retries enabled.

### Expected end-state (vision)

- Drop-in npm packages that work out of the box on Next.js 15+ with zero manual wiring beyond `<Analytics />`.
- First-class privacy defaults: opaque rotating fingerprints generated server-side, coarse geo enrichment, no IP or cookie storage.
- Pluggable storage layer where projects choose remote, local, or hybrid, and multi-project ingestion remains isolated by `projectId`.
- Clear examples for Neon/Postgres, Turso/SQLite, and edge-friendly deployments so teams can self-host anywhere.

### Suggested roadmap

1. **Hardening & privacy**: add server-side fingerprint helper + rotation guidance; document IP hashing flow; include geo header mapping utilities.
2. **Reliability**: introduce retry/backoff for remote sends, ensure flush on visibility changes, and add tests around batching/deduping.
3. **Schema & indexing**: ship migration snippets and recommended indexes for `page_views`, plus aggregates for unique visitors/page counts.
4. **DX & examples**: provide Next.js example app (remote/local/hybrid), Neon and Turso setup guides, and TypeScript types for server actions.
5. **Observability hooks**: expose optional logging/callbacks for dropped batches and ingestion errors without increasing bundle size.
