// ============================================
// FILE: src/components/cart/CartDrawer.jsx
// ============================================
import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import CartItem from "./CartItem";
import Button from "../common/Button";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, getTotal } = useCartStore();
  const total = getTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <button onClick={onClose}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6">{items.length === 0 ? <p className="text-center text-gray-500 mt-8">Your cart is empty</p> : items.map((item) => <CartItem key={item.id} item={item} />)}</div>

          {items.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between mb-4 text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" onClick={onClose}>
                <Button fullWidth>Proceed to Checkout</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
