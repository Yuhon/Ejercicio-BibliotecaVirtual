const PrintableInvoice = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="glass-panel" id="printable-invoice" style={{ maxWidth: "700px", width: "100%", padding: "40px", display: "flex", flexDirection: "column", gap: "24px", background: "#fff", color: "#1e293b", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
      {/* Header Invoice */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ color: "#4f46e5", fontSize: "2rem", margin: "0 0 4px 0", fontWeight: "800", textAlign: "left" }}>BIBLIOTECH</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0" }}>RUC: 1792348560001</p>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0" }}>Av. Amazonas N45-12 y Patria, Quito</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ fontSize: "1.4rem", color: "#0f172a", margin: "0 0 6px 0", fontWeight: "800" }}>COMPROBANTE DIGITAL</h2>
          <p style={{ color: "#4f46e5", fontWeight: "700", margin: "0", fontSize: "1.1rem" }}>{invoice.id}</p>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "4px 0 0 0" }}>Fecha: {invoice.date}</p>
        </div>
      </div>

      {/* Client Info */}
      <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", border: "1px solid #edf2f7" }}>
        <div>
          <h4 style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px 0" }}>Cliente</h4>
          <p style={{ fontWeight: "700", color: "#0f172a", margin: "0" }}>{invoice.userName}</p>
          <p style={{ color: "#475569", margin: "0", fontSize: "0.9rem" }}>{invoice.userEmail}</p>
        </div>
        <div>
          <h4 style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px 0" }}>Método de Pago</h4>
          <p style={{ color: "#0f172a", fontWeight: "600", margin: "0" }}>Tarjeta de Crédito</p>
          <p style={{ color: "#475569", margin: "0", fontSize: "0.9rem" }}>{invoice.paymentCard}</p>
        </div>
      </div>

      {/* Items List */}
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #cbd5e1" }}>
              <th style={{ padding: "12px 6px", color: "#64748b", fontWeight: "600", fontSize: "0.85rem" }}>Descripción del Libro</th>
              <th style={{ padding: "12px 6px", color: "#64748b", fontWeight: "600", fontSize: "0.85rem", textAlign: "right" }}>Precio</th>
              <th style={{ padding: "12px 6px", color: "#64748b", fontWeight: "600", fontSize: "0.85rem", textAlign: "center" }}>Cantidad</th>
              <th style={{ padding: "12px 6px", color: "#64748b", fontWeight: "600", fontSize: "0.85rem", textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #edf2f7" }}>
                <td style={{ padding: "12px 6px" }}>
                  <p style={{ fontWeight: "700", color: "#0f172a", margin: "0" }}>{item.title}</p>
                  <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0" }}>Por {item.author}</p>
                </td>
                <td style={{ padding: "12px 6px", textAlign: "right", color: "#334155" }}>${item.price.toFixed(2)}</td>
                <td style={{ padding: "12px 6px", textAlign: "center", color: "#334155" }}>{item.quantity}</td>
                <td style={{ padding: "12px 6px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Block */}
      <div style={{ alignSelf: "flex-end", width: "280px", display: "flex", flexDirection: "column", gap: "10px", borderTop: "2px solid #e2e8f0", paddingTop: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#475569" }}>
          <span>Subtotal:</span>
          <span>${invoice.subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#475569" }}>
          <span>IVA (12%):</span>
          <span>${invoice.tax.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", borderTop: "1px solid #cbd5e1", paddingTop: "8px" }}>
          <span>Total Neto:</span>
          <span style={{ color: "#4f46e5" }}>${invoice.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer Invoice */}
      <div style={{ textAlign: "center", marginTop: "20px", borderTop: "1px dashed #cbd5e1", paddingTop: "20px", color: "#64748b", fontSize: "0.85rem" }}>
        <p style={{ fontWeight: "600", color: "#475569", marginBottom: "4px" }}>¡Gracias por tu compra en Bibliotech!</p>
        <p>Este comprobante es un documento legal de compra digital. Transacción procesada de forma segura.</p>
      </div>
    </div>
  );
};

export default PrintableInvoice;
