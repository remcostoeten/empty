const highlights = [
  "App Router + Server Actions only (no API routes).",
  "Edge/Node compatible client bundle with beacon/fetch fallback.",
  "SQLite example uses the packaged Drizzle schema and writer.",
  "Swap to remote mode by pointing at the Hono ingestion service.",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="card">
        <h1 className="text-2xl font-semibold text-white">About this sample</h1>
        <p className="mt-2 text-slate-300">
          The goal is to showcase how the analytics package drops into a modern Next.js app with minimal setup.
          Fingerprints are derived server-side using request headers and a project secret, then passed to the
          client-only collector.
        </p>
      </section>
      <section className="card">
        <h2 className="text-xl font-semibold text-white">Highlights</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-300">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
