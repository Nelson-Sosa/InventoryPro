export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "supervisor" | "operador";
  active: boolean;
  lastLogin: string; // ISO string
}
