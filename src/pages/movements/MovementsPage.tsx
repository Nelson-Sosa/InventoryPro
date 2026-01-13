import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../../types/Product";
import { Movement } from "../../types/Movement";
import { format } from "date-fns";

import MovementForm from "../../components/movements/MovementForm";
import MovementTable from "../../components/movements/MovementTable";

const API_URL = "http://localhost:3001";

const MovementsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);

  const [filterType, setFilterType] = useState("Todos");
  const [filterProduct, setFilterProduct] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const loadData = async () => {
    const [productsRes, movementsRes] = await Promise.all([
      axios.get(`${API_URL}/products`),
      axios.get(`${API_URL}/movements`),
    ]);

    setProducts(productsRes.data);
    setMovements(movementsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMovements = movements.filter((m) => {
    const matchesType = filterType === "Todos" || m.type === filterType;
    const matchesProduct = !filterProduct || m.productId === filterProduct;
    const matchesUser = !filterUser || m.userId === filterUser;
    const matchesStart =
      !filterStartDate || new Date(m.createdAt) >= new Date(filterStartDate);
    const matchesEnd =
      !filterEndDate || new Date(m.createdAt) <= new Date(filterEndDate);

    return matchesType && matchesProduct && matchesUser && matchesStart && matchesEnd;
  });

  const exportCSV = () => {
    const headers = [
      "Producto",
      "Tipo",
      "Cantidad",
      "Stock anterior",
      "Stock nuevo",
      "Motivo",
      "Usuario",
      "Fecha",
    ];

    const rows = filteredMovements.map((m) => {
      const product = products.find((p) => p.id === m.productId);
      return [
        product?.name || "",
        m.type,
        m.quantity,
        m.previousStock,
        m.newStock,
        m.reason,
        m.userId,
        format(new Date(m.createdAt), "yyyy-MM-dd HH:mm"),
      ];
    });

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `movements_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Movimientos de Inventario</h1>

      <MovementForm onMovementSaved={loadData} />

      {/* 🔍 FILTROS */}
      <div className="flex flex-wrap gap-3 items-center mt-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Todos">Todos</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
          <option value="ajuste">Ajuste</option>
        </select>

        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos los productos</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Usuario"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Exportar CSV
        </button>
      </div>

      {/* 📋 TABLA */}
      <MovementTable movements={filteredMovements} products={products} />
    </div>
  );
};

export default MovementsPage;
