// ============================================
// FILE: src/components/common/Button.jsx
// ============================================
import React from "react";

export default function Button({ children, variant = "primary", size = "md", fullWidth = false, disabled = false, onClick, type = "button", className = "" }) {
  const baseStyles = "font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-black text-white hover:bg-[#111111]",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-black text-black hover:bg-black hover:text-white",
    black: "bg-black text-white hover:bg-gray-900 border border-white/10 shadow-2xl",
    white: "bg-white text-black hover:bg-gray-100 border border-black/10 shadow-xl",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
