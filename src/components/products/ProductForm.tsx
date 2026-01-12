

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

  /* 🔹 Cargar productos y categorías */
  useEffect(() => {
    axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
    axios.get(`${API_URL}/categories`).then(res => setCategories(res.data));
  }, []);

  /* 🔹 Cambios de inputs */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* 🔹 Validaciones */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.sku) newErrors.sku = "SKU requerido";
    if (products.some(p => p.sku === form.sku))
      newErrors.sku = "SKU ya existe";

    if (!form.name) newErrors.name = "Nombre requerido";
    if (!form.categoryId) newErrors.categoryId = "Seleccione categoría";

    if (!form.price || Number(form.price) <= 0)
      newErrors.price = "Precio inválido";

    if (!form.stock) newErrors.stock = "Stock requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* 🔹 Guardar producto */
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
    <div className="p-6 max-w-xl space-y-3 border rounded">
      <h2 className="text-xl font-bold">Nuevo Producto</h2>

      <input name="sku" placeholder="SKU" onChange={handleChange} />
      {errors.sku && <p className="text-red-500">{errors.sku}</p>}

      <input name="name" placeholder="Nombre" onChange={handleChange} />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      <input
        name="description"
        placeholder="Descripción"
        onChange={handleChange}
      />

      <select name="categoryId" onChange={handleChange}>
        <option value="">Seleccione categoría</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {errors.categoryId && (
        <p className="text-red-500">{errors.categoryId}</p>
      )}

      <input name="price" type="number" placeholder="Precio" onChange={handleChange} />
      <input name="cost" type="number" placeholder="Costo" onChange={handleChange} />
      <input name="stock" type="number" placeholder="Stock inicial" onChange={handleChange} />
      <input name="minStock" type="number" placeholder="Stock mínimo" onChange={handleChange} />
      <input name="maxStock" type="number" placeholder="Stock máximo" onChange={handleChange} />

      <input
        name="imageUrl"
        placeholder="URL de imagen"
        onChange={handleChange}
      />

      {/* 👁 Preview */}
      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="preview"
          className="w-32 h-32 object-contain border"
        />
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar Producto
      </button>
    </div>
  );
};

export default ProductForm;
