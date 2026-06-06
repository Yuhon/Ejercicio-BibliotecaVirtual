import Button from "../atoms/Button";

const InvoiceTable = ({ invoices, onViewDetail, showUserColumn = false }) => {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Factura</th>
            {showUserColumn && <th>Cliente / Correo</th>}
            <th>Fecha</th>
            <th>Libros Adquiridos</th>
            <th>Monto Neto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => (
            <tr key={invoice.id}>
              <td style={{ fontWeight: "700", color: "var(--secondary-color)" }}>{invoice.id}</td>
              {showUserColumn && (
                <td>
                  <p style={{ fontWeight: "600", margin: "0", color: "#fff" }}>{invoice.userName}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0" }}>{invoice.userEmail}</p>
                </td>
              )}
              <td>{invoice.date}</td>
              <td>
                <p style={{ fontSize: "0.85rem", margin: "0", maxWidth: showUserColumn ? "250px" : "auto", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {invoice.items.map(i => `${i.title} (x${i.quantity})`).join(", ")}
                </p>
              </td>
              <td style={{ fontWeight: "800", color: "#fff" }}>${parseFloat(invoice.total).toFixed(2)}</td>
              <td>
                <Button variant="outline" size="sm" onClick={() => onViewDetail(invoice)}>
                  Ver {showUserColumn ? "Detalle" : "Factura"} 📄
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
