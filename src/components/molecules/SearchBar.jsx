import Input from '../atoms/Input';
import Select from '../atoms/Select';

const SearchBar = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div style={{ display: "flex", width: "100%", maxWidth: "800px", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
      <div style={{ flex: "2", minWidth: "250px", position: "relative" }}>
        <Input type="text" placeholder="Buscar por título, autor o categoría..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: "40px" }} />
        <span style={{ position: "absolute", left: "14px", top: "12px", fontSize: "1.1rem", color: "var(--text-muted)" }}>🔍</span>
      </div>
      
      <div style={{ flex: "1", minWidth: "180px" }}>
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ cursor: "pointer" }}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default SearchBar;
