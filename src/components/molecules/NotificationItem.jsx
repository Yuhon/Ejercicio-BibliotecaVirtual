const NotificationItem = ({ notification }) => {
  return (
    <div style={{ padding: "10px", borderRadius: "8px", background: notification.read ? "rgba(255,255,255,0.02)" : "rgba(99, 102, 241, 0.1)", borderLeft: notification.read ? "3px solid transparent" : "3px solid var(--primary-color)", fontSize: "0.85rem", transition: "all 0.2s" }}>
      <p style={{ color: notification.read ? "var(--text-secondary)" : "#fff", fontWeight: notification.read ? "400" : "500", margin: "0 0 4px 0" }}>{notification.text}</p>
      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{notification.date}</span>
    </div>
  );
};

export default NotificationItem;
