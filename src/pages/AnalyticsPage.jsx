import { useState, useEffect } from "react";
import Header from "../components/Header";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || "Unknown";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

// ── Styles (unchanged) ─────────────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#F0F4F8", display: "flex", flexDirection: "column", fontFamily: ff },
  content: { flex: 1, padding: "40px 60px", display: "flex", flexDirection: "column", gap: "28px", boxSizing: "border-box", maxWidth: "1100px", margin: "0 auto", width: "100%" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#90A4AE", fontWeight: "500" },
  breadcrumbSep: { color: "#CFD8DC" },
  breadcrumbActive: { color: "#1565C0" },
  pageTitle: { fontSize: "24px", fontWeight: "700", color: "#1A2E4A", margin: "6px 0 4px" },
  pageDesc: { fontSize: "14px", color: "#78909C", margin: 0 },
  periodRow: { display: "flex", gap: "0", background: "#fff", borderRadius: "12px", border: "1px solid #E8EEF7", overflow: "hidden", alignSelf: "flex-start", boxShadow: "0 1px 6px rgba(13,59,122,0.06)" },
  periodBtn: {
    padding: "10px 22px", border: "none", background: "transparent",
    fontSize: "13px", fontWeight: "600", cursor: "pointer", color: "#78909C",
    fontFamily: ff, borderRight: "1px solid #E8EEF7", transition: "all 0.15s ease",
  },
  periodBtnActive: { background: "linear-gradient(135deg, #1565C0, #0097A7)", color: "#fff" },
  periodBtnLast: { borderRight: "none" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  statCard: {
    background: "#fff", borderRadius: "16px", padding: "20px 22px",
    border: "1px solid #E8EEF7", boxShadow: "0 2px 12px rgba(13,59,122,0.06)",
    display: "flex", flexDirection: "column", gap: "8px",
    position: "relative", overflow: "hidden",
  },
  statCardAccent: { position: "absolute", top: 0, left: 0, right: 0, height: "3px" },
  statIcon: { fontSize: "24px" },
  statNum: { fontSize: "28px", fontWeight: "800", color: "#1A2E4A", margin: 0, lineHeight: "1.1" },
  statLabel: { fontSize: "12px", color: "#90A4AE", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.7px", margin: 0 },
  statChange: { fontSize: "11px", fontWeight: "600", margin: 0 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  threeCol: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" },
  card: {
    background: "#fff", borderRadius: "16px", padding: "22px 24px",
    border: "1px solid #E8EEF7", boxShadow: "0 2px 12px rgba(13,59,122,0.06)",
  },
  cardTitle: { fontSize: "13px", fontWeight: "700", color: "#1A2E4A", margin: "0 0 16px 0" },
  barRow: { display: "flex", flexDirection: "column", gap: "10px" },
  barItem: { display: "flex", flexDirection: "column", gap: "4px" },
  barMeta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  barLabel: { fontSize: "12px", color: "#546E7A", fontWeight: "500", margin: 0 },
  barCount: { fontSize: "12px", color: "#1A2E4A", fontWeight: "700", margin: 0 },
  barTrack: { height: "8px", background: "#F0F4F8", borderRadius: "4px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "4px", transition: "width 0.4s ease" },
  filterSection: {
    background: "#fff", borderRadius: "16px", padding: "22px 24px",
    border: "1px solid #E8EEF7", boxShadow: "0 2px 12px rgba(13,59,122,0.06)",
    display: "flex", flexDirection: "column", gap: "16px",
  },
  filterTitle: { fontSize: "13px", fontWeight: "700", color: "#1A2E4A", margin: 0 },
  filterRow: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" },
  filterGroupLabel: { fontSize: "11px", color: "#90A4AE", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.7px", minWidth: "80px" },
  chip: {
    padding: "5px 14px", borderRadius: "20px", border: "1.5px solid #E8EEF7",
    background: "#F8FAFC", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", color: "#546E7A", fontFamily: ff, transition: "all 0.15s",
  },
  chipActive: { background: "#1565C0", borderColor: "#1565C0", color: "#fff" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 14px", fontSize: "11px", fontWeight: "700", color: "#90A4AE", textTransform: "uppercase", letterSpacing: "0.7px", textAlign: "left", borderBottom: "2px solid #E8EEF7", background: "#F8FAFC" },
  td: { padding: "12px 14px", fontSize: "13px", color: "#37474F", borderBottom: "1px solid #F4F6F9", fontFamily: ff },
  badge: { display: "inline-flex", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" },
};

const PERIOD_OPTIONS = ["All Time", "Monthly", "Weekly", "Daily"];
const BAR_COLORS = ["#1565C0", "#0097A7", "#2E7D32", "#7B1FA2", "#E65100", "#C62828"];

function BarChart({ data, title, colorStart = 0 }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div style={S.card}>
      <p style={S.cardTitle}>{title}</p>
      {entries.length === 0 ? (
        <p style={{ color: "#90A4AE", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>No data for this period</p>
      ) : (
        <div style={S.barRow}>
          {entries.map(([label, count], i) => (
            <div key={label} style={S.barItem}>
              <div style={S.barMeta}>
                <p style={S.barLabel}>{label}</p>
                <p style={S.barCount}>{count}</p>
              </div>
              <div style={S.barTrack}>
                <div style={{ ...S.barFill, width: `${(count / max) * 100}%`, background: BAR_COLORS[(i + colorStart) % BAR_COLORS.length] }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, num, label, change, changePositive, accentColor }) {
  return (
    <div style={S.statCard}>
      <div style={{ ...S.statCardAccent, background: accentColor }} />
      <span style={S.statIcon}>{icon}</span>
      <p style={S.statNum}>{num}</p>
      <p style={S.statLabel}>{label}</p>
      {change !== undefined && (
        <p style={{ ...S.statChange, color: changePositive ? "#2E7D32" : "#C62828" }}>
          {changePositive ? "▲" : "▼"} {change}
        </p>
      )}
    </div>
  );
}
function getDisplayStatus(appointment) {
  const { status, date } = appointment;
  if (status === "scheduled") {
    const apptDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (apptDate < today) return "overdue";
  }
  return status || "scheduled";
}
const statusColors = {
  scheduled: { background: "#E3F2FD", color: "#1565C0" },
  completed:  { background: "#E8F5E9", color: "#2E7D32" },
  cancelled:  { background: "#FEF2F2", color: "#C62828" },
  overdue:    { background: "#FFF3E0", color: "#E65100" },
};

function capitalize(s) {
  if (!s) return "Scheduled";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AnalyticsPage({ onBack }) {
  const [period, setPeriod]             = useState("All Time");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtered, setFiltered]         = useState([]);

  const CLINIC_DOCTORS = ["Kainat Niaz", "Nida Niaz", "Amna Niaz"];

  useEffect(() => {
    let active = true;

    const load = async () => {
      const result = await window.api.getAnalyticsAppointments({
        period,
        doctor: doctorFilter,
        status: statusFilter,
      });
      if (active) setFiltered(result || []);
    };

    load();

    return () => { active = false; };
  }, [period, doctorFilter, statusFilter]);

  const byDoctor    = groupBy(filtered, "doctor");
  const byTreatment = groupBy(filtered, "issue");
  const byStatus    = groupBy(filtered.map((a) => ({ ...a, status: capitalize(a.status) })), "status");
  const byGender    = groupBy(filtered, "gender");

  return (
    <div style={S.page}>
      <Header showBack onBack={onBack} />

      <div style={S.content}>
        <div>
          <div style={S.breadcrumb}>
            <span>Dashboard</span><span style={S.breadcrumbSep}>›</span>
            <span style={S.breadcrumbActive}>Analytics</span>
          </div>
          <h2 style={S.pageTitle}>Clinic Analytics</h2>
          <p style={S.pageDesc}>Appointment and patient insights across all periods.</p>
        </div>

        <div style={S.periodRow}>
          {PERIOD_OPTIONS.map((p, i) => (
            <button
              key={p}
              style={{
                ...S.periodBtn,
                ...(period === p ? S.periodBtnActive : {}),
                ...(i === PERIOD_OPTIONS.length - 1 ? S.periodBtnLast : {}),
              }}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div style={S.statsGrid}>
          <StatCard icon="📋" num={filtered.length}                                                  label="Total Appointments"  accentColor="linear-gradient(90deg,#1565C0,#0097A7)" />
          <StatCard icon="👥" num={[...new Set(filtered.map(a=>a.patientId))].length}                label="Unique Patients"     accentColor="linear-gradient(90deg,#0097A7,#2E7D32)" />
          <StatCard icon="✅" num={filtered.filter(a=>(a.status||"scheduled")==="completed").length}  label="Completed"           accentColor="linear-gradient(90deg,#2E7D32,#43A047)" />
          <StatCard icon="🟢" num={filtered.filter(a=>(a.status||"scheduled")==="scheduled").length}  label="Upcoming"            accentColor="linear-gradient(90deg,#7B1FA2,#9C27B0)" />
        </div>

        <div style={S.filterSection}>
          <p style={S.filterTitle}>🔽 Filters</p>

          <div style={S.filterRow}>
            <span style={S.filterGroupLabel}>Doctor</span>
            {["All", ...CLINIC_DOCTORS].map((d) => (
              <button key={d} style={doctorFilter === d ? { ...S.chip, ...S.chipActive } : S.chip} onClick={() => setDoctorFilter(d)}>
                {d === "All" ? "All Doctors" : d}
              </button>
            ))}
          </div>

          <div style={S.filterRow}>
            <span style={S.filterGroupLabel}>Status</span>
            {["All", "Scheduled", "Completed", "Cancelled"].map((s) => (
              <button key={s} style={statusFilter === s ? { ...S.chip, ...S.chipActive } : S.chip} onClick={() => setStatusFilter(s)}>
                {s === "All" ? "All Statuses" : s}
              </button>
            ))}
          </div>
        </div>

        <div style={S.twoCol}>
          <BarChart data={byTreatment} title="📊 Appointments by Treatment"   colorStart={0} />
          <BarChart data={byDoctor}    title="👨‍⚕️ Appointments by Doctor"     colorStart={2} />
        </div>
        <div style={S.twoCol}>
          <BarChart data={byStatus} title="🔵 Appointment Status Breakdown" colorStart={4} />
          <BarChart data={byGender} title="👥 Patients by Gender"           colorStart={1} />
        </div>

        <div style={S.card}>
          <p style={S.cardTitle}>📋 Filtered Appointments ({filtered.length})</p>
          {filtered.length === 0 ? (
            <p style={{ color: "#90A4AE", fontSize: "13px", textAlign: "center", padding: "24px 0" }}>
              No appointments match the selected filters.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["Patient", "ID", "Date", "Doctor", "Treatment", "Status"].map((h) => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id}>
                      <td style={S.td}>{a.name}</td>
                      <td style={{ ...S.td, color: "#0097A7", fontWeight: "600" }}>{a.patientId}</td>
                      <td style={S.td}>{new Date(a.date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td style={S.td}>{a.doctor}</td>
                      <td style={S.td}>{a.issue}</td>
                   <td style={S.td}>
  <span style={{ ...S.badge, ...(statusColors[getDisplayStatus(a)]) }}>
    {capitalize(getDisplayStatus(a))}
  </span>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}