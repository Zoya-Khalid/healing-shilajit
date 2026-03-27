// ============================================
// UPDATED FILE: src/store/authStore.js
// Admin redirect on login
// ============================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db } from "../lib/supabase";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      loading: true,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),

      initialize: async () => {
        try {
          const session = await auth.getSession();
          const user = await auth.getUser();

          if (user) {
            const { data: profile } = await db.getProfile(user.id);
            set({ user, profile, session, loading: false });
          } else {
            set({ user: null, profile: null, session: null, loading: false });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ loading: false });
        }
      },

      signIn: async (email, password) => {
        const { data, error } = await auth.signIn(email, password);
        if (error) throw error;

        const { data: profile } = await db.getProfile(data.user.id);
        set({ user: data.user, profile, session: data.session });

        // 🆕 Return profile to check role for redirect
        return { data, profile };
      },

      signUp: async (email, password, fullName) => {
        const { data, error } = await auth.signUp(email, password, fullName);
        if (error) throw error;
        return data;
      },

      signOut: async () => {
        await auth.signOut();
        set({ user: null, profile: null, session: null });
      },

      updateProfile: async (updates) => {
        const userId = get().user?.id;
        if (!userId) throw new Error("No user logged in");

        const { data, error } = await db.updateProfile(userId, updates);
        if (error) throw error;

        set({ profile: data });
        return data;
      },

      isAdmin: () => {
        return get().profile?.role === "admin";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
      }),
    },
  ),
);
