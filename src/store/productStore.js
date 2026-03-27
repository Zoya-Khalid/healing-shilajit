// ============================================
// FILE: src/store/productStore.js
// ============================================
import { create } from 'zustand'
import { db } from '../lib/supabase'

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await db.getProducts()
      if (error) throw error
      set({ products: data || [], loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id)
  }
}))