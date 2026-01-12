export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  unit?: string;
  status: "active" | "inactive" | "discontinued";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
