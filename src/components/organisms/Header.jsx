import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";

const Header = () => {
  const { 
    activeTab, navigateTo, currentUser, handleLogout, 
    setIsNotificationsOpen, setIsCartOpen, unreadNotificationsCount, cart 
  } = useApp();

  return (
    <header className="glass-panel no-print" style={{ margin: "16px 24px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: "16px", zIndex: "100" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigateTo("catalog")}>
        <span style={{ fontSize: "2rem", display: "inline-block", transform: "rotate(-10deg)" }}>📚</span>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0", letterSpacing: "-0.5px" }}>BIBLIOTECH</h1>
          <p style={{ fontSize: "0.75rem", color: "var(--secondary-color)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: "0" }}>Biblioteca Digital</p>
        </div>
      </div>

      <nav style={{ display: "flex", gap: "8px" }}>
        <Button size="sm" variant={activeTab === "catalog" ? "primary" : "outline"} onClick={() => navigateTo("catalog")}>
          Catálogo
        </Button>
        {currentUser && currentUser.role === "user" && (
          <Button size="sm" variant={activeTab === "history" ? "primary" : "outline"} onClick={() => navigateTo("history")}>
            Mis Compras
          </Button>
        )}
        {currentUser && currentUser.role === "admin" && (
          <>
            <Button size="sm" variant={activeTab === "admin-books" ? "primary" : "outline"} onClick={() => navigateTo("admin-books")}>
              Inventario
            </Button>
            <Button size="sm" variant={activeTab === "admin-reports" ? "primary" : "outline"} onClick={() => navigateTo("admin-reports")}>
              Reportes
            </Button>
          </>
        )}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setIsNotificationsOpen(prev => !prev)}>
          <span style={{ fontSize: "1.4rem" }}>🔔</span>
          {unreadNotificationsCount > 0 && (
            <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "var(--accent-color)", color: "white", fontSize: "0.7rem", fontWeight: "bold", borderRadius: "50%", width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {unreadNotificationsCount}
            </span>
          )}
        </div>
        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setIsCartOpen(prev => !prev)}>
          <span style={{ fontSize: "1.4rem" }}>🛒</span>
          {cart.length > 0 && (
            <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "var(--secondary-color)", color: "white", fontSize: "0.7rem", fontWeight: "bold", borderRadius: "50%", width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </div>
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff", margin: "0" }}>{currentUser.name}</p>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: "0", textTransform: "capitalize" }}>
                {currentUser.role === "admin" ? "🛡️ Administrador" : "👤 Cliente"}
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout} style={{ padding: "6px 12px" }}>
              Salir
            </Button>
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={() => navigateTo("login")}>
            Iniciar Sesión
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
