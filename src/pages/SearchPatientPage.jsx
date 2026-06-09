import { useState } from "react";
import Header from "../components/Header";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

// Dummy patient data — replace with API call: window.api.searchPatients(query)
const DUMMY_PATIENTS = [
  { id: 1, name: "Ahmed Raza",      age: 34, gender: "Male",   contact: "0300-1234567", issue: "Root Canal",         lastVisit: "2026-06-10" },
  { id: 2, name: "Fatima Noor",     age: 28, gender: "Female", contact: "0312-9876543", issue: "Teeth Whitening",    lastVisit: "2026-06-08" },
  { id: 3, name: "Usman Ali",       age: 45, gender: "Male",   contact: "0321-5551234", issue: "Cavity Filling",     lastVisit: "2026-06-05" },
  { id: 4, name: "Zara Khan",       age: 22, gender: "Female", contact: "0333-4445566", issue: "Braces Checkup",     lastVisit: "2026-05-30" },
  { id: 5, name: "Tariq Mehmood",   age: 52, gender: "Male",   contact: "0345-7778899", issue: "Tooth Extraction",   lastVisit: "2026-05-25" },
  { id: 6, name: "Ayesha Bibi",     age: 31, gender: "Female", contact: "0311-2223344", issue: "Gum Treatment",      lastVisit: "2026-05-18" },
  { id: 7, name: "Imran Sheikh",    age: 39, gender: "Male",   contact: "0322-6667788", issue: "Dental X-Ray",       lastVisit: "2026-05-12" },
  { id: 8, name: "Sana Waheed",     age: 26, gender: "Female", contact: "0301-0001122", issue: "Scaling & Polish",   lastVisit: "2026-04-28" },
  { id: 9, name: "Rizwan Haider",   age: 48, gender: "Male",   contact: "0315-3334455", issue: "Crown Placement",    lastVisit: "2026-04-20" },
  { id: 10, name: "Mariam Farooq",  age: 19, gender: "Female", contact: "0340-8889900", issue: "Wisdom Tooth",       lastVisit: "2026-04-15" },
];

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const avatarColors = [
  "#1565C0", "#0097A7", "#2E7D32", "#6A1B9A",
  "#AD1457", "#E65100", "#00695C", "#283593",
];

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
  searchCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px 28px",
    boxShadow: "0 2px 16px rgba(13,59,122,0.07)",
    border: "1px solid #E8EEF7",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  searchInputWrap: {
    flex: 1,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "12px 14px 12px 42px",
    borderRadius: "10px",
    border: "1.5px solid #CFD8DC",
    fontSize: "14px",
    color: "#263238",
    background: "#FAFCFE",
    outline: "none",
    fontFamily: ff,
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  searchBtn: {
    padding: "12px 28px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #1565C0, #0097A7)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: ff,
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(21,101,192,0.3)",
    transition: "opacity 0.18s ease",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultCount: {
    fontSize: "13px",
    color: "#78909C",
    fontWeight: "500",
    margin: 0,
  },
  highlight: { color: "#1565C0", fontWeight: "700" },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#0097A7",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
    fontFamily: ff,
    padding: 0,
  },
  table: {
    background: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(13,59,122,0.07)",
    border: "1px solid #E8EEF7",
    width: "100%",
  },
  tableHead: {
    background: "#F8FAFC",
    borderBottom: "2px solid #E8EEF7",
    display: "grid",
    gridTemplateColumns: "52px 1fr 80px 90px 160px 1fr 110px",
    padding: "12px 20px",
    gap: "8px",
    alignItems: "center",
  },
  th: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#90A4AE",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: 0,
  },
  tableBody: {
    display: "flex",
    flexDirection: "column",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "52px 1fr 80px 90px 160px 1fr 110px",
    padding: "14px 20px",
    gap: "8px",
    alignItems: "center",
    borderBottom: "1px solid #F4F6F9",
    transition: "background 0.15s ease",
  },
  tableRowHover: { background: "#F8FAFC" },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
    flexShrink: 0,
  },
  cellText: { fontSize: "13px", color: "#37474F", fontWeight: "500", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cellMuted: { fontSize: "12px", color: "#90A4AE", margin: 0 },
  badge: {
    display: "inline-flex",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 20px",
    gap: "12px",
    color: "#90A4AE",
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #E8EEF7",
  },
  emptyIcon: { fontSize: "40px" },
  emptyTitle: { fontSize: "16px", fontWeight: "600", color: "#546E7A", margin: 0 },
  emptyDesc: { fontSize: "13px", margin: 0 },
};

export default function SearchPatientPage({ onBack }) {
  const [query, setQuery] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = query.trim()
    ? DUMMY_PATIENTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    : DUMMY_PATIENTS;

  return (
    <div style={styles.page}>
      <Header showBack onBack={onBack} />

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div style={styles.breadcrumb}>
            <span>Dashboard</span>
            <span style={styles.breadcrumbSep}>›</span>
            <span style={styles.breadcrumbActive}>Search Patient</span>
          </div>
          <h2 style={styles.pageTitle}>Patient Records</h2>
          <p style={styles.pageDesc}>Search by name to find an existing patient record.</p>
        </div>

        {/* Search bar */}
        <div style={styles.searchCard}>
          <div style={styles.searchInputWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={{
                ...styles.searchInput,
                ...(inputFocus
                  ? { borderColor: "#1565C0", boxShadow: "0 0 0 3px rgba(21,101,192,0.1)" }
                  : {}),
              }}
              type="text"
              placeholder="Search by patient name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
          </div>
          <button style={styles.searchBtn} onClick={() => {}}>
            Search
          </button>
        </div>

        {/* Results meta */}
        <div style={styles.metaRow}>
          <p style={styles.resultCount}>
            Showing <span style={styles.highlight}>{filtered.length}</span> of{" "}
            {DUMMY_PATIENTS.length} patients
            {query && (
              <>
                {" "}matching <span style={styles.highlight}>"{query}"</span>
              </>
            )}
          </p>
          {query && (
            <button style={styles.clearBtn} onClick={() => setQuery("")}>
              ✕ Clear filter
            </button>
          )}
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div style={styles.table}>
            <div style={styles.tableHead}>
              <p style={styles.th}></p>
              <p style={styles.th}>Name</p>
              <p style={styles.th}>Age</p>
              <p style={styles.th}>Gender</p>
              <p style={styles.th}>Contact</p>
              <p style={styles.th}>Issue</p>
              <p style={styles.th}>Last Visit</p>
            </div>
            <div style={styles.tableBody}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  style={
                    hoveredRow === p.id
                      ? { ...styles.tableRow, ...styles.tableRowHover }
                      : styles.tableRow
                  }
                  onMouseEnter={() => setHoveredRow(p.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div
                    style={{
                      ...styles.avatar,
                      background: avatarColors[p.id % avatarColors.length],
                    }}
                  >
                    {getInitials(p.name)}
                  </div>
                  <p style={styles.cellText}>{p.name}</p>
                  <p style={styles.cellText}>{p.age} yrs</p>
                  <p style={styles.cellText}>{p.gender}</p>
                  <p style={{ ...styles.cellText, fontSize: "12px" }}>{p.contact}</p>
                  <p style={{ ...styles.cellText, color: "#0097A7" }}>{p.issue}</p>
                  <p style={{ ...styles.cellText, fontSize: "12px", color: "#90A4AE" }}>
                    {new Date(p.lastVisit).toLocaleDateString("en-PK", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🦷</span>
            <p style={styles.emptyTitle}>No patients found</p>
            <p style={styles.emptyDesc}>
              No records match "<strong>{query}</strong>". Try a different name.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}