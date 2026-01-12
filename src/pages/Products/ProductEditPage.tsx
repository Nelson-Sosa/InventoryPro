import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useState, useEffect } from "react";
import type { Product } from "../../types/Product";

const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct } = useProducts();
  const navigate = useNavigate();

  const productToEdit = products.find(p => p.id === id);

  const [form, setForm] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productToEdit) {
      setForm(productToEdit);
    }
  }, [productToEdit]);

  if (!form) return <p>Cargando...</p>;

  // =====================
  // VALIDACIONES
  // =====================
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!form.sku.trim()) newErrors.sku = "El SKU es obligatorio";
    if (form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (form.stock < 0) newErrors.stock = "El stock no puede ser negativo";
    if (!form.categoryId) newErrors.categoryId = "La categoría es obligatoria";

    // SKU único (excluyendo el producto actual)
    const skuExists = products.some(
      p => p.sku === form.sku && p.id !== form.id
    );
    if (skuExists) newErrors.sku = "El SKU ya existe";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =====================
  // HANDLERS
  // =====================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm(prev =>
      prev
        ? {
            ...prev,
            [name]:
              name === "price" || name === "stock" || name === "cost"
                ? Number(value)
                : value,
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const confirmSave = window.confirm(
      "¿Seguro que deseas guardar los cambios del producto?"
    );
    if (!confirmSave) return;

    await updateProduct(form.id, {
      ...form,
      updatedAt: new Date().toISOString(),
    });

    navigate("/products");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-3 max-w-xl">
      <h1 className="text-2xl font-bold">Editar Producto</h1>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre"
        className="border p-2 w-full"
      />
      {errors.name && <p className="text-red-600">{errors.name}</p>}

      <input
        name="sku"
        value={form.sku}
        onChange={handleChange}
        placeholder="SKU"
        className="border p-2 w-full"
      />
      {errors.sku && <p className="text-red-600">{errors.sku}</p>}

      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Precio"
        className="border p-2 w-full"
      />
      {errors.price && <p className="text-red-600">{errors.price}</p>}

      <input
        name="stock"
        type="number"
        value={form.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="border p-2 w-full"
      />
      {errors.stock && <p className="text-red-600">{errors.stock}</p>}

      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="">Seleccionar categoría</option>
        <option value="1">Laptops</option>
        <option value="2">Smartphones</option>
      </select>
      {errors.categoryId && (
        <p className="text-red-600">{errors.categoryId}</p>
      )}

      {/* IMAGE URL + PREVIEW */}
      <input
        name="imageUrl"
        value={form.imageUrl || ""}
        onChange={handleChange}
        placeholder="URL de la imagen"
        className="border p-2 w-full"
      />

      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="Preview"
          className="w-32 h-32 object-cover border mt-2"
        />
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </form>
  );
};

export default ProductEditPage;
