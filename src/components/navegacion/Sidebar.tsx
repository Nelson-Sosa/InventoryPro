import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirige al login después de cerrar sesión
  };

  // Menú principal
  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Productos", path: "/products" },
    { label: "Categorías", path: "/categories" },
    { label: "Movimientos", path: "/movements" },
    { label: "Reportes", path: "/reports" },
    { label: "Usuarios", path: "/users" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      {/* Logo */}
      <h1
        className="text-xl font-bold mb-6 cursor-pointer hover:text-gray-300"
        onClick={() => navigate("/dashboard")}
      >
        InventoryPro
      </h1>

      {/* Menú */}
      <nav className="flex flex-col flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-left p-2 rounded hover:bg-gray-700 w-full text-white ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout al final */}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
