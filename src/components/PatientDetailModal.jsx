import { useState, useEffect } from "react";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

// Inject keyframes once
function injectModalKeyframes() {
  if (document.getElementById("modal-keyframes")) return;
  const s = document.createElement("style");
  s.id = "modal-keyframes";
  s.textContent = `
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.94) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes overlayIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `;
  document.head.appendChild(s);
}

const S = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(10,30,60,0.55)",
    backdropFilter: "blur(3px)",
    zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "overlayIn 0.2s ease",
    fontFamily: ff,
  },
  modal: {
    background: "#ffffff",
    borderRadius: "22px",
    width: "520px",
    maxWidth: "95vw",
    maxHeight: "85vh",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(10,30,60,0.22)",
    animation: "modalFadeIn 0.25s cubic-bezier(0.22,1,0.36,1)",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    background: "linear-gradient(135deg, #0d3b7a, #1565C0)",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: {
    width: "42px", height: "42px", borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: "16px", fontWeight: "700",
  },
  patientName: { fontSize: "16px", fontWeight: "700", color: "#fff", margin: 0 },
  patientId: { fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, marginTop: "2px" },
  closeBtn: {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff", fontSize: "16px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  // Option chooser (shown first)
  optionPane: {
    display: "flex", flexDirection: "column", gap: "16px",
    padding: "32px 28px",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: "14px", color: "#546E7A", margin: 0,
    fontWeight: "500", textAlign: "center",
  },
  optionBtns: { display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" },
  optionBtn: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
    padding: "22px 28px", borderRadius: "16px",
    border: "2px solid #E8EEF7", background: "#FAFCFE",
    cursor: "pointer", width: "190px",
    transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
    fontFamily: ff,
  },
  optionBtnHover: {
    borderColor: "#1565C0",
    boxShadow: "0 4px 20px rgba(21,101,192,0.15)",
    transform: "translateY(-2px)",
  },
  optionIcon: { fontSize: "32px" },
  optionLabel: { fontSize: "13px", fontWeight: "600", color: "#1A2E4A", margin: 0, textAlign: "center" },
  optionSub: { fontSize: "11px", color: "#90A4AE", margin: 0, textAlign: "center", lineHeight: "1.5" },
  // Detail views
  detailBody: { padding: "24px 28px", overflowY: "auto", flex: 1 },
  backBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "none", border: "none", cursor: "pointer",
    color: "#1565C0", fontSize: "13px", fontWeight: "600",
    fontFamily: ff, padding: "0 0 16px 0",
  },
  sectionTitle: {
    fontSize: "11px", fontWeight: "700", color: "#90A4AE",
    textTransform: "uppercase", letterSpacing: "1px",
    margin: "0 0 14px 0", display: "flex", alignItems: "center", gap: "8px",
  },
  sectionLine: { flex: 1, height: "1px", background: "#E8EEF7" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" },
  infoCard: {
    background: "#F8FAFC", borderRadius: "12px",
    padding: "14px 16px", border: "1px solid #E8EEF7",
  },
  infoLabel: {
    fontSize: "10px", fontWeight: "600", color: "#90A4AE",
    textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 4px 0",
  },
  infoValue: { fontSize: "14px", fontWeight: "600", color: "#1A2E4A", margin: 0 },
  // Medical history
  visitCard: {
    background: "#F8FAFC", borderRadius: "12px",
    padding: "14px 16px", border: "1px solid #E8EEF7",
    display: "flex", gap: "14px", alignItems: "flex-start",
    marginBottom: "10px",
  },
  visitDot: {
    width: "10px", height: "10px", borderRadius: "50%",
    background: "#1565C0", flexShrink: 0, marginTop: "5px",
  },
  visitDate: { fontSize: "11px", color: "#90A4AE", margin: "0 0 2px 0" },
  visitReason: { fontSize: "13px", fontWeight: "600", color: "#1A2E4A", margin: 0 },
  visitDoctor: { fontSize: "12px", color: "#546E7A", margin: "2px 0 0 0" },
  emptyVisits: {
    textAlign: "center", padding: "24px", color: "#90A4AE", fontSize: "13px",
    background: "#F8FAFC", borderRadius: "12px",
  },
  diagnosisBox: {
    background: "#EFF8FF", border: "1px solid #BFDBFE",
    borderRadius: "12px", padding: "14px 16px", marginBottom: "14px",
  },
  diagnosisLabel: { fontSize: "10px", fontWeight: "700", color: "#1565C0", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 4px 0" },
  diagnosisText: { fontSize: "13px", color: "#1A2E4A", margin: 0, lineHeight: "1.6" },
};

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Option chooser ───────────────────────────────────────────────────────────
function OptionChooser({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const options = [
    { id: "personal", icon: "👤", label: "Personal Details", sub: "Name · Phone · Age · Gender" },
    { id: "medical",  icon: "🩺", label: "Medical History",  sub: "Patient ID · Visits · Complaints" },
  ];
  return (
    <div style={S.optionPane}>
      <p style={S.optionTitle}>What would you like to view?</p>
      <div style={S.optionBtns}>
        {options.map((o) => (
          <button
            key={o.id}
            style={hovered === o.id ? { ...S.optionBtn, ...S.optionBtnHover } : S.optionBtn}
            onMouseEnter={() => setHovered(o.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(o.id)}
          >
            <span style={S.optionIcon}>{o.icon}</span>
            <p style={S.optionLabel}>{o.label}</p>
            <p style={S.optionSub}>{o.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Personal Details view ────────────────────────────────────────────────────
function PersonalDetails({ data, onBack }) {
  return (
    <div style={S.detailBody}>
      <button style={S.backBtn} onClick={onBack}>← Back to options</button>
      <p style={S.sectionTitle}>
        <span>Personal Information</span>
        <span style={S.sectionLine} />
      </p>
      <div style={S.grid2}>
        {[
          { label: "Full Name",     value: data.name },
          { label: "Phone Number",  value: data.phone },
          { label: "Age",           value: `${data.age} years old` },
          { label: "Gender",        value: data.gender },
          { label: "Date of Birth", value: data.dateOfBirth ? formatDate(data.dateOfBirth) : "—" },
          { label: "Patient ID",    value: data.patientId },
        ].map((item) => (
          <div key={item.label} style={S.infoCard}>
            <p style={S.infoLabel}>{item.label}</p>
            <p style={S.infoValue}>{item.value}</p>
          </div>
        ))}
      </div>
      <p style={S.sectionTitle}>
        <span>Address</span>
        <span style={S.sectionLine} />
      </p>
      <div style={{ ...S.infoCard, marginBottom: "8px" }}>
        <p style={S.infoLabel}>Full Address</p>
        <p style={{ ...S.infoValue, fontWeight: "500", fontSize: "13px" }}>{data.address || "—"}</p>
      </div>
    </div>
  );
}

// ─── Medical History view ─────────────────────────────────────────────────────
function MedicalHistory({ data, onBack }) {
  return (
    <div style={S.detailBody}>
      <button style={S.backBtn} onClick={onBack}>← Back to options</button>

      <p style={S.sectionTitle}>
        <span>Current Visit</span>
        <span style={S.sectionLine} />
      </p>
      <div style={S.grid2}>
        <div style={S.infoCard}>
          <p style={S.infoLabel}>Patient ID</p>
          <p style={S.infoValue}>{data.patientId}</p>
        </div>
        <div style={S.infoCard}>
          <p style={S.infoLabel}>Treatment</p>
          <p style={S.infoValue}>{data.issue}</p>
        </div>
      </div>

      <div style={{ ...S.diagnosisBox }}>
        <p style={S.diagnosisLabel}>Reason of Visit (Complaint)</p>
        <p style={S.diagnosisText}>{data.complaint || "—"}</p>
      </div>
      <div style={{ ...S.diagnosisBox, background: "#F0FDF4", borderColor: "#BBF7D0" }}>
        <p style={{ ...S.diagnosisLabel, color: "#15803D" }}>Diagnosis</p>
        <p style={S.diagnosisText}>{data.diagnosis || "—"}</p>
      </div>
      {data.notes && (
        <div style={{ ...S.diagnosisBox, background: "#FFFBEB", borderColor: "#FDE68A", marginBottom: "20px" }}>
          <p style={{ ...S.diagnosisLabel, color: "#92400E" }}>Doctor's Notes</p>
          <p style={S.diagnosisText}>{data.notes}</p>
        </div>
      )}

      <p style={S.sectionTitle}>
        <span>Previous Visits</span>
        <span style={S.sectionLine} />
        <span style={{ whiteSpace: "nowrap", fontSize: "11px" }}>
          {data.previousVisits?.length || 0} record{data.previousVisits?.length !== 1 ? "s" : ""}
        </span>
      </p>
      {data.previousVisits && data.previousVisits.length > 0 ? (
        data.previousVisits.map((v, i) => (
          <div key={i} style={S.visitCard}>
            <div style={S.visitDot} />
            <div>
              <p style={S.visitDate}>{formatDate(v.date)}</p>
              <p style={S.visitReason}>{v.reason}</p>
              <p style={S.visitDoctor}>{v.doctor}</p>
            </div>
          </div>
        ))
      ) : (
        <div style={S.emptyVisits}>No previous visit records found.</div>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function PatientDetailModal({ appointment, onClose }) {
  const [view, setView] = useState("options"); // "options" | "personal" | "medical"

  useEffect(() => {
    injectModalKeyframes();
    // Close on Escape
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div style={S.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.modal}>
        {/* Header */}
        <div style={S.modalHeader}>
          <div style={S.headerLeft}>
            <div style={S.avatar}>{getInitials(appointment.name)}</div>
            <div>
              <p style={S.patientName}>{appointment.name}</p>
              <p style={S.patientId}>{appointment.patientId} · {appointment.issue}</p>
            </div>
          </div>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        {view === "options"  && <OptionChooser onSelect={setView} />}
        {view === "personal" && <PersonalDetails data={appointment} onBack={() => setView("options")} />}
        {view === "medical"  && <MedicalHistory  data={appointment} onBack={() => setView("options")} />}
      </div>
    </div>
  );
}