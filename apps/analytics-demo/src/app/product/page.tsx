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
    <div className="app-main">
      <section className="panel">
        <div className="panel-title">Storage modes</div>
        <p className="panel-subtitle" style={{ marginTop: 6 }}>
          Swap between remote, local, or hybrid delivery by changing the <code>mode</code> prop passed to
          <code>&lt;Analytics /&gt;</code>. This demo app runs in <strong>local</strong> mode so you can inspect the SQLite file directly.
        </p>
      </section>
      <section className="list-stack">
        {tiles.map((tile) => (
          <div key={tile.title} className="list-card">
            <div className="panel-title">{tile.title}</div>
            <p className="subtle" style={{ marginTop: 6 }}>
              {tile.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
