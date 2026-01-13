import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/Product";
import { Movement } from "../types/Movement";

import InventoryReport from "../components/reports/InventoryReport";
import LowStockReport from "../components/reports/LowStockReport";
import MovementsReport from "../components/reports/MovementsReport";
import InventoryValuation from "../components/reports/InventoryValuation";

const API_URL = "http://localhost:3001";

const ReportsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [activeReport, setActiveReport] = useState<"inventory" | "lowStock" | "movements" | "valuation">("inventory");

  useEffect(() => {
    const loadData = async () => {
      const [productsRes, movementsRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/movements`),
      ]);

      setProducts(productsRes.data);
      setMovements(movementsRes.data);
    };
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Reportes de Inventario</h1>

      {/* Menú de botones */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveReport("inventory")}
          className={`px-4 py-2 rounded ${activeReport === "inventory" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Inventario Actual
        </button>
        <button
          onClick={() => setActiveReport("lowStock")}
          className={`px-4 py-2 rounded ${activeReport === "lowStock" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Productos Stock Bajo
        </button>
        <button
          onClick={() => setActiveReport("movements")}
          className={`px-4 py-2 rounded ${activeReport === "movements" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Movimientos por Período
        </button>
        <button
          onClick={() => setActiveReport("valuation")}
          className={`px-4 py-2 rounded ${activeReport === "valuation" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Valorización del Inventario
        </button>
      </div>

      {/* Contenido dinámico según selección */}
      <div>
        {activeReport === "inventory" && <InventoryReport products={products} />}
        {activeReport === "lowStock" && <LowStockReport products={products} threshold={5} />}
        {activeReport === "movements" && <MovementsReport movements={movements} products={products} />}
        {activeReport === "valuation" && <InventoryValuation products={products} />}
      </div>
    </div>
  );
};

export default ReportsPage;

