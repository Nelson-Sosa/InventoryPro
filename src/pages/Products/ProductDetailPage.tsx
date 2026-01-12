import { useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();

  const product = products.find(p => p.id === id);

  if (!product) {
    return <p className="p-6">Producto no encontrado</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>

      {/* ✅ IMAGEN */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-64 h-64 object-contain border rounded"
        />
      ) : (
        <p className="text-gray-500">Sin imagen</p>
      )}

      <p><strong>SKU:</strong> {product.sku}</p>
      <p><strong>Stock:</strong> {Number(product.stock)}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Costo:</strong> ${product.cost}</p>
      <p><strong>Estado:</strong> {product.status}</p>

      <p>
        <strong>Creado:</strong>{" "}
        {new Date(product.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Actualizado:</strong>{" "}
        {new Date(product.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ProductDetailPage;
