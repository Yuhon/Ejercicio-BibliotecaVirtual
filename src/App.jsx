import { useState, useEffect } from "react";
import { initialBooks } from "./data/initialBooks";

// Helper to seed localStorage
const getLocalStorageData = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing localStorage key " + key, e);
    }
  }
  return defaultValue;
};

function App() {
  // --- STATE DECLARATIONS ---
  const [books, setBooks] = useState(() => getLocalStorageData("books", initialBooks));
  const [users, setUsers] = useState(() => 
    getLocalStorageData("users", [
      { email: "admin@bibliotech.com", password: "admin123", name: "Administrador General", role: "admin" },
      { email: "user@bibliotech.com", password: "user123", name: "Carlos Pérez", role: "user" }
    ])
  );
  const [currentUser, setCurrentUser] = useState(() => getLocalStorageData("currentUser", null));
  const [cart, setCart] = useState(() => getLocalStorageData("cart", []));
  const [sales, setSales] = useState(() => getLocalStorageData("sales", []));
  const [notifications, setNotifications] = useState(() => 
    getLocalStorageData("notifications", [
      { id: 1, text: "¡Bienvenido a Bibliotech! Explora nuestro catálogo y descubre miles de historias.", date: new Date().toLocaleString(), read: false },
      { id: 2, text: "Novedad: El libro 'Breves Respuestas a las Grandes Preguntas' de Stephen Hawking ya está disponible.", date: new Date().toLocaleString(), read: false }
    ])
  );

  // Navigation state
  const [activeTab, setActiveTab] = useState("catalog"); // catalog, cart, history, admin-books, admin-reports, login, register, recover, invoice-detail
  
  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 4;

  // Selected Book Modal Detail
  const [selectedBook, setSelectedBook] = useState(null);

  // Drawers open state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Active Invoice Detail (for view invoice history or after purchase)
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Authentication form states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState("user");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Recovery Password specific states
  const [recoverStep, setRecoverStep] = useState(1); // 1: input email, 2: input new password
  const [recoveredEmail, setRecoveredEmail] = useState("");

  // Payment checkout form states
  const [checkoutCardName, setCheckoutCardName] = useState("");
  const [checkoutCardNumber, setCheckoutCardNumber] = useState("");
  const [checkoutCardExpiry, setCheckoutCardExpiry] = useState("");
  const [checkoutCardCvv, setCheckoutCardCvv] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Admin New Book form states
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookCategory, setNewBookCategory] = useState("");
  const [newBookDescription, setNewBookDescription] = useState("");
  const [newBookPrice, setNewBookPrice] = useState("");
  const [newBookStock, setNewBookStock] = useState("");
  const [newBookIcon, setNewBookIcon] = useState("📖");
  const [newBookGradient, setNewBookGradient] = useState("linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)");
  const [adminBookError, setAdminBookError] = useState("");
  const [adminBookSuccess, setAdminBookSuccess] = useState("");

  // Admin Update Price/Stock states (tracked in-place per book)
  const [editingBookId, setEditingBookId] = useState(null);
  const [editPriceVal, setEditPriceVal] = useState("");
  const [editStockVal, setEditStockVal] = useState("");

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    // Reset cart when user changes if it's stored per user
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // --- HELPER FUNCTIONS ---
  const addNotification = (text) => {
    const newNotification = {
      id: Date.now(),
      text,
      date: new Date().toLocaleString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // --- AUTHENTICATION ACTIONS ---
  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!authEmail || !authPassword || !authName || !authConfirmPassword) {
      setAuthError("Por favor, completa todos los campos.");
      return;
    }

    if (authPassword !== authConfirmPassword) {
      setAuthError("Las contraseñas no coinciden.");
      return;
    }

    // Check if email already registered
    const exists = users.some(u => u.email.toLowerCase() === authEmail.toLowerCase());
    if (exists) {
      setAuthError("El correo electrónico ya está registrado.");
      return;
    }

    const newUser = {
      email: authEmail.toLowerCase(),
      password: authPassword,
      name: authName,
      role: authRole
    };

    setUsers(prev => [...prev, newUser]);
    addNotification(`Nuevo usuario registrado: ${authName} (${authRole === "admin" ? "Administrador" : "Cliente"})`);
    setAuthSuccess("¡Registro completado con éxito! Ahora puedes iniciar sesión.");
    
    // Clear form
    setAuthEmail("");
    setAuthPassword("");
    setAuthConfirmPassword("");
    setAuthName("");
    setAuthRole("user");

    // Redirect to login after a short delay
    setTimeout(() => {
      setActiveTab("login");
      setAuthSuccess("");
    }, 1500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail || !authPassword) {
      setAuthError("Por favor, ingresa correo y contraseña.");
      return;
    }

    const user = users.find(
      u => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword
    );

    if (!user) {
      setAuthError("Credenciales incorrectas.");
      return;
    }

    setCurrentUser(user);
    addNotification(`Sesión iniciada por ${user.name}`);
    
    // Clear form
    setAuthEmail("");
    setAuthPassword("");

    // Redirect to catalog or admin depending on role
    if (user.role === "admin") {
      setActiveTab("admin-books");
    } else {
      setActiveTab("catalog");
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addNotification(`Sesión cerrada por ${currentUser.name}`);
    }
    setCurrentUser(null);
    setCart([]);
    setActiveTab("catalog");
  };

  const handleRecoverPassword = (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (recoverStep === 1) {
      if (!authEmail) {
        setAuthError("Por favor, ingresa tu correo electrónico.");
        return;
      }
      const user = users.find(u => u.email.toLowerCase() === authEmail.toLowerCase());
      if (!user) {
        setAuthError("No existe ninguna cuenta registrada con este correo electrónico.");
        return;
      }
      setRecoveredEmail(authEmail.toLowerCase());
      setRecoverStep(2);
    } else if (recoverStep === 2) {
      if (!authPassword || !authConfirmPassword) {
        setAuthError("Por favor, completa los campos de contraseña.");
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setAuthError("Las contraseñas no coinciden.");
        return;
      }

      // Update password
      setUsers(prev => prev.map(u => {
        if (u.email === recoveredEmail) {
          return { ...u, password: authPassword };
        }
        return u;
      }));

      addNotification(`Contraseña restablecida para ${recoveredEmail}`);
      setAuthSuccess("Contraseña restablecida con éxito. Redirigiendo a inicio de sesión...");
      
      setTimeout(() => {
        setRecoverStep(1);
        setRecoveredEmail("");
        setAuthEmail("");
        setAuthPassword("");
        setAuthConfirmPassword("");
        setActiveTab("login");
        setAuthSuccess("");
      }, 2000);
    }
  };

  // --- CATALOG & SEARCH ACTIONS ---
  // Get all unique categories for search filter
  const categories = ["Todos", ...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Todos" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="badge badge-danger">Agotado</span>;
    if (stock <= 3) return <span className="badge badge-warning">Pocas unidades ({stock})</span>;
    return <span className="badge badge-success">Disponible ({stock})</span>;
  };

  // --- SHOPPING CART ACTIONS ---
  const handleAddToCart = (book) => {
    if (book.stock === 0) return;

    // Check quantity already in cart
    const cartItem = cart.find(item => item.bookId === book.id);
    const currentQty = cartItem ? cartItem.quantity : 0;

    if (currentQty >= book.stock) {
      alert(`No puedes agregar más unidades de las disponibles en inventario (${book.stock}).`);
      return;
    }

    if (cartItem) {
      setCart(prev => prev.map(item => 
        item.bookId === book.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart(prev => [...prev, { bookId: book.id, quantity: 1 }]);
    }

    // Open cart drawer
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (bookId, newQty) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    if (newQty <= 0) {
      handleRemoveFromCart(bookId);
      return;
    }

    if (newQty > book.stock) {
      alert(`Lo sentimos, solo hay ${book.stock} unidades disponibles en inventario.`);
      return;
    }

    setCart(prev => prev.map(item => 
      item.bookId === bookId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleRemoveFromCart = (bookId) => {
    setCart(prev => prev.filter(item => item.bookId !== bookId));
  };

  const calculateCartSubtotal = () => {
    return cart.reduce((acc, item) => {
      const book = books.find(b => b.id === item.bookId);
      return acc + (book ? book.price * item.quantity : 0);
    }, 0);
  };

  const cartSubtotal = calculateCartSubtotal();
  const salesTax = cartSubtotal * 0.12; // 12% sales tax
  const cartTotal = cartSubtotal + salesTax;

  // --- CHECKOUT & PAYMENT ACTIONS ---
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCheckoutError("");

    if (!currentUser) {
      setActiveTab("login");
      setIsCartOpen(false);
      alert("Por favor inicia sesión para completar la compra.");
      return;
    }

    if (cart.length === 0) {
      setCheckoutError("Tu carrito está vacío.");
      return;
    }

    if (!checkoutCardName || !checkoutCardNumber || !checkoutCardExpiry || !checkoutCardCvv) {
      setCheckoutError("Por favor completa todos los campos de pago.");
      return;
    }

    // Basic Card Validation (e.g. 16 digits)
    const rawCardNum = checkoutCardNumber.replace(/\s+/g, "");
    if (rawCardNum.length < 13 || rawCardNum.length > 19 || isNaN(rawCardNum)) {
      setCheckoutError("El número de tarjeta de crédito no es válido.");
      return;
    }

    if (checkoutCardCvv.length < 3 || checkoutCardCvv.length > 4 || isNaN(checkoutCardCvv)) {
      setCheckoutError("El código CVV no es válido.");
      return;
    }

    // Start simulated processing
    setIsProcessingPayment(true);

    setTimeout(() => {
      // Create transaction / invoice record
      const invoiceId = "FAC-" + Math.floor(100000 + Math.random() * 900000);
      const invoiceItems = cart.map(item => {
        const book = books.find(b => b.id === item.bookId);
        return {
          bookId: item.bookId,
          title: book.title,
          author: book.author,
          price: book.price,
          quantity: item.quantity
        };
      });

      const newInvoice = {
        id: invoiceId,
        userEmail: currentUser.email,
        userName: currentUser.name,
        date: new Date().toLocaleString(),
        items: invoiceItems,
        subtotal: cartSubtotal,
        tax: salesTax,
        total: cartTotal,
        paymentCard: "**** **** **** " + rawCardNum.slice(-4)
      };

      // Deduct stock from book inventory
      setBooks(prev => prev.map(book => {
        const cartItem = cart.find(item => item.bookId === book.id);
        if (cartItem) {
          return { ...book, stock: Math.max(0, book.stock - cartItem.quantity) };
        }
        return book;
      }));

      // Add to sales record
      setSales(prev => [newInvoice, ...prev]);

      // Add dynamic notifications
      addNotification(`Compra realizada por ${currentUser.name}. Factura #${invoiceId} generada por $${cartTotal.toFixed(2)}.`);
      
      // Notify about stock running low if applicable
      cart.forEach(item => {
        const book = books.find(b => b.id === item.bookId);
        if (book && book.stock - item.quantity === 0) {
          addNotification(`Alerta de Inventario: El libro '${book.title}' se ha agotado.`);
        }
      });

      // Clear states
      setCart([]);
      setCheckoutCardName("");
      setCheckoutCardNumber("");
      setCheckoutCardExpiry("");
      setCheckoutCardCvv("");
      setIsProcessingPayment(false);
      
      // Select invoice for printing view
      setSelectedInvoice(newInvoice);
      setActiveTab("invoice-detail");
      setIsCartOpen(false);
    }, 2000); // 2 seconds delay simulation
  };

  // --- ADMIN ACTIONS ---
  const handleCreateBook = (e) => {
    e.preventDefault();
    setAdminBookError("");
    setAdminBookSuccess("");

    if (!newBookTitle || !newBookAuthor || !newBookCategory || !newBookPrice || !newBookStock) {
      setAdminBookError("Todos los campos obligatorios deben ser completados.");
      return;
    }

    const price = parseFloat(newBookPrice);
    const stock = parseInt(newBookStock, 10);

    if (isNaN(price) || price <= 0) {
      setAdminBookError("El precio debe ser un número positivo.");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setAdminBookError("El stock no puede ser negativo.");
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      title: newBookTitle,
      author: newBookAuthor,
      category: newBookCategory,
      description: newBookDescription || "Sin descripción disponible.",
      price: price,
      stock: stock,
      gradient: newBookGradient,
      icon: newBookIcon
    };

    setBooks(prev => [...prev, newBook]);
    addNotification(`Catálogo: Se ha añadido el nuevo libro '${newBookTitle}' de ${newBookAuthor}.`);
    setAdminBookSuccess(`¡El libro '${newBookTitle}' se ha registrado exitosamente!`);

    // Reset Form
    setNewBookTitle("");
    setNewBookAuthor("");
    setNewBookCategory("");
    setNewBookDescription("");
    setNewBookPrice("");
    setNewBookStock("");
    setNewBookIcon("📖");
    setNewBookGradient("linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)");

    setTimeout(() => {
      setAdminBookSuccess("");
    }, 3000);
  };

  const handleStartEditingBook = (book) => {
    setEditingBookId(book.id);
    setEditPriceVal(book.price.toString());
    setEditStockVal(book.stock.toString());
  };

  const handleCancelEditingBook = () => {
    setEditingBookId(null);
    setEditPriceVal("");
    setEditStockVal("");
  };

  const handleUpdateBookPriceStock = (bookId) => {
    const price = parseFloat(editPriceVal);
    const stock = parseInt(editStockVal, 10);

    if (isNaN(price) || price <= 0) {
      alert("El precio debe ser un número positivo.");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      alert("El inventario (stock) debe ser un número mayor o igual a 0.");
      return;
    }

    const bookBefore = books.find(b => b.id === bookId);

    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        return { ...book, price: price, stock: stock };
      }
      return book;
    }));

    setEditingBookId(null);
    
    // Add notifications
    addNotification(`Inventario: Libro '${bookBefore.title}' actualizado. Precio: $${price.toFixed(2)}, Stock: ${stock}.`);
  };

  // --- REPORT GENERATION HELPERS ---
  const totalEarnings = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalUnitsSold = sales.reduce((acc, sale) => 
    acc + sale.items.reduce((sum, item) => sum + item.quantity, 0), 0
  );

  const getBestSellingBook = () => {
    const salesMap = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        salesMap[item.title] = (salesMap[item.title] || 0) + item.quantity;
      });
    });

    let bestBook = "Ninguno";
    let maxQty = 0;
    
    Object.keys(salesMap).forEach(title => {
      if (salesMap[title] > maxQty) {
        maxQty = salesMap[title];
        bestBook = title;
      }
    });

    return { title: bestBook, quantity: maxQty };
  };

  const bestSeller = getBestSellingBook();

  // Navigation handlers
  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const viewInvoiceDetail = (invoice) => {
    setSelectedInvoice(invoice);
    navigateTo("invoice-detail");
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* --- HEADER NAVBAR --- */}
      <header className="glass-panel no-print" style={{ margin: "16px 24px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: "16px", zIndex: "100" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigateTo("catalog")}>
          <span style={{ fontSize: "2rem", display: "inline-block", transform: "rotate(-10deg)" }}>📚</span>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800", background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0", letterSpacing: "-0.5px" }}>BIBLIOTECH</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--secondary-color)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: "0" }}>Biblioteca Digital</p>
          </div>
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <nav style={{ display: "flex", gap: "8px" }}>
          <button className={`btn btn-sm ${activeTab === "catalog" ? "btn-primary" : "btn-outline"}`} onClick={() => navigateTo("catalog")}>
            Catálogo
          </button>
          
          {currentUser && currentUser.role === "user" && (
            <button className={`btn btn-sm ${activeTab === "history" ? "btn-primary" : "btn-outline"}`} onClick={() => navigateTo("history")}>
              Mis Compras
            </button>
          )}

          {currentUser && currentUser.role === "admin" && (
            <>
              <button className={`btn btn-sm ${activeTab === "admin-books" ? "btn-primary" : "btn-outline"}`} onClick={() => navigateTo("admin-books")}>
                Inventario
              </button>
              <button className={`btn btn-sm ${activeTab === "admin-reports" ? "btn-primary" : "btn-outline"}`} onClick={() => navigateTo("admin-reports")}>
                Reportes
              </button>
            </>
          )}
        </nav>

        {/* --- USER SESSION & ICONS --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Notifications bell */}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setIsNotificationsOpen(prev => !prev)}>
            <span style={{ fontSize: "1.4rem" }}>🔔</span>
            {unreadNotificationsCount > 0 && (
              <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "var(--accent-color)", color: "white", fontSize: "0.7rem", fontWeight: "bold", borderRadius: "50%", width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {unreadNotificationsCount}
              </span>
            )}
          </div>

          {/* Cart Icon */}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setIsCartOpen(prev => !prev)}>
            <span style={{ fontSize: "1.4rem" }}>🛒</span>
            {cart.length > 0 && (
              <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "var(--secondary-color)", color: "white", fontSize: "0.7rem", fontWeight: "bold", borderRadius: "50%", width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>

          {/* User profile dropdown or login link */}
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff", margin: "0" }}>{currentUser.name}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: "0", textTransform: "capitalize" }}>
                  {currentUser.role === "admin" ? "🛡️ Administrador" : "👤 Cliente"}
                </p>
              </div>
              <button className="btn btn-outline btn-sm btn-danger" onClick={handleLogout} style={{ padding: "6px 12px" }}>
                Salir
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => navigateTo("login")}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      {/* --- NOTIFICATIONS SIDE DRAWER --- */}
      {isNotificationsOpen && (
        <div className="glass-panel slide-in-right no-print" style={{ position: "fixed", top: "90px", right: "24px", width: "360px", maxHeight: "450px", overflowY: "auto", zIndex: "1000", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.1rem", margin: "0" }}>Notificaciones</h3>
            <span style={{ cursor: "pointer", fontSize: "1.2rem" }} onClick={() => setIsNotificationsOpen(false)}>✕</span>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-outline btn-sm" style={{ flex: "1", fontSize: "0.75rem", padding: "4px 8px" }} onClick={handleMarkAllNotificationsAsRead}>
              Leídas
            </button>
            <button className="btn btn-danger btn-sm" style={{ flex: "1", fontSize: "0.75rem", padding: "4px 8px" }} onClick={handleClearNotifications}>
              Borrar
            </button>
          </div>

          <hr style={{ border: "none", borderBottom: "1px solid var(--border-light)" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifications.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", padding: "20px 0" }}>No tienes notificaciones.</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{ padding: "10px", borderRadius: "8px", background: n.read ? "rgba(255,255,255,0.02)" : "rgba(99, 102, 241, 0.1)", borderLeft: n.read ? "3px solid transparent" : "3px solid var(--primary-color)", fontSize: "0.85rem", transition: "all 0.2s" }}>
                  <p style={{ color: n.read ? "var(--text-secondary)" : "#fff", fontWeight: n.read ? "400" : "500", margin: "0 0 4px 0" }}>{n.text}</p>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{n.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
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
                <button className="btn btn-primary btn-sm" style={{ marginTop: "16px" }} onClick={() => { setIsCartOpen(false); navigateTo("catalog"); }}>
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cart.map(item => {
                const book = books.find(b => b.id === item.bookId);
                if (!book) return null;
                return (
                  <div key={item.bookId} style={{ display: "flex", gap: "12px", background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    {/* Cover shape preview */}
                    <div style={{ width: "50px", height: "70px", background: book.gradient, borderRadius: "6px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                      {book.icon}
                    </div>
                    <div style={{ flex: "1" }}>
                      <h4 style={{ fontSize: "0.95rem", margin: "0 0 2px 0", fontWeight: "600" }}>{book.title}</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 6px 0" }}>{book.author}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "6px", padding: "2px" }}>
                          <button style={{ background: "none", border: "none", color: "white", padding: "4px 8px", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleUpdateCartQuantity(item.bookId, item.quantity - 1)}>-</button>
                          <span style={{ fontSize: "0.9rem", fontWeight: "600", minWidth: "15px", textAlign: "center" }}>{item.quantity}</span>
                          <button style={{ background: "none", border: "none", color: "white", padding: "4px 8px", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleUpdateCartQuantity(item.bookId, item.quantity + 1)}>+</button>
                        </div>
                        <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--secondary-color)" }}>
                          ${(book.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <button style={{ background: "none", border: "none", color: "var(--danger)", fontSize: "1.1rem", cursor: "pointer" }} onClick={() => handleRemoveFromCart(item.bookId)}>✕</button>
                    </div>
                  </div>
                );
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

              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { setIsCartOpen(false); navigateTo("cart"); }}>
                Proceder al Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- MAIN PAGE CONTAINER --- */}
      <main className="container" style={{ flex: "1", padding: "20px 24px 80px 24px", maxWidth: "1200px" }}>
        
        {/* --- PAGE: CATALOG --- */}
        {activeTab === "catalog" && (
          <div className="fade-in">
            {/* Hero search section */}
            <div className="glass-panel" style={{ padding: "40px", marginBottom: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Descubre Lecturas Increíbles</h2>
              <p style={{ color: "var(--text-secondary)", maxWidth: "600px", fontSize: "1.05rem" }}>Consulta disponibilidad en tiempo real, añade libros al carrito y cómpralos en línea de forma segura.</p>
              
              {/* Search fields */}
              <div style={{ display: "flex", width: "100%", maxWidth: "800px", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                <div style={{ flex: "2", minWidth: "250px", position: "relative" }}>
                  <input type="text" className="input-field" placeholder="Buscar por título, autor o categoría..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: "40px" }} />
                  <span style={{ position: "absolute", left: "14px", top: "12px", fontSize: "1.1rem", color: "var(--text-muted)" }}>🔍</span>
                </div>
                
                <div style={{ flex: "1", minWidth: "180px" }}>
                  <select className="input-field" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ cursor: "pointer" }}>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Grid Catalog */}
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "24px", textAlign: "left", display: "flex", alignItems: "center", gap: "10px" }}>
              📚 Catálogo de Libros <span className="badge badge-primary">{filteredBooks.length}</span>
            </h3>

            {currentBooks.length === 0 ? (
              <div className="glass-panel" style={{ padding: "60px", textAlign: "center" }}>
                <span style={{ fontSize: "4rem" }}>🔍</span>
                <h4 style={{ fontSize: "1.3rem", marginTop: "16px" }}>No se encontraron libros</h4>
                <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>Prueba modificando tus términos de búsqueda o filtros.</p>
                <button className="btn btn-outline" style={{ marginTop: "16px" }} onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}>
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "30px", marginBottom: "40px" }}>
                  {currentBooks.map(book => (
                    <div key={book.id} className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", cursor: "pointer" }} onClick={() => setSelectedBook(book)}>
                      {/* Premium Cover Design */}
                      <div style={{ height: "200px", background: book.gradient, borderRadius: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px", color: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden" }}>
                        {/* Glow overlay */}
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
                        <button className="btn btn-outline btn-sm" style={{ flex: "1" }} onClick={() => setSelectedBook(book)}>
                          Ver Detalle
                        </button>
                        <button className={`btn btn-primary btn-sm ${book.stock === 0 ? "btn-danger" : ""}`} style={{ flex: "1.2" }} onClick={() => handleAddToCart(book)} disabled={book.stock === 0}>
                          {book.stock === 0 ? "Agotado" : "Añadir 🛒"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
                  <button className="btn btn-outline btn-sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                    ◀ Anterior
                  </button>
                  <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button className="btn btn-outline btn-sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Siguiente ▶
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* --- BOOK DETAIL MODAL --- */}
        {selectedBook && (
          <div className="no-print" style={{ position: "fixed", top: "0", left: "0", right: "0", bottom: "0", background: "rgba(0, 0, 0, 0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "2000", padding: "20px" }} onClick={() => setSelectedBook(null)}>
            <div className="glass-panel fade-in" style={{ maxWidth: "650px", width: "100%", padding: "30px", position: "relative", display: "flex", flexDirection: "column", gap: "24px", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)" }} onClick={(e) => e.stopPropagation()}>
              <span style={{ position: "absolute", top: "20px", right: "20px", cursor: "pointer", fontSize: "1.5rem", color: "var(--text-muted)" }} onClick={() => setSelectedBook(null)}>✕</span>
              
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {/* Book cover in modal */}
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
                <button className="btn btn-outline" style={{ flex: "1" }} onClick={() => setSelectedBook(null)}>
                  Cerrar
                </button>
                <button className={`btn btn-primary ${selectedBook.stock === 0 ? "btn-danger" : ""}`} style={{ flex: "2" }} onClick={() => { handleAddToCart(selectedBook); setSelectedBook(null); }} disabled={selectedBook.stock === 0}>
                  {selectedBook.stock === 0 ? "Agotado en Tienda" : "Añadir al Carrito de Compras 🛒"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: SHOPPING CART & CHECKOUT PAYMENT --- */}
        {activeTab === "cart" && (
          <div className="fade-in" style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center" }}>
            {/* Cart Items Summary */}
            <div className="glass-panel" style={{ flex: "1.5", minWidth: "320px", padding: "30px" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "20px" }}>Tu Carrito</h2>

              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <span style={{ fontSize: "4rem" }}>🛒</span>
                  <h3 style={{ fontSize: "1.3rem", marginTop: "16px" }}>El carrito está vacío</h3>
                  <button className="btn btn-primary" style={{ marginTop: "20px" }} onClick={() => navigateTo("catalog")}>
                    Volver al Catálogo
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {cart.map(item => {
                    const book = books.find(b => b.id === item.bookId);
                    if (!book) return null;
                    return (
                      <div key={item.bookId} style={{ display: "flex", gap: "16px", background: "rgba(255, 255, 255, 0.02)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ width: "60px", height: "85px", background: book.gradient, borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.8rem", boxShadow: "0 6px 12px rgba(0,0,0,0.3)" }}>
                          {book.icon}
                        </div>
                        <div style={{ flex: "1" }}>
                          <h3 style={{ fontSize: "1.1rem", margin: "0 0 4px 0", fontWeight: "700" }}>{book.title}</h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 10px 0" }}>Por {book.author}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "4px" }}>
                              <button style={{ background: "none", border: "none", color: "white", padding: "4px 10px", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleUpdateCartQuantity(item.bookId, item.quantity - 1)}>-</button>
                              <span style={{ fontSize: "1rem", fontWeight: "600" }}>{item.quantity}</span>
                              <button style={{ background: "none", border: "none", color: "white", padding: "4px 10px", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleUpdateCartQuantity(item.bookId, item.quantity + 1)}>+</button>
                            </div>
                            <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--secondary-color)" }}>
                              ${(book.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <button style={{ background: "none", border: "none", color: "var(--danger)", fontSize: "1.25rem", cursor: "pointer" }} onClick={() => handleRemoveFromCart(item.bookId)}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setCart([])}>Vaciar Carrito</button>
                    <button className="btn btn-outline btn-sm" onClick={() => navigateTo("catalog")}>Añadir más Libros</button>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout & Payment gateway */}
            {cart.length > 0 && (
              <div className="glass-panel" style={{ flex: "1", minWidth: "300px", padding: "30px", display: "flex", flexDirection: "column", gap: "24px" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Resumen y Pago</h2>
                
                {/* Cost summary */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(255, 255, 255, 0.02)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                    <span style={{ fontWeight: "600" }}>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Impuestos (12% IVA)</span>
                    <span style={{ fontWeight: "600" }}>${salesTax.toFixed(2)}</span>
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid var(--border-light)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", fontWeight: "800" }}>
                    <span>Total Neto</span>
                    <span style={{ color: "var(--secondary-color)" }}>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Form payment */}
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "16px" }}>Pasarela de Pago Segura</h3>
                  
                  {!currentUser ? (
                    <div style={{ textAlign: "center", padding: "10px 0" }}>
                      <p style={{ color: "var(--accent-color)", fontSize: "0.95rem", marginBottom: "12px" }}>Debes iniciar sesión para realizar el pago de tu compra.</p>
                      <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => navigateTo("login")}>
                        Iniciar Sesión / Registrarse
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {checkoutError && (
                        <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>
                          ⚠️ {checkoutError}
                        </div>
                      )}

                      <div className="form-group">
                        <label className="input-label">Nombre del Titular</label>
                        <input type="text" className="input-field" placeholder="Juan Pérez" value={checkoutCardName} onChange={(e) => setCheckoutCardName(e.target.value)} required disabled={isProcessingPayment} />
                      </div>

                      <div className="form-group">
                        <label className="input-label">Número de Tarjeta</label>
                        <input type="text" className="input-field" placeholder="4111 2222 3333 4444" value={checkoutCardNumber} onChange={(e) => setCheckoutCardNumber(e.target.value)} required disabled={isProcessingPayment} />
                      </div>

                      <div style={{ display: "flex", gap: "12px" }}>
                        <div className="form-group" style={{ flex: "1" }}>
                          <label className="input-label">Vencimiento</label>
                          <input type="text" className="input-field" placeholder="MM/AA" maxLength="5" value={checkoutCardExpiry} onChange={(e) => setCheckoutCardExpiry(e.target.value)} required disabled={isProcessingPayment} />
                        </div>
                        <div className="form-group" style={{ flex: "1" }}>
                          <label className="input-label">Código CVV</label>
                          <input type="password" className="input-field" placeholder="123" maxLength="4" value={checkoutCardCvv} onChange={(e) => setCheckoutCardCvv(e.target.value)} required disabled={isProcessingPayment} />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-secondary" style={{ width: "100%", marginTop: "10px" }} disabled={isProcessingPayment}>
                        {isProcessingPayment ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                            <span className="spinner" style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            Procesando Pago...
                          </div>
                        ) : (
                          `Pagar Ahora $${cartTotal.toFixed(2)} 🔒`
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- PAGE: DIGITAL INVOICE DETAIL (PRINTABLE) --- */}
        {activeTab === "invoice-detail" && selectedInvoice && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
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
                  <p style={{ color: "#4f46e5", fontWeight: "700", margin: "0", fontSize: "1.1rem" }}>{selectedInvoice.id}</p>
                  <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "4px 0 0 0" }}>Fecha: {selectedInvoice.date}</p>
                </div>
              </div>

              {/* Client Info */}
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", border: "1px solid #edf2f7" }}>
                <div>
                  <h4 style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px 0" }}>Cliente</h4>
                  <p style={{ fontWeight: "700", color: "#0f172a", margin: "0" }}>{selectedInvoice.userName}</p>
                  <p style={{ color: "#475569", margin: "0", fontSize: "0.9rem" }}>{selectedInvoice.userEmail}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px 0" }}>Método de Pago</h4>
                  <p style={{ color: "#0f172a", fontWeight: "600", margin: "0" }}>Tarjeta de Crédito</p>
                  <p style={{ color: "#475569", margin: "0", fontSize: "0.9rem" }}>{selectedInvoice.paymentCard}</p>
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
                    {selectedInvoice.items.map((item, idx) => (
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
                  <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#475569" }}>
                  <span>IVA (12%):</span>
                  <span>${selectedInvoice.tax.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", borderTop: "1px solid #cbd5e1", paddingTop: "8px" }}>
                  <span>Total Neto:</span>
                  <span style={{ color: "#4f46e5" }}>${selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer Invoice */}
              <div style={{ textAlign: "center", marginTop: "20px", borderTop: "1px dashed #cbd5e1", paddingTop: "20px", color: "#64748b", fontSize: "0.85rem" }}>
                <p style={{ fontWeight: "600", color: "#475569", marginBottom: "4px" }}>¡Gracias por tu compra en Bibliotech!</p>
                <p>Este comprobante es un documento legal de compra digital. Transacción procesada de forma segura.</p>
              </div>
            </div>

            {/* Print and Return Buttons */}
            <div className="no-print" style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "700px" }}>
              <button className="btn btn-outline" style={{ flex: "1" }} onClick={() => navigateTo(currentUser && currentUser.role === "admin" ? "admin-reports" : "catalog")}>
                Volver
              </button>
              <button className="btn btn-primary" style={{ flex: "2" }} onClick={() => window.print()}>
                🖨️ Imprimir Factura Digital
              </button>
            </div>
          </div>
        )}

        {/* --- PAGE: MIS COMPRAS (USER INVOICES HISTORY) --- */}
        {activeTab === "history" && currentUser && (
          <div className="fade-in glass-panel" style={{ padding: "30px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "20px" }}>Historial de Compras</h2>
            
            {sales.filter(s => s.userEmail === currentUser.email).length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                <span style={{ fontSize: "3rem" }}>📄</span>
                <p style={{ marginTop: "12px" }}>Aún no has realizado ninguna compra en el sistema.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: "16px" }} onClick={() => navigateTo("catalog")}>
                  Ver Catálogo de Libros
                </button>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Factura</th>
                      <th>Fecha</th>
                      <th>Libros Adquiridos</th>
                      <th>Monto Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales
                      .filter(s => s.userEmail === currentUser.email)
                      .map(invoice => (
                        <tr key={invoice.id}>
                          <td style={{ fontWeight: "700", color: "var(--secondary-color)" }}>{invoice.id}</td>
                          <td>{invoice.date}</td>
                          <td>
                            <p style={{ fontSize: "0.85rem", margin: "0" }}>
                              {invoice.items.map(i => `${i.title} (x${i.quantity})`).join(", ")}
                            </p>
                          </td>
                          <td style={{ fontWeight: "800", color: "#fff" }}>${invoice.total.toFixed(2)}</td>
                          <td>
                            <button className="btn btn-outline btn-sm" onClick={() => viewInvoiceDetail(invoice)}>
                              Ver Factura 📄
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- PAGE: ADMIN INVENTORY & REGISTER BOOKS --- */}
        {activeTab === "admin-books" && currentUser && currentUser.role === "admin" && (
          <div className="fade-in" style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            
            {/* New Book form */}
            <div className="glass-panel" style={{ flex: "1", minWidth: "300px", padding: "30px" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "20px" }}>Registrar Nuevo Libro</h2>
              
              <form onSubmit={handleCreateBook} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {adminBookError && (
                  <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>
                    ⚠️ {adminBookError}
                  </div>
                )}
                {adminBookSuccess && (
                  <div style={{ color: "#a7f3d0", background: "rgba(16, 185, 129, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "left" }}>
                    ✅ {adminBookSuccess}
                  </div>
                )}

                <div className="form-group">
                  <label className="input-label">Título del Libro *</label>
                  <input type="text" className="input-field" placeholder="Ej. El Alquimista" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="input-label">Autor(es) *</label>
                  <input type="text" className="input-field" placeholder="Ej. Paulo Coelho" value={newBookAuthor} onChange={(e) => setNewBookAuthor(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="input-label">Categoría *</label>
                  <input type="text" className="input-field" placeholder="Ej. Literatura, Ciencia, Finanzas" value={newBookCategory} onChange={(e) => setNewBookCategory(e.target.value)} required />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="form-group" style={{ flex: "1" }}>
                    <label className="input-label">Precio * ($)</label>
                    <input type="number" step="0.01" className="input-field" placeholder="19.99" value={newBookPrice} onChange={(e) => setNewBookPrice(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: "1" }}>
                    <label className="input-label">Stock Inicial *</label>
                    <input type="number" className="input-field" placeholder="10" value={newBookStock} onChange={(e) => setNewBookStock(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">Sinopsis / Descripción</label>
                  <textarea className="input-field" placeholder="Escribe un breve resumen de la obra..." style={{ height: "90px", resize: "none" }} value={newBookDescription} onChange={(e) => setNewBookDescription(e.target.value)} />
                </div>

                {/* Cover presets */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <label className="input-label">Ícono Representativo</label>
                    <select className="input-field" value={newBookIcon} onChange={(e) => setNewBookIcon(e.target.value)}>
                      <option value="📖">📖 Libro</option>
                      <option value="🚀">🚀 Nave (Ciencia Ficción)</option>
                      <option value="💻">💻 Laptop (Tecnología)</option>
                      <option value="📈">📈 Gráfica (Finanzas)</option>
                      <option value="🦋">🦋 Mariposa (Fantasía)</option>
                      <option value="⚡">⚡ Rayo (Desarrollo)</option>
                      <option value="🌌">🌌 Galaxia (Ciencia)</option>
                      <option value="🛡️">🛡️ Escudo (Literatura)</option>
                      <option value="🧠">🧠 Cerebro (Filosofía)</option>
                    </select>
                  </div>

                  <div style={{ flex: "1.2" }}>
                    <label className="input-label">Color de Portada</label>
                    <select className="input-field" value={newBookGradient} onChange={(e) => setNewBookGradient(e.target.value)}>
                      <option value="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)">Azul Nocturno</option>
                      <option value="linear-gradient(135deg, #2c3e50 0%, #3498db 100%)">Gris y Azul</option>
                      <option value="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)">Esmeralda</option>
                      <option value="linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)">Fucsia Cósmico</option>
                      <option value="linear-gradient(135deg, #e65c00 0%, #F9D423 100%)">Fuego Cálido</option>
                      <option value="linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)">Púrpura Profundo</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                  Añadir al Catálogo ➕
                </button>
              </form>
            </div>

            {/* List & Edit Prices/Stock */}
            <div className="glass-panel" style={{ flex: "1.8", minWidth: "320px", padding: "30px" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "20px" }}>Gestión de Inventario y Precios</h2>
              
              <div style={{ overflowX: "auto" }}>
                <table className="custom-table" style={{ fontSize: "0.85rem" }}>
                  <thead>
                    <tr>
                      <th>Libro</th>
                      <th>Categoría</th>
                      <th style={{ width: "110px" }}>Precio ($)</th>
                      <th style={{ width: "100px" }}>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "1.3rem" }}>{book.icon}</span>
                            <div>
                              <p style={{ fontWeight: "700", color: "#fff", margin: "0" }}>{book.title}</p>
                              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", margin: "0" }}>Por {book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>{book.category}</span>
                        </td>
                        <td>
                          {editingBookId === book.id ? (
                            <input type="number" step="0.01" className="input-field" style={{ padding: "6px 8px", fontSize: "0.85rem" }} value={editPriceVal} onChange={(e) => setEditPriceVal(e.target.value)} />
                          ) : (
                            <span style={{ fontWeight: "700" }}>${book.price.toFixed(2)}</span>
                          )}
                        </td>
                        <td>
                          {editingBookId === book.id ? (
                            <input type="number" className="input-field" style={{ padding: "6px 8px", fontSize: "0.85rem" }} value={editStockVal} onChange={(e) => setEditStockVal(e.target.value)} />
                          ) : (
                            <span>{book.stock} und</span>
                          )}
                        </td>
                        <td>
                          {editingBookId === book.id ? (
                            <div style={{ display: "flex", gap: "4px" }}>
                              <button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={() => handleUpdateBookPriceStock(book.id)}>✓</button>
                              <button className="btn btn-outline btn-sm" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={handleCancelEditingBook}>✕</button>
                            </div>
                          ) : (
                            <button className="btn btn-outline btn-sm" style={{ padding: "6px 10px", fontSize: "0.75rem" }} onClick={() => handleStartEditingBook(book)}>
                              Editar ✏️
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- PAGE: ADMIN SALES REPORT --- */}
        {activeTab === "admin-reports" && currentUser && currentUser.role === "admin" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Metric Cards Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px", background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" }}>
                <span style={{ fontSize: "2rem" }}>💰</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Ingresos Totales</span>
                <span style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--secondary-color)" }}>${totalEarnings.toFixed(2)}</span>
              </div>

              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" }}>
                <span style={{ fontSize: "2rem" }}>📦</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Unidades Vendidas</span>
                <span style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--primary-color)" }}>{totalUnitsSold} libros</span>
              </div>

              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px", background: "linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" }}>
                <span style={{ fontSize: "2rem" }}>📄</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Transacciones</span>
                <span style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--accent-color)" }}>{sales.length} compras</span>
              </div>

              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "8px", background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" }}>
                <span style={{ fontSize: "2rem" }}>🏆</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Libro Más Vendido</span>
                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bestSeller.title}</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{bestSeller.quantity} unidades vendidas</span>
              </div>
            </div>

            {/* Sales invoices log table */}
            <div className="glass-panel" style={{ padding: "30px" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "20px" }}>Registro General de Ventas</h2>
              
              {sales.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px 0" }}>Aún no se registran ventas en la plataforma.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Factura</th>
                        <th>Cliente / Correo</th>
                        <th>Fecha y Hora</th>
                        <th>Desglose de Compra</th>
                        <th>Monto Neto</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map(invoice => (
                        <tr key={invoice.id}>
                          <td style={{ fontWeight: "700", color: "var(--secondary-color)" }}>{invoice.id}</td>
                          <td>
                            <p style={{ fontWeight: "600", margin: "0", color: "#fff" }}>{invoice.userName}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0" }}>{invoice.userEmail}</p>
                          </td>
                          <td>{invoice.date}</td>
                          <td>
                            <p style={{ fontSize: "0.8rem", margin: "0", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {invoice.items.map(i => `${i.title} (x${i.quantity})`).join(", ")}
                            </p>
                          </td>
                          <td style={{ fontWeight: "800", color: "#fff" }}>${invoice.total.toFixed(2)}</td>
                          <td>
                            <button className="btn btn-outline btn-sm" onClick={() => viewInvoiceDetail(invoice)}>
                              Ver Detalle 📄
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- PAGE: LOGIN --- */}
        {activeTab === "login" && (
          <div className="fade-in" style={{ display: "flex", justifyContent: "center" }}>
            <div className="glass-panel" style={{ maxWidth: "420px", width: "100%", padding: "35px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "800", textAlign: "center" }}>Iniciar Sesión</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center", marginTop: "-10px" }}>
                Accede a tu cuenta de Bibliotech.
              </p>

              {authError && (
                <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>
                  ⚠️ {authError}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group">
                  <label className="input-label">Correo Electrónico</label>
                  <input type="email" className="input-field" placeholder="ejemplo@correo.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label className="input-label" style={{ marginBottom: "0" }}>Contraseña</label>
                    <span style={{ fontSize: "0.8rem", color: "var(--secondary-color)", cursor: "pointer" }} onClick={() => navigateTo("recover")}>
                      ¿Olvidaste tu contraseña?
                    </span>
                  </div>
                  <input type="password" className="input-field" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}>
                  Ingresar al Sistema 🔑
                </button>
              </form>

              <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "10px 0" }} />

              <p style={{ fontSize: "0.9rem", textAlign: "center", color: "var(--text-secondary)" }}>
                ¿No tienes una cuenta?{" "}
                <span style={{ color: "var(--secondary-color)", cursor: "pointer", fontWeight: "600" }} onClick={() => navigateTo("register")}>
                  Regístrate aquí
                </span>
              </p>

              {/* Demo accounts hint */}
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", fontSize: "0.75rem", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontWeight: "600", marginBottom: "4px" }}>Cuentas de demostración:</p>
                <p>👤 Cliente: <b>user@bibliotech.com</b> / pass: <b>user123</b></p>
                <p>🛡️ Administrador: <b>admin@bibliotech.com</b> / pass: <b>admin123</b></p>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: REGISTER --- */}
        {activeTab === "register" && (
          <div className="fade-in" style={{ display: "flex", justifyContent: "center" }}>
            <div className="glass-panel" style={{ maxWidth: "450px", width: "100%", padding: "35px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "800", textAlign: "center" }}>Crear Cuenta</h2>
              
              {authError && (
                <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>
                  ⚠️ {authError}
                </div>
              )}
              {authSuccess && (
                <div style={{ color: "#a7f3d0", background: "rgba(16, 185, 129, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "left" }}>
                  ✅ {authSuccess}
                </div>
              )}

              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label className="input-label">Nombre Completo</label>
                  <input type="text" className="input-field" placeholder="Juan Pérez" value={authName} onChange={(e) => setAuthName(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="input-label">Correo Electrónico</label>
                  <input type="email" className="input-field" placeholder="juan.perez@correo.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="input-label">Rol de Cuenta (Para Pruebas)</label>
                  <select className="input-field" value={authRole} onChange={(e) => setAuthRole(e.target.value)}>
                    <option value="user">👤 Cliente / Lector</option>
                    <option value="admin">🛡️ Administrador del Sistema</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="form-group" style={{ flex: "1" }}>
                    <label className="input-label">Contraseña</label>
                    <input type="password" className="input-field" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: "1" }}>
                    <label className="input-label">Confirmar</label>
                    <input type="password" className="input-field" placeholder="••••••••" value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                  Crear Cuenta y Registrarse 🚀
                </button>
              </form>

              <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "8px 0" }} />

              <p style={{ fontSize: "0.9rem", textAlign: "center", color: "var(--text-secondary)" }}>
                ¿Ya tienes una cuenta?{" "}
                <span style={{ color: "var(--secondary-color)", cursor: "pointer", fontWeight: "600" }} onClick={() => navigateTo("login")}>
                  Inicia sesión aquí
                </span>
              </p>
            </div>
          </div>
        )}

        {/* --- PAGE: RECOVER PASSWORD --- */}
        {activeTab === "recover" && (
          <div className="fade-in" style={{ display: "flex", justifyContent: "center" }}>
            <div className="glass-panel" style={{ maxWidth: "420px", width: "100%", padding: "35px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "800", textAlign: "center" }}>Recuperar Contraseña</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "center", marginTop: "-10px" }}>
                {recoverStep === 1 
                  ? "Ingresa tu correo para buscar tu cuenta en el sistema." 
                  : "Ingresa tu nueva contraseña para actualizar tu cuenta."}
              </p>

              {authError && (
                <div style={{ color: "#fca5a5", background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(239, 68, 68, 0.3)", textAlign: "left" }}>
                  ⚠️ {authError}
                </div>
              )}
              {authSuccess && (
                <div style={{ color: "#a7f3d0", background: "rgba(16, 185, 129, 0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid rgba(16, 185, 129, 0.3)", textAlign: "left" }}>
                  ✅ {authSuccess}
                </div>
              )}

              <form onSubmit={handleRecoverPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {recoverStep === 1 ? (
                  <div className="form-group">
                    <label className="input-label">Correo Registrado</label>
                    <input type="email" className="input-field" placeholder="ejemplo@correo.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "6px", textAlign: "left", margin: "0" }}>
                      Cuenta encontrada: <b>{recoveredEmail}</b>
                    </p>
                    <div className="form-group">
                      <label className="input-label">Nueva Contraseña</label>
                      <input type="password" className="input-field" placeholder="Nueva contraseña" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="input-label">Confirmar Contraseña</label>
                      <input type="password" className="input-field" placeholder="Confirmar contraseña" value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} required />
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}>
                  {recoverStep === 1 ? "Buscar Cuenta 🔍" : "Actualizar Contraseña 💾"}
                </button>
              </form>

              <hr style={{ border: "none", borderTop: "1px solid var(--border-light)", margin: "10px 0" }} />

              <span style={{ color: "var(--secondary-color)", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem", textAlign: "center" }} onClick={() => { setRecoverStep(1); navigateTo("login"); }}>
                Volver al Inicio de Sesión
              </span>
            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="glass-panel no-print" style={{ margin: "24px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0" }}>© 2026 Bibliotech. Todos los derechos reservados.</p>
        <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigateTo("catalog")}>Catálogo</span>
          <span>•</span>
          <span style={{ cursor: "pointer" }} onClick={() => navigateTo("login")}>Acceso Privado</span>
        </div>
      </footer>
    </>
  );
}

export default App;
