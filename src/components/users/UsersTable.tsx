import { User } from "../../types/User";
import { format } from "date-fns";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onToggleActive: (user: User) => void;
}

const UsersTable = ({ users, onEdit, onToggleActive }: Props) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Activo</th>
            <th className="border p-2">Último Acceso</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">{u.active ? "Sí" : "No"}</td>
              <td className="border p-2">{format(new Date(u.lastLogin), "yyyy-MM-dd HH:mm")}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => onEdit(u)} className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                <button onClick={() => onToggleActive(u)} className={`px-2 py-1 rounded ${u.active ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                  {u.active ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
