import { useEffect, useState } from "react";
import { Category } from "../types/category";

const API_URL = "http://localhost:3001/categories";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const createCategory = async (category: Category) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = async (category: Category) => {
    await fetch(`${API_URL}/${category.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    setCategories(prev =>
      prev.map(c => (c.id === category.id ? category : c))
    );
  };

  const deleteCategory = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
