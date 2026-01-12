import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  email: string;
  role: "admin" | "supervisor" | "operador";
  token: string;
  password?: string; // solo para login
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, "token"> & { password: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Login con JSON Server y localStorage
  const login = async (email: string, password: string) => {
    try {
      // 1. Intentar buscar usuario en JSON Server
      const res = await fetch("http://localhost:3001/users");
      const users: any[] = await res.json();

      const found = users.find(u => u.email === email && u.password === password);

      if (found) {
        const token = "fake-jwt-token";
        const newUser: User = { email: found.email, role: found.role as User["role"], token };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return true;
      }

      // 2. Si no está en JSON Server, buscar en localStorage usuarios registrados en la sesión
      const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundLocal = savedUsers.find((u: any) => u.email === email && u.password === password);

      if (foundLocal) {
        const token = "fake-jwt-token";
        const newUser: User = { email: foundLocal.email, role: foundLocal.role as User["role"], token };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return true;
      }

      return false; // no se encontró el usuario
    } catch (error) {
      console.error("Error login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = (u: Omit<User, "token"> & { password: string }) => {
    const token = "fake-jwt-token";
    const newUser: User = { ...u, token };

    // Guardar en localStorage para login posterior
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    savedUsers.push(u); // solo email, password, role
    localStorage.setItem("users", JSON.stringify(savedUsers));

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => logout(), 1000 * 60 * 60); // expira en 1 hora
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
