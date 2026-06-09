import { useState } from "react";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: "1 1 240px",
    minWidth: "0",
  },
  fieldGroupFull: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: "1 1 100%",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#546E7A",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    fontFamily: ff,
  },
  input: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #CFD8DC",
    fontSize: "14px",
    color: "#263238",
    background: "#FAFCFE",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    fontFamily: ff,
    width: "100%",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#1565C0",
    boxShadow: "0 0 0 3px rgba(21,101,192,0.1)",
  },
  select: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #CFD8DC",
    fontSize: "14px",
    color: "#263238",
    background: "#FAFCFE",
    outline: "none",
    cursor: "pointer",
    fontFamily: ff,
    width: "100%",
    boxSizing: "border-box",
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23546E7A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "36px",
  },
  textarea: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #CFD8DC",
    fontSize: "14px",
    color: "#263238",
    background: "#FAFCFE",
    outline: "none",
    resize: "vertical",
    minHeight: "90px",
    fontFamily: ff,
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  divider: {
    height: "1px",
    background: "#E8EEF4",
    margin: "4px 0",
  },
  submitRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    paddingTop: "4px",
  },
  resetBtn: {
    padding: "11px 28px",
    borderRadius: "10px",
    border: "1.5px solid #CFD8DC",
    background: "transparent",
    color: "#546E7A",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: ff,
    transition: "background 0.18s ease",
  },
  submitBtn: {
    padding: "11px 36px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #1565C0, #0097A7)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: ff,
    boxShadow: "0 4px 14px rgba(21,101,192,0.3)",
    transition: "opacity 0.18s ease, transform 0.18s ease",
    letterSpacing: "0.2px",
  },
  submitBtnHover: {
    opacity: "0.9",
    transform: "translateY(-1px)",
  },
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderRadius: "10px",
    background: "#E8F5E9",
    border: "1px solid #A5D6A7",
    color: "#2E7D32",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: ff,
  },
};

const initialForm = {
  fullName: "",
  age: "",
  gender: "",
  contact: "",
  address: "",
  issue: "",
};

export default function PatientForm() {
  const [form, setForm] = useState(initialForm);
  const [focusedField, setFocusedField] = useState(null);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSubmitted(false);
  };

  const handleSubmit = () => {
    // Validation: require all fields
    const allFilled = Object.values(form).every((v) => v.trim() !== "");
    if (!allFilled) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    // TODO: Replace with API call — e.g. window.api.addPatient(form)
    console.log("New Patient Submitted:", form);
    setSubmitted(true);
    setForm(initialForm);
  };

  const handleReset = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  const inputStyle = (name) => ({
    ...styles.input,
    ...(focusedField === name ? styles.inputFocus : {}),
  });
  const textareaStyle = (name) => ({
    ...styles.textarea,
    ...(focusedField === name ? styles.inputFocus : {}),
  });

  return (
    <div style={styles.form}>
      {submitted && (
        <div style={styles.successBanner}>
          <span>✅</span>
          Patient record saved successfully. Ready for backend integration.
        </div>
      )}

      <div style={styles.row}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            style={inputStyle("fullName")}
            type="text"
            name="fullName"
            placeholder="e.g. Ahmed Raza"
            value={form.fullName}
            onChange={handleChange}
            onFocus={() => setFocusedField("fullName")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Age</label>
          <input
            style={inputStyle("age")}
            type="number"
            name="age"
            placeholder="e.g. 32"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            onFocus={() => setFocusedField("age")}
            onBlur={() => setFocusedField(null)}
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Gender</label>
          <select
            style={styles.select}
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Contact Number</label>
          <input
            style={inputStyle("contact")}
            type="tel"
            name="contact"
            placeholder="e.g. 0300-1234567"
            value={form.contact}
            onChange={handleChange}
            onFocus={() => setFocusedField("contact")}
            onBlur={() => setFocusedField(null)}
          />
        </div>
      </div>

      <div style={styles.fieldGroupFull}>
        <label style={styles.label}>Address</label>
        <input
          style={inputStyle("address")}
          type="text"
          name="address"
          placeholder="e.g. House 12, Block B, Gulshan-e-Iqbal, Karachi"
          value={form.address}
          onChange={handleChange}
          onFocus={() => setFocusedField("address")}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={styles.fieldGroupFull}>
        <label style={styles.label}>Disease / Issue</label>
        <textarea
          style={textareaStyle("issue")}
          name="issue"
          placeholder="Describe the dental issue or reason for visit..."
          value={form.issue}
          onChange={handleChange}
          onFocus={() => setFocusedField("issue")}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={styles.divider} />

      <div style={styles.submitRow}>
        <button style={styles.resetBtn} onClick={handleReset}>
          Clear Form
        </button>
        <button
          style={
            submitHovered
              ? { ...styles.submitBtn, ...styles.submitBtnHover }
              : styles.submitBtn
          }
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