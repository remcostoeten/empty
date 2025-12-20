const items = [
  {
    title: "Batching",
    detail: "Batched events flush every 4s or on pagehide/visibilitychange to avoid drops during navigation.",
  },
  {
    title: "Fingerprinting",
    detail:
      "A short-lived hash derived from headers + project scope. No cookies, rotated regularly, scoped per project.",
  },
  {
    title: "Visit grouping",
    detail: "A localStorage visit id prevents duplicate route-change writes while keeping users anonymous.",
  },
];

export default function DocsPage() {
  return (
    <div className="app-main">
      <section className="panel">
        <div className="panel-title">How it works</div>
        <p className="panel-subtitle" style={{ marginTop: 6 }}>
          The client component is lightweight and safe for edge/runtime streaming. Server Actions own persistence so
          data never leaves your project unless you opt into remote mode.
        </p>
      </section>
      <section className="list-stack">
        {items.map((item) => (
          <div key={item.title} className="list-card">
            <div className="panel-title">{item.title}</div>
            <p className="subtle" style={{ marginTop: 6 }}>{item.detail}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
