import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct } = useProducts();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);

  // Modal de ajuste de stock
  const [adjustQty, setAdjustQty] = useState(0);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  if (!product) return <p className="p-6">Producto no encontrado</p>;

  // Acción de guardar ajuste de stock
  const submitAdjustStock = async () => {
    await updateProduct(product.id, { ...product, stock: product.stock + adjustQty });
    setShowAdjustModal(false);
    setAdjustQty(0);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/products/edit/${product.id}`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Editar
          </button>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Ajustar Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border p-4 rounded">
        <div>
          <p><strong>SKU:</strong> {product.sku}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Precio:</strong> ${product.price}</p>
          <p><strong>Costo:</strong> ${product.cost}</p>
        </div>
        <div>
          <p><strong>Estado:</strong> {product.status}</p>
          <p><strong>Creado:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
          <p><strong>Última actualización:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
          {/* Categoria opcional si existe */}
          {("categoryId" in product) && <p><strong>Categoría:</strong> {product.categoryId}</p>}
        </div>
      </div>

      {/* Modal Ajuste de Stock */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Ajustar Stock: {product.name}</h2>
            <input
              type="number"
              value={adjustQty}
              onChange={e => setAdjustQty(Number(e.target.value))}
              placeholder="Cantidad a ajustar"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={submitAdjustStock}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
