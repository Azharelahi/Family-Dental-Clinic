import { useState } from "react";

const ff = "'Segoe UI', system-ui, -apple-system, sans-serif";

const S = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px 22px",
    boxShadow: "0 2px 16px rgba(13,59,122,0.09)",
    border: "1px solid #E8EEF7",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "290px",
    flex: "0 0 290px",
    position: "relative",
    overflow: "hidden",
    fontFamily: ff,
    // ✅ NOT clickable — removed cursor:pointer and click handler
    transition: "box-shadow 0.18s ease",
  },
  accentBar: {
    position: "absolute", top: 0, left: 0, right: 0, height: "4px",
    background: "linear-gradient(90deg, #1565C0, #0097A7)",
    borderRadius: "16px 16px 0 0",
  },
  topRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" },
  nameRow: { display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 },
  avatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    background: "linear-gradient(135deg, #1565C0, #0097A7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: "14px", fontWeight: "700", flexShrink: 0,
  },
  nameBlock: { display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 },
  name:  { fontSize: "14px", fontWeight: "700", color: "#1A2E4A", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  issue: { fontSize: "11px", color: "#0097A7", fontWeight: "500", margin: 0 },

  // 3-button action row
  actionRow: { display: "flex", gap: "4px", flexShrink: 0 },
  iconBtn: {
    width: "30px", height: "30px", borderRadius: "8px",
    border: "1px solid #E8EEF7", background: "#F8FAFC",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: "13px",
    transition: "background 0.15s ease, border-color 0.15s ease",
    flexShrink: 0,
  },
  editBtnHover:     { background: "#EFF8FF", borderColor: "#93C5FD" },
  completeBtnHover: { background: "#F0FDF4", borderColor: "#86EFAC" },
  deleteBtnHover:   { background: "#FEF2F2", borderColor: "#FCA5A5" },

  divider: { height: "1px", background: "#E8EEF7" },
  infoGrid: { display: "flex", flexDirection: "column", gap: "7px" },
  infoRow:  { display: "flex", alignItems: "center", gap: "8px" },
  infoIcon: { fontSize: "13px", flexShrink: 0 },
  infoContent: { display: "flex", flexDirection: "column" },
  infoLabel: { fontSize: "10px", color: "#90A4AE", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.6px", margin: 0 },
  infoValue: { fontSize: "12px", color: "#37474F", fontWeight: "500", margin: 0 },

  bottomRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  badge: {
    display: "inline-flex", alignItems: "center", padding: "3px 10px",
    borderRadius: "20px", fontSize: "10px", fontWeight: "600",
  },
};

const statusColors = {
  Scheduled: { background: "#E3F2FD", color: "#1565C0" },
  Completed:  { background: "#E8F5E9", color: "#2E7D32" },
  Cancelled:  { background: "#FEF2F2", color: "#C62828" },
};

const getInitials = (name = "") => {
  if (typeof name !== "string") return "";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(n => n[0])
    .join("")
    .toUpperCase();
};
function formatDate(d) {
  return new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * AppointmentCard
 * Props:
 *  - appointment  : object
 *  - onEdit       : (appointment) => void
 *  - onComplete   : (appointment) => void  ← NEW: marks as completed & removes card
 *  - onDelete     : (appointment) => void
 *
 * onView has been intentionally removed — cards are no longer clickable.
 * TODO (backend): onComplete should call window.api.updateAppointment(id, { status: "Completed" })
 */
export default function AppointmentCard({ appointment, onEdit, onComplete, onDelete }) {
  const [editHov,     setEditHov]     = useState(false);
  const [completeHov, setCompleteHov] = useState(false);
  const [deleteHov,   setDeleteHov]   = useState(false);

  const { name, date, time, doctor, issue, status = "Scheduled" } = appointment;

  return (
    <div style={S.card}>
      <div style={S.accentBar} />

      <div style={S.topRow}>
        <div style={S.nameRow}>
          <div style={S.avatar}>{getInitials(name)}</div>
          <div style={S.nameBlock}>
            <p style={S.name}>{name}</p>
            <p style={S.issue}>{issue}</p>
          </div>
        </div>

        {/* ── 3 action buttons: Edit · Complete · Delete ── */}
        <div style={S.actionRow} data-action="true">

          {/* Edit */}
          <button
            data-action="true"
            title="Edit appointment"
            style={editHov ? { ...S.iconBtn, ...S.editBtnHover } : S.iconBtn}
            onMouseEnter={() => setEditHov(true)}
            onMouseLeave={() => setEditHov(false)}
            onClick={(e) => { e.stopPropagation(); onEdit(appointment); }}
          >
            ✏️
          </button>

          {/* Mark as Completed — card disappears from Scheduled view */}
          <button
            data-action="true"
            title="Mark as completed"
            style={completeHov ? { ...S.iconBtn, ...S.completeBtnHover } : S.iconBtn}
            onMouseEnter={() => setCompleteHov(true)}
            onMouseLeave={() => setCompleteHov(false)}
            onClick={(e) => { e.stopPropagation(); onComplete(appointment); }}
          >
            ✅
          </button>

          {/* Delete */}
          <button
            data-action="true"
            title="Delete appointment"
            style={deleteHov ? { ...S.iconBtn, ...S.deleteBtnHover } : S.iconBtn}
            onMouseEnter={() => setDeleteHov(true)}
            onMouseLeave={() => setDeleteHov(false)}
            onClick={(e) => { e.stopPropagation(); onDelete(appointment); }}
          >
            🗑️
          </button>

        </div>
      </div>

      <div style={S.divider} />

      <div style={S.infoGrid}>
        <div style={S.infoRow}>
          <span style={S.infoIcon}>📅</span>
          <div style={S.infoContent}>
            <p style={S.infoLabel}>Date</p>
            <p style={S.infoValue}>{formatDate(date)}</p>
          </div>
        </div>
        <div style={S.infoRow}>
          <span style={S.infoIcon}>🕐</span>
          <div style={S.infoContent}>
            <p style={S.infoLabel}>Time</p>
            <p style={S.infoValue}>{time}</p>
          </div>
        </div>
        <div style={S.infoRow}>
          <span style={S.infoIcon}>👨‍⚕️</span>
          <div style={S.infoContent}>
            <p style={S.infoLabel}>Doctor</p>
            <p style={S.infoValue}>{doctor}</p>
          </div>
        </div>
      </div>

      <div style={S.bottomRow}>
        <div style={{ ...S.badge, ...(statusColors[status] || statusColors.Scheduled) }}>
          {status}
        </div>
      </div>
    </div>
  );
}