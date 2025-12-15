const tiles = [
  {
    title: "Remote",
    body:
      "Send beacons to the shared ingestion service. Good for multi-project rollups and zero DB setup.",
  },
  {
    title: "Local",
    body:
      "Persist inside this project using Server Actions + Drizzle. Great for teams that want full data ownership.",
  },
  {
    title: "Hybrid",
    body:
      "Write locally while forwarding batches to the central service for fleet-wide insights.",
  },
];

export default function ProductPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="card">
        <h1 className="text-2xl font-semibold text-white">Storage modes</h1>
        <p className="mt-2 text-slate-300">
          Swap between remote, local, or hybrid delivery by changing the <code>mode</code> prop passed to
          <code>&lt;Analytics /&gt;</code>. This demo app runs in <span className="text-white">local</span> mode so
          you can inspect the SQLite file directly.
        </p>
      </section>
      <section className="grid gap-3 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.title} className="card">
            <div className="text-lg font-semibold text-white">{tile.title}</div>
            <p className="mt-1 text-slate-300">{tile.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
