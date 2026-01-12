import { useCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import { Category } from "../../types/category";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const CategoriesPage = () => {
  const { categories, createCategory, deleteCategory, updateCategory } = useCategories();
  const { products } = useProducts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#000000");
  const [icon, setIcon] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const getProductCount = (categoryId: string) =>
    products.filter(p => p.categoryId === categoryId).length;

  const canDeleteCategory = (categoryId: string) =>
    !products.some(p => p.categoryId === categoryId);

  const handleCreateOrUpdate = () => {
  if (!name.trim()) return;

  if (editingCategoryId) {
    // Editar categoría existente
    updateCategory({
      id: editingCategoryId,
      name,
      description,
      color,
      icon,
    });
    setEditingCategoryId(null);
  } else {
    // Crear nueva categoría
    const newCategory: Category = {
      id: uuid(),
      name,
      description,
      color,
      icon,
    };
    createCategory(newCategory);
  }

  setName("");
  setDescription("");
  setColor("#000000");
  setIcon("");
};


  const handleEditClick = (category: Category) => {
    setEditingCategoryId(category.id);
    setName(category.name);
    setDescription(category.description);
    setColor(category.color);
    setIcon(category.icon);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>

      {/* Crear / Editar categoría */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Descripción"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Icono (ej: laptop)"
          value={icon}
          onChange={e => setIcon(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        />

        <button
          onClick={handleCreateOrUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingCategoryId ? "Actualizar categoría" : "Crear categoría"}
        </button>
      </div>

      {/* Listado */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Color</th>
            <th className="p-2">Icono</th>
            <th className="p-2">Productos</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id} className="border-t">
              <td className="p-2">{category.name}</td>
              <td className="p-2">
                <span
                  className="px-2 py-1 rounded text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.color}
                </span>
              </td>
              <td className="p-2">{category.icon}</td>
              <td className="p-2">{getProductCount(category.id)}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleEditClick(category)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  disabled={!canDeleteCategory(category.id)}
                  onClick={() => deleteCategory(category.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesPage;
