# Self Hosted Analytics (Vercel-style)

This repository contains a reusable, privacy-first analytics stack inspired by `@vercel/analytics`. It is designed for modern Next.js (15+) and React 19+ projects, with opt-in centralized ingestion, local project storage, or hybrid writes.

## Packages

- **`packages/analytics-core`** – Client-only instrumentation and the `<Analytics />` component. Collects page views, deduplicates navigations, batches events, and ships them via `sendBeacon`/`fetch` without blocking rendering.
- **`packages/analytics-adapters`** – Storage helpers for Drizzle ORM, portable schemas for SQLite/PostgreSQL, and remote ingestion utilities.
- **`apps/analytics-service`** – Minimal ingestion service using Hono and Drizzle to accept batched events for multiple projects.

## Quickstart

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

## Privacy model

- No cookies or persistent identifiers are used.
- A short-lived `__analytics_visit_id` in `localStorage` deduplicates navigations.
- Fingerprints are opaque and project-scoped; hash inputs should be generated server-side to avoid exposing IPs. The client accepts an injected fingerprint or falls back to a transient, non-reversible token.
- Collected client fields: pathname, referrer, language, timezone, screen bucket, navigation type, visit id.
- Geo enrichment is server-side only (platform headers or coarse IP lookup) and never stores raw IPs.

## Storage modes

- **Remote**: Sends batched events to the ingestion service using `sendBeacon` with `fetch` fallback.
- **Local**: Invokes a provided Server Action (Drizzle-powered) inside the host project.
- **Hybrid**: Executes both local and remote flows, enabling local ownership with centralized aggregation.

## Ingestion service

The example service in `apps/analytics-service` uses SQLite via Drizzle. It validates payloads, scopes data per `projectId`, and can be deployed as a standalone collector behind any platform that forwards standard geo headers.

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

- Client-only `<Analytics />` component for Next.js app router that batches page views and navigation events with `sendBeacon`/`fetch` while keeping bundle size minimal.【F:packages/analytics-core/src/Analytics.tsx†L1-L78】【F:packages/analytics-core/src/transport.ts†L1-L75】
- Privacy-preserving visit grouping via short-lived localStorage keys plus lightweight, project-scoped fingerprints that avoid IP storage on the client.【F:packages/analytics-core/src/visit.ts†L1-L25】【F:packages/analytics-core/src/fingerprint.ts†L1-L33】
- Configurable delivery modes: remote ingestion, direct local writes via server actions, or hybrid for dual writes.【F:packages/analytics-core/src/types.ts†L1-L34】【F:packages/analytics-core/src/transport.ts†L41-L72】
- Drizzle-ready schemas for SQLite/PostgreSQL and helpers to create server actions or remote ingest calls.【F:packages/analytics-adapters/src/schema.ts†L1-L41】【F:packages/analytics-adapters/src/local.ts†L1-L41】【F:packages/analytics-adapters/src/remote.ts†L1-L20】
- Example Hono-based ingestion service wiring that scopes data per project and can be deployed independently.【F:README.md†L59-L79】

### Near-term additions we could ship

- Server-side fingerprint helper that hashes platform headers and rotates secrets, so apps don’t rely on the client fallback.
- Navigation event enrichment (first/returning visit markers, navigation performance buckets) while keeping payloads anonymous.
- Retry/backoff strategy for remote delivery plus in-memory queue draining on `visibilitychange` for better reliability.
- Schema migrations and indexes (per-project + timestamp) to improve aggregation performance for both SQLite and Postgres.
- Optional geo enrichment helpers that map common platform headers to coarse country/region fields for local writes.

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
