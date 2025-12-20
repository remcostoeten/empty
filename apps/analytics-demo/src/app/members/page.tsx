const members = [
  { name: "Orlando Diggs", email: "orlando@studio.dev", progress: 86 },
  { name: "Andi Lane", email: "andi@studio.dev", progress: 73 },
  { name: "Lars Steiner", email: "lars@studio.dev", progress: 68 },
  { name: "Olivia Byrne", email: "olivia@studio.dev", progress: 82 },
  { name: "Phoenix Baker", email: "phoenix@studio.dev", progress: 59 },
  { name: "Demi Williamson", email: "demi@studio.dev", progress: 64 },
];

export default function MembersPage() {
  return (
    <div className="app-main">
      <section className="panel">
        <div className="panel-title">Welcome back</div>
        <p className="panel-subtitle" style={{ marginTop: 6 }}>
          A second themed screen inspired by the reference screenshots. Data is static; page views still
          flow to the SQLite store when you navigate.
        </p>
        <div className="pill" style={{ marginTop: 10 }}>12 months · Synthetic cohort</div>
        <div className="panel" style={{ marginTop: 14 }}>
          <div className="panel-title">Members</div>
          <div className="member-row subtle" style={{ marginTop: 10, fontWeight: 600, color: "var(--text)" }}>
            <div>Member</div>
            <div>Enrolled</div>
            <div>Progress</div>
          </div>
          <div className="subtle" style={{ marginTop: 8, display: "grid", gap: 12 }}>
            {members.map((member) => (
              <div key={member.email} className="member-row" style={{ alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text)" }}>{member.name}</div>
                  <div className="subtle">{member.email}</div>
                </div>
                <div>Jan 4, 2024</div>
                <div>
                  <div className="progress">
                    <span style={{ width: `${member.progress}%` }} />
                  </div>
                  <div className="subtle" style={{ marginTop: 4 }}>
                    {member.progress}% complete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
