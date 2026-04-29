import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/api/notifications/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleOpen = async () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      await fetchNotifications();
      await api.put("/api/notifications/mark-all-read");
      setUnreadCount(0);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "BOOKING_APPROVED": return "#48bb78";
      case "BOOKING_REJECTED": return "#fc8181";
      case "BOOKING_CANCELLED": return "#f6ad55";
      case "TICKET_STATUS_CHANGED": return "#63b3ed";
      case "NEW_COMMENT": return "#b794f4";
      default: return "#a0aec0";
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>

      {/* Bell Button */}
      <button
        onClick={handleOpen}
        style={{
          background: "none", border: "none",
          cursor: "pointer", fontSize: "22px",
          position: "relative", padding: "4px"
        }}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: "-4px", right: "-4px",
            background: "#e53e3e", color: "white",
            borderRadius: "50%", padding: "1px 5px",
            fontSize: "11px", fontWeight: "bold",
            minWidth: "18px", textAlign: "center"
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)",
          width: "340px", background: "white",
          border: "1px solid #e2e8f0", borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 9999, maxHeight: "420px", overflowY: "auto"
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid #e2e8f0",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#1a202c" }}>
              Notifications
            </h3>
            <span style={{ fontSize: "12px", color: "#718096" }}>
              {notifications.length} total
            </span>
          </div>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#a0aec0" }}>
              <p style={{ fontSize: "32px", margin: "0 0 8px" }}>🔕</p>
              <p style={{ margin: 0 }}>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} style={{
                padding: "14px 18px",
                borderBottom: "1px solid #f7fafc",
                background: n.read ? "white" : "#ebf8ff",
                display: "flex", gap: "12px", alignItems: "flex-start"
              }}>
                {/* Color dot for type */}
                <div style={{
                  width: "10px", height: "10px",
                  borderRadius: "50%", marginTop: "5px", flexShrink: 0,
                  background: getTypeColor(n.type)
                }} />
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#2d3748" }}>
                    {n.message}
                  </p>
                  <small style={{ color: "#a0aec0", fontSize: "12px" }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}