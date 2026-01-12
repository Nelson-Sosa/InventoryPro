//(valorización del inventario)
import { Product } from "../../types/Product";

interface Props {
  products: Product[];
}

const InventoryValuation = ({ products }: Props) => {
  // Para el ejemplo: asumimos que cada producto tiene `price`
  const totalValue = products.reduce((sum, p) => sum + (p.stock * (p.price || 0)), 0);

  return (
    <div className="border p-4 rounded space-y-2">
      <h2 className="font-bold text-lg">Valorización del Inventario</h2>
      <p>Total inventario: <strong>${totalValue.toFixed(2)}</strong></p>
    </div>
  );
};

export default InventoryValuation;
