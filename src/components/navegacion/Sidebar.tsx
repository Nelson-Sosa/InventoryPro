import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6 cursor-pointer" onClick={() => navigate("/dashboard")}>
        InventoryPro
      </h1>
      <nav className="flex flex-col space-y-2">
        <button className="text-left p-2 rounded hover:bg-gray-700" onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button className="text-left p-2 rounded hover:bg-gray-700" onClick={() => navigate("/products")}>Productos</button>
        <button className="text-left p-2 rounded hover:bg-gray-700" onClick={() => navigate("/categories")}>Categorías</button>
        <button className="text-left p-2 rounded hover:bg-gray-700" onClick={() => navigate("/movements")}>Movimientos</button>
        <button className="text-left p-2 rounded hover:bg-gray-700" onClick={() => navigate("/reports")}>Reportes</button>
        <button className="text-left p-2 rounded hover:bg-gray-700" onClick={() => navigate("/users")}>Usuarios</button>
      </nav>
    </div>
  );
};

export default Sidebar;
