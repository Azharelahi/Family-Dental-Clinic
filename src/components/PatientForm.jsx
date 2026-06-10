import { useState } from "react";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

const S = {
  form: { display: "flex", flexDirection: "column", gap: "24px", width: "100%" },
  sectionTitle: {
    fontSize: "11px", fontWeight: "700", color: "#90A4AE",
    textTransform: "uppercase", letterSpacing: "1px",
    margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "8px",
  },
  sectionLine: { flex: 1, height: "1px", background: "#E8EEF7" },
  section: { display: "flex", flexDirection: "column", gap: "16px" },
  row: { display: "flex", gap: "16px", flexWrap: "wrap" },
  field: { display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 220px", minWidth: 0 },
  fieldFull: { display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 100%" },
  label: { fontSize: "11px", fontWeight: "600", color: "#546E7A", letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: ff },
  required: { color: "#EF4444", marginLeft: "2px" },
  input: {
    padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #CFD8DC",
    fontSize: "14px", color: "#263238", background: "#FAFCFE", outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease", fontFamily: ff,
    width: "100%", boxSizing: "border-box",
  },
  inputFocus: { borderColor: "#1565C0", boxShadow: "0 0 0 3px rgba(21,101,192,0.1)" },
  select: {
    padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #CFD8DC",
    fontSize: "14px", color: "#263238", background: "#FAFCFE", outline: "none",
    cursor: "pointer", fontFamily: ff, width: "100%", boxSizing: "border-box",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23546E7A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px",
  },
  textarea: {
    padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #CFD8DC",
    fontSize: "14px", color: "#263238", background: "#FAFCFE", outline: "none",
    resize: "vertical", minHeight: "80px", fontFamily: ff,
    width: "100%", boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  divider: { height: "1px", background: "#E8EEF7", margin: "4px 0" },
  submitRow: { display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "4px" },
  resetBtn: {
    padding: "11px 28px", borderRadius: "10px", border: "1.5px solid #CFD8DC",
    background: "transparent", color: "#546E7A", fontSize: "14px", fontWeight: "500",
    cursor: "pointer", fontFamily: ff,
  },
  submitBtn: {
    padding: "11px 36px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #1565C0, #0097A7)",
    color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
    fontFamily: ff, boxShadow: "0 4px 14px rgba(21,101,192,0.3)",
    transition: "opacity 0.18s, transform 0.18s", letterSpacing: "0.2px",
  },
  successBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "14px 20px", borderRadius: "10px",
    background: "#E8F5E9", border: "1px solid #A5D6A7",
    color: "#2E7D32", fontSize: "14px", fontWeight: "500", fontFamily: ff,
  },
  hint: { fontSize: "11px", color: "#90A4AE", marginTop: "2px", fontFamily: ff },
};

const initial = {
  // Personal
  fullName: "", dateOfBirth: "", age: "", gender: "", phone: "", address: "",
  // Medical
  complaint: "", diagnosis: "", treatment: "", notes: "",
  // Status
  isActive: "Active",
};

export default function PatientForm() {
  const [form, setForm]       = useState(initial);
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);

  const set = (e) => { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); setSubmitted(false); };

  const inputStyle = (name) => ({ ...S.input, ...(focused === name ? S.inputFocus : {}) });
  const taStyle    = (name) => ({ ...S.textarea, ...(focused === name ? S.inputFocus : {}) });

  const handleSubmit = () => {
    const required = ["fullName", "dateOfBirth", "gender", "phone"];
    const missing = required.filter((k) => !form[k].trim());
    if (missing.length) { alert("Please fill all required fields (marked with *)."); return; }

const patientPayload = {
  full_name: form.fullName,
  date_of_birth: form.dateOfBirth,
  gender: form.gender,
  phone: form.phone,
  address: form.address,
  status: form.isActive,
};

const medicalPayload = {
  complaint: form.complaint,
  diagnosis: form.diagnosis,
  treatment: form.treatment,
  notes: form.notes,
};

console.log("=== PATIENT PAYLOAD ===");
console.table(patientPayload);

console.log("=== MEDICAL PAYLOAD ===");
console.table(medicalPayload);    setSubmitted(true);
    setForm(initial);
  };

  return (
    <div style={S.form}>
      {submitted && (
        <div style={S.successBanner}>
          ✅ Patient record saved successfully. Ready for backend integration.
        </div>
      )}

      {/* ── Section 1: Personal Info ── */}
      <div style={S.section}>
        <p style={S.sectionTitle}><span>👤 Personal Information</span><span style={S.sectionLine} /></p>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Full Name<span style={S.required}>*</span></label>
            <input style={inputStyle("fullName")} type="text" name="fullName" placeholder="e.g. Ahmed Raza"
              value={form.fullName} onChange={set} onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Date of Birth<span style={S.required}>*</span></label>
            <input style={inputStyle("dateOfBirth")} type="date" name="dateOfBirth"
              value={form.dateOfBirth} onChange={set} onFocus={() => setFocused("dateOfBirth")} onBlur={() => setFocused(null)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Age (years)</label>
            <input style={inputStyle("age")} type="number" name="age" placeholder="Auto-calculated or enter" min="1" max="120"
              value={form.age} onChange={set} onFocus={() => setFocused("age")} onBlur={() => setFocused(null)} />
            <p style={S.hint}>Leave blank to auto-calculate from DOB</p>
          </div>
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Gender<span style={S.required}>*</span></label>
            <select style={S.select} name="gender" value={form.gender} onChange={set}>
              <option value="">Select gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div style={S.field}>
            <label style={S.label}>Phone Number<span style={S.required}>*</span></label>
            <input style={inputStyle("phone")} type="tel" name="phone" placeholder="e.g. 0300-1234567"
              value={form.phone} onChange={set} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Status</label>
            <select style={S.select} name="isActive" value={form.isActive} onChange={set}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>

        <div style={S.fieldFull}>
          <label style={S.label}>Full Address</label>
          <input style={inputStyle("address")} type="text" name="address"
            placeholder="e.g. House 12, Block B, Gulshan-e-Iqbal, Karachi"
            value={form.address} onChange={set} onFocus={() => setFocused("address")} onBlur={() => setFocused(null)} />
        </div>
      </div>

      <div style={S.divider} />

      {/* ── Section 2: Medical Record ── */}
      <div style={S.section}>
        <p style={S.sectionTitle}><span>🩺 Medical Record</span><span style={S.sectionLine} /></p>

        <div style={S.fieldFull}>
          <label style={S.label}>Complaint / Reason of Visit</label>
          <textarea style={taStyle("complaint")} name="complaint"
            placeholder="Patient's chief complaint in their own words..."
            value={form.complaint} onChange={set} onFocus={() => setFocused("complaint")} onBlur={() => setFocused(null)} />
          <p style={S.hint}>Important: Do NOT store this inside the patient table — it belongs in the Medical Record.</p>
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Diagnosis</label>
            <textarea style={{ ...taStyle("diagnosis"), minHeight: "70px" }} name="diagnosis"
              placeholder="Clinical diagnosis after examination..."
              value={form.diagnosis} onChange={set} onFocus={() => setFocused("diagnosis")} onBlur={() => setFocused(null)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Treatment Plan</label>
            <textarea style={{ ...taStyle("treatment"), minHeight: "70px" }} name="treatment"
              placeholder="Proposed or administered treatment..."
              value={form.treatment} onChange={set} onFocus={() => setFocused("treatment")} onBlur={() => setFocused(null)} />
          </div>
        </div>

        <div style={S.fieldFull}>
          <label style={S.label}>Doctor's Notes</label>
          <textarea style={taStyle("notes")} name="notes"
            placeholder="Allergies, special instructions, follow-up reminders..."
            value={form.notes} onChange={set} onFocus={() => setFocused("notes")} onBlur={() => setFocused(null)} />
        </div>
      </div>

      <div style={S.divider} />

      <div style={S.submitRow}>
        <button style={S.resetBtn} onClick={() => { setForm(initial); setSubmitted(false); }}>Clear Form</button>
        <button
          style={submitHovered ? { ...S.submitBtn, opacity: 0.9, transform: "translateY(-1px)" } : S.submitBtn}
          onMouseEnter={() => setSubmitHovered(true)}
          onMouseLeave={() => setSubmitHovered(false)}
          onClick={handleSubmit}
        >
          Save Patient Record
        </button>
      </div>
    </div>
  );
}