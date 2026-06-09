import Header from "../components/Header";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

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
    maxWidth: "960px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  pageHeader: { display: "flex", flexDirection: "column", gap: "6px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#90A4AE", fontWeight: "500" },
  breadcrumbSep: { color: "#CFD8DC" },
  breadcrumbActive: { color: "#1565C0" },
  pageTitle: { fontSize: "24px", fontWeight: "700", color: "#1A2E4A", margin: 0 },
  pageDesc: { fontSize: "14px", color: "#78909C", margin: 0 },
  banner: {
    background: "linear-gradient(135deg, #E3F2FD, #E0F7FA)",
    border: "1px solid #B3E5FC",
    borderRadius: "14px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },
  bannerIcon: { fontSize: "28px", flexShrink: 0, marginTop: "2px" },
  bannerBody: { display: "flex", flexDirection: "column", gap: "4px" },
  bannerTitle: { fontSize: "15px", fontWeight: "700", color: "#0d3b7a", margin: 0 },
  bannerText: { fontSize: "13px", color: "#546E7A", margin: 0, lineHeight: "1.6" },
  dbCard: {
    background: "#ffffff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(13,59,122,0.07)",
    border: "1px solid #E8EEF7",
  },
  dbCardHeader: {
    background: "linear-gradient(135deg, #0d3b7a, #1565C0)",
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dbCardTitle: { fontSize: "14px", fontWeight: "600", color: "#ffffff", margin: 0 },
  dbStatusDot: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.7)",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#FFB74D",
    flexShrink: 0,
  },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: { background: "#F8FAFC", borderBottom: "2px solid #E8EEF7" },
  th: {
    padding: "12px 20px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#90A4AE",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #F4F6F9" },
  td: {
    padding: "14px 20px",
    fontSize: "13px",
    color: "#37474F",
    fontFamily: ff,
  },
  skeleton: {
    display: "inline-block",
    height: "12px",
    borderRadius: "6px",
    background: "linear-gradient(90deg, #EEF2F7, #E0E7EF, #EEF2F7)",
    backgroundSize: "400px 100%",
    animation: "shimmer 1.4s ease infinite",
  },
  footer: {
    padding: "14px 24px",
    background: "#F8FAFC",
    borderTop: "1px solid #E8EEF7",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: "12px", color: "#90A4AE", margin: 0 },
  connectBtn: {
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #1565C0, #0097A7)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "not-allowed",
    opacity: 0.6,
    fontFamily: ff,
  },
  schemaCols: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    padding: "24px",
  },
  schemaCard: {
    flex: "1 1 200px",
    borderRadius: "12px",
    border: "1.5px dashed #CFD8DC",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#FAFCFE",
  },
  schemaTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#546E7A",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: 0,
  },
  schemaFields: { display: "flex", flexDirection: "column", gap: "6px" },
  schemaField: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  fieldName: { fontSize: "12px", color: "#37474F", fontWeight: "500", margin: 0 },
  fieldType: {
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "4px",
    background: "#E3F2FD",
    color: "#1565C0",
    fontWeight: "600",
    letterSpacing: "0.3px",
    margin: 0,
  },
};

const TABLE_COLUMNS = ["ID", "Full Name", "Age", "Gender", "Contact", "Issue", "Registered"];
const SCHEMA = [
  {
    table: "patients",
    fields: [
      { name: "id", type: "INT" },
      { name: "full_name", type: "VARCHAR" },
      { name: "age", type: "INT" },
      { name: "gender", type: "ENUM" },
      { name: "contact", type: "VARCHAR" },
      { name: "address", type: "TEXT" },
      { name: "issue", type: "TEXT" },
    ],
  },
  {
    table: "appointments",
    fields: [
      { name: "id", type: "INT" },
      { name: "patient_id", type: "FK" },
      { name: "doctor_id", type: "FK" },
      { name: "date", type: "DATE" },
      { name: "time", type: "TIME" },
    ],
  },
  {
    table: "doctors",
    fields: [
      { name: "id", type: "INT" },
      { name: "name", type: "VARCHAR" },
      { name: "specialty", type: "VARCHAR" },
    ],
  },
];

export default function DatabasePage({ onBack }) {
  return (
    <div style={styles.page}>
      <Header showBack onBack={onBack} />

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div style={styles.breadcrumb}>
            <span>Dashboard</span>
            <span style={styles.breadcrumbSep}>›</span>
            <span style={styles.breadcrumbActive}>Database</span>
          </div>
          <h2 style={styles.pageTitle}>Database Management</h2>
          <p style={styles.pageDesc}>
            Backend integration pending. Below is the planned schema and table structure.
          </p>
        </div>

        {/* Info banner */}
        <div style={styles.banner}>
          <span style={styles.bannerIcon}>🗄️</span>
          <div style={styles.bannerBody}>
            <p style={styles.bannerTitle}>
              Database connection will be integrated later
            </p>
            <p style={styles.bannerText}>
              This section is reserved for the backend developer. The schema below
              represents the planned database structure. Once the Electron IPC bridge
              or REST API is connected, this panel will display live records.
            </p>
          </div>
        </div>

        {/* Patient table skeleton */}
        <div style={styles.dbCard}>
          <div style={styles.dbCardHeader}>
            <p style={styles.dbCardTitle}>📁 patients — Table Preview</p>
            <div style={styles.dbStatusDot}>
              <div style={styles.dot} />
              Not connected
            </div>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  {TABLE_COLUMNS.map((col) => (
                    <th key={col} style={styles.th}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} style={styles.tr}>
                    {TABLE_COLUMNS.map((col) => (
                      <td key={col} style={styles.td}>
                        <span
                          style={{
                            ...styles.skeleton,
                            width: `${50 + Math.floor(Math.random() * 60)}px`,
                            opacity: 1 - i * 0.12,
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Awaiting database connection · 0 records loaded
            </p>
            <button style={styles.connectBtn} disabled>
              Connect Database
            </button>
          </div>
        </div>

        {/* Schema preview */}
        <div style={styles.dbCard}>
          <div style={{ ...styles.dbCardHeader, background: "linear-gradient(135deg, #283593, #3949AB)" }}>
            <p style={styles.dbCardTitle}>🔷 Planned Schema</p>
          </div>
          <div style={styles.schemaCols}>
            {SCHEMA.map((s) => (
              <div key={s.table} style={styles.schemaCard}>
                <p style={styles.schemaTitle}>{s.table}</p>
                <div style={styles.schemaFields}>
                  {s.fields.map((f) => (
                    <div key={f.name} style={styles.schemaField}>
                      <p style={styles.fieldName}>{f.name}</p>
                      <p style={styles.fieldType}>{f.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}