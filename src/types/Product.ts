export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  status: "active" | "inactive" | "discontinued";
  categoryId: string;
  imageUrl?: string;   // 👈 NUEVO
  createdAt: string;
  updatedAt: string;
}
