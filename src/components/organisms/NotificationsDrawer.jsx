import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";
import NotificationItem from "../molecules/NotificationItem";

const NotificationsDrawer = () => {
  const { 
    isNotificationsOpen, setIsNotificationsOpen, 
    notifications, handleMarkAllNotificationsAsRead, handleClearNotifications 
  } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="glass-panel slide-in-right no-print" style={{ position: "fixed", top: "90px", right: "24px", width: "360px", maxHeight: "450px", overflowY: "auto", zIndex: "1000", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.1rem", margin: "0" }}>Notificaciones</h3>
        <span style={{ cursor: "pointer", fontSize: "1.2rem" }} onClick={() => setIsNotificationsOpen(false)}>✕</span>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <Button variant="outline" size="sm" style={{ flex: "1", fontSize: "0.75rem", padding: "4px 8px" }} onClick={handleMarkAllNotificationsAsRead}>
          Leídas
        </Button>
        <Button variant="danger" size="sm" style={{ flex: "1", fontSize: "0.75rem", padding: "4px 8px" }} onClick={handleClearNotifications}>
          Borrar
        </Button>
      </div>
      <hr style={{ border: "none", borderBottom: "1px solid var(--border-light)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {notifications.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", padding: "20px 0" }}>No tienes notificaciones.</p>
        ) : (
          notifications.map(n => <NotificationItem key={n.id} notification={n} />)
        )}
      </div>
    </div>
  );
};

export default NotificationsDrawer;
