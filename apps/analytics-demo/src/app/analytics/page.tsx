const metrics = [
  { label: "Visitors", value: "44.8M", sub: "+4.7% online" },
  { label: "Page views", value: "128.1M", sub: "+3.2% vs last week" },
  { label: "Bounce", value: "32%", sub: "-2.3% vs last week" },
];

const pages = [
  { page: "/", views: "2.1M", change: "+6%" },
  { page: "/product", views: "1.4M", change: "+3%" },
  { page: "/docs", views: "986k", change: "+4%" },
  { page: "/about", views: "712k", change: "+2%" },
];

const countries = [
  { country: "United States", value: "38%" },
  { country: "Germany", value: "16%" },
  { country: "Canada", value: "12%" },
  { country: "Netherlands", value: "9%" },
];

const devices = [
  { label: "Desktop", value: "62%" },
  { label: "Mobile", value: "33%" },
  { label: "Tablet", value: "5%" },
];

const chartPoints = [
  { x: 0, y: 80 },
  { x: 1, y: 110 },
  { x: 2, y: 160 },
  { x: 3, y: 150 },
  { x: 4, y: 190 },
  { x: 5, y: 175 },
  { x: 6, y: 220 },
  { x: 7, y: 205 },
  { x: 8, y: 240 },
  { x: 9, y: 230 },
];

export default function AnalyticsPage() {
  const pointSpacing = 40;
  const pathData = chartPoints
    .map((point, idx) => `${idx === 0 ? "M" : "L"}${idx * pointSpacing} ${260 - point.y}`)
    .join(" ");

  const lastX = (chartPoints.length - 1) * pointSpacing;
  const areaPath = `${pathData} L ${lastX} 260 L 0 260 Z`;

  return (
    <div className="app-main">
      <section className="panel">
        <div className="panel-title">Analytics overview</div>
        <p className="panel-subtitle" style={{ marginTop: 6 }}>
          Styled after the Next.js analytics console. Navigate between pages and watch the local SQLite
          table populate via the analytics collector.
        </p>
        <div className="stat-grid" style={{ marginTop: 14 }}>
          {metrics.map((metric) => (
            <div key={metric.label} className="panel" style={{ padding: 14 }}>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
              <div className="subtle">{metric.sub}</div>
            </div>
          ))}
        </div>
        <div className="panel chart-card" style={{ marginTop: 14 }}>
          <div className="panel-title">Page views</div>
          <p className="panel-subtitle">Weekly trend · synthetic sample data</p>
          <svg className="chart-svg" viewBox="0 0 360 260" preserveAspectRatio="none">
            <defs>
              <linearGradient id="line" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d={areaPath}
              fill="url(#line)"
              opacity="0.6"
              stroke="none"
            />
            <path
              d={pathData}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      <section className="grid-split">
        <div className="panel">
          <div className="panel-title">Top pages</div>
          <table className="table">
            <thead>
              <tr>
                <th>Pathname</th>
                <th>Views</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((row) => (
                <tr key={row.page}>
                  <td>{row.page}</td>
                  <td>{row.views}</td>
                  <td>{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-title">Geo (coarse)</div>
          <p className="panel-subtitle">
            Populated server-side via header mapping, with IP lookups rotating across free providers when headers are missing.
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((row) => (
                <tr key={row.country}>
                  <td>{row.country}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pill-muted" style={{ marginTop: 10 }}>
            No IP storage · rotated fingerprints
          </div>
        </div>
      </section>

      <section className="grid-split">
        <div className="panel">
          <div className="panel-title">Devices</div>
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <div className="panel-title">Events stored locally</div>
          <p className="panel-subtitle" style={{ marginTop: 6 }}>
            This sample writes page views into <code>apps/analytics-demo/data/analytics.db</code> via a Server
            Action. Swap the Analytics component to remote or hybrid to forward to the ingestion service.
          </p>
        </div>
      </section>
    </div>
  );
}
