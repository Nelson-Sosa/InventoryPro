export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "supervisor" | "user";
  active: boolean;
  lastLogin: string; // ISO date string
}
