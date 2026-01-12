import { useEffect, useState } from "react";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  status: "active" | "inactive" | "discontinued";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  productId: string;
  type: "entrada" | "salida" | "ajuste";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  userId: string;
  createdAt: string;
}

const API_URL = "http://localhost:3001"; // JSON Server

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, movRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/movements`)
        ]);

        const prodData = await prodRes.json();
        const movData = await movRes.json();

        setProducts(prodData);
        setMovements(movData);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Métricas
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < p.minStock);
  const outOfStockProducts = products.filter(p => p.stock <= 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.cost, 0);

  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  const movementsToday = movements.filter(m => m.createdAt.startsWith(today));

  // Top 5 productos más movidos (por cantidad total)
  const movementCount: Record<string, number> = {};
  movements.forEach(m => {
    movementCount[m.productId] = (movementCount[m.productId] || 0) + m.quantity;
  });
  const top5Products = Object.entries(movementCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId, qty]) => ({
      product: products.find(p => p.id === productId)?.name || productId,
      quantity: qty
    }));

  return {
    products,
    movements,
    loading,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    totalInventoryValue,
    movementsToday,
    top5Products
  };
};
