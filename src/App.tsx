import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import ProductsPage from "./pages/Products/ProductsPage";
import ProductDetailPage from "./pages/Products/ProductDetailPage";
import ProductEditPage from "./pages/Products/ProductEditPage";
import ProductForm from "./components/products/ProductForm";

import CategoriesPage from "./pages/Categories/CategoriesPage";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard - todos los roles */}
           <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor", "operador"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Productos - SOLO admin y supervisor */}
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <ProductsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
              element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <CategoriesPage />
              </ProtectedRoute>
  }
/>
          <Route
            path="/products/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <ProductForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor"]}>
                <ProductEditPage />
              </ProtectedRoute>
            }
          />

          {/* Detalle - todos los roles */}
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "supervisor", "operador"]}>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          </Route>
          {/* Acceso no autorizado */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Ruta comodín */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
