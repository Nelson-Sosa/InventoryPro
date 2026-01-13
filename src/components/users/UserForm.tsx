import { useState, useEffect } from "react";
import { User } from "../../types/User";
import axios from "axios";

interface Props {
  selectedUser: User | null;
  onSaved: () => void;
}

const API_URL = "http://localhost:3001";

const UserForm = ({ selectedUser, onSaved }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("operador");
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setRole(selectedUser.role);
    } else {
      setName("");
      setEmail("");
      setRole("operador");
    }
  }, [selectedUser]);

  const handleSubmit = async () => {
    if (!name || !email) {
      setError("Complete todos los campos");
      return;
    }

    try {
      if (selectedUser) {
        await axios.patch(`${API_URL}/users/${selectedUser.id}`, { name, email, role });
      } else {
        await axios.post(`${API_URL}/users`, {
          id: crypto.randomUUID(),
          name,
          email,
          role,
          active: true,
          lastLogin: new Date().toISOString(),
        });
      }
      setError("");
      onSaved();
    } catch (err) {
      setError("Error al guardar el usuario");
      console.error(err);
    }
  };

  return (
    <div className="border p-4 rounded space-y-2 max-w-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h2 className="font-bold text-lg">{selectedUser ? "Editar Usuario" : "Crear Usuario"}</h2>
      {error && <p className="text-red-600">{error}</p>}

      <input
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as User["role"])}
        className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="admin">Admin</option>
        <option value="supervisor">Supervisor</option>
        <option value="operador">Operador</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {selectedUser ? "Guardar Cambios" : "Crear Usuario"}
      </button>
    </div>
  );
};

export default UserForm;
