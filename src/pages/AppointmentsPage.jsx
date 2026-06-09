import Header from "../components/Header";
import AppointmentCard from "../components/AppointmentCard";
import appointments from "../data/appointments";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

// Sort descending by date (latest first)
const sortedAppointments = [...appointments].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F0F4F8",
    display: "flex",
    flexDirection: "column",
    fontFamily: ff,
  },
  content: {
    flex: 1,
    padding: "40px 60px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    boxSizing: "border-box",
  },
  pageHeader: { display: "flex", flexDirection: "column", gap: "6px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#90A4AE", fontWeight: "500" },
  breadcrumbSep: { color: "#CFD8DC" },
  breadcrumbActive: { color: "#1565C0" },
  pageTitle: { fontSize: "24px", fontWeight: "700", color: "#1A2E4A", margin: 0 },
  pageDesc: { fontSize: "14px", color: "#78909C", margin: 0 },
  statsStrip: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  statPill: {
    background: "#ffffff",
    border: "1px solid #E8EEF7",
    borderRadius: "12px",
    padding: "14px 22px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 1px 8px rgba(13,59,122,0.05)",
  },
  statIcon: { fontSize: "22px" },
  statInfo: { display: "flex", flexDirection: "column", gap: "1px" },
  statVal: { fontSize: "18px", fontWeight: "700", color: "#1A2E4A", margin: 0 },
  statLbl: { fontSize: "11px", color: "#90A4AE", textTransform: "uppercase", letterSpacing: "0.7px", margin: 0 },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#90A4AE",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  labelLine: { flex: 1, height: "1px", background: "#E0E7EF" },
  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
};

export default function AppointmentsPage({ onBack }) {
  const doctors = [...new Set(sortedAppointments.map((a) => a.doctor))];

  return (
    <div style={styles.page}>
      <Header showBack onBack={onBack} />

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div style={styles.breadcrumb}>
            <span>Dashboard</span>
            <span style={styles.breadcrumbSep}>›</span>
            <span style={styles.breadcrumbActive}>Scheduled Appointments</span>
          </div>
          <h2 style={styles.pageTitle}>Appointment Schedule</h2>
          <p style={styles.pageDesc}>
            All scheduled appointments — sorted by latest date first.
          </p>
        </div>

        {/* Stats strip */}
        <div style={styles.statsStrip}>
          <div style={styles.statPill}>
            <span style={styles.statIcon}>📋</span>
            <div style={styles.statInfo}>
              <p style={styles.statVal}>{sortedAppointments.length}</p>
              <p style={styles.statLbl}>Total Appointments</p>
            </div>
          </div>
          <div style={styles.statPill}>
            <span style={styles.statIcon}>👨‍⚕️</span>
            <div style={styles.statInfo}>
              <p style={styles.statVal}>{doctors.length}</p>
              <p style={styles.statLbl}>Attending Doctors</p>
            </div>
          </div>
          <div style={styles.statPill}>
            <span style={styles.statIcon}>📅</span>
            <div style={styles.statInfo}>
              <p style={styles.statVal}>
                {new Date(sortedAppointments[0]?.date).toLocaleDateString("en-PK", {
                  day: "numeric", month: "short",
                })}
              </p>
              <p style={styles.statLbl}>Latest Appointment</p>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div style={styles.sectionLabel}>
          <span>All Appointments</span>
          <span style={styles.labelLine} />
          <span style={{ whiteSpace: "nowrap" }}>{sortedAppointments.length} records</span>
        </div>

        {/* Cards grid */}
        <div style={styles.cardGrid}>
          {sortedAppointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      </div>
    </div>
  );
}