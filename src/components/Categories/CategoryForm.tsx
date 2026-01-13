import { Category } from "../../types/category";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

interface Props {
  onSave: (category: Category) => void;
  editingCategory?: Category | null;
}

const CategoryForm = ({ onSave, editingCategory }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#000000");
  const [icon, setIcon] = useState("");

  // <-- Este useEffect sincroniza los estados cuando cambia editingCategory
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description || "");
      setColor(editingCategory.color || "#000000");
      setIcon(editingCategory.icon || "");
    } else {
      // Reset si no hay editingCategory
      setName("");
      setDescription("");
      setColor("#000000");
      setIcon("");
    }
  }, [editingCategory]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    const category: Category = {
      id: editingCategory?.id || uuid(),
      name,
      description,
      color,
      icon,
    };

    onSave(category);

    // reset
    setName("");
    setDescription("");
    setColor("#000000");
    setIcon("");
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-3 max-w-md mx-auto">
      <input
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Icono (ej: laptop)"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-10 border rounded cursor-pointer"
        />
        <span className="ml-2 text-gray-700 font-medium">{color}</span>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {editingCategory ? "Actualizar categoría" : "Crear categoría"}
      </button>
    </div>
  );
};

export default CategoryForm;
