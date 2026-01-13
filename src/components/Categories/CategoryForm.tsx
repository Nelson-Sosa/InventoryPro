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

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description || "");
      setColor(editingCategory.color || "#000000");
      setIcon(editingCategory.icon || "");
    } else {
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
      {/* Nombre */}
      <div className="flex flex-col">
        <label htmlFor="name" className="sr-only">
          Nombre
        </label>
        <input
          id="name"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col">
        <label htmlFor="description" className="sr-only">
          Descripción
        </label>
        <input
          id="description"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Icono */}
      <div className="flex flex-col">
        <label htmlFor="icon" className="sr-only">
          Icono
        </label>
        <input
          id="icon"
          placeholder="Icono (ej: laptop)"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Color */}
      <div className="flex items-center gap-3">
        <label htmlFor="color" className="text-sm font-medium">
          Color:
        </label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-10 border rounded cursor-pointer"
        />
        <span className="ml-2 text-gray-700 font-medium">{color}</span>
      </div>

      {/* Botón */}
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
