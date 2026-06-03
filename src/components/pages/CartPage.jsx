import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";
import CartItem from "../molecules/CartItem";
import CheckoutForm from "../organisms/CheckoutForm";

const CartPage = () => {
  const { cart, books, navigateTo, handleUpdateCartQuantity, handleRemoveFromCart, setCart } = useApp();

  return (
    <div className="fade-in" style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center" }}>
      <div className="glass-panel" style={{ flex: "1.5", minWidth: "320px", padding: "30px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "20px" }}>Tu Carrito</h2>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <span style={{ fontSize: "4rem" }}>🛒</span>
            <h3 style={{ fontSize: "1.3rem", marginTop: "16px" }}>El carrito está vacío</h3>
            <Button variant="primary" style={{ marginTop: "20px" }} onClick={() => navigateTo("catalog")}>
              Volver al Catálogo
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {cart.map(item => {
              const book = books.find(b => b.id === item.bookId);
              return <CartItem key={item.bookId} item={item} book={book} onUpdateQuantity={handleUpdateCartQuantity} onRemove={handleRemoveFromCart} />;
            })}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <Button variant="outline" size="sm" onClick={() => setCart([])}>Vaciar Carrito</Button>
              <Button variant="outline" size="sm" onClick={() => navigateTo("catalog")}>Añadir más Libros</Button>
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="glass-panel" style={{ flex: "1", minWidth: "300px", padding: "30px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Resumen y Pago</h2>
          <CheckoutForm />
        </div>
      )}
    </div>
  );
};

export default CartPage;
