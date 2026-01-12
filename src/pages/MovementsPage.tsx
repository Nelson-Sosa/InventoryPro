import { useEffect, useState } from "react";
import axios from "axios";
import { Movement } from "../types/Movement";
import { Product } from "../types/Product";

const API_URL = "http://localhost:3001";

const MovementsPage = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/movements`).then(res => setMovements(res.data));
    axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
  }, []);

  const getProductName = (id: string) =>
    products.find(p => p.id === id)?.name || "—";

  const filtered = movements.filter(m =>
    typeFilter ? m.type === typeFilter : true
  );

  const getColor = (type: string) => {
    if (type === "entrada") return "text-green-600";
    if (type === "salida") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Movimientos de Inventario</h1>

      <select onChange={e => setTypeFilter(e.target.value)}>
        <option value="">Todos</option>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
        <option value="ajuste">Ajuste</option>
      </select>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Stock anterior</th>
            <th>Stock nuevo</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.id}>
              <td>{new Date(m.createdAt).toLocaleDateString()}</td>
              <td>{getProductName(m.productId)}</td>
              <td className={getColor(m.type)}>{m.type}</td>
              <td>{m.quantity}</td>
              <td>{m.previousStock}</td>
              <td>{m.newStock}</td>
              <td>{m.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovementsPage;
