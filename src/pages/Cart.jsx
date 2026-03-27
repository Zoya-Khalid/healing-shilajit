// ============================================
// FILE: src/pages/Cart.jsx
// ============================================
import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import CartItem from "../components/cart/CartItem";
import Button from "../components/common/Button";

export default function Cart() {
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="inline-block group mb-6">
            <h2 className="text-4xl md:text-5xl font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4">Your cart is empty</h2>
          </div>
          <p className="text-gray-600 text-lg mb-10">Add some products to get started!</p>
          <Link to="/products">
            <Button size="lg" className="px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 max-md:!pt-[80px] max-md:!px-0 max-md:!pb-12 max-md:!bg-[#f5f5f5]">
      <div className="text-center mb-16 px-4 max-md:!mb-[16px]">
        <div className="inline-block group max-md:flex max-md:flex-col max-md:items-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold inline-block text-black border-b-8 border-[#D4AF37] pb-4 max-md:!pb-0 max-md:!border-b-0 max-md:!mb-[12px]">Shopping Cart</h1>
          <div className="w-full h-2 max-md:!h-[4px] max-md:!w-[60px] bg-amber-500 rounded-full md:hidden"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-xl p-8 max-md:!p-[12px_14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!mb-[14px] max-md:!shadow-[0_1_4px_rgba(0,0,0,0.08)]">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <button onClick={clearCart} className="mt-4 text-red-500 hover:text-red-700 text-sm max-md:!px-[14px] max-md:!py-[8px] max-md:!text-[12px]">
              Clear Cart
            </button>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-[2rem] shadow-xl p-8 sticky top-32 max-md:!p-[14px] max-md:!rounded-[12px] max-md:!mx-[14px] max-md:!mb-[14px] max-md:!static max-md:!shadow-[0_1_4_rgba(0,0,0,0.08)]">
            <h2 className="text-xl font-bold mb-4 max-md:!text-[15px] max-md:!font-bold max-md:!mb-[12px]">Order Summary</h2>

            <div className="space-y-2 mb-4 max-md:!mb-0">
              <div className="flex justify-between max-md:!text-[13px] max-md:!mb-[8px] max-md:!items-center">
                <span>Subtotal</span>
                <span>Rs.{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between max-md:!text-[13px] max-md:!mb-[8px] max-md:!items-center">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg max-md:!text-[15px] max-md:!border-t-[#f0f0f0] max-md:!pt-[10px] max-md:!mt-[4px] max-md:!items-center">
                <span>Total</span>
                <span className="text-black">Rs.{total.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button fullWidth className="max-md:!h-[44px] max-md:!text-[14px] max-md:!font-semibold max-md:!rounded-[10px] max-md:!mt-[12px] flex items-center justify-center">Proceed to Checkout</Button>
            </Link>

            <Link to="/products">
              <button className="w-full mt-2 text-black hover:underline max-md:!text-[13px] max-md:!text-center max-md:!block max-md:!mt-[10px]">Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
