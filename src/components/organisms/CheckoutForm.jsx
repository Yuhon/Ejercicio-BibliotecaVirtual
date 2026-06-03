import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";
import FormGroup from "../molecules/FormGroup";
import Input from "../atoms/Input";
import Spinner from "../atoms/Spinner";

const CheckoutForm = () => {
  const { 
    currentUser, navigateTo, handlePaymentSubmit, checkoutError,
    checkoutCardName, setCheckoutCardName, checkoutCardNumber, setCheckoutCardNumber,
    checkoutCardExpiry, setCheckoutCardExpiry, checkoutCardCvv, setCheckoutCardCvv,
    isProcessingPayment, calculateCartSubtotal
  } = useApp();

  const cartTotal = calculateCartSubtotal() * 1.12;

  if (!currentUser) {
    return (
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <p style={{ color: "var(--accent-color)", fontSize: "0.95rem", marginBottom: "12px" }}>Debes iniciar sesión para realizar el pago de tu compra.</p>
        <Button variant="primary" style={{ width: "100%" }} onClick={() => navigateTo("login")}>
          Iniciar Sesión / Registrarse
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {checkoutError && (
        <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>
          ⚠️ {checkoutError}
        </div>
      )}
      <FormGroup label="Nombre del Titular">
        <Input type="text" placeholder="Juan Pérez" value={checkoutCardName} onChange={(e) => setCheckoutCardName(e.target.value)} required disabled={isProcessingPayment} />
      </FormGroup>
      <FormGroup label="Número de Tarjeta">
        <Input type="text" placeholder="4111 2222 3333 4444" value={checkoutCardNumber} onChange={(e) => setCheckoutCardNumber(e.target.value)} required disabled={isProcessingPayment} />
      </FormGroup>
      <div style={{ display: "flex", gap: "12px" }}>
        <FormGroup label="Vencimiento" style={{ flex: "1" }}>
          <Input type="text" placeholder="MM/AA" maxLength="5" value={checkoutCardExpiry} onChange={(e) => setCheckoutCardExpiry(e.target.value)} required disabled={isProcessingPayment} />
        </FormGroup>
        <FormGroup label="Código CVV" style={{ flex: "1" }}>
          <Input type="password" placeholder="123" maxLength="4" value={checkoutCardCvv} onChange={(e) => setCheckoutCardCvv(e.target.value)} required disabled={isProcessingPayment} />
        </FormGroup>
      </div>
      <Button type="submit" variant="secondary" style={{ width: "100%", marginTop: "10px" }} disabled={isProcessingPayment}>
        {isProcessingPayment ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <Spinner />
            Procesando Pago...
          </div>
        ) : (
          `Pagar Ahora $${cartTotal.toFixed(2)} 🔒`
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;
