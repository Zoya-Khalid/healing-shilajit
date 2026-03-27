// ============================================
// FILE: src/store/cartStore.js
// ============================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const items = [...state.items];
          const existingItemIndex = items.findIndex((item) => item.id === product.id);

          if (existingItemIndex > -1) {
            items[existingItemIndex] = {
              ...items[existingItemIndex],
              quantity: items[existingItemIndex].quantity + quantity
            };
            toast.success("Cart updated!");
          } else {
            items.push({ ...product, quantity });
            toast.success("Added to cart!");
          }
          return { items };
        });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
        toast.success("Removed from cart");
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
