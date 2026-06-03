import { useApp } from "../../context/AppContext";
import SearchBar from "../molecules/SearchBar";
import BookCard from "../molecules/BookCard";
import Button from "../atoms/Button";

const CatalogPage = () => {
  const { 
    books, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    currentPage, setCurrentPage, booksPerPage, setSelectedBook, handleAddToCart
  } = useApp();

  const categories = ["Todos", ...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="fade-in">
      {/* Hero search section */}
      <div className="glass-panel" style={{ padding: "40px", marginBottom: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "8px", background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Descubre Lecturas Increíbles</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", fontSize: "1.05rem" }}>Consulta disponibilidad en tiempo real, añade libros al carrito y cómpralos en línea de forma segura.</p>
        <SearchBar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      </div>

      <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "24px", textAlign: "left", display: "flex", alignItems: "center", gap: "10px" }}>
        📚 Catálogo de Libros <span className="badge badge-primary">{filteredBooks.length}</span>
      </h3>

      {currentBooks.length === 0 ? (
        <div className="glass-panel" style={{ padding: "60px", textAlign: "center" }}>
          <span style={{ fontSize: "4rem" }}>🔍</span>
          <h4 style={{ fontSize: "1.3rem", marginTop: "16px" }}>No se encontraron libros</h4>
          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>Prueba modificando tus términos de búsqueda o filtros.</p>
          <Button variant="outline" style={{ marginTop: "16px" }} onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}>
            Limpiar Filtros
          </Button>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "30px", marginBottom: "40px" }}>
            {currentBooks.map(book => (
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} onAddToCart={handleAddToCart} />
            ))}
          </div>

          <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>◀ Anterior</Button>
            <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>Página {currentPage} de {totalPages}</span>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente ▶</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CatalogPage;
