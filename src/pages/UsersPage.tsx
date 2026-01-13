import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../types/User";
import UsersTable from "../components/users/UsersTable";
import UserForm from "../components/users/UserForm";

const API_URL = "http://localhost:3001";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get(`${API_URL}/users`).then(res => setUsers(res.data));
  }, []);

  const refreshUsers = async () => {
    const res = await axios.get(`${API_URL}/users`);
    setUsers(res.data);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>

      <UserForm
        selectedUser={selectedUser}
        onSaved={() => {
          setSelectedUser(null);
          refreshUsers();
        }}
      />

      <UsersTable
        users={users}
        onEdit={user => setSelectedUser(user)}
        onToggleActive={async user => {
          await axios.patch(`${API_URL}/users/${user.id}`, { active: !user.active });
          refreshUsers();
        }}
      />
    </div>
  );
};

export default UsersPage;
