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

  useEffect(() => {
    if (productToEdit) setForm(productToEdit);
  }, [productToEdit]);

  if (!form) return <p>Cargando...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      await updateProduct(form.id, form);
      navigate("/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-2">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
      <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" />
      <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Precio" />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
        <option value="discontinued">Descontinuado</option>
      </select>
      <button type="submit">Guardar cambios</button>
    </form>
  );
};

export default ProductEditPage;
