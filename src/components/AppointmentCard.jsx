const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "22px 24px",
    boxShadow: "0 2px 16px rgba(13,59,122,0.09)",
    border: "1px solid #E8EEF7",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "280px",
    flex: "0 0 280px",
    position: "relative",
    overflow: "hidden",
    fontFamily: ff,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #1565C0, #0097A7)",
    borderRadius: "16px 16px 0 0",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1565C0, #0097A7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  nameBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  name: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1A2E4A",
    margin: 0,
    lineHeight: "1.2",
  },
  issue: {
    fontSize: "12px",
    color: "#0097A7",
    fontWeight: "500",
    margin: 0,
  },
  divider: {
    height: "1px",
    background: "#E8EEF7",
  },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  infoIcon: {
    fontSize: "14px",
    marginTop: "1px",
    flexShrink: 0,
  },
  infoContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  infoLabel: {
    fontSize: "10px",
    color: "#90A4AE",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    margin: 0,
  },
  infoValue: {
    fontSize: "13px",
    color: "#37474F",
    fontWeight: "500",
    margin: 0,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: "20px",
    background: "#E3F2FD",
    color: "#1565C0",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.3px",
    alignSelf: "flex-start",
  },
};

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AppointmentCard({ appointment }) {
  const { name, date, time, doctor, issue } = appointment;

  return (
    <div style={styles.card}>
      <div style={styles.accentBar} />

      <div style={styles.nameRow}>
        <div style={styles.avatar}>{getInitials(name)}</div>
        <div style={styles.nameBlock}>
          <p style={styles.name}>{name}</p>
          <p style={styles.issue}>{issue}</p>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.infoGrid}>
        <div style={styles.infoRow}>
          <span style={styles.infoIcon}>📅</span>
          <div style={styles.infoContent}>
            <p style={styles.infoLabel}>Date</p>
            <p style={styles.infoValue}>{formatDate(date)}</p>
          </div>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.infoIcon}>🕐</span>
          <div style={styles.infoContent}>
            <p style={styles.infoLabel}>Time</p>
            <p style={styles.infoValue}>{time}</p>
          </div>
        </div>

        <div style={styles.infoRow}>
          <span style={styles.infoIcon}>👨‍⚕️</span>
          <div style={styles.infoContent}>
            <p style={styles.infoLabel}>Doctor</p>
            <p style={styles.infoValue}>{doctor}</p>
          </div>
        </div>
      </div>

      <div style={styles.badge}>Scheduled</div>
    </div>
  );
}