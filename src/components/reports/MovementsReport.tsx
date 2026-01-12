//(movimientos por período)
import { useState } from "react";
import { Movement } from "../../types/Movement";
import { Product } from "../../types/Product";
import { format } from "date-fns";

interface Props {
  movements: Movement[];
  products: Product[];
}

const MovementsReport = ({ movements, products }: Props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = movements.filter(m => {
    const afterStart = !startDate || new Date(m.createdAt) >= new Date(startDate);
    const beforeEnd = !endDate || new Date(m.createdAt) <= new Date(endDate);
    return afterStart && beforeEnd;
  });

  return (
    <div className="border p-4 rounded space-y-2">
      <h2 className="font-bold text-lg">Movimientos por Período</h2>

      <div className="flex gap-2 mb-2">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Producto</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => {
            const product = products.find(p => p.id === m.productId);
            return (
              <tr key={m.id}>
                <td className="border p-2">{product?.name}</td>
                <td className="border p-2">{m.type}</td>
                <td className="border p-2">{m.quantity}</td>
                <td className="border p-2">
                  {format(new Date(m.createdAt), "yyyy-MM-dd HH:mm")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MovementsReport;
