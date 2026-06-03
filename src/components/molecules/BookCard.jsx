import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

const BookCard = ({ book, onSelect, onAddToCart }) => {
  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="danger">Agotado</Badge>;
    if (stock <= 3) return <Badge variant="warning">Pocas unidades ({stock})</Badge>;
    return <Badge variant="success">Disponible ({stock})</Badge>;
  };

  return (
    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", cursor: "pointer" }} onClick={() => onSelect(book)}>
      {/* Premium Cover Design */}
      <div style={{ height: "200px", background: book.gradient, borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px", color: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", background: "linear-gradient(rgba(255,255,255,0.1), transparent)", pointerEvents: "none" }} />
        <span style={{ fontSize: "2.5rem", alignSelf: "flex-end" }}>{book.icon}</span>
        <div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "99px", fontWeight: "600" }}>
            {book.category}
          </span>
          <h4 style={{ fontSize: "1.1rem", fontWeight: "800", marginTop: "8px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", lineHeight: "1.2" }}>{book.title}</h4>
        </div>
      </div>

      {/* Info & Price */}
      <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Por {book.author}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--secondary-color)" }}>${book.price.toFixed(2)}</span>
          {getStockBadge(book.stock)}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
        <Button variant="outline" size="sm" style={{ flex: "1" }} onClick={() => onSelect(book)}>
          Ver Detalle
        </Button>
        <Button variant={book.stock === 0 ? "danger" : "primary"} size="sm" style={{ flex: "1.2" }} onClick={() => onAddToCart(book)} disabled={book.stock === 0}>
          {book.stock === 0 ? "Agotado" : "Añadir 🛒"}
        </Button>
      </div>
    </div>
  );
};

export default BookCard;
