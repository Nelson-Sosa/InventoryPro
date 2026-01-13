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
  const [role, setRole] = useState<User["role"]>("user");
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setRole(selectedUser.role);
    } else {
      setName("");
      setEmail("");
      setRole("user");
    }
  }, [selectedUser]);

  const handleSubmit = async () => {
    if (!name || !email) {
      setError("Complete todos los campos");
      return;
    }

    if (selectedUser) {
      // Editar
      await axios.patch(`${API_URL}/users/${selectedUser.id}`, { name, email, role });
    } else {
      // Crear
      await axios.post(`${API_URL}/users`, {
        id: crypto.randomUUID(),
        name,
        email,
        role,
        active: true,
        lastLogin: new Date().toISOString(),
      });
    }

    onSaved();
  };

  return (
    <div className="border p-4 rounded space-y-2 max-w-xl">
      <h2 className="font-bold">{selectedUser ? "Editar Usuario" : "Crear Usuario"}</h2>
      {error && <p className="text-red-600">{error}</p>}

      <input
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <select value={role} onChange={e => setRole(e.target.value as User["role"])} className="w-full border p-2 rounded">
        <option value="admin">Admin</option>
        <option value="supervisor">Supervisor</option>
        <option value="user">Usuario</option>
      </select>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        {selectedUser ? "Guardar Cambios" : "Crear Usuario"}
      </button>
    </div>
  );
};

export default UserForm;
