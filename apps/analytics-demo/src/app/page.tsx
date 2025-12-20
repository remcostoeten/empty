import Link from "next/link";

const highlights = [
  "Edge + Node friendly client with beacon/fetch fallback",
  "Server Actions own persistence; no API routes required",
  "Coarse geo and rotated fingerprints stay off the client bundle",
];

export default function HomePage() {
  return (
    <div className="app-main">
      <section className="panel hero">
        <div>
          <p className="pill-muted">MVP → production hardening</p>
          <h1 className="panel-title" style={{ marginTop: 10 }}>
            Self-hosted analytics with Vercel-like polish
          </h1>
          <p className="panel-subtitle" style={{ marginTop: 8 }}>
            Navigate the demo routes to see local page-view writes land in SQLite via Server Actions.
            The client is lightweight, anonymous, and ships batched events via beacon/fetch.
          </p>
          <div className="cta-row">
            <Link className="cta" href="/analytics">
              Explore dashboard
            </Link>
            <Link className="cta-secondary" href="/product">
              View storage modes
            </Link>
          </div>
        </div>
        <div className="panel chart-card" style={{ padding: 16 }}>
          <div className="panel-title">What’s wired up</div>
          <ul className="subtle" style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.6 }}>
            {highlights.map((item) => (
              <li key={item} style={{ marginBottom: 6 }}>
                {item}
              </li>
            ))}
          </ul>
          <div className="pill" style={{ marginTop: 14 }}>Local mode · SQLite + Drizzle</div>
          <p className="subtle" style={{ marginTop: 8 }}>
            Fingerprints are injected from the server (hashed headers + project secret) and geo is
            derived server-side.
          </p>
        </div>
      </section>

      <section className="list-stack">
        <Link className="list-card" href="/analytics">
          <div className="panel-title">Analytics view</div>
          <p className="subtle" style={{ marginTop: 6 }}>
            Styled after the Next.js analytics console—hero metrics, sparkline, top pages, and geo.
          </p>
        </Link>
        <Link className="list-card" href="/members">
          <div className="panel-title">Members page</div>
          <p className="subtle" style={{ marginTop: 6 }}>
            A second themed screen with avatars and progress bars for variety.
          </p>
        </Link>
        <Link className="list-card" href="/docs">
          <div className="panel-title">Instrumentation notes</div>
          <p className="subtle" style={{ marginTop: 6 }}>
            Batching, navigation dedupe, and fingerprint/geo guidance for production use.
          </p>
        </Link>
      </section>

      <section className="panel">
        <div className="panel-title">Quickstart</div>
        <p className="panel-subtitle" style={{ marginTop: 6 }}>
          From the repo root, install deps, run the demo, click around, then inspect captured events in SQLite.
        </p>
        <ol className="subtle" style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.6 }}>
          <li>
            Install: <code>npm install</code>
          </li>
          <li>
            Start: <code>npm run dev --workspace analytics-demo</code>
          </li>
          <li>
            Inspect: <code>sqlite3 apps/analytics-demo/data/analytics.db 'select pathname, country, created_at from page_views limit 5;'</code>
          </li>
        </ol>
      </section>
    </div>
  );
}
