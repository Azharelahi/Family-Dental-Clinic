import { useState, useEffect } from "react";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

function injectKeyframes() {
  if (document.getElementById("assign-modal-kf")) return;
  const s = document.createElement("style");
  s.id = "assign-modal-kf";
  s.textContent = `
    @keyframes assignModalIn {
      from { opacity: 0; transform: scale(0.94) translateY(14px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes assignOverlayIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `;
  document.head.appendChild(s);
}

const DOCTORS = [
  "Dr. Saima Malik",
  "Dr. Hassan Qureshi",
  "Dr. Bilal Siddiqui",
];

const TREATMENTS = [
  "Root Canal",
  "Teeth Whitening",
  "Cavity Filling",
  "Braces Checkup",
  "Tooth Extraction",
  "Gum Treatment",
  "Dental X-Ray",
  "Scaling & Polishing",
  "Crown Placement",
  "Wisdom Tooth Consultation",
  "Routine Checkup",
  "Other",
];

const S = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(10,30,60,0.55)",
    backdropFilter: "blur(3px)",
    zIndex: 1100,
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "assignOverlayIn 0.2s ease",
    fontFamily: ff,
  },
  modal: {
    background: "#fff",
    borderRadius: "22px",
    width: "500px",
    maxWidth: "95vw",
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex", flexDirection: "column",
    boxShadow: "0 24px 60px rgba(10,30,60,0.2)",
    animation: "assignModalIn 0.25s cubic-bezier(0.22,1,0.36,1)",
  },
  header: {
    background: "linear-gradient(135deg, #00695C, #0097A7)",
    padding: "20px 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexShrink: 0,
  },
  headerLeft: { display: "flex", flexDirection: "column", gap: "3px" },
  headerTitle: { fontSize: "16px", fontWeight: "700", color: "#fff", margin: 0 },
  headerSub:   { fontSize: "12px", color: "rgba(255,255,255,0.65)", margin: 0 },
  closeBtn: {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff", fontSize: "16px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  patientBanner: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "16px 24px",
    background: "#F0FDF4", borderBottom: "1px solid #D1FAE5",
    flexShrink: 0,
  },
  patientAvatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    background: "linear-gradient(135deg, #00695C, #0097A7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: "13px", fontWeight: "700", flexShrink: 0,
  },
  patientName:  { fontSize: "14px", fontWeight: "700", color: "#065F46", margin: 0 },
  patientId:    { fontSize: "11px", color: "#059669", margin: 0 },
  body: {
    padding: "22px 24px",
    overflowY: "auto",
    display: "flex", flexDirection: "column", gap: "16px",
    flex: 1,
  },
  row: { display: "flex", gap: "14px" },
  field: { display: "flex", flexDirection: "column", gap: "5px", flex: 1 },
  label: {
    fontSize: "11px", fontWeight: "600", color: "#546E7A",
    textTransform: "uppercase", letterSpacing: "0.8px",
  },
  required: { color: "#EF4444", marginLeft: "2px" },
  input: {
    padding: "10px 13px", borderRadius: "10px",
    border: "1.5px solid #CFD8DC", fontSize: "13px",
    color: "#263238", background: "#FAFCFE",
    outline: "none", fontFamily: ff,
    width: "100%", boxSizing: "border-box",
    transition: "border-color 0.18s, box-shadow 0.18s",
  },
  inputFocus: {
    borderColor: "#0097A7",
    boxShadow: "0 0 0 3px rgba(0,151,167,0.1)",
  },
  select: {
    padding: "10px 13px", borderRadius: "10px",
    border: "1.5px solid #CFD8DC", fontSize: "13px",
    color: "#263238", background: "#FAFCFE",
    outline: "none", fontFamily: ff, cursor: "pointer",
    width: "100%", boxSizing: "border-box",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23546E7A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 13px center",
    paddingRight: "34px",
  },
  textarea: {
    padding: "10px 13px", borderRadius: "10px",
    border: "1.5px solid #CFD8DC", fontSize: "13px",
    color: "#263238", background: "#FAFCFE",
    outline: "none", fontFamily: ff, resize: "vertical", minHeight: "72px",
    width: "100%", boxSizing: "border-box",
    transition: "border-color 0.18s, box-shadow 0.18s",
  },
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid #E8EEF7",
    display: "flex", justifyContent: "flex-end", gap: "10px",
    flexShrink: 0,
  },
  cancelBtn: {
    padding: "10px 22px", borderRadius: "10px",
    border: "1.5px solid #CFD8DC", background: "#fff",
    color: "#546E7A", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: ff,
  },
  saveBtn: {
    padding: "10px 28px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #00695C, #0097A7)",
    color: "#fff", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: ff,
    boxShadow: "0 4px 12px rgba(0,151,167,0.3)",
  },
};

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const emptyForm = {
  date: "",
  time: "",
  doctor: DOCTORS[0],
  issue: "",
  complaint: "",
  notes: "",
};

export default function AssignAppointmentModal({ patient, onSave, onClose }) {
  const [form, setForm]     = useState(emptyForm);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    injectKeyframes();
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const inputStyle = (name) => ({ ...S.input,    ...(focused === name ? S.inputFocus : {}) });
  const taStyle    = (name) => ({ ...S.textarea, ...(focused === name ? S.inputFocus : {}) });

  const handleSave = () => {
    if (!form.date || !form.time || !form.issue) {
      alert("Please fill in Date, Time, and Treatment.");
      return;
    }

    /**
     * New appointment object — mirrors the DB schema.
     * TODO: Replace with API call → window.api.createAppointment(payload)
     * The `id` will be assigned by the backend; using Date.now() as temp client ID.
     */
    const newAppointment = {
      id:          Date.now(),
      patientId:   patient.patientId,
      name:        patient.name,
      age:         patient.age,
      gender:      patient.gender,
      phone:       patient.phone,
      address:     patient.address,
      dateOfBirth: patient.dateOfBirth,
      date:        form.date,
      time:        form.time,
      doctor:      form.doctor,
      issue:       form.issue,
      complaint:   form.complaint,
      diagnosis:   "",
      treatment:   form.issue,
      notes:       form.notes,
      status:      "Scheduled",
      previousVisits: [],
    };

    onSave(newAppointment);
    onClose();
  };

  return (
    <div style={S.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={S.modal}>

        {/* Header */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <p style={S.headerTitle}>📅 Assign New Appointment</p>
            <p style={S.headerSub}>Schedule a visit for this patient</p>
          </div>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Patient banner */}
        <div style={S.patientBanner}>
          <div style={S.patientAvatar}>{getInitials(patient.name)}</div>
          <div>
            <p style={S.patientName}>{patient.name}</p>
            <p style={S.patientId}>{patient.patientId} · Age {patient.age} · {patient.gender}</p>
          </div>
        </div>

        {/* Form */}
        <div style={S.body}>
          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>Date <span style={S.required}>*</span></label>
              <input
                style={inputStyle("date")} type="date" name="date"
                value={form.date} onChange={set}
                onFocus={() => setFocused("date")} onBlur={() => setFocused(null)}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Time <span style={S.required}>*</span></label>
              <input
                style={inputStyle("time")} type="text" name="time"
                placeholder="e.g. 10:30 AM"
                value={form.time} onChange={set}
                onFocus={() => setFocused("time")} onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Attending Doctor</label>
            <select style={S.select} name="doctor" value={form.doctor} onChange={set}>
              {DOCTORS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div style={S.field}>
            <label style={S.label}>Treatment / Issue <span style={S.required}>*</span></label>
            <select style={S.select} name="issue" value={form.issue} onChange={set}>
              <option value="">Select treatment type</option>
              {TREATMENTS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div style={S.field}>
            <label style={S.label}>Patient Complaint</label>
            <textarea
              style={taStyle("complaint")} name="complaint"
              placeholder="Brief description of the patient's complaint..."
              value={form.complaint} onChange={set}
              onFocus={() => setFocused("complaint")} onBlur={() => setFocused(null)}
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Additional Notes</label>
            <textarea
              style={{ ...taStyle("notes"), minHeight: "60px" }} name="notes"
              placeholder="Any special instructions or notes..."
              value={form.notes} onChange={set}
              onFocus={() => setFocused("notes")} onBlur={() => setFocused(null)}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={S.saveBtn} onClick={handleSave}>
            Save Appointment
          </button>
        </div>

      </div>
    </div>
  );
}