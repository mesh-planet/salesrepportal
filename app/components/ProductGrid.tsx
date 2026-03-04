import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  priceMap: Record<string, string>;
  currencyCode: string;
  onAddToCart: (item: {
    variantId: string;
    productId: string;
    productTitle: string;
    variantTitle: string;
    sku: string;
    quantity: number;
    price: string;
    imageUrl: string;
  }) => void;
}

export function ProductGrid({
  products,
  priceMap,
  currencyCode,
  onAddToCart,
}: ProductGridProps) {
  return (
    <div className="rep-portal-product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          priceMap={priceMap}
          currencyCode={currencyCode}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
