import Header from "../components/Header";
import PatientForm from "../components/PatientForm";

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
    maxWidth: "880px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  pageHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#90A4AE",
    fontWeight: "500",
  },
  breadcrumbSep: {
    color: "#CFD8DC",
  },
  breadcrumbActive: {
    color: "#1565C0",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1A2E4A",
    margin: 0,
    lineHeight: "1.3",
  },
  pageDesc: {
    fontSize: "14px",
    color: "#78909C",
    margin: 0,
    lineHeight: "1.5",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "36px 40px",
    boxShadow: "0 2px 20px rgba(13,59,122,0.07)",
    border: "1px solid #E8EEF7",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #E8EEF7",
  },
  cardIconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #1565C0, #0097A7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  cardTitleBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1A2E4A",
    margin: 0,
  },
  cardSub: {
    fontSize: "12px",
    color: "#90A4AE",
    margin: 0,
  },
};

export default function AddPatientPage({ onBack }) {
  return (
    <div style={styles.page}>
      <Header showBack onBack={onBack} />

      <div style={styles.content}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <div style={styles.breadcrumb}>
            <span>Dashboard</span>
            <span style={styles.breadcrumbSep}>›</span>
            <span style={styles.breadcrumbActive}>Add New Patient</span>
          </div>
          <h2 style={styles.pageTitle}>Register New Patient</h2>
          <p style={styles.pageDesc}>
            Fill in the patient details below. All fields are required. Records will sync
            to the database once the backend is integrated.
          </p>
        </div>

        {/* Card wrapping the form component */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIconWrap}>🦷</div>
            <div style={styles.cardTitleBlock}>
              <p style={styles.cardTitle}>Patient Information</p>
              <p style={styles.cardSub}>Personal & medical details</p>
            </div>
          </div>

          {/* PatientForm lives in /components — separation of concerns */}
          <PatientForm />
        </div>
      </div>
    </div>
  );
}