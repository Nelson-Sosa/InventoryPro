import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useEffect, useState } from "react";

interface Movement {
  id: string;
  productId: string;
  type: "entrada" | "salida";
  quantity: number;
  previousStock: number;    
  newStock: number;
  reason: string;
  createdAt: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();

  const product = products.find(p => p.id === id);

  const [movements, setMovements] = useState<Movement[]>([]);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustQty, setAdjustQty] = useState(0);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/movements?productId=${id}`)
      .then(res => res.json())
      .then(data => setMovements(data));
  }, [id]);

  if (!product) {
    return <p className="p-6">Producto no encontrado</p>;
  }

  const submitAdjustStock = async () => {
    if (!product) return;

    const prevStock = Number(product.stock);
    const newStock = prevStock + Number(adjustQty);

    await updateProduct(product.id, {
      ...product,
      stock: newStock,
    });

    // Agregar el movimiento al historial (simulado)
    setMovements(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        productId: product.id,
        type: adjustQty >= 0 ? "entrada" : "salida",
        quantity: Math.abs(Number(adjustQty)),
        previousStock: prevStock,
        newStock: newStock,
        reason: reason || "Ajuste manual",
        createdAt: new Date().toISOString(),
      },
    ]);

    setAdjustQty(0);
    setReason("");
    setShowAdjustModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        {/* Acciones rápidas */}
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
            Ajustar stock
          </button>
        </div>
      </div>

      {/* IMAGEN */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-64 h-64 object-contain border rounded"
        />
      ) : (
        <p className="text-gray-500">Sin imagen</p>
      )}

      {/* INFO GENERAL */}
      <div className="grid grid-cols-2 gap-4">
        <p><strong>SKU:</strong> {product.sku}</p>
        <p><strong>Estado:</strong> {product.status}</p>
        <p><strong>Stock:</strong> {Number(product.stock)}</p>
        <p><strong>Precio:</strong> ${product.price}</p>
        <p><strong>Costo:</strong> ${product.cost}</p>
        <p><strong>Mínimo:</strong> {product.minStock}</p>
        <p><strong>Máximo:</strong> {product.maxStock}</p>
        <p><strong>Creado:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
      </div>

      {/* HISTORIAL DE MOVIMIENTOS */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Historial de movimientos</h2>
        {movements.length === 0 ? (
          <p className="text-gray-500">Sin movimientos registrados</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Stock anterior</th>
                <th className="border p-2">Stock nuevo</th>
                <th className="border p-2">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(m => (
                <tr key={m.id}>
                  <td className="border p-2">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="border p-2">{m.type}</td>
                  <td className="border p-2">{m.quantity}</td>
                  <td className="border p-2">{m.previousStock}</td>
                  <td className="border p-2">{m.newStock}</td>
                  <td className="border p-2">{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL AJUSTE DE STOCK */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Ajustar Stock: {product.name}</h2>
            <input
              type="number"
              value={adjustQty}
              onChange={e => setAdjustQty(Number(e.target.value))}
              placeholder="Cantidad a ajustar"
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Motivo del ajuste"
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
