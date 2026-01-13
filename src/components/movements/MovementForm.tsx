import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../../types/Product";
import { Movement } from "../../types/Movement";

const API_URL = "http://localhost:3001";

interface Props {
  onMovementSaved: () => void;
}

const MovementForm = ({ onMovementSaved }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<Movement["type"]>("entrada");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
  }, []);

  const selectedProduct = products.find(p => p.id === productId);

  const handleSubmit = async () => {
    if (!productId || quantity <= 0 || !reason) {
      setError("Complete todos los campos obligatorios");
      return;
    }

    if (!selectedProduct) return;

    const prevStock = selectedProduct.stock;

    if (type === "salida" && quantity > prevStock) {
      setError("La salida no puede superar el stock disponible");
      return;
    }

    const newStock =
      type === "entrada"
        ? prevStock + quantity
        : type === "salida"
        ? prevStock - quantity
        : prevStock + quantity;

    const movement: Movement = {
      id: crypto.randomUUID(),
      productId,
      type,
      quantity,
      previousStock: prevStock,
      newStock,
      reason,
      userId: "1",
      createdAt: new Date().toISOString(),
    };

    await axios.post(`${API_URL}/movements`, movement);

    await axios.patch(`${API_URL}/products/${productId}`, {
      stock: newStock,
      updatedAt: new Date().toISOString(),
    });

    setProductId("");
    setQuantity(0);
    setReason("");
    setError("");

    onMovementSaved();
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold text-center mb-2">Registrar Movimiento</h2>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded">
          {error}
        </p>
      )}

      <div className="flex flex-col space-y-3">
        {/* Producto */}
        <select
          value={productId}
          onChange={e => setProductId(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Seleccione producto</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.sku} - {p.name}
            </option>
          ))}
        </select>

        {/* Tipo de movimiento */}
        <select
          value={type}
          onChange={e => setType(e.target.value as Movement["type"])}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
          <option value="ajuste">Ajuste</option>
        </select>

        {/* Cantidad */}
        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Motivo */}
        <input
          placeholder="Motivo (obligatorio)"
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-2 rounded shadow"
        >
          Guardar Movimiento
        </button>
      </div>
    </div>
  );
};

export default MovementForm;
