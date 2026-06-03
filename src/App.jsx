import { AppProvider, useApp } from "./context/AppContext";
import MainLayout from "./components/templates/MainLayout";
import CatalogPage from "./components/pages/CatalogPage";
import CartPage from "./components/pages/CartPage";
import InvoiceDetailPage from "./components/pages/InvoiceDetailPage";
import HistoryPage from "./components/pages/HistoryPage";
import AdminBooksPage from "./components/pages/AdminBooksPage";
import AdminReportsPage from "./components/pages/AdminReportsPage";
import { LoginPage, RegisterPage, RecoverPage } from "./components/pages/AuthPages";

const AppContent = () => {
  const { activeTab } = useApp();

  const renderPage = () => {
    switch (activeTab) {
      case "catalog": return <CatalogPage />;
      case "cart": return <CartPage />;
      case "invoice-detail": return <InvoiceDetailPage />;
      case "history": return <HistoryPage />;
      case "admin-books": return <AdminBooksPage />;
      case "admin-reports": return <AdminReportsPage />;
      case "login": return <LoginPage />;
      case "register": return <RegisterPage />;
      case "recover": return <RecoverPage />;
      default: return <CatalogPage />;
    }
  };

  return (
    <MainLayout>
      {renderPage()}
    </MainLayout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
