import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "supervisor" | "operador">("operador");
  const [error, setError] = useState("");

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !password) {
    setError("Todos los campos son obligatorios");
    return;
  }

  await register({ email, password, role }); // ⬅️ await
  navigate("/dashboard");
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded mt-1"
            required
          />
        </label>

        <label className="block mb-2">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded mt-1"
            required
          />
        </label>

        <label className="block mb-4">
          Rol
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "supervisor" | "operador")}
            className="border p-2 w-full rounded mt-1"
          >
            <option value="operador">Operador</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button type="submit" className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700">
          Registrar
        </button>

        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">
            Inicia sesión
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
