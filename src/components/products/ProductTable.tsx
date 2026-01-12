import { useState } from "react";
import { Product } from "../../types/Product";

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onAdjustStock: (product: Product) => void;
}

const ProductTable = ({ products, onDelete, onView, onEdit, onAdjustStock }: Props) => {
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th onClick={() => handleSort("sku")} className="cursor-pointer">SKU</th>
          <th onClick={() => handleSort("name")} className="cursor-pointer">Nombre</th>
          <th onClick={() => handleSort("stock")} className="cursor-pointer">Stock</th>
          <th onClick={() => handleSort("price")} className="cursor-pointer">Precio</th>
          <th onClick={() => handleSort("createdAt")} className="cursor-pointer">Creado</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {sortedProducts.map(p => {
          let stockColor = "text-green-600";
          if (p.stock === 0) stockColor = "text-red-600";
          else if (p.stock < p.minStock) stockColor = "text-yellow-600";

          return (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td className={stockColor}>{p.stock}</td>
              <td>${p.price}</td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td>{p.status}</td>
              <td className="flex gap-2">
                <button className="text-blue-600" onClick={() => onView(p.id)}>Ver</button>
                <button className="text-yellow-600" onClick={() => onEdit(p.id)}>Editar</button>
                <button className="text-purple-600" onClick={() => onAdjustStock(p)}>Ajustar Stock</button>
                <button className="text-red-600" onClick={() => onDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductTable;
