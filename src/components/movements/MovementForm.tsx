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
    <div className="p-4 border rounded max-w-xl space-y-2">
      <h2 className="text-xl font-bold">Registrar Movimiento</h2>

      {error && <p className="text-red-600">{error}</p>}

      <select value={productId} onChange={e => setProductId(e.target.value)}>
        <option value="">Seleccione producto</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.sku} - {p.name}
          </option>
        ))}
      </select>

      <select value={type} onChange={e => setType(e.target.value as Movement["type"])}>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
        <option value="ajuste">Ajuste</option>
      </select>

      <input
        type="number"
        placeholder="Cantidad"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
      />

      <input
        placeholder="Motivo (obligatorio)"
        value={reason}
        onChange={e => setReason(e.target.value)}
      />

      <button
  onClick={handleSubmit}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Guardar Movimiento
</button>
    </div>
  );
};

export default MovementForm;
