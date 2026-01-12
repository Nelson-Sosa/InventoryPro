import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("admin" | "supervisor" | "operador")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // Si no hay usuario logueado, redirige a login
  if (!user) return <Navigate to="/login" replace />;

  // Si el rol del usuario no está en allowedRoles, redirige a unauthorized
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  // Usuario autorizado, renderiza los children
  return <>{children}</>;
};

export default ProtectedRoute;
