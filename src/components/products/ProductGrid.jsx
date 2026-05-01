// ============================================
// FILE: src/components/products/ProductGrid.jsx
// ============================================
import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 max-w-[1500px] mx-auto px-2 md:px-[40px]">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
