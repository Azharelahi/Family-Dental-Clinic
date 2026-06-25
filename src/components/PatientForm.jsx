import { useState } from "react";
import toast from "react-hot-toast";
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
  errorBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "14px 20px", borderRadius: "10px",
    background: "#FFEBEE", border: "1px solid #EF9A9A",
    color: "#C62828", fontSize: "14px", fontWeight: "500", fontFamily: ff,
  },
  hint: { fontSize: "11px", color: "#90A4AE", marginTop: "2px", fontFamily: ff },
};

const PROBLEM_TREATMENT_MAP = {
  "Tooth Decay / Cavity": "Dental Filling (Composite/Amalgam)",
  "Tooth Pain / Toothache": "Pain Relief + RCT Evaluation",
  "Gum Bleeding / Gingivitis": "Scaling & Polishing",
  "Tooth Sensitivity": "Desensitizing Treatment / Fluoride Application",
  "Broken / Chipped Tooth": "Tooth Restoration / Crown",
  "Wisdom Tooth Pain": "Wisdom Tooth Extraction",
  "Tooth Decay (Severe) / Pulp Infection": "Root Canal Treatment (RCT)",
  "Loose Tooth": "Splinting / Extraction",
  "Bad Breath (Halitosis)": "Oral Prophylaxis & Hygiene Instructions",
  "Misaligned Teeth": "Orthodontic Consultation / Braces",
  "Tooth Loss / Missing Tooth": "Dental Implant / Bridge / Denture",
  "Mouth Ulcers": "Topical Medication / Symptomatic Treatment",
  "Jaw Pain (TMJ)": "TMJ Therapy / Night Guard",
  "Dental Checkup / Routine Visit": "Routine Cleaning & Examination",
  "Other": "",
};

const PROBLEM_OPTIONS = Object.keys(PROBLEM_TREATMENT_MAP);

const TREATMENT_OPTIONS = [
  "Dental Filling (Composite/Amalgam)",
  "Pain Relief + RCT Evaluation",
  "Scaling & Polishing",
  "Desensitizing Treatment / Fluoride Application",
  "Tooth Restoration / Crown",
  "Wisdom Tooth Extraction",
  "Root Canal Treatment (RCT)",
  "Splinting / Extraction",
  "Oral Prophylaxis & Hygiene Instructions",
  "Orthodontic Consultation / Braces",
  "Dental Implant / Bridge / Denture",
  "Topical Medication / Symptomatic Treatment",
  "TMJ Therapy / Night Guard",
  "Routine Cleaning & Examination",
  "Other",
];

const initial = {
  fullName: "", age: "", gender: "", phone: "", address: "",
  complaint: "", complaintOther: "",
  treatment: "", treatmentOther: "",
  diagnosis: "", notes: "",
};

function ageToDob(age) {
  const n = parseInt(age, 10);
  if (!n || n <= 0) return "";
  const birthYear = new Date().getFullYear() - n;
  return `${birthYear}-01-01`;
}

function sanitizeName(raw) {
  const lettersOnly = raw.replace(/[^a-zA-Z\s]/g, "");
  const collapsedSpaces = lettersOnly.replace(/\s{2,}/g, " ");
  const words = collapsedSpaces.split(" ");
  if (words.length > 3) return words.slice(0, 3).join(" ");
  return collapsedSpaces.replace(/^\s+/, "");
}

function sanitizePhone(raw) {
  let digits = raw.replace(/\D/g, "");
  digits = digits.slice(0, 11);
  if (digits.length === 0) return "";
  if (digits[0] !== "0") digits = "0" + digits.slice(0, 10);
  if (digits.length >= 2 && digits[1] !== "3") {
    digits = digits[0] + "3" + digits.slice(2, 10);
    digits = digits.slice(0, 11);
  }
  return digits;
}

function isValidPhone(phone) {
  return /^03\d{9}$/.test(phone);
}

export default function PatientForm() {
  const [form,          setForm]          = useState(initial);
  const [focused,       setFocused]       = useState(null);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [success,       setSuccess]       = useState(null);
  const [error,         setError]         = useState(null);

  const clearBanners = () => { setSuccess(null); setError(null); };

  const set = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    clearBanners();
  };

  const setName = (e) => {
    setForm((p) => ({ ...p, fullName: sanitizeName(e.target.value) }));
    clearBanners();
  };

  const setPhone = (e) => {
    setForm((p) => ({ ...p, phone: sanitizePhone(e.target.value) }));
    clearBanners();
  };

  const setComplaint = (e) => {
    const value = e.target.value;
    setForm((p) => ({
      ...p,
      complaint: value,
      treatment: value === "Other" ? p.treatment : (PROBLEM_TREATMENT_MAP[value] || p.treatment),
    }));
    clearBanners();
  };

  const inputStyle = (name) => ({ ...S.input,    ...(focused === name ? S.inputFocus : {}) });
  const taStyle    = (name) => ({ ...S.textarea, ...(focused === name ? S.inputFocus : {}) });

  const handleSubmit = async () => {
    clearBanners();

    const required = ["fullName", "age", "gender", "phone"];
    const missing = required.filter((k) => !form[k].trim());
    if (missing.length) { setError("Please fill all required fields (marked with *)."); return; }

    if (form.fullName.trim().length < 2) {
      setError("Please enter a valid name."); return;
    }

    if (!isValidPhone(form.phone)) {
      setError("Phone number must be exactly 11 digits and start with 03 (e.g. 03001234567)."); return;
    }

    const finalComplaint = form.complaint === "Other" ? form.complaintOther.trim() : form.complaint;
    const finalTreatment = form.treatment === "Other" ? form.treatmentOther.trim() : form.treatment;

    if (form.complaint === "Other" && !finalComplaint) { setError("Please write the problem since 'Other' was selected."); return; }
    if (form.treatment === "Other" && !finalTreatment) { setError("Please write the treatment since 'Other' was selected."); return; }

    const patientPayload = {
      full_name:     form.fullName,
      date_of_birth: ageToDob(form.age),
      age:           form.age,
      gender:        form.gender,
      phone:         form.phone,
      address:       form.address,
      status:        "Active",
    };

    const medicalPayload = {
      complaint: finalComplaint,
      diagnosis: form.diagnosis,
      treatment: finalTreatment,
      notes:     form.notes,
    };

    const result = await window.api.addPatient({ patientPayload, medicalPayload });

    if (result.success) {
toast.success(
  `Patient saved successfully. ID: ${result.patientCode}`
);      setForm(initial);
    } else {
      toast.error(result.error || "Failed to save patient. Please try again.");
    }
  };

  return (
    <div style={S.form}>

      {success && <div style={S.successBanner}>✅ {success}</div>}
      {error   && <div style={S.errorBanner}>⚠️ {error}</div>}

      {/* ── Section 1: Personal Info ── */}
      <div style={S.section}>
        <p style={S.sectionTitle}><span>👤 Personal Information</span><span style={S.sectionLine} /></p>
        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Full Name<span style={S.required}>*</span></label>
            <input style={inputStyle("fullName")} type="text" name="fullName" placeholder="e.g. Ahmed Raza" maxLength={40}
              value={form.fullName} onChange={setName} onFocus={() => setFocused("fullName")} onBlur={() => setFocused(null)} />
            <p style={S.hint}>Name only, max 3 words</p>
          </div>
          <div style={S.field}>
            <label style={S.label}>Age (years)<span style={S.required}>*</span></label>
            <input style={inputStyle("age")} type="number" name="age" placeholder="e.g. 24" min="1" max="120"
              value={form.age} onChange={set} onFocus={() => setFocused("age")} onBlur={() => setFocused(null)} />
            <p style={S.hint}>Date of birth is auto-set from age (year only)</p>
          </div>
          <div style={S.field}>
            <label style={S.label}>Gender<span style={S.required}>*</span></label>
            <select style={S.select} name="gender" value={form.gender} onChange={set}>
              <option value="">Select gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Phone Number<span style={S.required}>*</span></label>
            <input style={inputStyle("phone")} type="tel" name="phone" placeholder="03001234567" maxLength={11} inputMode="numeric"
              value={form.phone} onChange={setPhone} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
            <p style={S.hint}>11 digits, must start with 03</p>
          </div>
          <div style={S.fieldFull}>
            <label style={S.label}>Full Address</label>
            <input style={inputStyle("address")} type="text" name="address"
              placeholder="e.g. Gulshan-e-Iqbal, Karachi"
              value={form.address} onChange={set} onFocus={() => setFocused("address")} onBlur={() => setFocused(null)} />
          </div>
        </div>
      </div>

      <div style={S.divider} />

      {/* ── Section 2: Medical Record ── */}
      <div style={S.section}>
        <p style={S.sectionTitle}><span>🩺 Medical Record</span><span style={S.sectionLine} /></p>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Problem / Complaint<span style={S.required}>*</span></label>
            <select style={S.select} name="complaint" value={form.complaint} onChange={setComplaint}>
              <option value="">Select problem</option>
              {PROBLEM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {form.complaint === "Other" && (
              <input style={{ ...inputStyle("complaintOther"), marginTop: "4px" }} type="text" name="complaintOther"
                placeholder="Write the problem..."
                value={form.complaintOther} onChange={set} onFocus={() => setFocused("complaintOther")} onBlur={() => setFocused(null)} />
            )}
          </div>

          <div style={S.field}>
            <label style={S.label}>Treatment</label>
            <select style={S.select} name="treatment" value={form.treatment} onChange={set}>
              <option value="">Select treatment</option>
              {TREATMENT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {form.treatment === "Other" && (
              <input style={{ ...inputStyle("treatmentOther"), marginTop: "4px" }} type="text" name="treatmentOther"
                placeholder="Write the treatment..."
                value={form.treatmentOther} onChange={set} onFocus={() => setFocused("treatmentOther")} onBlur={() => setFocused(null)} />
            )}
            <p style={S.hint}>Auto-filled from problem, can be changed</p>
          </div>
        </div>

        <div style={S.row}>
          <div style={S.field}>
            <label style={S.label}>Diagnosis</label>
            <textarea style={{ ...taStyle("diagnosis"), minHeight: "60px" }} name="diagnosis"
              placeholder="Clinical diagnosis after examination..."
              value={form.diagnosis} onChange={set} onFocus={() => setFocused("diagnosis")} onBlur={() => setFocused(null)} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Doctor's Notes</label>
            <textarea style={{ ...taStyle("notes"), minHeight: "60px" }} name="notes"
              placeholder="Allergies, follow-up reminders..."
              value={form.notes} onChange={set} onFocus={() => setFocused("notes")} onBlur={() => setFocused(null)} />
          </div>
        </div>
      </div>

      <div style={S.divider} />

      <div style={S.submitRow}>
        <button style={S.resetBtn} onClick={() => { setForm(initial); clearBanners(); }}>Clear Form</button>
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