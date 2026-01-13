import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  password: string; // solo para login
  role: "admin" | "supervisor" | "operador";
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, "token" | "id"> & { password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      // 1️⃣ buscar en JSON Server
      const res = await fetch("http://localhost:3001/users");
      const users: User[] = await res.json();
      const found = users.find(u => u.email === email && u.password === password);

      if (found) {
        const token = "fake-jwt-token";
        const loggedUser = { ...found, token };
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return true;
      }

      // 2️⃣ fallback: usuarios locales
      const localUsers: User[] = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const foundLocal = localUsers.find(u => u.email === email && u.password === password);

      if (foundLocal) {
        const token = "fake-jwt-token";
        const loggedUser = { ...foundLocal, token };
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (u: Omit<User, "token" | "id"> & { password: string }) => {
    const id = crypto.randomUUID();
    const token = "fake-jwt-token";
    const newUser: User = { ...u, id, token };

    // Guardar localmente
    const savedUsers: User[] = JSON.parse(localStorage.getItem("localUsers") || "[]");
    savedUsers.push({ ...newUser });
    localStorage.setItem("localUsers", JSON.stringify(savedUsers));

    // Auto-login
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => logout(), 1000 * 60 * 60); // 1 hora
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
