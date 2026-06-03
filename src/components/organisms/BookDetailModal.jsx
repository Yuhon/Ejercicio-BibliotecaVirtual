import { useApp } from "../../context/AppContext";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

const BookDetailModal = () => {
  const { selectedBook, setSelectedBook, handleAddToCart } = useApp();

  if (!selectedBook) return null;

  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="danger">Agotado</Badge>;
    if (stock <= 3) return <Badge variant="warning">Pocas unidades ({stock})</Badge>;
    return <Badge variant="success">Disponible ({stock})</Badge>;
  };

  return (
    <div className="no-print" style={{ position: "fixed", top: "0", left: "0", right: "0", bottom: "0", background: "rgba(0, 0, 0, 0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "2000", padding: "20px" }} onClick={() => setSelectedBook(null)}>
      <div className="glass-panel fade-in" style={{ maxWidth: "650px", width: "100%", padding: "30px", position: "relative", display: "flex", flexDirection: "column", gap: "24px", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)" }} onClick={(e) => e.stopPropagation()}>
        <span style={{ position: "absolute", top: "20px", right: "20px", cursor: "pointer", fontSize: "1.5rem", color: "var(--text-muted)" }} onClick={() => setSelectedBook(null)}>✕</span>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ width: "150px", height: "220px", background: selectedBook.gradient, borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px", color: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", background: "linear-gradient(rgba(255,255,255,0.1), transparent)", pointerEvents: "none" }} />
            <span style={{ fontSize: "2rem", alignSelf: "flex-end" }}>{selectedBook.icon}</span>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", background: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: "99px", fontWeight: "600", width: "max-content" }}>
              {selectedBook.category}
            </span>
          </div>
          <div style={{ flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ color: "var(--secondary-color)", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{selectedBook.category}</span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", lineHeight: "1.2", margin: "0" }}>{selectedBook.title}</h2>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: "500" }}>Por: {selectedBook.author}</p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", margin: "8px 0" }}>
              <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#fff" }}>${selectedBook.price.toFixed(2)}</span>
              {getStockBadge(selectedBook.stock)}
            </div>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: "0.95rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "8px" }}>Sinopsis</h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>{selectedBook.description}</p>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <Button variant="outline" style={{ flex: "1" }} onClick={() => setSelectedBook(null)}>Cerrar</Button>
          <Button variant={selectedBook.stock === 0 ? "danger" : "primary"} style={{ flex: "2" }} onClick={() => { handleAddToCart(selectedBook); setSelectedBook(null); }} disabled={selectedBook.stock === 0}>
            {selectedBook.stock === 0 ? "Agotado en Tienda" : "Añadir al Carrito de Compras 🛒"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
