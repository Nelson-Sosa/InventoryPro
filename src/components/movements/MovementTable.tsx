import { Movement } from "../../types/Movement";
import { Product } from "../../types/Product";
import { format } from "date-fns";

interface Props {
  movements: Movement[];
  products: Product[];
}

const MovementTable = ({ movements, products }: Props) => {
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr>
          <th className="border p-2">Producto</th>
          <th className="border p-2">Tipo</th>
          <th className="border p-2">Cantidad</th>
          <th className="border p-2">Stock anterior</th>
          <th className="border p-2">Stock nuevo</th>
          <th className="border p-2">Motivo</th>
          <th className="border p-2">Usuario</th>
          <th className="border p-2">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {movements.map(m => {
          const product = products.find(p => p.id === m.productId);

          const typeColor =
            m.type === "entrada"
              ? "text-green-600"
              : m.type === "salida"
              ? "text-red-600"
              : "text-yellow-600";

          return (
            <tr key={m.id}>
              <td className="border p-2">{product?.name}</td>
              <td className={`border p-2 ${typeColor}`}>{m.type}</td>
              <td className="border p-2">{m.quantity}</td>
              <td className="border p-2">{m.previousStock}</td>
              <td className="border p-2">{m.newStock}</td>
              <td className="border p-2">{m.reason}</td>
              <td className="border p-2">{m.userId}</td>
              <td className="border p-2">
                {format(new Date(m.createdAt), "yyyy-MM-dd HH:mm")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MovementTable;
