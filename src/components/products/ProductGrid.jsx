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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-md:grid-cols-2 max-md:gap-2 max-md:items-stretch max-md:[&>*:nth-child(3)]:col-span-full max-md:[&>*:nth-child(3)]:max-w-[calc(50%-4px)] max-md:[&>*:nth-child(3)]:mx-auto md:gap-6 md:max-w-[1500px] md:mx-auto md:px-[40px]">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
