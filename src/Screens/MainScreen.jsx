import Header from "../components/Header";
import NavButton from "../components/NavButton";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

const styles = {
  page: { minHeight: "100vh", background: "#F0F4F8", display: "flex", flexDirection: "column", fontFamily: ff },
  hero: {
    background: "linear-gradient(160deg, #0d3b7a 0%, #1565C0 55%, #0097A7 100%)",
    padding: "48px 60px 56px", color: "#ffffff", position: "relative", overflow: "hidden",
  },
  heroBgCircle1: { position: "absolute", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: "-100px", right: "-60px" },
  heroBgCircle2: { position: "absolute", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(0,151,167,0.15)", bottom: "-60px", left: "30%" },
  heroGreeting: { fontSize: "13px", fontWeight: "500", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", margin: "0 0 8px" },
  heroTitle: { fontSize: "28px", fontWeight: "700", margin: "0 0 8px", lineHeight: "1.3" },
  heroSub: { fontSize: "14px", color: "rgba(255,255,255,0.65)", margin: 0, maxWidth: "420px", lineHeight: "1.6" },
  statsRow: { display: "flex", gap: "20px", marginTop: "28px", flexWrap: "wrap" },
  statCard: {
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px", padding: "14px 22px", display: "flex", flexDirection: "column", gap: "4px",
  },
  statNumber: { fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: 0 },
  statLabel: { fontSize: "11px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.7px", textTransform: "uppercase", margin: 0 },
  body: { flex: 1, padding: "52px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" },
  sectionLabel: { fontSize: "11px", fontWeight: "600", color: "#90A4AE", letterSpacing: "2px", textTransform: "uppercase", textAlign: "center", margin: 0 },
  navGrid: { display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center" },
  footer: { textAlign: "center", padding: "20px", color: "#B0BEC5", fontSize: "12px", borderTop: "1px solid #E0E7EF", background: "#F8FAFC", fontFamily: ff },
};

// ✅ "Database" renamed to "Analytics"
const navItems = [
  { icon: "🦷", label: "Add New Patient",            page: "add-patient",   color: "blue" },
  { icon: "🔍", label: "Search Patient",             page: "search",        color: "teal" },
  { icon: "📋", label: "View Scheduled\nAppointments", page: "appointments", color: "green" },
  { icon: "📊", label: "Analytics",                  page: "analytics",     color: "indigo" },
];

export default function MainScreen({ onNavigate }) {
  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.hero}>
        <div style={styles.heroBgCircle1} />
        <div style={styles.heroBgCircle2} />
        <p style={styles.heroGreeting}>Welcome Back</p>
        <h2 style={styles.heroTitle}>Patient Management Dashboard</h2>
        <p style={styles.heroSub}>Manage patient records, appointments, and clinic analytics from one place.</p>
        <div style={styles.statsRow}>
          <div style={styles.statCard}><p style={styles.statNumber}>—</p><p style={styles.statLabel}>Total Patients</p></div>
          <div style={styles.statCard}><p style={styles.statNumber}>—</p><p style={styles.statLabel}>Today's Appointments</p></div>
          <div style={styles.statCard}><p style={styles.statNumber}>3</p><p style={styles.statLabel}>Doctors On Duty</p></div>
        </div>
      </div>
      <div style={styles.body}>
        <p style={styles.sectionLabel}>Quick Actions</p>
        <div style={styles.navGrid}>
          {navItems.map((item) => (
            <NavButton key={item.page} icon={item.icon} label={item.label} color={item.color} onClick={() => onNavigate(item.page)} />
          ))}
        </div>
      </div>
      <div style={styles.footer}>Family Dental Clinic · Desktop v1.0.0 · Powered by Electron + React</div>
    </div>
  );
}