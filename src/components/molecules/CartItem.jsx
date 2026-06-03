import Button from '../atoms/Button';

const CartItem = ({ item, book, onUpdateQuantity, onRemove }) => {
  if (!book) return null;
  return (
    <div style={{ display: "flex", gap: "12px", background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Cover shape preview */}
      <div style={{ width: "50px", height: "70px", background: book.gradient, borderRadius: "6px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
        {book.icon}
      </div>
      <div style={{ flex: "1" }}>
        <h4 style={{ fontSize: "0.95rem", margin: "0 0 2px 0", fontWeight: "600" }}>{book.title}</h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 6px 0" }}>{book.author}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "2px" }}>
            <button style={{ background: "none", border: "none", color: "white", padding: "4px 8px", cursor: "pointer", fontWeight: "bold" }} onClick={() => onUpdateQuantity(item.bookId, item.quantity - 1)}>-</button>
            <span style={{ fontSize: "0.9rem", fontWeight: "600", minWidth: "15px", textAlign: "center" }}>{item.quantity}</span>
            <button style={{ background: "none", border: "none", color: "white", padding: "4px 8px", cursor: "pointer", fontWeight: "bold" }} onClick={() => onUpdateQuantity(item.bookId, item.quantity + 1)}>+</button>
          </div>
          <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--secondary-color)" }}>
            ${(book.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <button style={{ background: "none", border: "none", color: "var(--danger)", fontSize: "1.1rem", cursor: "pointer" }} onClick={() => onRemove(item.bookId)}>✕</button>
      </div>
    </div>
  );
};

export default CartItem;
