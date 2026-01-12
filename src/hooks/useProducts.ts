import { useEffect, useState } from "react";
import { Product } from "../types/Product";

const API_URL = "http://localhost:3001/products";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const createProduct = async (product: Product) => {
    // Validar SKU único
    if (products.some(p => p.sku === product.sku)) {
      throw new Error("El SKU ya existe");
    }

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    fetchProducts();
  };

  const updateProduct = async (id: string, product: Product) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    fetchProducts();
  };

  // Soft delete
  const deleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, status: "discontinued" }),
    });

    fetchProducts();
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
