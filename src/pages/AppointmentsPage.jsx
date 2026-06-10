import { useState } from "react";
import Header from "../components/Header";
import AppointmentCard from "../components/AppointmentCard";
import PatientDetailModal from "../components/PatientDetailModal";
import appointments from "../data/appointments";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

function injectKeyframes() {
  if (document.getElementById("appt-keyframes")) return;
  const s = document.createElement("style");
  s.id = "appt-keyframes";
  s.textContent = `
    @keyframes confirmIn {
      from { opacity:0; transform:scale(0.92) translateY(10px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(s);
}

const sorted = [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date));

const S = {
  page: { minHeight: "100vh", background: "#F0F4F8", display: "flex", flexDirection: "column", fontFamily: ff },
  content: { flex: 1, padding: "40px 60px", display: "flex", flexDirection: "column", gap: "28px", boxSizing: "border-box" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#90A4AE", fontWeight: "500" },
  breadcrumbSep: { color: "#CFD8DC" },
  breadcrumbActive: { color: "#1565C0" },
  pageTitle: { fontSize: "24px", fontWeight: "700", color: "#1A2E4A", margin: "6px 0 4px" },
  pageDesc: { fontSize: "14px", color: "#78909C", margin: 0 },
  statsStrip: { display: "flex", gap: "16px", flexWrap: "wrap" },
  statPill: {
    background: "#fff", border: "1px solid #E8EEF7", borderRadius: "12px",
    padding: "14px 22px", display: "flex", alignItems: "center", gap: "12px",
    boxShadow: "0 1px 8px rgba(13,59,122,0.05)",
  },
  statIcon: { fontSize: "22px" },
  statVal: { fontSize: "18px", fontWeight: "700", color: "#1A2E4A", margin: 0 },
  statLbl: { fontSize: "11px", color: "#90A4AE", textTransform: "uppercase", letterSpacing: "0.7px", margin: 0 },
  filterRow: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" },
  filterLabel: { fontSize: "12px", color: "#90A4AE", fontWeight: "600", marginRight: "4px" },
  filterChip: {
    padding: "6px 16px", borderRadius: "20px",
    border: "1.5px solid #E8EEF7", background: "#fff",
    fontSize: "12px", fontWeight: "600", cursor: "pointer",
    color: "#546E7A", fontFamily: ff,
    transition: "all 0.15s ease",
  },
  filterChipActive: { background: "#1565C0", borderColor: "#1565C0", color: "#fff" },
  sectionLabel: {
    display: "flex", alignItems: "center", gap: "10px",
    fontSize: "11px", fontWeight: "700", color: "#90A4AE",
    letterSpacing: "1.5px", textTransform: "uppercase",
  },
  labelLine: { flex: 1, height: "1px", background: "#E0E7EF" },
  cardGrid: { display: "flex", flexWrap: "wrap", gap: "20px" },
  // Delete confirm overlay
  confirmOverlay: {
    position: "fixed", inset: 0, background: "rgba(10,30,60,0.5)",
    backdropFilter: "blur(3px)", zIndex: 999,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  confirmBox: {
    background: "#fff", borderRadius: "18px",
    padding: "32px 28px", width: "380px",
    boxShadow: "0 20px 50px rgba(10,30,60,0.2)",
    animation: "confirmIn 0.2s ease",
    display: "flex", flexDirection: "column", gap: "16px", alignItems: "center",
    textAlign: "center",
  },
  confirmIcon: { fontSize: "36px" },
  confirmTitle: { fontSize: "17px", fontWeight: "700", color: "#1A2E4A", margin: 0 },
  confirmSub: { fontSize: "13px", color: "#78909C", margin: 0, lineHeight: "1.6" },
  confirmBtns: { display: "flex", gap: "12px", marginTop: "4px" },
  cancelBtn: {
    padding: "10px 24px", borderRadius: "10px",
    border: "1.5px solid #E8EEF7", background: "#fff",
    color: "#546E7A", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: ff,
  },
  deleteConfirmBtn: {
    padding: "10px 24px", borderRadius: "10px",
    border: "none", background: "linear-gradient(135deg, #DC2626, #EF4444)",
    color: "#fff", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: ff,
    boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
  },
  // Edit modal (simple inline form)
  editOverlay: {
    position: "fixed", inset: 0, background: "rgba(10,30,60,0.5)",
    backdropFilter: "blur(3px)", zIndex: 999,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  editBox: {
    background: "#fff", borderRadius: "18px",
    padding: "0", width: "460px",
    boxShadow: "0 20px 50px rgba(10,30,60,0.2)",
    animation: "confirmIn 0.2s ease",
    overflow: "hidden",
  },
  editHeader: {
    background: "linear-gradient(135deg, #0d3b7a, #1565C0)",
    padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  editTitle: { fontSize: "15px", fontWeight: "700", color: "#fff", margin: 0 },
  editClose: {
    background: "rgba(255,255,255,0.12)", border: "none", color: "#fff",
    width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "14px",
  },
  editBody: { padding: "24px", display: "flex", flexDirection: "column", gap: "14px" },
  editField: { display: "flex", flexDirection: "column", gap: "5px" },
  editLabel: { fontSize: "11px", fontWeight: "600", color: "#546E7A", textTransform: "uppercase", letterSpacing: "0.7px" },
  editInput: {
    padding: "10px 12px", borderRadius: "9px",
    border: "1.5px solid #CFD8DC", fontSize: "13px",
    color: "#263238", background: "#FAFCFE", outline: "none", fontFamily: ff,
  },
  editFooter: {
    padding: "16px 24px", borderTop: "1px solid #E8EEF7",
    display: "flex", justifyContent: "flex-end", gap: "10px",
  },
  saveBtn: {
    padding: "10px 24px", borderRadius: "9px", border: "none",
    background: "linear-gradient(135deg, #1565C0, #0097A7)",
    color: "#fff", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: ff,
  },
};

const DOCTORS = ["Dr. Saima Malik", "Dr. Hassan Qureshi", "Dr. Bilal Siddiqui"];
const STATUSES = ["Scheduled", "Completed", "Cancelled"];
const FILTER_OPTIONS = ["All", "Scheduled", "Completed"];

export default function AppointmentsPage({ onBack }) {
  const [data, setData] = useState(sorted);
  const [filter, setFilter] = useState("All");
  const [viewAppt, setViewAppt] = useState(null);   // for detail modal
  const [deleteAppt, setDeleteAppt] = useState(null); // for confirm dialog
  const [editAppt, setEditAppt] = useState(null);   // for edit modal
  const [editForm, setEditForm] = useState({});

  injectKeyframes();

  const displayed = filter === "All" ? data : data.filter((a) => a.status === filter);
  const doctors = [...new Set(data.map((a) => a.doctor))];

  // ── Handlers ──────────────────────────────────────────────
  const handleDelete = (appt) => {
    setData((prev) => prev.filter((a) => a.id !== appt.id));
    setDeleteAppt(null);
    // TODO: window.api.deleteAppointment(appt.id)
  };

  const handleEditOpen = (appt) => {
    setEditAppt(appt);
    setEditForm({ date: appt.date, time: appt.time, doctor: appt.doctor, status: appt.status || "Scheduled" });
  };

  const handleEditSave = () => {
    setData((prev) =>
      prev.map((a) => a.id === editAppt.id ? { ...a, ...editForm } : a)
    );
    setEditAppt(null);
    // TODO: window.api.updateAppointment(editAppt.id, editForm)
  };

  return (
    <div style={S.page}>
      <Header showBack onBack={onBack} />

      <div style={S.content}>
        {/* Page heading */}
        <div>
          <div style={S.breadcrumb}>
            <span>Dashboard</span><span style={S.breadcrumbSep}>›</span>
            <span style={S.breadcrumbActive}>Scheduled Appointments</span>
          </div>
          <h2 style={S.pageTitle}>Appointment Schedule</h2>
          <p style={S.pageDesc}>All scheduled appointments — latest first. Click any card to view patient details.</p>
        </div>

        {/* Stats */}
        <div style={S.statsStrip}>
          {[
            { icon: "📋", val: data.length,                                       lbl: "Total" },
            { icon: "🟢", val: data.filter(a => a.status === "Scheduled").length, lbl: "Scheduled" },
            { icon: "✅", val: data.filter(a => a.status === "Completed").length, lbl: "Completed" },
            { icon: "👨‍⚕️", val: doctors.length,                                   lbl: "Doctors" },
          ].map((s) => (
            <div key={s.lbl} style={S.statPill}>
              <span style={S.statIcon}>{s.icon}</span>
              <div>
                <p style={S.statVal}>{s.val}</p>
                <p style={S.statLbl}>{s.lbl}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={S.filterRow}>
          <span style={S.filterLabel}>Filter:</span>
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              style={filter === f ? { ...S.filterChip, ...S.filterChipActive } : S.filterChip}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Section label */}
        <div style={S.sectionLabel}>
          <span>Appointments</span>
          <span style={S.labelLine} />
          <span style={{ whiteSpace: "nowrap" }}>{displayed.length} records</span>
        </div>

        {/* Cards */}
        <div style={S.cardGrid}>
          {displayed.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onView={setViewAppt}
              onEdit={handleEditOpen}
              onDelete={setDeleteAppt}
            />
          ))}
        </div>
      </div>

      {/* ── Patient Detail Modal ───────────────────────────── */}
      {viewAppt && (
        <PatientDetailModal appointment={viewAppt} onClose={() => setViewAppt(null)} />
      )}

      {/* ── Delete Confirm ────────────────────────────────── */}
      {deleteAppt && (
        <div style={S.confirmOverlay} onClick={() => setDeleteAppt(null)}>
          <div style={S.confirmBox} onClick={(e) => e.stopPropagation()}>
            <span style={S.confirmIcon}>🗑️</span>
            <p style={S.confirmTitle}>Delete Appointment?</p>
            <p style={S.confirmSub}>
              This will permanently remove <strong>{deleteAppt.name}</strong>'s appointment
              on {new Date(deleteAppt.date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}.
              This action cannot be undone.
            </p>
            <div style={S.confirmBtns}>
              <button style={S.cancelBtn} onClick={() => setDeleteAppt(null)}>Cancel</button>
              <button style={S.deleteConfirmBtn} onClick={() => handleDelete(deleteAppt)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ────────────────────────────────────── */}
      {editAppt && (
        <div style={S.editOverlay} onClick={() => setEditAppt(null)}>
          <div style={S.editBox} onClick={(e) => e.stopPropagation()}>
            <div style={S.editHeader}>
              <p style={S.editTitle}>Edit Appointment — {editAppt.name}</p>
              <button style={S.editClose} onClick={() => setEditAppt(null)}>✕</button>
            </div>
            <div style={S.editBody}>
              {[
                { key: "date", label: "Date", type: "date" },
                { key: "time", label: "Time", type: "text", placeholder: "e.g. 10:00 AM" },
              ].map((f) => (
                <div key={f.key} style={S.editField}>
                  <label style={S.editLabel}>{f.label}</label>
                  <input
                    style={S.editInput}
                    type={f.type}
                    value={editForm[f.key] || ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setEditForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div style={S.editField}>
                <label style={S.editLabel}>Doctor</label>
                <select
                  style={S.editInput}
                  value={editForm.doctor || ""}
                  onChange={(e) => setEditForm((p) => ({ ...p, doctor: e.target.value }))}
                >
                  {DOCTORS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={S.editField}>
                <label style={S.editLabel}>Status</label>
                <select
                  style={S.editInput}
                  value={editForm.status || "Scheduled"}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={S.editFooter}>
              <button style={S.cancelBtn} onClick={() => setEditAppt(null)}>Cancel</button>
              <button style={S.saveBtn} onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}