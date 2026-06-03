import { useApp } from "../../context/AppContext";

const Footer = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="glass-panel no-print" style={{ margin: "24px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0" }}>© 2026 Bibliotech. Todos los derechos reservados.</p>
      <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
        <span style={{ cursor: "pointer" }} onClick={() => navigateTo("catalog")}>Catálogo</span>
        <span>•</span>
        <span style={{ cursor: "pointer" }} onClick={() => navigateTo("login")}>Acceso Privado</span>
      </div>
    </footer>
  );
};

export default Footer;
