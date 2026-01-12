import { useState, useMemo } from "react";
import { useProducts } from "../../hooks/useProducts";
import ProductTable from "../../components/products/ProductTable";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/Product";

const ProductsPage = () => {
  const { products, deleteProduct, updateProduct, loading } = useProducts();
  const navigate = useNavigate();

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<"low" | "out" | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal para ajuste de stock
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);

  // Filtrado y búsqueda
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return products
      .filter(p =>
        (p.name?.toLowerCase().includes(term) ?? false) ||
        (p.sku?.toLowerCase().includes(term) ?? false) ||
        (p.description?.toLowerCase().includes(term) ?? false)
      )
      .filter(p => !categoryFilter || p.categoryId === categoryFilter)
      .filter(p => !statusFilter || p.status === statusFilter)
      .filter(p =>
        stockFilter === "low" ? p.stock < p.minStock :
        stockFilter === "out" ? p.stock === 0 : true
      );
  }, [products, searchTerm, categoryFilter, statusFilter, stockFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Funciones de acción
  const handleView = (id: string) => navigate(`/products/${id}`);
  const handleEdit = (id: string) => navigate(`/products/edit/${id}`);
  const handleDelete = async (id: string) => await deleteProduct(id);
  const handleAdjustStock = (product: Product) => {
    setAdjustProduct(product);
    setAdjustQty(product.stock); // inicia el input con el stock actual
  };

  const submitAdjustStock = async () => {
    if (!adjustProduct) return;

    if (adjustQty < 0) {
      alert("El stock no puede ser negativo");
      return;
    }

    await updateProduct(adjustProduct.id, { ...adjustProduct, stock: adjustQty });
    setAdjustProduct(null);
    setAdjustQty(0);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

      {/* Controles de búsqueda y filtros */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por SKU, nombre o descripción"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select onChange={e => setCategoryFilter(e.target.value || null)} className="border p-2 rounded">
          <option value="">Todas las categorías</option>
          <option value="1">Laptops</option>
          <option value="2">Smartphones</option>
        </select>
        <select onChange={e => setStatusFilter(e.target.value || null)} className="border p-2 rounded">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="discontinued">Descontinuado</option>
        </select>
        <select onChange={e => setStockFilter(e.target.value as any)} className="border p-2 rounded">
          <option value="">Todos los stocks</option>
          <option value="low">Stock bajo</option>
          <option value="out">Sin stock</option>
        </select>
        <select onChange={e => setItemsPerPage(Number(e.target.value))} className="border p-2 rounded">
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Tabla de productos */}
      {loading ? <p>Cargando productos...</p> : (
        <ProductTable
          products={currentProducts}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
          onAdjustStock={handleAdjustStock}
        />
      )}

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="px-4 py-2 border rounded disabled:opacity-50">Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="px-4 py-2 border rounded disabled:opacity-50">Siguiente</button>
      </div>

      {/* Modal Ajuste de stock */}
      {adjustProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Ajustar Stock: {adjustProduct.name}</h2>
            <input
              type="number"
              value={adjustQty}
              onChange={e => setAdjustQty(Number(e.target.value))}
              placeholder="Cantidad"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setAdjustProduct(null)} className="px-4 py-2 border rounded">Cancelar</button>
              <button onClick={submitAdjustStock} className="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

