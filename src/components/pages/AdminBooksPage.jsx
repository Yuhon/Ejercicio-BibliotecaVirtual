import { useApp } from "../../context/AppContext";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import FormGroup from "../molecules/FormGroup";

const AdminBooksPage = () => {
  const { 
    currentUser, books, 
    newBookTitle, setNewBookTitle, newBookAuthor, setNewBookAuthor,
    newBookCategory, setNewBookCategory, newBookDescription, setNewBookDescription,
    newBookPrice, setNewBookPrice, newBookStock, setNewBookStock,
    newBookIcon, setNewBookIcon, newBookGradient, setNewBookGradient,
    adminBookError, adminBookSuccess, handleCreateBook,
    editingBookId, setEditingBookId,
    editPriceVal, setEditPriceVal, editStockVal, setEditStockVal, handleUpdateBookPriceStock
  } = useApp();

  if (!currentUser || currentUser.role !== "admin") return null;

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

  return (
    <div className="fade-in" style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
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

          <FormGroup label="Título del Libro *">
            <Input type="text" placeholder="Ej. El Alquimista" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} required />
          </FormGroup>

          <FormGroup label="Autor(es) *">
            <Input type="text" placeholder="Ej. Paulo Coelho" value={newBookAuthor} onChange={(e) => setNewBookAuthor(e.target.value)} required />
          </FormGroup>

          <FormGroup label="Categoría *">
            <Input type="text" placeholder="Ej. Literatura, Ciencia, Finanzas" value={newBookCategory} onChange={(e) => setNewBookCategory(e.target.value)} required />
          </FormGroup>

          <div style={{ display: "flex", gap: "12px" }}>
            <FormGroup label="Precio * ($)" style={{ flex: "1" }}>
              <Input type="number" step="0.01" placeholder="19.99" value={newBookPrice} onChange={(e) => setNewBookPrice(e.target.value)} required />
            </FormGroup>
            <FormGroup label="Stock Inicial *" style={{ flex: "1" }}>
              <Input type="number" placeholder="10" value={newBookStock} onChange={(e) => setNewBookStock(e.target.value)} required />
            </FormGroup>
          </div>

          <FormGroup label="Sinopsis / Descripción">
            <textarea className="input-field" placeholder="Escribe un breve resumen de la obra..." style={{ height: "90px", resize: "none" }} value={newBookDescription} onChange={(e) => setNewBookDescription(e.target.value)} />
          </FormGroup>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <FormGroup label="Ícono Representativo" style={{ flex: "1" }}>
              <Select value={newBookIcon} onChange={(e) => setNewBookIcon(e.target.value)}>
                <option value="📖">📖 Libro</option>
                <option value="🚀">🚀 Nave</option>
                <option value="💻">💻 Laptop</option>
                <option value="📈">📈 Gráfica</option>
                <option value="🦋">🦋 Mariposa</option>
                <option value="⚡">⚡ Rayo</option>
                <option value="🌌">🌌 Galaxia</option>
                <option value="🛡️">🛡️ Escudo</option>
                <option value="🧠">🧠 Cerebro</option>
              </Select>
            </FormGroup>

            <FormGroup label="Color de Portada" style={{ flex: "1.2" }}>
              <Select value={newBookGradient} onChange={(e) => setNewBookGradient(e.target.value)}>
                <option value="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)">Azul Nocturno</option>
                <option value="linear-gradient(135deg, #2c3e50 0%, #3498db 100%)">Gris y Azul</option>
                <option value="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">Púrpura Místico</option>
                <option value="linear-gradient(135deg, #0ba360 0%, #3cba92 100%)">Verde Esmeralda</option>
                <option value="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">Rosa Atardecer</option>
                <option value="linear-gradient(135deg, #e65c00 0%, #F9D423 100%)">Fuego</option>
                <option value="linear-gradient(135deg, #434343 0%, #000000 100%)">Oscuridad</option>
              </Select>
            </FormGroup>
          </div>

          <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "10px" }}>
            Añadir al Inventario 📚
          </Button>
        </form>
      </div>

      <div className="glass-panel" style={{ flex: "2", minWidth: "300px", padding: "30px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "20px" }}>Inventario Actual ({books.length})</h2>
        <div style={{ flex: "1", overflowX: "auto" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ícono</th>
                <th>Título</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td style={{ fontSize: "1.5rem" }}>{book.icon}</td>
                  <td>
                    <p style={{ fontWeight: "700", margin: "0", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{book.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0" }}>{book.author}</p>
                  </td>
                  <td>
                    {editingBookId === book.id ? (
                      <Input type="number" step="0.01" style={{ padding: "6px 8px", fontSize: "0.85rem", width: "80px" }} value={editPriceVal} onChange={(e) => setEditPriceVal(e.target.value)} />
                    ) : (
                      <span style={{ fontWeight: "700" }}>${book.price.toFixed(2)}</span>
                    )}
                  </td>
                  <td>
                    {editingBookId === book.id ? (
                      <Input type="number" style={{ padding: "6px 8px", fontSize: "0.85rem", width: "60px" }} value={editStockVal} onChange={(e) => setEditStockVal(e.target.value)} />
                    ) : (
                      <span>{book.stock} und</span>
                    )}
                  </td>
                  <td>
                    {editingBookId === book.id ? (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <Button variant="secondary" size="sm" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={() => handleUpdateBookPriceStock(book.id)}>✓</Button>
                        <Button variant="outline" size="sm" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={handleCancelEditingBook}>✕</Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" style={{ padding: "6px 10px", fontSize: "0.75rem" }} onClick={() => handleStartEditingBook(book)}>
                        Editar ✏️
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooksPage;
