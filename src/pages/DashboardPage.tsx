import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  cost: number;
}

interface Movement {
  id: string;
  productId: string;
  type: "entrada" | "salida" | "ajuste";
  quantity: number;
  createdAt: string;
}

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("http://localhost:3001/products");
        const productsData = await productsRes.json();
        setProducts(productsData);

        const movementsRes = await fetch("http://localhost:3001/movements");
        const movementsData = await movementsRes.json();
        setMovements(movementsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Métricas básicas
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < p.minStock).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.cost, 0);

  // Movimientos del día y de la semana
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // domingo de esta semana

  const movementsToday = movements.filter((m) => {
    const d = new Date(m.createdAt);
    return d.toDateString() === today.toDateString();
  });

  const movementsWeek = movements.filter((m) => {
    const d = new Date(m.createdAt);
    return d >= startOfWeek && d <= today;
  });

  // Top 5 productos más movidos
  const topMovements = movements.reduce((acc: Record<string, number>, m) => {
    acc[m.productId] = (acc[m.productId] || 0) + m.quantity;
    return acc;
  }, {});
  const top5 = Object.entries(topMovements)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {user && (
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="mb-4">
            Bienvenido <strong>{user.email}</strong> (<span className="capitalize">{user.role}</span>)
          </p>
        </div>
      )}

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Total de productos</h2>
          <p className="text-2xl">{totalProducts}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Stock bajo</h2>
          <p className="text-2xl">{lowStockProducts}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Sin stock</h2>
          <p className="text-2xl">{outOfStockProducts}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Valor total inventario</h2>
          <p className="text-2xl">${totalInventoryValue.toFixed(2)}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Movimientos hoy</h2>
          <p className="text-2xl">{movementsToday.length}</p>
        </div>
        <div className="bg-indigo-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Movimientos esta semana</h2>
          <p className="text-2xl">{movementsWeek.length}</p>
        </div>
      </div>

      {/* Gráfico Top 5 productos */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Top 5 productos más movidos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={top5.map(([productId, qty]) => ({
              product: products.find((p) => p.id === productId)?.name || productId,
              quantity: qty,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Últimos movimientos */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Últimos movimientos</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Producto</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movements
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((m) => (
                <tr key={m.id}>
                  <td className="border p-2">{products.find((p) => p.id === m.productId)?.name || "Desconocido"}</td>
                  <td className="border p-2">{m.type}</td>
                  <td className="border p-2">{m.quantity}</td>
                  <td className="border p-2">{new Date(m.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded mt-4">
        Logout
      </button>
      <button
  onClick={() => navigate("/products")}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Gestionar Productos
</button>
    </div>
  );
};

export default DashboardPage;
