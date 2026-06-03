import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";
import PrintableInvoice from "../organisms/PrintableInvoice";

const InvoiceDetailPage = () => {
  const { selectedInvoice, currentUser, navigateTo } = useApp();

  if (!selectedInvoice) return null;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
      <PrintableInvoice invoice={selectedInvoice} />
      <div className="no-print" style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "700px" }}>
        <Button variant="outline" style={{ flex: "1" }} onClick={() => navigateTo(currentUser && currentUser.role === "admin" ? "admin-reports" : "catalog")}>
          Volver
        </Button>
        <Button variant="primary" style={{ flex: "2" }} onClick={() => window.print()}>
          🖨️ Imprimir Factura Digital
        </Button>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
