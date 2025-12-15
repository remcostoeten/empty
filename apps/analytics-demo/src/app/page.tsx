import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="card">
        <h1 className="text-2xl font-semibold text-white">Self-hosted analytics demo</h1>
        <p className="mt-2 text-slate-300">
          This Next.js app is wired to the <code>@selfhosted/analytics</code> MVP. Navigate the
          routes below and page views will be written straight into the local SQLite database via a
          Server Action.
        </p>
      </section>
      <section className="card">
        <h2 className="text-xl font-semibold text-white">Try it out</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-slate-300">
          <li>
            Run <code>npm install</code> from the repo root, then <code>npm run dev --workspace analytics-demo</code>.
          </li>
          <li>Visit several routes (Home, Product, Docs, About) and refresh.</li>
          <li>
            Inspect <code>apps/analytics-demo/data/analytics.db</code> to see page views captured by the
            local Drizzle writer.
          </li>
        </ol>
      </section>
      <section className="card grid gap-3 sm:grid-cols-2">
        <Link className="rounded-lg border border-slate-800 p-4 hover:border-slate-600" href="/product">
          <div className="text-lg font-semibold text-white">Product tour</div>
          <p className="text-slate-300">Overview of storage modes and when to use them.</p>
        </Link>
        <Link className="rounded-lg border border-slate-800 p-4 hover:border-slate-600" href="/docs">
          <div className="text-lg font-semibold text-white">Docs</div>
          <p className="text-slate-300">How batching, fingerprints, and geo hints are applied.</p>
        </Link>
      </section>
    </div>
  );
}
