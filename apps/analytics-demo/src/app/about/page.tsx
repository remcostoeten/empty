const highlights = [
  "App Router + Server Actions only (no API routes).",
  "Edge/Node compatible client bundle with beacon/fetch fallback.",
  "SQLite example uses the packaged Drizzle schema and writer.",
  "Swap to remote mode by pointing at the Hono ingestion service.",
];

export default function AboutPage() {
  return (
    <div className="app-main">
      <section className="panel">
        <div className="panel-title">About this sample</div>
        <p className="panel-subtitle" style={{ marginTop: 6 }}>
          The goal is to showcase how the analytics package drops into a modern Next.js app with minimal setup.
          Fingerprints are derived server-side using request headers and a project secret, then passed to the
          client-only collector.
        </p>
      </section>
      <section className="panel">
        <div className="panel-title">Highlights</div>
        <ul className="subtle" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.6 }}>
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
