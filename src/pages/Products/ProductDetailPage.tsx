import { useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);

  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>SKU: {product.sku}</p>
      <p>Stock: {product.stock}</p>
      <p>Precio: ${product.price}</p>
      <p>Costo: ${product.cost}</p>
      <p>Estado: {product.status}</p>
      <p>Creado: {new Date(product.createdAt).toLocaleDateString()}</p>
      <p>Última actualización: {new Date(product.updatedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ProductDetailPage;

