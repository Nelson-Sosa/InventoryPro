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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reportes de Inventario</h1>

      <InventoryReport products={products} />
      <LowStockReport products={products} threshold={5} />
      <MovementsReport movements={movements} products={products} />
      <InventoryValuation products={products} />
    </div>
  );
};

export default ReportsPage;
