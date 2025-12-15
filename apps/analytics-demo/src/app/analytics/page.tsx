const metricCards = [
  { label: "Visitors", value: "5", delta: "-62%", sub: "vs last 7 days" },
  { label: "Page Views", value: "5", delta: "-62%", sub: "vs last 7 days" },
  { label: "Bounce Rate", value: "100%", delta: "+7%", sub: "vs last 7 days" },
  { label: "Realtime", value: "2", delta: "Up to date", sub: "live sessions" },
];

const traffic = [
  { range: "Last 24 Hours", selected: false },
  { range: "Last 7 Days", selected: true },
  { range: "Last 30 Days", selected: false },
  { range: "Last 3 Months", selected: false },
  { range: "Last 6 Months", selected: false },
];

const pages = [
  { page: "/", visitors: "5" },
  { page: "/product", visitors: "1" },
];

const geos = [
  { country: "Netherlands", value: "80%" },
  { country: "United States of America", value: "20%" },
];

const devices = [
  { label: "Desktop", value: "100%" },
];

const systems = [
  { label: "macOS", value: "100%" },
];

const chartPoints = [
  { x: 0, y: 20 },
  { x: 1, y: 60 },
  { x: 2, y: 20 },
  { x: 3, y: 100 },
];

export default function AnalyticsPage() {
  const width = 340;
  const height = 160;
  const spacing = width / (chartPoints.length - 1);
  const baseline = height - 10;
  const pathData = chartPoints
    .map((point, idx) => `${idx === 0 ? "M" : "L"}${idx * spacing} ${baseline - point.y}`)
    .join(" ");
  const areaPath = `${pathData} L ${width} ${baseline} L 0 ${baseline} Z`;

  return (
    <div className="analytics-grid">
      <div className="analytics-head">
        <div>
          <div className="pill live">analytics @ {"{}"}</div>
          <div className="panel-title" style={{ marginTop: 8 }}>Web Analytics</div>
          <p className="panel-subtitle">Styled after the Vercel Analytics console with live-ish sample data.</p>
        </div>
        <div className="toolbar">
          <span className="env">Production</span>
          <div className="range-menu">
            {traffic.map((item) => (
              <span key={item.range} className={item.selected ? "menu-item selected" : "menu-item"}>
                {item.range}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="metric-row">
        {metricCards.map((metric) => (
          <div key={metric.label} className="panel metric-card">
            <div className="metric-label subtle">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className={`delta ${metric.delta.includes("-") ? "down" : ""}`}>{metric.delta}</div>
            <div className="panel-subtitle" style={{ marginTop: 4 }}>{metric.sub}</div>
          </div>
        ))}
      </div>

      <div className="panel chart-panel">
        <div className="chart-head">
          <div>
            <div className="panel-title">Page views</div>
            <p className="panel-subtitle">Total and uniques · synthetic demo values</p>
          </div>
          <div className="legend">
            <span className="legend-dot" /> Visitors · Page views
          </div>
        </div>
        <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#fill)" stroke="none" />
          <path d={pathData} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="panel stat-columns">
        <div>
          <div className="panel-title">Pages</div>
          <table className="table dense">
            <tbody>
              {pages.map((row) => (
                <tr key={row.page}>
                  <td>{row.page}</td>
                  <td>{row.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="panel-title">Locations</div>
          <table className="table dense">
            <tbody>
              {geos.map((row) => (
                <tr key={row.country}>
                  <td>{row.country}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="panel-title">Devices</div>
          <table className="table dense">
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
        <div>
          <div className="panel-title">Operating systems</div>
          <table className="table dense">
            <tbody>
              {systems.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-cta">
        <div className="panel muted">No custom events</div>
        <div className="panel muted">No referrers</div>
        <div className="panel muted">No UTM parameters</div>
      </div>
    </div>
  );
}
