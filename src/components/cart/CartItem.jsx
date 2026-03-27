// ============================================
// FILE: src/components/cart/CartItem.jsx
// ============================================
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-3 py-4 border-b last:border-0 max-md:!gap-[12px] max-md:!py-[10px] max-md:!border-b-[#f0f0f0]">
      <img src={item.image_url || "https://via.placeholder.com/100"} alt={item.name} className="w-20 h-20 object-cover rounded-xl max-md:!w-[64px] max-md:!h-[64px] max-md:!rounded-[8px] flex-shrink-0" />

      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-gray-900 line-clamp-2 max-md:!text-[13px] max-md:!font-medium max-md:!leading-[1.4]">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1 max-md:!text-[11px] max-md:!mt-[2px]">{item.weight || "Standard Pack"}</p>
        <p className="text-black font-bold mt-1 max-md:!text-[13px] max-md:!font-bold max-md:!mt-[4px] max-md:!text-black">Rs.{item.price.toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center bg-gray-50 rounded-lg p-1 border max-md:!h-[28px] max-md:!p-0 max-md:!bg-transparent max-md:!border-0 max-md:!gap-[8px]">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded hover:bg-white hover:shadow-sm transition-all max-md:!w-[28px] max-md:!h-[28px] max-md:!text-[16px] max-md:!rounded-[6px] border flex items-center justify-center">
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-sm font-medium max-md:!text-[14px]">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded hover:bg-white hover:shadow-sm transition-all max-md:!w-[28px] max-md:!h-[28px] max-md:!text-[16px] max-md:!rounded-[6px] border flex items-center justify-center">
            <Plus className="h-3 w-3" />
          </button>
        </div>
        
        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors max-md:!ml-[8px]">
          <Trash2 className="h-4 w-4 max-md:!h-[16px] max-md:!w-[16px]" />
        </button>
      </div>
    </div>
  );
}
