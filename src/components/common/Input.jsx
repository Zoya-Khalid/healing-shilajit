// ============================================
// FILE: src/components/common/Input.jsx
// ============================================
import React from "react";

export default function Input({ label, type = "text", error, className = "", ...props }) {
  return (
    <div className="mb-4 max-md:!mb-[10px]">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1 max-md:!text-[12px] max-md:!mb-[4px]">{label}</label>}
      <input
        type={type}
        className={`
          w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300
          ${props.variant === "dark"
            ? "bg-[#0a0a0a] border-white/10 text-white focus:border-[#D4AF37] focus:ring-0 placeholder:text-gray-500"
            : "bg-white border-gray-200 text-black focus:border-black focus:ring-0 placeholder:text-gray-400"}
          ${error ? "border-red-500" : ""}
          max-md:!h-[44px] max-md:!text-[14px] max-md:!rounded-[8px] max-md:!px-[10px] max-md:!border-[#e0e0e0]
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 max-md:!text-[11px]">{error}</p>}
    </div>
  );
}
