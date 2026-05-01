// ============================================
// FIXED FILE: src/components/products/ProductCard.jsx
// Removed nested <Link> tags (no <a> inside <a>)
// ============================================
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleViewProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const discountPercent = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  const stockStatus = product.stock > 20 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock";
  // Monochrome stock colors: Gray for in-stock, Black for low/out-of-stock emphasis
  const stockColor = stockStatus === "in-stock" ? "text-gray-400" : "text-white";

  // Placeholder category since it might not be in product data
  const category = product.category || "Wellness";

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    navigate("/cart");
  };

  return (
    <div onClick={handleCardClick} className="group cursor-pointer bg-white p-6 rounded-[2.5rem] border-2 border-black shadow-sm hover:shadow-xl transition-all duration-500 max-md:!p-[10px] max-md:!rounded-[12px] md:p-5 max-md:flex max-md:flex-col max-md:justify-between h-full">
      {/* 1. Image Container - Full Wrap, No Padding */}
      <div className="relative mb-6 overflow-hidden aspect-square rounded-[1.5rem] border border-gray-100 max-md:!mb-[8px] max-md:!aspect-auto max-md:!h-[140px] max-md:!rounded-[10px] md:aspect-square md:rounded-[1.5rem]">
        {/* Product Images */}
        <div className="w-full h-full relative">
          {/* Main Image */}
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600"}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 rounded-[1.5rem] max-md:!rounded-[10px] ${product.hover_image_url ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-105"}`}
          />
          {/* Hover Image (Nutrition Facts) */}
          {product.hover_image_url && (
            <img
              src={product.hover_image_url}
              alt={`${product.name} Nutrition`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100 rounded-[1.5rem] max-md:!rounded-[10px]"
            />
          )}
        </div>
      </div>

      {/* 2. Product Details Below */}
      <div className="px-2 max-md:!px-0 flex flex-col flex-grow">
        {/* Title & Price Row */}
        <div className="flex flex-col mb-1 max-md:mb-0">
          <h3 
            className="font-bold text-lg text-black leading-[1.4] group-hover:text-gray-700 transition-colors max-md:!text-[12px] max-md:!leading-[1.4] max-md:min-h-[36px] max-md:mb-0 md:text-[16px] md:font-semibold md:mt-[12px] md:mb-[6px]"
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'visible' }}
          >
            {product.name}
          </h3>
          <div className="text-black font-bold text-lg max-md:!text-[13px] max-md:!font-[600] max-md:!my-[6px] md:text-[18px] md:font-bold md:mb-[6px]">
            Rs.{product.price?.toLocaleString()}
          </div>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-2 mb-6 max-md:!mb-[4px] md:mb-[12px]">
          <div className="flex text-[#D4AF37]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current max-md:!w-[10px] max-md:!h-[10px]" />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium max-md:!text-[11px] md:text-[13px]">({product.review_count || "1.2k"} Reviews)</span>
        </div>

        <div className="flex gap-3 max-md:!gap-[6px] mt-auto">
          <button
            onClick={handleAddToCart}
            className="flex-1 w-full bg-black text-white font-bold py-2.5 rounded-full text-sm hover:bg-gray-800 transition-all max-md:!text-[11px] max-md:tracking-tighter max-md:!px-0 max-md:!py-0 max-md:!h-[34px] max-md:flex max-md:items-center max-md:justify-center md:h-[44px] md:text-[14px] md:px-[20px]"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 w-full bg-black text-white font-bold py-2.5 rounded-full text-sm hover:bg-gray-800 transition-all max-md:!text-[11px] max-md:tracking-tighter max-md:!px-0 max-md:!py-0 max-md:!h-[34px] max-md:flex max-md:items-center max-md:justify-center md:h-[44px] md:text-[14px] md:px-[20px]"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
