export interface Movement {
  id: string;
  productId: string;
  type: "entrada" | "salida" | "ajuste";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: string;
  createdAt: string;
}
