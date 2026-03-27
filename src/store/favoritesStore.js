// ============================================
// FILE: src/store/favoritesStore.js
// ============================================
import { create } from "zustand";
import { db } from "../lib/supabase";
import toast from "react-hot-toast";

export const useFavoritesStore = create((set, get) => ({
    favorites: new Set(), // Set of product_id strings
    loading: false,

    /** Load favourites for a given user from Supabase */
    loadFavorites: async (userId) => {
        if (!userId) return;
        set({ loading: true });
        const { data, error } = await db.getFavorites(userId);
        if (!error && data) {
            set({ favorites: new Set(data.map((r) => r.product_id)) });
        }
        set({ loading: false });
    },

    /** Toggle a product in/out of favourites */
    toggleFavorite: async (userId, productId) => {
        if (!userId) {
            toast.error("Please log in to save favourites");
            return;
        }

        const { favorites } = get();
        const isFav = favorites.has(productId);

        // Optimistic update
        const next = new Set(favorites);
        if (isFav) {
            next.delete(productId);
        } else {
            next.add(productId);
        }
        set({ favorites: next });

        // Persist to Supabase
        const { error } = isFav
            ? await db.removeFavorite(userId, productId)
            : await db.addFavorite(userId, productId);

        if (error) {
            // Rollback on failure
            set({ favorites });
            toast.error("Failed to update favourites");
        } else {
            toast.success(isFav ? "Removed from favourites" : "Added to favourites");
        }
    },

    /** Reset on sign-out */
    clearFavorites: () => set({ favorites: new Set() }),
}));
