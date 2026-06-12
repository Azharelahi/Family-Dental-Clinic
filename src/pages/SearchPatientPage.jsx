import { useState } from "react";
import Header                 from "../components/Header";
import PatientDetailModal     from "../components/PatientDetailModal";
import AssignAppointmentModal from "../components/AssignAppointmentModal";
import patients               from "../data/patients";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";
let data = window.api.getFrequentVisitors()
console.log("data inside this page is ",data)
function injectKF() {
  if (document.getElementById("search-kf")) return;
  const s = document.createElement("style");
  s.id = "search-kf";
  s.textContent = `
    @keyframes searchConfirmIn { from{opacity:0;transform:scale(0.92) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes searchEditIn    { from{opacity:0;transform:scale(0.94) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
  `;
  document.head.appendChild(s);
}

const AVATAR_COLORS = ["#1565C0","#0097A7","#2E7D32","#6A1B9A","#AD1457","#E65100","#00695C","#283593"];

function getInitials(name) {
  return name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"});
}

/**
 * Build the object PatientDetailModal expects.
 * Combines patient registry data + their most recent appointment from shared state.
 * TODO: Replace with → window.api.getPatientWithHistory(patientId)
 */
function buildModalData(patient, allAppointments) {
  const appts = allAppointments
    .filter(a => a.patientId === patient.patientId)
    .sort((a,b) => new Date(b.date) - new Date(a.date));
  const latest = appts[0] || {};
  return {
    name:        patient.name,
    patientId:   patient.patientId,
    age:         patient.age,
    gender:      patient.gender,
    phone:       patient.phone,
    address:     patient.address,
    dateOfBirth: patient.dateOfBirth,
    issue:       latest.issue     || "No recent appointment",
    complaint:   latest.complaint || "—",
    diagnosis:   latest.diagnosis || "—",
    treatment:   latest.treatment || "—",
    notes:       latest.notes     || "—",
    previousVisits: appts.slice(1).map(a=>({ date:a.date, reason:a.issue, doctor:a.doctor })),
  };
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page:    { minHeight:"100vh", background:"#F0F4F8", display:"flex", flexDirection:"column", fontFamily:ff },
  content: { flex:1, padding:"40px 60px", display:"flex", flexDirection:"column", gap:"24px", width:"100%", maxWidth:"1160px", margin:"0 auto", boxSizing:"border-box" },

  breadcrumb:       { display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", color:"#90A4AE", fontWeight:"500" },
  breadcrumbSep:    { color:"#CFD8DC" },
  breadcrumbActive: { color:"#1565C0" },
  pageTitle: { fontSize:"24px", fontWeight:"700", color:"#1A2E4A", margin:"6px 0 4px" },
  pageDesc:  { fontSize:"14px", color:"#78909C", margin:0 },

  searchCard: { background:"#fff", borderRadius:"16px", padding:"20px 24px", boxShadow:"0 2px 16px rgba(13,59,122,0.07)", border:"1px solid #E8EEF7", display:"flex", gap:"12px", alignItems:"center" },
  searchWrap: { flex:1, position:"relative" },
  searchIcon: { position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"16px", pointerEvents:"none" },
  searchInput: { width:"100%", padding:"11px 14px 11px 42px", borderRadius:"10px", border:"1.5px solid #CFD8DC", fontSize:"14px", color:"#263238", background:"#FAFCFE", outline:"none", fontFamily:ff, boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s" },
  searchBtn: { padding:"11px 26px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#1565C0,#0097A7)", color:"#fff", fontSize:"14px", fontWeight:"600", cursor:"pointer", fontFamily:ff, flexShrink:0, boxShadow:"0 4px 12px rgba(21,101,192,0.3)" },

  metaRow:     { display:"flex", alignItems:"center", justifyContent:"space-between" },
  resultCount: { fontSize:"13px", color:"#78909C", fontWeight:"500", margin:0 },
  highlight:   { color:"#1565C0", fontWeight:"700" },
  clearBtn:    { background:"none", border:"none", color:"#0097A7", fontSize:"13px", cursor:"pointer", fontWeight:"500", fontFamily:ff, padding:0 },

  tableWrap: { background:"#fff", borderRadius:"16px", overflow:"hidden", boxShadow:"0 2px 16px rgba(13,59,122,0.07)", border:"1px solid #E8EEF7" },
  tableHead: { background:"#F8FAFC", borderBottom:"2px solid #E8EEF7", display:"grid", gridTemplateColumns:"44px 1.6fr 70px 80px 150px 1fr 112px 80px", padding:"11px 20px", gap:"8px", alignItems:"center" },
  th:        { fontSize:"11px", fontWeight:"700", color:"#90A4AE", textTransform:"uppercase", letterSpacing:"0.8px", margin:0 },
  row:       { display:"grid", gridTemplateColumns:"44px 1.6fr 70px 80px 150px 1fr 112px 80px", padding:"13px 20px", gap:"8px", alignItems:"center", borderBottom:"1px solid #F4F6F9", cursor:"pointer", transition:"background 0.14s" },
  rowHover:  { background:"#F0F7FF" },
  avatar:    { width:"34px", height:"34px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"12px", fontWeight:"700", flexShrink:0 },
  cell:      { fontSize:"13px", color:"#37474F", fontWeight:"500", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  cellBlue:  { fontSize:"13px", color:"#0097A7", fontWeight:"600", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  cellMuted: { fontSize:"12px", color:"#90A4AE", margin:0, whiteSpace:"nowrap" },

  // 2x2 action grid
  actionGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px", width:"68px" },
  actionBtn:  { width:"32px", height:"32px", borderRadius:"7px", border:"1px solid #E8EEF7", background:"#F8FAFC", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"14px", transition:"background 0.14s, border-color 0.14s, transform 0.14s", flexShrink:0 },

  emptyState: { display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 20px", gap:"12px", color:"#90A4AE", background:"#fff", borderRadius:"16px", border:"1px solid #E8EEF7" },
  emptyIcon:  { fontSize:"40px" },
  emptyTitle: { fontSize:"16px", fontWeight:"600", color:"#546E7A", margin:0 },
  emptyDesc:  { fontSize:"13px", margin:0 },

  overlay: { position:"fixed", inset:0, background:"rgba(10,30,60,0.5)", backdropFilter:"blur(3px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" },

  confirmBox:   { background:"#fff", borderRadius:"18px", padding:"32px 28px", width:"360px", boxShadow:"0 20px 50px rgba(10,30,60,0.2)", animation:"searchConfirmIn 0.2s ease", display:"flex", flexDirection:"column", gap:"14px", alignItems:"center", textAlign:"center" },
  confirmIcon:  { fontSize:"34px" },
  confirmTitle: { fontSize:"17px", fontWeight:"700", color:"#1A2E4A", margin:0 },
  confirmSub:   { fontSize:"13px", color:"#78909C", margin:0, lineHeight:"1.6" },
  confirmBtns:  { display:"flex", gap:"12px" },
  cancelBtn:    { padding:"10px 22px", borderRadius:"10px", border:"1.5px solid #E8EEF7", background:"#fff", color:"#546E7A", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:ff },
  deleteBtn:    { padding:"10px 22px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#DC2626,#EF4444)", color:"#fff", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:ff },

  editBox:     { background:"#fff", borderRadius:"20px", width:"460px", overflow:"hidden", boxShadow:"0 20px 50px rgba(10,30,60,0.2)", animation:"searchEditIn 0.25s ease" },
  editHeader:  { background:"linear-gradient(135deg,#1565C0,#1976D2)", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  editTitle:   { fontSize:"15px", fontWeight:"700", color:"#fff", margin:0 },
  editClose:   { background:"rgba(255,255,255,0.12)", border:"none", color:"#fff", width:"28px", height:"28px", borderRadius:"50%", cursor:"pointer", fontSize:"14px" },
  editBody:    { padding:"22px 24px", display:"flex", flexDirection:"column", gap:"14px" },
  editRow:     { display:"flex", gap:"14px" },
  editField:   { display:"flex", flexDirection:"column", gap:"5px", flex:1 },
  editLabel:   { fontSize:"11px", fontWeight:"600", color:"#546E7A", textTransform:"uppercase", letterSpacing:"0.7px" },
  editInput:   { padding:"10px 12px", borderRadius:"9px", border:"1.5px solid #CFD8DC", fontSize:"13px", color:"#263238", background:"#FAFCFE", outline:"none", fontFamily:ff, width:"100%", boxSizing:"border-box" },
  editFooter:  { padding:"16px 24px", borderTop:"1px solid #E8EEF7", display:"flex", justifyContent:"flex-end", gap:"10px" },
  saveBtn:     { padding:"10px 24px", borderRadius:"9px", border:"none", background:"linear-gradient(135deg,#1565C0,#0097A7)", color:"#fff", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:ff },

  toast: { position:"fixed", bottom:"28px", right:"28px", background:"#1A2E4A", color:"#fff", padding:"12px 20px", borderRadius:"12px", fontSize:"13px", fontWeight:"500", boxShadow:"0 8px 24px rgba(10,30,60,0.25)", zIndex:2000, display:"flex", alignItems:"center", gap:"8px" },
};

// Single square action button
function ActionBtn({ title, emoji, hoverBg, hoverBorder, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      data-action="true"
      style={{ ...S.actionBtn, ...(hov ? { background:hoverBg, borderColor:hoverBorder, transform:"scale(1.1)" } : {}) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={e => { e.stopPropagation(); onClick(); }}
    >
      {emoji}
    </button>
  );
}

export default function SearchPatientPage({ onBack, appointments, onAddAppointment }) {
  injectKF();

  const [patientList,   setPatientList]   = useState(patients);
  const [query,         setQuery]         = useState("");
  const [inputFocus,    setInputFocus]    = useState(false);
  const [hoveredRow,    setHoveredRow]    = useState(null);

  const [viewPatient,   setViewPatient]   = useState(null);
  const [assignPatient, setAssignPatient] = useState(null);
  const [deletePatient, setDeletePatient] = useState(null);
  const [editPatient,   setEditPatient]   = useState(null);
  const [editForm,      setEditForm]      = useState({});
  const [toast,         setToast]         = useState(null);

  const filtered = query.trim()
    ? patientList.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : patientList;

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleRowClick = (patient, e) => {
    if (e.target.closest("[data-action]")) return;
    setViewPatient(patient);
  };

  const handleEditOpen = patient => {
    setEditPatient(patient);
    setEditForm({ name:patient.name, phone:patient.phone, age:patient.age, gender:patient.gender, address:patient.address });
  };

  const handleEditSave = () => {
    setPatientList(prev => prev.map(p => p.id === editPatient.id ? { ...p, ...editForm } : p));
    // TODO: window.api.updatePatient(editPatient.patientId, editForm)
    setEditPatient(null);
    showToast("✅ Patient info updated successfully");
  };

  const handleMarkCompleted = patient => {
    // TODO: window.api.markLatestAppointmentCompleted(patient.patientId)
    showToast(`✅ Latest appointment for ${patient.name} marked as completed`);
  };

  const handleDelete = patient => {
    setPatientList(prev => prev.filter(p => p.id !== patient.id));
    setDeletePatient(null);
    // TODO: window.api.deletePatient(patient.patientId)
    showToast(`🗑️ ${patient.name} removed from records`);
  };

  const handleAssignSave = newAppointment => {
    onAddAppointment(newAppointment);
    // TODO: window.api.createAppointment(newAppointment)
    showToast(`📅 New appointment assigned for ${newAppointment.name}`);
  };

  return (
    <div style={S.page}>
      <Header showBack onBack={onBack} />

      <div style={S.content}>
        <div>
          <div style={S.breadcrumb}>
            <span>Dashboard</span><span style={S.breadcrumbSep}>›</span>
            <span style={S.breadcrumbActive}>Search Patient</span>
          </div>
          <h2 style={S.pageTitle}>Patient Records</h2>
          <p style={S.pageDesc}>Click any row to view full details &amp; history. Use action buttons to manage each patient.</p>
        </div>

        {/* Search bar */}
        <div style={S.searchCard}>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>🔍</span>
            <input
              style={{ ...S.searchInput, ...(inputFocus ? { borderColor:"#1565C0", boxShadow:"0 0 0 3px rgba(21,101,192,0.1)" } : {}) }}
              type="text" placeholder="Search by patient name…"
              value={query} onChange={e => setQuery(e.target.value)}
              onFocus={() => setInputFocus(true)} onBlur={() => setInputFocus(false)}
            />
          </div>
          <button style={S.searchBtn}>Search</button>
        </div>

        {/* Meta */}
        <div style={S.metaRow}>
          <p style={S.resultCount}>
            Showing <span style={S.highlight}>{filtered.length}</span> of {patientList.length} patients
            {query && <> matching <span style={S.highlight}>"{query}"</span></>}
          </p>
          {query && <button style={S.clearBtn} onClick={() => setQuery("")}>✕ Clear filter</button>}
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div style={S.tableWrap}>
            <div style={S.tableHead}>
              <p style={S.th}></p>
              <p style={S.th}>Name</p>
              <p style={S.th}>Age</p>
              <p style={S.th}>Gender</p>
              <p style={S.th}>Phone</p>
              <p style={S.th}>Last Issue</p>
              <p style={S.th}>Last Visit</p>
              <p style={{ ...S.th, textAlign:"center" }}>Actions</p>
            </div>

            {filtered.map(p => (
              <div
                key={p.id}
                style={{ ...S.row, ...(hoveredRow === p.id ? S.rowHover : {}) }}
                onMouseEnter={() => setHoveredRow(p.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={e => handleRowClick(p, e)}
                title="Click to view patient details"
              >
                <div style={{ ...S.avatar, background: AVATAR_COLORS[p.id % AVATAR_COLORS.length] }}>
                  {getInitials(p.name)}
                </div>
                <p style={S.cell}>{p.name}</p>
                <p style={S.cell}>{p.age} yrs</p>
                <p style={S.cell}>{p.gender}</p>
                <p style={{ ...S.cell, fontSize:"12px" }}>{p.phone}</p>
                <p style={S.cellBlue}>
                  {(appointments.find(a => a.patientId === p.patientId) || {}).issue || "—"}
                </p>
                <p style={S.cellMuted}>{formatDate(p.lastVisit)}</p>

                {/* ── 2×2 Action button group ── */}
                <div style={S.actionGrid}>
                  <ActionBtn title="Edit patient info"                       emoji="✏️" hoverBg="#EFF8FF" hoverBorder="#93C5FD" onClick={() => handleEditOpen(p)} />
                  <ActionBtn title="Assign new appointment"                  emoji="📅" hoverBg="#F0FDF4" hoverBorder="#86EFAC" onClick={() => setAssignPatient(p)} />
                  <ActionBtn title="Mark latest appointment as completed"    emoji="✅" hoverBg="#FEFCE8" hoverBorder="#FDE047" onClick={() => handleMarkCompleted(p)} />
                  <ActionBtn title="Delete patient"                          emoji="🗑️" hoverBg="#FEF2F2" hoverBorder="#FCA5A5" onClick={() => setDeletePatient(p)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={S.emptyState}>
            <span style={S.emptyIcon}>🦷</span>
            <p style={S.emptyTitle}>No patients found</p>
            <p style={S.emptyDesc}>No records match "<strong>{query}</strong>". Try a different name.</p>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {viewPatient && (
        <PatientDetailModal
          appointment={buildModalData(viewPatient, appointments)}
          onClose={() => setViewPatient(null)}
        />
      )}

      {/* Assign Appointment Modal */}
      {assignPatient && (
        <AssignAppointmentModal
          patient={assignPatient}
          onSave={handleAssignSave}
          onClose={() => setAssignPatient(null)}
        />
      )}

      {/* Edit Patient Modal */}
      {editPatient && (
        <div style={S.overlay} onClick={() => setEditPatient(null)}>
          <div style={S.editBox} onClick={e => e.stopPropagation()}>
            <div style={S.editHeader}>
              <p style={S.editTitle}>✏️ Edit Patient — {editPatient.name}</p>
              <button style={S.editClose} onClick={() => setEditPatient(null)}>✕</button>
            </div>
            <div style={S.editBody}>
              <div style={S.editRow}>
                <div style={S.editField}>
                  <label style={S.editLabel}>Full Name</label>
                  <input style={S.editInput} value={editForm.name||""} onChange={e => setEditForm(p=>({...p,name:e.target.value}))} />
                </div>
                <div style={S.editField}>
                  <label style={S.editLabel}>Age</label>
                  <input style={S.editInput} type="number" value={editForm.age||""} onChange={e => setEditForm(p=>({...p,age:e.target.value}))} />
                </div>
              </div>
              <div style={S.editRow}>
                <div style={S.editField}>
                  <label style={S.editLabel}>Phone</label>
                  <input style={S.editInput} value={editForm.phone||""} onChange={e => setEditForm(p=>({...p,phone:e.target.value}))} />
                </div>
                <div style={S.editField}>
                  <label style={S.editLabel}>Gender</label>
                  <select style={S.editInput} value={editForm.gender||""} onChange={e => setEditForm(p=>({...p,gender:e.target.value}))}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div style={S.editField}>
                <label style={S.editLabel}>Address</label>
                <input style={S.editInput} value={editForm.address||""} onChange={e => setEditForm(p=>({...p,address:e.target.value}))} />
              </div>
            </div>
            <div style={S.editFooter}>
              <button style={S.cancelBtn} onClick={() => setEditPatient(null)}>Cancel</button>
              <button style={S.saveBtn} onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deletePatient && (
        <div style={S.overlay} onClick={() => setDeletePatient(null)}>
          <div style={S.confirmBox} onClick={e => e.stopPropagation()}>
            <span style={S.confirmIcon}>🗑️</span>
            <p style={S.confirmTitle}>Delete Patient?</p>
            <p style={S.confirmSub}>Removing <strong>{deletePatient.name}</strong> will permanently delete their record. This cannot be undone.</p>
            <div style={S.confirmBtns}>
              <button style={S.cancelBtn} onClick={() => setDeletePatient(null)}>Cancel</button>
              <button style={S.deleteBtn} onClick={() => handleDelete(deletePatient)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}