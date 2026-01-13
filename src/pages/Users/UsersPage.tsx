import { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "../../components/users/UserForm";
import UsersTable from "../../components/users/UsersTable";
import { User } from "../../types/User";

const API_URL = "http://localhost:3001";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Obtener usuarios del backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<User[]>(`${API_URL}/users`);
      setUsers(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setUsers([]);
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle activo/inactivo
  const handleToggleActive = async (user: User) => {
    try {
      await axios.patch(`${API_URL}/users/${user.id}`, {
        active: !user.active,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el estado del usuario.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <UserForm
        selectedUser={editingUser}
        onSaved={() => {
          setEditingUser(null);
          fetchUsers();
        }}
      />

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <UsersTable
          users={users}
          onEdit={setEditingUser}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
};

export default UsersPage;
