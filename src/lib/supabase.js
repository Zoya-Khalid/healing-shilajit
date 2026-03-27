// ============================================
// FILE: src/lib/supabase.js
// ============================================
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  },

  getUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },
};

// Database helpers
export const db = {
  // Products
  getProducts: async () => {
    const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
    return { data, error };
  },

  getProduct: async (id) => {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    return { data, error };
  },

  // Orders
  createOrder: async (orderData) => {
    const { data, error } = await supabase.from("orders").insert([orderData]).select().single();
    return { data, error };
  },

  createOrderItems: async (items) => {
    const { data, error } = await supabase.from("order_items").insert(items).select();
    return { data, error };
  },

  getUserOrders: async (userId) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (*)
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  // Profile
  getProfile: async (userId) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    return { data, error };
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single();
    return { data, error };
  },

  // Addresses
  getAddresses: async (userId) => {
    const { data, error } = await supabase.from("addresses").select("*").eq("user_id", userId).order("is_default", { ascending: false });
    return { data, error };
  },

  createAddress: async (address) => {
    const { data, error } = await supabase.from("addresses").insert([address]).select().single();
    return { data, error };
  },

  // Reviews
  getProductReviews: async (productId) => {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        profiles (full_name)
      `,
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  createReview: async (review) => {
    const { data, error } = await supabase.from("reviews").insert([review]).select().single();
    return { data, error };
  },

  // Certifications
  getCertifications: async () => {
    const { data, error } = await supabase.from("certifications").select("*").eq("is_active", true).order("display_order", { ascending: true });
    return { data, error };
  },

  // Blog
  getBlogPosts: async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false });
    return { data, error };
  },

  getBlogPost: async (slug) => {
    const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();
    return { data, error };
  },

  // Favourites
  getFavorites: async (userId) => {
    const { data, error } = await supabase
      .from("user_favorites")
      .select("product_id")
      .eq("user_id", userId);
    return { data, error };
  },

  addFavorite: async (userId, productId) => {
    const { error } = await supabase
      .from("user_favorites")
      .insert([{ user_id: userId, product_id: productId }]);
    return { error };
  },

  removeFavorite: async (userId, productId) => {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
    return { error };
  },
};

// Admin helpers
export const admin = {
  // Products
  createProduct: async (product) => {
    const { data, error } = await supabase.from("products").insert([product]).select().single();
    return { data, error };
  },

  updateProduct: async (id, updates) => {
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
    return { data, error };
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id);
    return { error };
  },

  // Orders
  getAllOrders: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles (full_name, email),
        order_items (*)
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  },

  updateOrderStatus: async (id, status, trackingNumber = null) => {
    const updates = { status, updated_at: new Date().toISOString() };
    if (trackingNumber) updates.tracking_number = trackingNumber;

    const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single();
    return { data, error };
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const { data: orders } = await supabase.from("orders").select("total_amount, status, created_at");

    const { data: customers } = await supabase.from("profiles").select("id").eq("role", "customer");

    return {
      totalRevenue: orders?.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) || 0,
      totalOrders: orders?.length || 0,
      totalCustomers: customers?.length || 0,
      pendingOrders: orders?.filter((o) => o.status === "pending").length || 0,
    };
  },
};
