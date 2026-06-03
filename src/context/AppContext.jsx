import { createContext, useContext, useState, useEffect } from "react";
import { initialBooks } from "../data/initialBooks";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
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
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            });
          } else {
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
              role: firebaseUser.email.includes("admin") ? "admin" : "user"
            });
          }
        } catch (error) {
          console.error("Error fetching user profile in auth state change:", error);
        }
      } else {
        setCurrentUser(prev => (prev && prev.uid ? null : prev));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

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

  const handleRegister = async (e) => {
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail.toLowerCase(), authPassword);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: authEmail.toLowerCase(),
        name: authName,
        role: authRole
      });

      const newUser = {
        email: authEmail.toLowerCase(),
        password: authPassword,
        name: authName,
        role: authRole
      };
      setUsers(prev => [...prev, newUser]);

      addNotification(`Nuevo usuario registrado: ${authName} (${authRole === "admin" ? "Administrador" : "Cliente"})`);
      setAuthSuccess("¡Registro completado con éxito! Ahora puedes iniciar sesión.");
      
      setAuthEmail("");
      setAuthPassword("");
      setAuthConfirmPassword("");
      setAuthName("");
      setAuthRole("user");

      setTimeout(() => {
        setActiveTab("login");
        setAuthSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error al registrar usuario en Firebase:", error);
      if (error.code === "auth/email-already-in-use") {
        setAuthError("El correo electrónico ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        setAuthError("El formato del correo electrónico no es válido.");
      } else if (error.code === "auth/weak-password") {
        setAuthError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setAuthError(`Error al registrarse: ${error.message}`);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail || !authPassword) {
      setAuthError("Por favor, ingresa correo y contraseña.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, authEmail.toLowerCase(), authPassword);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      let loggedUser = null;

      if (userDoc.exists()) {
        loggedUser = {
          uid: user.uid,
          email: user.email,
          ...userDoc.data()
        };
      } else {
        const defaultName = user.displayName || user.email.split("@")[0];
        const defaultRole = user.email.includes("admin") ? "admin" : "user";
        
        loggedUser = {
          uid: user.uid,
          email: user.email,
          name: defaultName,
          role: defaultRole
        };

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: defaultName,
          role: defaultRole
        });
      }

      setCurrentUser(loggedUser);
      addNotification(`Sesión iniciada por ${loggedUser.name}`);
      
      setAuthEmail("");
      setAuthPassword("");

      if (loggedUser.role === "admin") {
        setActiveTab("admin-books");
      } else {
        setActiveTab("catalog");
      }
    } catch (error) {
      console.error("Error al iniciar sesión en Firebase:", error);
      
      const localUser = users.find(
        u => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword
      );

      if (localUser) {
        setCurrentUser(localUser);
        addNotification(`Sesión iniciada localmente por ${localUser.name} (Cuenta Demo)`);
        setAuthEmail("");
        setAuthPassword("");
        if (localUser.role === "admin") {
          setActiveTab("admin-books");
        } else {
          setActiveTab("catalog");
        }
      } else {
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
          setAuthError("Credenciales incorrectas.");
        } else if (error.code === "auth/invalid-email") {
          setAuthError("El formato del correo electrónico no es válido.");
        } else {
          setAuthError(`Error al iniciar sesión: ${error.message}`);
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (currentUser) {
        addNotification(`Sesión cerrada por ${currentUser.name}`);
      }
      setCurrentUser(null);
      setCart([]);
      setActiveTab("catalog");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setCurrentUser(null);
      setCart([]);
      setActiveTab("catalog");
    }
  };

  const handleRecoverPassword = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!authEmail) {
      setAuthError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    const emailLower = authEmail.toLowerCase();
    const isDemoUser = emailLower === "user@bibliotech.com" || emailLower === "admin@bibliotech.com";

    if (recoverStep === 1) {
      if (isDemoUser) {
        const user = users.find(u => u.email.toLowerCase() === emailLower);
        if (!user) {
          setAuthError("No existe ninguna cuenta registrada con este correo electrónico.");
          return;
        }
        setRecoveredEmail(emailLower);
        setRecoverStep(2);
      } else {
        try {
          await sendPasswordResetEmail(auth, emailLower);
          setAuthSuccess("Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.");
          addNotification(`Correo de recuperación enviado a ${emailLower}`);
          
          setTimeout(() => {
            setAuthEmail("");
            setActiveTab("login");
            setAuthSuccess("");
          }, 4000);
        } catch (error) {
          console.error("Error al enviar correo de recuperación:", error);
          if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
            setAuthError("No existe ninguna cuenta registrada con este correo electrónico.");
          } else if (error.code === "auth/invalid-email") {
            setAuthError("El formato del correo electrónico no es válido.");
          } else {
            setAuthError(`Error al restablecer contraseña: ${error.message}`);
          }
        }
      }
    } else if (recoverStep === 2) {
      if (!authPassword || !authConfirmPassword) {
        setAuthError("Por favor, completa los campos de contraseña.");
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setAuthError("Las contraseñas no coinciden.");
        return;
      }

      setUsers(prev => prev.map(u => {
        if (u.email === recoveredEmail) {
          return { ...u, password: authPassword };
        }
        return u;
      }));

      addNotification(`Contraseña restablecida localmente para cuenta demo ${recoveredEmail}`);
      setAuthSuccess("Contraseña de cuenta demo restablecida con éxito. Redirigiendo a inicio de sesión...");
      
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

  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleAddToCart = (book) => {
    if (book.stock === 0) return;

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

    const rawCardNum = checkoutCardNumber.replace(/\s+/g, "");
    if (rawCardNum.length < 13 || rawCardNum.length > 19 || isNaN(rawCardNum)) {
      setCheckoutError("El número de tarjeta de crédito no es válido.");
      return;
    }

    if (checkoutCardCvv.length < 3 || checkoutCardCvv.length > 4 || isNaN(checkoutCardCvv)) {
      setCheckoutError("El código CVV no es válido.");
      return;
    }

    setIsProcessingPayment(true);

    const cartSubtotal = calculateCartSubtotal();
    const salesTax = cartSubtotal * 0.12;
    const cartTotal = cartSubtotal + salesTax;

    setTimeout(() => {
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

      setBooks(prev => prev.map(book => {
        const cartItem = cart.find(item => item.bookId === book.id);
        if (cartItem) {
          return { ...book, stock: Math.max(0, book.stock - cartItem.quantity) };
        }
        return book;
      }));

      setSales(prev => [newInvoice, ...prev]);

      addNotification(`Compra realizada por ${currentUser.name}. Factura #${invoiceId} generada por $${cartTotal.toFixed(2)}.`);
      
      cart.forEach(item => {
        const book = books.find(b => b.id === item.bookId);
        if (book && book.stock - item.quantity === 0) {
          addNotification(`Alerta de Inventario: El libro '${book.title}' se ha agotado.`);
        }
      });

      setCart([]);
      setCheckoutCardName("");
      setCheckoutCardNumber("");
      setCheckoutCardExpiry("");
      setCheckoutCardCvv("");
      setIsProcessingPayment(false);
      
      setSelectedInvoice(newInvoice);
      setActiveTab("invoice-detail");
      setIsCartOpen(false);
    }, 2000);
  };

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
    addNotification(`Inventario: Libro '${bookBefore.title}' actualizado. Precio: $${price.toFixed(2)}, Stock: ${stock}.`);
  };

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

  const contextValue = {
    // State
    books, setBooks,
    users, setUsers,
    currentUser, setCurrentUser,
    cart, setCart,
    sales, setSales,
    notifications, setNotifications,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    currentPage, setCurrentPage,
    booksPerPage,
    selectedBook, setSelectedBook,
    isCartOpen, setIsCartOpen,
    isNotificationsOpen, setIsNotificationsOpen,
    selectedInvoice, setSelectedInvoice,
    authEmail, setAuthEmail,
    authPassword, setAuthPassword,
    authConfirmPassword, setAuthConfirmPassword,
    authName, setAuthName,
    authRole, setAuthRole,
    authError, setAuthError,
    authSuccess, setAuthSuccess,
    recoverStep, setRecoverStep,
    recoveredEmail, setRecoveredEmail,
    checkoutCardName, setCheckoutCardName,
    checkoutCardNumber, setCheckoutCardNumber,
    checkoutCardExpiry, setCheckoutCardExpiry,
    checkoutCardCvv, setCheckoutCardCvv,
    checkoutError, setCheckoutError,
    isProcessingPayment, setIsProcessingPayment,
    newBookTitle, setNewBookTitle,
    newBookAuthor, setNewBookAuthor,
    newBookCategory, setNewBookCategory,
    newBookDescription, setNewBookDescription,
    newBookPrice, setNewBookPrice,
    newBookStock, setNewBookStock,
    newBookIcon, setNewBookIcon,
    newBookGradient, setNewBookGradient,
    adminBookError, setAdminBookError,
    adminBookSuccess, setAdminBookSuccess,
    editingBookId, setEditingBookId,
    editPriceVal, setEditPriceVal,
    editStockVal, setEditStockVal,

    // Actions & Computed
    addNotification,
    handleRegister,
    handleLogin,
    handleLogout,
    handleRecoverPassword,
    navigateTo,
    handleMarkAllNotificationsAsRead,
    handleClearNotifications,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveFromCart,
    calculateCartSubtotal,
    handlePaymentSubmit,
    handleCreateBook,
    handleUpdateBookPriceStock,
    getBestSellingBook,
    unreadNotificationsCount: notifications.filter(n => !n.read).length
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
