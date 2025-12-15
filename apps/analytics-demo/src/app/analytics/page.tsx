import { db, pageViewsTable } from "@/db/client";
import { desc } from "drizzle-orm";

function asChart(points: number[]) {
  const width = 340;
  const height = 160;
  const spacing = width / Math.max(points.length - 1, 1);
  const baseline = height - 10;
  const pathData = points
    .map((y, idx) => `${idx === 0 ? "M" : "L"}${idx * spacing} ${baseline - y}`)
    .join(" ");
  const areaPath = `${pathData} L ${width} ${baseline} L 0 ${baseline} Z`;
  return { width, height, pathData, areaPath, baseline };
}

export default async function AnalyticsPage() {
  const events = await db
    .select()
    .from(pageViewsTable)
    .orderBy(desc(pageViewsTable.createdAt))
    .limit(120);

  const totalViews = events.length;
  const uniqueVisits = new Set(events.map((e) => e.visitId)).size;
  const paths = new Map<string, number>();
  const geos = new Map<string, number>();

  events.forEach((event) => {
    paths.set(event.pathname, (paths.get(event.pathname) ?? 0) + 1);
    const key = event.country ?? "Unknown";
    geos.set(key, (geos.get(key) ?? 0) + 1);
  });

  const pageList = Array.from(paths.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const geoList = Array.from(geos.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const hourlyBuckets = Array.from({ length: 8 }, (_, idx) => {
    const cutoff = Date.now() - idx * 60 * 60 * 1000;
    const next = cutoff - 60 * 60 * 1000;
    return events.filter(
      (e) => e.createdAt.getTime() <= cutoff && e.createdAt.getTime() > next
    ).length;
  }).reverse();

  const { width, height, pathData, areaPath } = asChart(
    hourlyBuckets.length ? hourlyBuckets : [0, 0]
  );

  const metricCards = [
    { label: "Visitors", value: uniqueVisits || "–", delta: "live sample" },
    { label: "Page Views", value: totalViews || "–", delta: "last 120" },
    { label: "Bounce Rate", value: "demo", delta: "placeholder" },
    { label: "Realtime", value: Math.max(uniqueVisits, 1), delta: "sample" },
  ];

  return (
    <div className="analytics-grid">
      <div className="analytics-head">
        <div>
          <div className="pill live">analytics @ {{}}</div>
          <div className="panel-title" style={{ marginTop: 8 }}>Web Analytics</div>
          <p className="panel-subtitle">
            Styled after the Vercel Analytics console; data is live from your local
            SQLite insertions. Geo stays server-side and will be unknown on
            localhost without platform headers.
          </p>
        </div>
        <div className="toolbar">
          <span className="env">Production</span>
          <div className="range-menu">
            <span className="menu-item selected">Last 120 events</span>
          </div>
        </div>
      </div>

      <div className="metric-row">
        {metricCards.map((metric) => (
          <div key={metric.label} className="panel metric-card">
            <div className="metric-label subtle">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="delta">{metric.delta}</div>
            <div className="panel-subtitle" style={{ marginTop: 4 }}>
              updated from stored events
            </div>
          </div>
        ))}
      </div>

      <div className="panel chart-panel">
        <div className="chart-head">
          <div>
            <div className="panel-title">Page views</div>
            <p className="panel-subtitle">
              Last 8 hours of captured events (server-rendered from SQLite)
            </p>
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
              {pageList.length ? (
                pageList.map(([page, count]) => (
                  <tr key={page}>
                    <td>{page}</td>
                    <td>{count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="subtle">
                    No events yet. Click around the demo to generate page views.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <div className="panel-title">Locations</div>
          <table className="table dense">
            <tbody>
              {geoList.length ? (
                geoList.map(([country, count]) => (
                  <tr key={country}>
                    <td>{country === "Unknown" ? "Unknown / localhost" : country}</td>
                    <td>{count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="subtle">
                    Geo is derived server-side. Localhost generally lacks geo headers,
                    so values may stay "Unknown" until deployed behind a platform that
                    forwards location headers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <div className="panel-title">Devices</div>
          <table className="table dense">
            <tbody>
              <tr>
                <td>Desktop</td>
                <td>demo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className="panel-title">Operating systems</div>
          <table className="table dense">
            <tbody>
              <tr>
                <td>macOS</td>
                <td>demo</td>
              </tr>
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
