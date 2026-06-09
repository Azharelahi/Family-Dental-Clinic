import { useState } from "react";

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
    width: "220px",
    height: "200px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "none",
    outline: "none",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    flexShrink: 0,
  },
  label: {
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.2px",
    textAlign: "center",
    lineHeight: "1.4",
    margin: 0,
    padding: "0 12px",
  },
};

const themes = {
  blue: {
    card: {
      background: "linear-gradient(145deg, #1565C0, #1976D2)",
      boxShadow: "0 8px 24px rgba(21,101,192,0.35)",
    },
    cardHover: {
      boxShadow: "0 14px 32px rgba(21,101,192,0.5)",
    },
    icon: { background: "rgba(255,255,255,0.18)" },
    label: { color: "#ffffff" },
  },
  teal: {
    card: {
      background: "linear-gradient(145deg, #00838F, #0097A7)",
      boxShadow: "0 8px 24px rgba(0,131,143,0.35)",
    },
    cardHover: {
      boxShadow: "0 14px 32px rgba(0,131,143,0.5)",
    },
    icon: { background: "rgba(255,255,255,0.18)" },
    label: { color: "#ffffff" },
  },
  green: {
    card: {
      background: "linear-gradient(145deg, #2E7D32, #388E3C)",
      boxShadow: "0 8px 24px rgba(46,125,50,0.35)",
    },
    cardHover: {
      boxShadow: "0 14px 32px rgba(46,125,50,0.5)",
    },
    icon: { background: "rgba(255,255,255,0.18)" },
    label: { color: "#ffffff" },
  },
  indigo: {
    card: {
      background: "linear-gradient(145deg, #283593, #3949AB)",
      boxShadow: "0 8px 24px rgba(40,53,147,0.35)",
    },
    cardHover: {
      boxShadow: "0 14px 32px rgba(40,53,147,0.5)",
    },
    icon: { background: "rgba(255,255,255,0.18)" },
    label: { color: "#ffffff" },
  },
};

export default function NavButton({ icon, label, onClick, color = "blue" }) {
  const [hovered, setHovered] = useState(false);
  const theme = themes[color] || themes.blue;

  const cardStyle = {
    ...styles.card,
    ...theme.card,
    ...(hovered
      ? { transform: "translateY(-5px)", ...theme.cardHover }
      : {}),
  };

  return (
    <button
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ ...styles.iconCircle, ...theme.icon }}>
        <span role="img" aria-label={label} style={{ fontSize: "28px" }}>
          {icon}
        </span>
      </div>
      <p style={{ ...styles.label, ...theme.label }}>{label}</p>
    </button>
  );
}