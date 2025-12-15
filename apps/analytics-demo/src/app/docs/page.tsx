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
    <div className="flex flex-col gap-4">
      <section className="card">
        <h1 className="text-2xl font-semibold text-white">How it works</h1>
        <p className="mt-2 text-slate-300">
          The client component is lightweight and safe for edge/runtime streaming. Server Actions own persistence so
          data never leaves your project unless you opt into remote mode.
        </p>
      </section>
      <section className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="card">
            <div className="text-lg font-semibold text-white">{item.title}</div>
            <p className="mt-1 text-slate-300">{item.detail}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
