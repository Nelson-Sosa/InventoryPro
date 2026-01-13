import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Product } from "../../types/Product";

const API_URL = "http://localhost:3001";

const ProductForm = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    categoryId: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    maxStock: "",
    unit: "unidad",
    imageUrl: "",
  });

  useEffect(() => {
    axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
    axios.get(`${API_URL}/categories`).then(res => setCategories(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.sku) newErrors.sku = "SKU requerido";
    if (products.some(p => p.sku === form.sku)) newErrors.sku = "SKU ya existe";
    if (!form.name) newErrors.name = "Nombre requerido";
    if (!form.categoryId) newErrors.categoryId = "Seleccione categoría";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "Precio inválido";
    if (!form.stock) newErrors.stock = "Stock requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!window.confirm("¿Desea guardar el producto?")) return;

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: crypto.randomUUID(),
      sku: form.sku,
      name: form.name,
      description: form.description,
      categoryId: form.categoryId,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      maxStock: Number(form.maxStock),
      unit: form.unit,
      status: "active",
      imageUrl: form.imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    await axios.post(`${API_URL}/products`, newProduct);
    navigate("/products");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Nuevo Producto</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SKU */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">SKU</label>
          <input
            name="sku"
            placeholder="Ingrese SKU"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.sku && <span className="text-red-500 text-sm mt-1">{errors.sku}</span>}
        </div>

        {/* Nombre */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Nombre</label>
          <input
            name="name"
            placeholder="Nombre del producto"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
        </div>

        {/* Categoría */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Categoría</label>
          <select
            name="categoryId"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccione categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className="text-red-500 text-sm mt-1">{errors.categoryId}</span>
          )}
        </div>

        {/* Precio */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Precio</label>
          <input
            name="price"
            type="number"
            placeholder="Precio de venta"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.price && <span className="text-red-500 text-sm mt-1">{errors.price}</span>}
        </div>

        {/* Costo */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Costo</label>
          <input
            name="cost"
            type="number"
            placeholder="Costo del producto"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Stock */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Stock inicial</label>
          <input
            name="stock"
            type="number"
            placeholder="Cantidad inicial"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.stock && <span className="text-red-500 text-sm mt-1">{errors.stock}</span>}
        </div>

        {/* Stock mínimo */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Stock mínimo</label>
          <input
            name="minStock"
            type="number"
            placeholder="Stock mínimo"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Stock máximo */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Stock máximo</label>
          <input
            name="maxStock"
            type="number"
            placeholder="Stock máximo"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* URL de imagen */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-medium mb-1">URL de Imagen</label>
          <input
            name="imageUrl"
            placeholder="Ingrese URL de la imagen"
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Preview de imagen */}
      {form.imageUrl && (
        <div className="flex justify-center">
          <img
            src={form.imageUrl}
            alt="preview"
            className="w-40 h-40 object-contain border rounded shadow-sm"
          />
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-2 rounded shadow"
        >
          Guardar Producto
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
