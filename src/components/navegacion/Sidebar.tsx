import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Productos", path: "/products" },
    { label: "Categorías", path: "/categories" },
    { label: "Movimientos", path: "/movements" },
    { label: "Reportes", path: "/reports" },
    { label: "Usuarios", path: "/users" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      {/* Logo */}
      <h1
        className="text-2xl font-bold mb-8 cursor-pointer hover:text-gray-300"
        onClick={() => navigate("/dashboard")}
      >
        InventoryPro
      </h1>

      {/* Menú */}
      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative text-left px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200 w-full ${
                isActive ? "bg-gray-800 font-semibold" : ""
              }`}
            >
              {/* Barra a la izquierda cuando está activo */}
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></span>
              )}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout siempre al fondo */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
