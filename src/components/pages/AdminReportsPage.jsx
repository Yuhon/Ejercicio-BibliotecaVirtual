import { useApp } from "../../context/AppContext";
import StatCard from "../molecules/StatCard";
import InvoiceTable from "../organisms/InvoiceTable";

const AdminReportsPage = () => {
  const { currentUser, sales, getBestSellingBook, setSelectedInvoice, navigateTo } = useApp();

  if (!currentUser || currentUser.role !== "admin") return null;

  const totalEarnings = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalUnitsSold = sales.reduce((acc, sale) => 
    acc + sale.items.reduce((sum, item) => sum + item.quantity, 0), 0
  );
  const bestSeller = getBestSellingBook();

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        <StatCard icon="💰" title="Ingresos Totales" value={`$${parseFloat(totalEarnings).toFixed(2)}`} gradient="linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" />
        <StatCard icon="📦" title="Unidades Vendidas" value={`${totalUnitsSold} libros`} gradient="linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" />
        <StatCard icon="📄" title="Transacciones" value={`${sales.length} compras`} gradient="linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" />
        <StatCard icon="🏆" title="Libro Más Vendido" value={bestSeller.title} subtitle={`${bestSeller.quantity} unidades vendidas`} gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" />
      </div>

      <div className="glass-panel" style={{ padding: "30px" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "20px" }}>Registro General de Ventas</h2>
        {sales.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px 0" }}>Aún no se registran ventas en la plataforma.</p>
        ) : (
          <InvoiceTable 
            invoices={sales} 
            showUserColumn={true} 
            onViewDetail={(invoice) => {
              setSelectedInvoice(invoice);
              navigateTo("invoice-detail");
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
