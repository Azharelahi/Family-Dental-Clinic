import { useState, useEffect } from "react";
import Header          from "../components/Header";
import AppointmentCard from "../components/AppointmentCard";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

// ── Constants (module scope — correct) ────────────────────────────────────
const DOCTORS  = ["Kainat Niaz", "Nida Niaz", "Amna Niaz"];
const STATUSES = ["Scheduled", "Completed", "Cancelled"];

function injectKF() {
  if (document.getElementById("appt-kf")) return;
  const s = document.createElement("style");
  s.id = "appt-kf";
  s.textContent = `
    @keyframes apptIn {
      from { opacity:0; transform:scale(0.93) translateY(10px); }
      to   { opacity:1; transform:scale(1)    translateY(0);    }
    }
    @keyframes panelSlideIn {
      from { opacity:0; transform:translateX(40px); }
      to   { opacity:1; transform:translateX(0);    }
    }
  `;
  document.head.appendChild(s);
}

const S = {
  page:    { minHeight:"100vh", background:"#F0F4F8", display:"flex", flexDirection:"column", fontFamily:ff },
  content: { flex:1, padding:"40px 60px", display:"flex", flexDirection:"column", gap:"28px", boxSizing:"border-box" },

  breadcrumb:       { display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", color:"#90A4AE", fontWeight:"500" },
  breadcrumbSep:    { color:"#CFD8DC" },
  breadcrumbActive: { color:"#1565C0" },

  headingRow: {
    display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px", flexWrap:"wrap",
  },
  headingLeft: { display:"flex", flexDirection:"column", gap:"4px" },
  pageTitle:   { fontSize:"24px", fontWeight:"700", color:"#1A2E4A", margin:0 },
  pageDesc:    { fontSize:"14px", color:"#78909C", margin:0 },
  newBadge:    { display:"inline-flex", padding:"2px 8px", borderRadius:"20px", background:"#DCFCE7", color:"#15803D", fontSize:"10px", fontWeight:"700", marginLeft:"8px", verticalAlign:"middle" },

  completedBtn: {
    display:"flex", alignItems:"center", gap:"8px",
    padding:"10px 20px", borderRadius:"12px", border:"none",
    background:"linear-gradient(135deg,#2E7D32,#43A047)",
    color:"#fff", fontSize:"13px", fontWeight:"600",
    cursor:"pointer", fontFamily:ff, flexShrink:0,
    boxShadow:"0 4px 14px rgba(46,125,50,0.3)",
    transition:"opacity 0.18s, transform 0.18s",
  },
  completedBtnBadge: {
    background:"rgba(255,255,255,0.25)", borderRadius:"20px",
    padding:"1px 8px", fontSize:"12px", fontWeight:"700",
  },

  statsStrip: { display:"flex", gap:"16px", flexWrap:"wrap" },
  statPill:   { background:"#fff", border:"1px solid #E8EEF7", borderRadius:"12px", padding:"14px 22px", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 1px 8px rgba(13,59,122,0.05)" },
  statIcon:   { fontSize:"22px" },
  statVal:    { fontSize:"18px", fontWeight:"700", color:"#1A2E4A", margin:0 },
  statLbl:    { fontSize:"11px", color:"#90A4AE", textTransform:"uppercase", letterSpacing:"0.7px", margin:0 },

  sectionLabel: { display:"flex", alignItems:"center", gap:"10px", fontSize:"11px", fontWeight:"700", color:"#90A4AE", letterSpacing:"1.5px", textTransform:"uppercase" },
  labelLine:    { flex:1, height:"1px", background:"#E0E7EF" },

  cardGrid: { display:"flex", flexWrap:"wrap", gap:"20px" },

  emptyState: { display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 20px", gap:"12px", color:"#90A4AE" },
  emptyIcon:  { fontSize:"48px" },
  emptyTitle: { fontSize:"16px", fontWeight:"600", color:"#546E7A", margin:0 },
  emptyDesc:  { fontSize:"13px", color:"#90A4AE", margin:0 },

  panelOverlay: {
    position:"fixed", inset:0,
    background:"rgba(10,30,60,0.45)",
    backdropFilter:"blur(3px)",
    zIndex:900,
    display:"flex", justifyContent:"flex-end",
  },
  panel: {
    width:"520px", maxWidth:"95vw",
    background:"#F0F4F8",
    height:"100vh",
    display:"flex", flexDirection:"column",
    boxShadow:"-8px 0 40px rgba(10,30,60,0.18)",
    animation:"panelSlideIn 0.28s cubic-bezier(0.22,1,0.36,1)",
    overflow:"hidden",
  },
  panelHeader: {
    background:"linear-gradient(135deg,#1B5E20,#2E7D32)",
    padding:"22px 24px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
    flexShrink:0,
  },
  panelHeaderLeft: { display:"flex", flexDirection:"column", gap:"3px" },
  panelTitle: { fontSize:"17px", fontWeight:"700", color:"#fff", margin:0 },
  panelSub:   { fontSize:"12px", color:"rgba(255,255,255,0.65)", margin:0 },
  panelCloseBtn: {
    width:"32px", height:"32px", borderRadius:"50%",
    background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)",
    color:"#fff", fontSize:"16px", cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  panelBody: {
    flex:1, overflowY:"auto", padding:"20px",
    display:"flex", flexDirection:"column", gap:"12px",
  },

  overlay: { position:"fixed", inset:0, background:"rgba(10,30,60,0.5)", backdropFilter:"blur(3px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" },

  confirmBox:   { background:"#fff", borderRadius:"18px", padding:"32px 28px", width:"380px", boxShadow:"0 20px 50px rgba(10,30,60,0.2)", animation:"apptIn 0.2s ease", display:"flex", flexDirection:"column", gap:"16px", alignItems:"center", textAlign:"center" },
  confirmIcon:  { fontSize:"36px" },
  confirmTitle: { fontSize:"17px", fontWeight:"700", color:"#1A2E4A", margin:0 },
  confirmSub:   { fontSize:"13px", color:"#78909C", margin:0, lineHeight:"1.6" },
  confirmBtns:  { display:"flex", gap:"12px" },
  cancelBtn:    { padding:"10px 24px", borderRadius:"10px", border:"1.5px solid #E8EEF7", background:"#fff", color:"#546E7A", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:ff },
  deleteBtn:    { padding:"10px 24px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#DC2626,#EF4444)", color:"#fff", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:ff },
  completeConfirmBtn: { padding:"10px 24px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#2E7D32,#43A047)", color:"#fff", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:ff },

  editBox:    { background:"#fff", borderRadius:"18px", width:"460px", overflow:"hidden", boxShadow:"0 20px 50px rgba(10,30,60,0.2)", animation:"apptIn 0.2s ease" },
  editHeader: { background:"linear-gradient(135deg,#0d3b7a,#1565C0)", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" },
  editTitle:  { fontSize:"15px", fontWeight:"700", color:"#fff", margin:0 },
  editClose:  { background:"rgba(255,255,255,0.12)", border:"none", color:"#fff", width:"28px", height:"28px", borderRadius:"50%", cursor:"pointer", fontSize:"14px" },
  editBody:   { padding:"24px", display:"flex", flexDirection:"column", gap:"14px" },
  editField:  { display:"flex", flexDirection:"column", gap:"5px" },
  editLabel:  { fontSize:"11px", fontWeight:"600", color:"#546E7A", textTransform:"uppercase", letterSpacing:"0.7px" },
  editInput:  { padding:"10px 12px", borderRadius:"9px", border:"1.5px solid #CFD8DC", fontSize:"13px", color:"#263238", background:"#FAFCFE", outline:"none", fontFamily:ff },
  editFooter: { padding:"16px 24px", borderTop:"1px solid #E8EEF7", display:"flex", justifyContent:"flex-end", gap:"10px" },
  saveBtn:    { padding:"10px 24px", borderRadius:"9px", border:"none", background:"linear-gradient(135deg,#1565C0,#0097A7)", color:"#fff", fontSize:"13px", fontWeight:"600", cursor:"pointer", fontFamily:ff },
};

export default function AppointmentsPage({ onBack, appointments, setAppointments }) {
  injectKF();

  // ── BUG FIX 1: useEffect and loadAppointments were floating outside the
  //   component at module scope — moved inside the component so they have
  //   access to React state and hooks are called in the right context.
  useEffect(() => {
    loadAppointments();
  }, []);

  // ── BUG FIX 2: loadAppointments was defined at module scope with no access
  //   to setAppointments. Moved inside component and normalized data inline.
  const loadAppointments = async () => {
    try {
      const ScheduledAppointmentsdata = await window.api.getScheduledAppointments();
      const CompletedAppointmentsdata = await window.api.getCompletedAppointments();
      const CancelledAppointmentsdata = await window.api.getCancelledAppointments();
console.log("Scheduled appointments data from API:", ScheduledAppointmentsdata);
console.log("Completed appointments data from API:", CompletedAppointmentsdata);
console.log("Cancelled appointments data from API:", CancelledAppointmentsdata);
      // ── BUG FIX 3: `normalized` was computed at module scope referencing
      //   an undefined `data` variable. Moved here where `data` actually exists.
      const normalized = data.map(a => ({
        id:     a.id,
        name:   a.name,
        date:   a.appointment_date,
        time:   a.appointment_time,
        doctor: a.doctor,
        issue:  a.purpose,
        status: a.status,
      }));

      setAppointments(normalized);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  };

  const sorted = [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date));

  const scheduledList = sorted.filter(a => (a.status || "Scheduled") === "Scheduled");
  const completedList = sorted.filter(a => a.status === "Completed");

  const [showCompleted,    setShowCompleted]    = useState(false);
  const [completeAppt,     setCompleteAppt]     = useState(null);
  const [deleteAppt,       setDeleteAppt]       = useState(null);
  const [editAppt,         setEditAppt]         = useState(null);
  const [editForm,         setEditForm]         = useState({});
  const [completedBtnHov,  setCompletedBtnHov]  = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleComplete = (appt) => {
    setAppointments(prev =>
      prev.map(a => a.id === appt.id ? { ...a, status: "Completed" } : a)
    );
    setCompleteAppt(null);
  };

  const handleDelete = (appt) => {
    setAppointments(prev => prev.filter(a => a.id !== appt.id));
    setDeleteAppt(null);
  };

  const handleEditOpen = (appt) => {
    setEditAppt(appt);
    setEditForm({ date: appt.date, time: appt.time, doctor: appt.doctor, status: appt.status || "Scheduled" });
  };

  const handleEditSave = () => {
    setAppointments(prev => prev.map(a => a.id === editAppt.id ? { ...a, ...editForm } : a));
    setEditAppt(null);
  };

  // ── BUG FIX 4: appointments.some(...) could throw if appointments is
  //   undefined/null on the first render. Guard with optional chaining.
  const hasNewAppointment = appointments?.some(a => a.id > 1000000000000) ?? false;

  return (
    <div style={S.page}>
      <Header showBack onBack={onBack} />

      <div style={S.content}>

        {/* ── Heading row ──────────────────────────────────────────────── */}
        <div>
          <div style={S.breadcrumb}>
            <span>Dashboard</span>
            <span style={S.breadcrumbSep}>›</span>
            <span style={S.breadcrumbActive}>Scheduled Appointments</span>
          </div>

          <div style={S.headingRow}>
            <div style={S.headingLeft}>
              <h2 style={S.pageTitle}>
                Appointment Schedule
                {hasNewAppointment && (
                  <span style={S.newBadge}>NEW</span>
                )}
              </h2>
              <p style={S.pageDesc}>
                Active scheduled appointments. Click ✅ to complete, ✏️ to edit, 🗑️ to delete.
              </p>
            </div>

            <button
              style={{
                ...S.completedBtn,
                ...(completedBtnHov ? { opacity:0.88, transform:"translateY(-1px)" } : {}),
              }}
              onMouseEnter={() => setCompletedBtnHov(true)}
              onMouseLeave={() => setCompletedBtnHov(false)}
              onClick={() => setShowCompleted(true)}
            >
              ✅ Completed Appointments
              <span style={S.completedBtnBadge}>{completedList.length}</span>
            </button>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <div style={S.statsStrip}>
          {[
            { icon:"📋", val: sorted.length,        lbl:"Total"     },
            { icon:"🟢", val: scheduledList.length,  lbl:"Scheduled" },
            { icon:"✅", val: completedList.length,  lbl:"Completed" },
            { icon:"👨‍⚕️", val: [...new Set(sorted.map(a => a.doctor))].length, lbl:"Doctors" },
          ].map(s => (
            <div key={s.lbl} style={S.statPill}>
              <span style={S.statIcon}>{s.icon}</span>
              <div><p style={S.statVal}>{s.val}</p><p style={S.statLbl}>{s.lbl}</p></div>
            </div>
          ))}
        </div>

        {/* ── Section label ─────────────────────────────────────────────── */}
        <div style={S.sectionLabel}>
          <span>Scheduled</span>
          <span style={S.labelLine} />
          <span style={{ whiteSpace:"nowrap" }}>{scheduledList.length} records</span>
        </div>

        {/* ── Scheduled cards ───────────────────────────────────────────── */}
        {scheduledList.length > 0 ? (
          <div style={S.cardGrid}>
            {scheduledList.map(appt => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onEdit={handleEditOpen}
                onComplete={setCompleteAppt}
                onDelete={setDeleteAppt}
              />
            ))}
          </div>
        ) : (
          <div style={S.emptyState}>
            <span style={S.emptyIcon}>🗓️</span>
            <p style={S.emptyTitle}>No scheduled appointments</p>
            <p style={S.emptyDesc}>All appointments have been completed or removed.</p>
          </div>
        )}

      </div>

      {/* ── Completed Appointments — slide-in side panel ─────────────── */}
      {showCompleted && (
        <div style={S.panelOverlay} onClick={() => setShowCompleted(false)}>
          <div style={S.panel} onClick={e => e.stopPropagation()}>

            <div style={S.panelHeader}>
              <div style={S.panelHeaderLeft}>
                <p style={S.panelTitle}>✅ Completed Appointments</p>
                <p style={S.panelSub}>{completedList.length} appointment{completedList.length !== 1 ? "s" : ""} completed</p>
              </div>
              <button style={S.panelCloseBtn} onClick={() => setShowCompleted(false)}>✕</button>
            </div>

            <div style={S.panelBody}>
              {completedList.length > 0 ? (
                completedList.map(appt => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    onEdit={handleEditOpen}
                    onComplete={() => {}}
                    onDelete={setDeleteAppt}
                  />
                ))
              ) : (
                <div style={{ ...S.emptyState, padding:"40px 20px" }}>
                  <span style={S.emptyIcon}>✅</span>
                  <p style={S.emptyTitle}>No completed appointments yet</p>
                  <p style={S.emptyDesc}>Mark appointments as done using the ✅ button on each card.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Mark Complete Confirm ─────────────────────────────────────── */}
      {completeAppt && (
        <div style={S.overlay} onClick={() => setCompleteAppt(null)}>
          <div style={S.confirmBox} onClick={e => e.stopPropagation()}>
            <span style={S.confirmIcon}>✅</span>
            <p style={S.confirmTitle}>Mark as Completed?</p>
            <p style={S.confirmSub}>
              Mark <strong>{completeAppt.name}</strong>'s appointment as completed?
              It will disappear from the main schedule and move to Completed Appointments.
            </p>
            <div style={S.confirmBtns}>
              <button style={S.cancelBtn} onClick={() => setCompleteAppt(null)}>Cancel</button>
              <button style={S.completeConfirmBtn} onClick={() => handleComplete(completeAppt)}>
                Yes, Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ───────────────────────────────────────────── */}
      {deleteAppt && (
        <div style={S.overlay} onClick={() => setDeleteAppt(null)}>
          <div style={S.confirmBox} onClick={e => e.stopPropagation()}>
            <span style={S.confirmIcon}>🗑️</span>
            <p style={S.confirmTitle}>Delete Appointment?</p>
            <p style={S.confirmSub}>
              Remove <strong>{deleteAppt.name}</strong>'s appointment on{" "}
              {new Date(deleteAppt.date).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" })}?
              This cannot be undone.
            </p>
            <div style={S.confirmBtns}>
              <button style={S.cancelBtn} onClick={() => setDeleteAppt(null)}>Cancel</button>
              <button style={S.deleteBtn} onClick={() => handleDelete(deleteAppt)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ───────────────────────────────────────────────── */}
      {editAppt && (
        <div style={S.overlay} onClick={() => setEditAppt(null)}>
          <div style={S.editBox} onClick={e => e.stopPropagation()}>
            <div style={S.editHeader}>
              <p style={S.editTitle}>Edit Appointment — {editAppt.name}</p>
              <button style={S.editClose} onClick={() => setEditAppt(null)}>✕</button>
            </div>
            <div style={S.editBody}>
              {[
                { key:"date", label:"Date", type:"date" },
                { key:"time", label:"Time", type:"text", placeholder:"e.g. 10:00 AM" },
              ].map(f => (
                <div key={f.key} style={S.editField}>
                  <label style={S.editLabel}>{f.label}</label>
                  <input
                    style={S.editInput}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={editForm[f.key] || ""}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div style={S.editField}>
                <label style={S.editLabel}>Doctor</label>
                <select style={S.editInput} value={editForm.doctor || ""} onChange={e => setEditForm(p => ({ ...p, doctor: e.target.value }))}>
                  {DOCTORS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={S.editField}>
                <label style={S.editLabel}>Status</label>
                <select style={S.editInput} value={editForm.status || "Scheduled"} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
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