import { useState } from "react";

const styles = {
  header: {
    background: "linear-gradient(135deg, #0d3b7a 0%, #1565C0 60%, #0097A7 100%)",
    padding: "0 32px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 12px rgba(13,59,122,0.25)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    userSelect: "none",
  },
  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "36px",
    height: "36px",
    flexShrink: 0,
  },
  titleBlock: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    lineHeight: "1.2",
    margin: 0,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "11px",
    fontWeight: "400",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    margin: 0,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
    padding: "7px 16px",
    cursor: "pointer",
    transition: "background 0.2s ease",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  backBtnHover: {
    background: "rgba(255,255,255,0.22)",
  },
};

export default function Header({ showBack = false, onBack }) {
  const [hovered, setHovered] = useState(false);

  return (
    <header style={styles.header}>
      <div style={styles.leftGroup}>
        {/* Tooth SVG Logo */}
        <svg style={styles.logo} viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.12)" />
          <path
            d="M18 7c-2.5 0-4.5 1-5.5 2.5C11 11 11 13.5 11 15c0 3 1 5.5 1.5 8 .3 1.5.8 4 1.8 4 .7 0 1-.8 1.5-2.5.4-1.3.8-2.5 2.2-2.5s1.8 1.2 2.2 2.5c.5 1.7.8 2.5 1.5 2.5 1 0 1.5-2.5 1.8-4 .5-2.5 1.5-5 1.5-8 0-1.5 0-4-1.5-5.5C22.5 8 20.5 7 18 7z"
            fill="#ffffff"
            opacity="0.9"
          />
        </svg>

        <div style={styles.titleBlock}>
          <p style={styles.title}>Family Dental Clinic</p>
          <p style={styles.subtitle}>Professional Dental Care</p>
        </div>
      </div>

      {showBack && (
        <button
          style={hovered ? { ...styles.backBtn, ...styles.backBtnHover } : styles.backBtn}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
      )}
    </header>
  );
}