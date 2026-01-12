import { Outlet } from "react-router-dom";
import Sidebar from "../navegacion/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido dinámico */}
      <main className="flex-1 min-h-screen bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
