// ============================================
// FILE: src/components/products/ProductDetails.jsx
// ============================================
import React, { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import Button from "../common/Button";

export default function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Images */}
      <div>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img src={product.image_url || "https://via.placeholder.com/600"} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-gray-600">(87 reviews)</span>
        </div>

        <div className="mb-6">
          {product.original_price ? (
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-black">${product.price}</span>
              <span className="text-xl text-gray-500 line-through">${product.original_price}</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">SAVE ${(product.original_price - product.price).toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-3xl font-bold text-[#8B4513]">${product.price}</span>
          )}
        </div>

        <p className="text-gray-600 mb-6">
          {product.weight} | {product.servings} Servings
        </p>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center border rounded-lg">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100">
              -
            </button>
            <span className="px-4 py-2">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100">
              +
            </button>
          </div>

          <Button onClick={handleAddToCart} fullWidth>
            <ShoppingCart className="h-5 w-5 mr-2 inline" />
            Add to Cart
          </Button>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Benefits</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Boosts energy and stamina</li>
            <li>✓ Supports immunity</li>
            <li>✓ Enhances mental clarity</li>
            <li>✓ Rich in minerals and fulvic acid</li>
            <li>✓ 100% natural and lab-tested</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
