import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";
import InvoiceTable from "../organisms/InvoiceTable";

const HistoryPage = () => {
  const { currentUser, sales, navigateTo, setSelectedInvoice } = useApp();

  if (!currentUser) return null;

  const userSales = sales.filter(s => s.userEmail === currentUser.email);

  return (
    <div className="fade-in glass-panel" style={{ padding: "30px" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "20px" }}>Historial de Compras</h2>
      
      {userSales.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
          <span style={{ fontSize: "3rem" }}>📄</span>
          <p style={{ marginTop: "12px" }}>Aún no has realizado ninguna compra en el sistema.</p>
          <Button variant="primary" size="sm" style={{ marginTop: "16px" }} onClick={() => navigateTo("catalog")}>
            Ver Catálogo de Libros
          </Button>
        </div>
      ) : (
        <InvoiceTable 
          invoices={userSales} 
          onViewDetail={(invoice) => {
            setSelectedInvoice(invoice);
            navigateTo("invoice-detail");
          }} 
        />
      )}
    </div>
  );
};

export default HistoryPage;
