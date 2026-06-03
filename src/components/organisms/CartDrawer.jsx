import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";
import CartItem from "../molecules/CartItem";

const CartDrawer = () => {
  const { 
    isCartOpen, setIsCartOpen, cart, books, 
    handleUpdateCartQuantity, handleRemoveFromCart, 
    calculateCartSubtotal, navigateTo 
  } = useApp();

  if (!isCartOpen) return null;

  const cartSubtotal = calculateCartSubtotal();
  const salesTax = cartSubtotal * 0.12;
  const cartTotal = cartSubtotal + salesTax;

  return (
    <div className="glass-panel slide-in-right no-print" style={{ position: "fixed", top: "90px", right: "24px", width: "400px", height: "calc(100vh - 120px)", zIndex: "999", padding: "24px", display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,0.7)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.4rem", margin: "0" }}>Carrito de Compras</h2>
        <span style={{ cursor: "pointer", fontSize: "1.4rem" }} onClick={() => setIsCartOpen(false)}>✕</span>
      </div>
      <div style={{ flex: "1", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", paddingRight: "8px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "3rem" }}>🛒</span>
            <p style={{ marginTop: "12px" }}>Tu carrito está vacío.</p>
            <Button variant="primary" size="sm" style={{ marginTop: "16px" }} onClick={() => { setIsCartOpen(false); navigateTo("catalog"); }}>
              Explorar Catálogo
            </Button>
          </div>
        ) : (
          cart.map(item => {
            const book = books.find(b => b.id === item.bookId);
            return <CartItem key={item.bookId} item={item} book={book} onUpdateQuantity={handleUpdateCartQuantity} onRemove={handleRemoveFromCart} />;
          })
        )}
      </div>
      {cart.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px", marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <span>Subtotal:</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <span>Impuesto (12%):</span>
            <span>${salesTax.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "800", color: "#fff", margin: "4px 0 10px 0" }}>
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Button variant="primary" style={{ width: "100%" }} onClick={() => { setIsCartOpen(false); navigateTo("cart"); }}>
            Proceder al Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
