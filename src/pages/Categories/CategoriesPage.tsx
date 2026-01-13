import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import { Category } from "../../types/category";
import CategoryForm from "../../components/Categories/CategoryForm";


const CategoriesPage = () => {
  const { categories, createCategory, deleteCategory, updateCategory } = useCategories();
  const { products } = useProducts();

  const getProductCount = (categoryId: string) =>
    products.filter(p => p.categoryId === categoryId).length;

  const canDeleteCategory = (categoryId: string) =>
    !products.some(p => p.categoryId === categoryId);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSave = (category: Category) => {
    if (categories.some(c => c.id === category.id)) {
      updateCategory(category);
    } else {
      createCategory(category);
    }
    setEditingCategory(null); // reset
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Categorías</h1>

      {/* Formulario */}
      <CategoryForm onSave={handleSave} editingCategory={editingCategory} />

      {/* Listado */}
      <table className="w-full border-collapse border mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Color</th>
            <th className="p-2 text-left">Icono</th>
            <th className="p-2 text-left">Productos</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr
              key={category.id}
              className="border-t even:bg-gray-50 hover:bg-gray-100 transition-colors"
            >
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
                {/* Editar */}
                <button
                  onClick={() => setEditingCategory(category)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Editar
                </button>

                {/* Eliminar */}
                <button
                  onClick={() => deleteCategory(category.id)}
                  disabled={!canDeleteCategory(category.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 transition"
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
