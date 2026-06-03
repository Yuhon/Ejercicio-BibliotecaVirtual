import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import NotificationsDrawer from "../organisms/NotificationsDrawer";
import CartDrawer from "../organisms/CartDrawer";
import BookDetailModal from "../organisms/BookDetailModal";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <NotificationsDrawer />
      <CartDrawer />
      
      <main className="container" style={{ flex: "1", padding: "20px 24px 80px 24px", maxWidth: "1200px", display: "flex", flexDirection: "column" }}>
        {children}
      </main>

      <BookDetailModal />
      <Footer />
    </>
  );
};

export default MainLayout;
