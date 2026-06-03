const StatCard = ({ icon, title, value, subtitle, gradient }) => {
  return (
    <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px", background: gradient }}>
      <span style={{ fontSize: "2rem" }}>{icon}</span>
      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>{title}</span>
      <span style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--primary-color)" }}>{value}</span>
      {subtitle && <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</span>}
    </div>
  );
};

export default StatCard;
